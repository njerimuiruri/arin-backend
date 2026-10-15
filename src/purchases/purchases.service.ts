import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Purchase } from './purchases.schema';
import { Books } from '../books/books.schema';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { createHmac } from 'crypto';

type RecordHints = {
  name?: string;
  email?: string;
  bookId?: string;
  bookTitle?: string;
  resources?: string[];
  quantity?: number;
};

@Injectable()
export class PurchasesService {
  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<Purchase>,
    @InjectModel(Books.name) private bookModel: Model<Books>,
  ) {}

  private getTransporter() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  private paystackHeaders() {
    return { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` };
  }

  // Paystack may return metadata as an object or a JSON string
  private parseMetadata(metadata: unknown): Record<string, any> {
    if (!metadata) return {};
    if (typeof metadata === 'string') {
      try { return JSON.parse(metadata) || {}; } catch { return {}; }
    }
    return typeof metadata === 'object' ? (metadata as Record<string, any>) : {};
  }

  // Called by the website right after checkout
  async verifyAndRecord(data: {
    reference: string;
    email: string;
    name?: string;
    bookId: string;
    bookTitle: string;
    resources: string[];
    currency: string;
    quantity: number;
  }) {
    return this.recordFromReference(data.reference, { sendEmail: true, hints: data });
  }

  // Called by Paystack directly  works even if the buyer closed the browser
  async handleWebhook(signature: string | undefined, rawBody: Buffer | undefined, body: any) {
    const secret = process.env.PAYSTACK_SECRET_KEY || '';
    const payload = rawBody ?? Buffer.from(JSON.stringify(body));
    const expected = createHmac('sha512', secret).update(payload).digest('hex');
    if (!signature || signature !== expected) {
      throw new UnauthorizedException('Invalid Paystack signature');
    }

    if (body?.event !== 'charge.success') return { received: true };

    const metadata = this.parseMetadata(body.data?.metadata);
    // Only handle book purchases
    if (!metadata.book_id) return { received: true };

    await this.recordFromReference(body.data.reference, { sendEmail: true });
    return { received: true };
  }

  /**
   * Verifies a reference with Paystack and saves it. Idempotent: an existing
   * record is returned (and filled in / emailed if that previously failed).
   */
  private async recordFromReference(
    reference: string,
    opts: { sendEmail: boolean; hints?: RecordHints },
  ) {
    const hints = opts.hints ?? {};
    let purchase = await this.purchaseModel.findOne({ reference });

    if (!purchase) {
      let paystackData: any;
      try {
        const response = await axios.get(
          `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
          { headers: this.paystackHeaders() },
        );
        paystackData = response.data;
      } catch {
        throw new BadRequestException('Could not reach Paystack to verify payment');
      }

      if (!paystackData.status || paystackData.data?.status !== 'success') {
        throw new BadRequestException('Payment not confirmed by Paystack');
      }

      purchase = await this.buildFromTransaction(paystackData.data, hints);
      try {
        await purchase.save();
      } catch (err: any) {
        // Webhook and browser verify can race on the same reference
        if (err?.code === 11000) {
          purchase = await this.purchaseModel.findOne({ reference });
          if (!purchase) throw err;
        } else {
          throw err;
        }
      }
    } else if (!purchase.name && hints.name?.trim()) {
      purchase.name = hints.name.trim();
      await purchase.save();
    }

    if (opts.sendEmail && !purchase.emailSent) {
      await this.trySendEmail(purchase);
    }

    return purchase;
  }

  private async buildFromTransaction(tx: any, hints: RecordHints) {
    const metadata = this.parseMetadata(tx.metadata);
    const customer = tx.customer ?? {};
    const bookId: string = metadata.book_id || hints.bookId || '';

    // Prefer the book's current resources from the DB over what the browser sent
    let bookTitle: string = metadata.book_title || hints.bookTitle || 'ARIN Book';
    let resources: string[] = [];
    if (bookId && isValidObjectId(bookId)) {
      const book = await this.bookModel.findById(bookId).lean();
      if (book) {
        bookTitle = book.title || bookTitle;
        resources = (book.availableResources ?? []).filter(u => typeof u === 'string' && u.trim());
      }
    }
    if (resources.length === 0) resources = hints.resources ?? [];

    const customerName = [customer.first_name, customer.last_name].filter(Boolean).join(' ');
    const name = (metadata.buyer_name || hints.name || customerName || '').trim();

    return new this.purchaseModel({
      name,
      email: customer.email || hints.email,
      bookId: bookId || 'unknown',
      bookTitle,
      reference: tx.reference,
      amount: tx.amount,
      currency: tx.currency,
      quantity: Number(metadata.quantity) || hints.quantity || 1,
      resources,
      status: 'success',
      emailSent: false,
      paidAt: tx.paid_at ? new Date(tx.paid_at) : undefined,
    });
  }

  private async trySendEmail(purchase: Purchase) {
    try {
      await this.sendBookEmail(purchase);
      purchase.emailSent = true;
      purchase.emailError = undefined;
    } catch (err: any) {
      console.error('Purchase email failed to send:', err);
      purchase.emailSent = false;
      purchase.emailError = String(err?.message || err).slice(0, 500);
    }
    await purchase.save();
  }

  async resendEmail(id: string) {
    if (!isValidObjectId(id)) throw new NotFoundException('Purchase not found');
    const purchase = await this.purchaseModel.findById(id);
    if (!purchase) throw new NotFoundException('Purchase not found');

    // Refresh download links in case the book's files were added/changed since
    if (isValidObjectId(purchase.bookId)) {
      const book = await this.bookModel.findById(purchase.bookId).lean();
      const resources = (book?.availableResources ?? []).filter(u => typeof u === 'string' && u.trim());
      if (resources.length > 0) purchase.resources = resources;
    }

    await this.trySendEmail(purchase);
    return purchase;
  }

  /**
   * Pulls successful book transactions from Paystack and records any that are
   * missing from the DB. Does NOT email buyers  use resend from the dashboard.
   */
  async syncFromPaystack() {
    let page = 1;
    let added = 0;
    let checked = 0;
    const perPage = 100;

    while (true) {
      let res: any;
      try {
        res = await axios.get('https://api.paystack.co/transaction', {
          headers: this.paystackHeaders(),
          params: { status: 'success', perPage, page },
        });
      } catch {
        throw new BadRequestException('Could not reach Paystack');
      }

      const transactions: any[] = res.data?.data ?? [];
      for (const tx of transactions) {
        const metadata = this.parseMetadata(tx.metadata);
        if (!metadata.book_id) continue;
        checked++;
        const exists = await this.purchaseModel.exists({ reference: tx.reference });
        if (exists) continue;

        const purchase = await this.buildFromTransaction(tx, {});
        try {
          await purchase.save();
          added++;
        } catch (err: any) {
          if (err?.code !== 11000) throw err;
        }
      }

      const pageCount = res.data?.meta?.pageCount ?? 1;
      if (page >= pageCount || transactions.length === 0) break;
      page++;
    }

    return { checked, added };
  }

  private escapeHtml(value: string) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Gmail rejects messages over 25MB, and attachments grow ~33% when encoded
  private static readonly MAX_ATTACHMENT_BYTES = 17 * 1024 * 1024;

  /**
   * Downloads the book files so they can be attached. Files that are too large
   * or fail to download are skipped  the email still carries download links.
   */
  private async buildAttachments(bookTitle: string, resources: string[]) {
    const safeTitle =
      bookTitle.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80) || 'ARIN-Book';
    const attachments: { filename: string; content: Buffer; contentType?: string }[] = [];
    let total = 0;

    for (let i = 0; i < resources.length; i++) {
      const url = resources[i];
      try {
        const res = await axios.get<ArrayBuffer>(url, {
          responseType: 'arraybuffer',
          timeout: 60000,
          maxContentLength: PurchasesService.MAX_ATTACHMENT_BYTES,
        });
        const content = Buffer.from(res.data);
        if (total + content.length > PurchasesService.MAX_ATTACHMENT_BYTES) continue;

        const contentType = String(res.headers['content-type'] || '').split(';')[0];
        const urlExt = (url.split('?')[0].match(/\.([a-z0-9]{2,5})$/i)?.[1] || '').toLowerCase();
        const ext = urlExt || (contentType.includes('epub') ? 'epub' : 'pdf');
        const suffix = resources.length > 1 ? `-part-${i + 1}` : '';

        attachments.push({
          filename: `${safeTitle}${suffix}.${ext}`,
          content,
          contentType: contentType || undefined,
        });
        total += content.length;
      } catch (err: any) {
        console.warn(`Could not attach book file ${url}: ${err?.message || err}`);
      }
    }
    return attachments;
  }

  private async sendBookEmail(purchase: Purchase) {
    const transporter = this.getTransporter();
    const { email, name, bookTitle, resources, reference } = purchase;

    const attachments = await this.buildAttachments(bookTitle, resources);
    const attached = attachments.length > 0;

    const title = this.escapeHtml(bookTitle);
    const rawFirstName = (name || '').trim().split(/\s+/)[0] || '';
    const greeting = rawFirstName ? `Hi ${this.escapeHtml(rawFirstName)},` : 'Hello,';

    let amountText: string;
    try {
      amountText = new Intl.NumberFormat('en-US', { style: 'currency', currency: purchase.currency || 'USD' })
        .format((purchase.amount || 0) / 100);
    } catch {
      amountText = `${purchase.currency} ${((purchase.amount || 0) / 100).toFixed(2)}`;
    }
    const dateText = new Date(purchase.paidAt || (purchase as any).createdAt || Date.now())
      .toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    const deliveryNote = attached
      ? `Your copy is <strong>attached to this email</strong>  save it to keep it.`
      : resources.length > 0
        ? 'Use the button below to download your copy.'
        : 'Your purchase is confirmed. We will send your copy shortly; if it does not arrive, just reply to this email.';

    const buttons = resources
      .map((url, i) => `
              <tr><td style="padding:4px 0;">
                <a href="${this.escapeHtml(url)}" style="display:inline-block;padding:12px 22px;background:${attached ? '#ffffff' : '#021d49'};color:${attached ? '#021d49' : '#ffffff'};border:1px solid #021d49;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">
                  ${attached ? 'Or download online' : 'Download your book'}${resources.length > 1 ? ` (part ${i + 1})` : ''}
                </a>
              </td></tr>`)
      .join('');

    const row = (label: string, value: string) => `
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;">${label}</td>
                  <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:13px;text-align:right;">${value}</td>
                </tr>`;

    const fileRows = attachments
      .map(a => `
            <tr><td style="padding:14px 16px;">
              <span style="display:inline-block;background:#dc2626;color:#ffffff;font-size:11px;font-weight:700;padding:4px 6px;border-radius:4px;vertical-align:middle;">${this.escapeHtml((a.filename.split('.').pop() || 'pdf').toUpperCase())}</span>
              <span style="color:#111827;font-size:14px;vertical-align:middle;margin-left:8px;">${this.escapeHtml(a.filename)}</span>
              <span style="color:#9ca3af;font-size:12px;vertical-align:middle;margin-left:6px;">${(a.content.length / 1024 / 1024).toFixed(1)} MB</span>
            </td></tr>`)
      .join('');

    const html = `
<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f3f4f6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:10px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">

        <tr><td style="background:#021d49;padding:22px 32px;">
          <span style="color:#ffffff;font-size:16px;font-weight:700;letter-spacing:2px;">ARIN PRESS</span><br>
          <span style="color:#9fb3d1;font-size:12px;">African Research and Impact Network</span>
        </td></tr>

        <tr><td style="padding:32px 32px 8px;">
          <p style="margin:0 0 16px;color:#111827;font-size:15px;">${greeting}</p>
          <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">
            Thank you for buying <strong>${title}</strong>. ${deliveryNote}
          </p>
        </td></tr>

        ${attached ? `
        <tr><td style="padding:0 32px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;">${fileRows}
          </table>
        </td></tr>` : ''}

        ${buttons ? `
        <tr><td style="padding:16px 32px 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0">${buttons}</table>
        </td></tr>` : ''}

        <tr><td style="padding:24px 32px 8px;">
          <p style="margin:0 0 4px;color:#111827;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Order summary</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;">
            ${row('Book', title)}
            ${row('Quantity', String(purchase.quantity || 1))}
            ${row('Amount paid', this.escapeHtml(amountText))}
            ${row('Date', dateText)}
            ${row('Reference', `<span style="font-family:monospace;">${this.escapeHtml(reference)}</span>`)}
          </table>
        </td></tr>

        <tr><td style="padding:24px 32px 32px;">
          <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
            Questions about your order? Contact us at
            <a href="mailto:info@arin-africa.org" style="color:#021d49;">info@arin-africa.org</a>.
          </p>
        </td></tr>

        <tr><td style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
          <p style="margin:0;color:#9ca3af;font-size:11px;">ARIN Press · African Research and Impact Network · arin-africa.org</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const text = [
      rawFirstName ? `Hi ${rawFirstName},` : 'Hello,',
      '',
      `Thank you for buying "${bookTitle}".`,
      attached ? 'Your copy is attached to this email.' : '',
      ...resources.map((url, i) => `Download${resources.length > 1 ? ` (part ${i + 1})` : ''}: ${url}`),
      '',
      `Amount paid: ${amountText}`,
      `Date: ${dateText}`,
      `Reference: ${reference}`,
      '',
      'Questions? info@arin-africa.org',
    ].join('\n');

    await transporter.sendMail({
      from: `"ARIN Press" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: email,
      replyTo: 'info@arin-africa.org',
      subject: `Your book from ARIN Press: ${bookTitle}`,
      html,
      text,
      attachments,
    });
  }

  async findAll() {
    return this.purchaseModel.find().sort({ createdAt: -1 }).exec();
  }
}

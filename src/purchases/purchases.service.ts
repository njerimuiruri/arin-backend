import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Purchase } from './purchases.schema';
import axios from 'axios';
import nodemailer from 'nodemailer';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<Purchase>,
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

  async verifyAndRecord(data: {
    reference: string;
    email: string;
    bookId: string;
    bookTitle: string;
    resources: string[];
    currency: string;
    quantity: number;
  }) {
    // Idempotent  don't double-process the same reference
    const existing = await this.purchaseModel.findOne({ reference: data.reference });
    if (existing) return existing;

    // Verify payment with Paystack
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    let paystackData: any;
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(data.reference)}`,
        { headers: { Authorization: `Bearer ${secretKey}` } },
      );
      paystackData = response.data;
    } catch {
      throw new BadRequestException('Could not reach Paystack to verify payment');
    }

    if (!paystackData.status || paystackData.data?.status !== 'success') {
      throw new BadRequestException('Payment not confirmed by Paystack');
    }

    const amount: number = paystackData.data.amount;
    const currency: string = paystackData.data.currency;

    // Save purchase record
    const purchase = new this.purchaseModel({
      email: data.email,
      bookId: data.bookId,
      bookTitle: data.bookTitle,
      reference: data.reference,
      amount,
      currency,
      quantity: data.quantity,
      resources: data.resources,
      status: 'success',
      emailSent: false,
    });
    await purchase.save();

    // Send email  non-blocking failure (log but don't throw)
    let emailSent = false;
    try {
      await this.sendBookEmail(data.email, data.bookTitle, data.resources, data.reference);
      emailSent = true;
    } catch (err) {
      console.error('Purchase email failed to send:', err);
    }

    purchase.emailSent = emailSent;
    await purchase.save();

    return purchase;
  }

  private async sendBookEmail(
    email: string,
    bookTitle: string,
    resources: string[],
    reference: string,
  ) {
    const transporter = this.getTransporter();

    const downloadLinks =
      resources.length > 0
        ? resources
            .map(
              (url, i) =>
                `<a href="${url}" style="display:inline-block;margin:6px 0;padding:12px 24px;background:#021d49;color:white;text-decoration:none;border-radius:6px;font-weight:bold;font-size:14px;">
                  Download ${resources.length > 1 ? `File ${i + 1}: ` : ''}${bookTitle}
                </a>`,
            )
            .join('<br>')
        : '<p style="color:#4a5568;">Your purchase is confirmed. If the download link is not available yet, please contact us at info@arin-africa.org</p>';

    await transporter.sendMail({
      from: `"ARIN Press" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: email,
      subject: `Your ARIN Book: ${bookTitle}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;">
          <div style="background:#021d49;padding:28px 32px;border-radius:10px 10px 0 0;text-align:center;">
            <h1 style="color:white;margin:0;font-size:20px;letter-spacing:1px;">ARIN PRESS</h1>
            <p style="color:#93c5fd;margin:6px 0 0;font-size:14px;">African Research and Impact Network</p>
          </div>

          <div style="background:white;border:1px solid #e2e8f0;border-top:none;padding:36px 32px;border-radius:0 0 10px 10px;">
            <h2 style="color:#1a202c;margin-top:0;font-size:22px;">Thank you for your purchase!</h2>
            <p style="color:#4a5568;line-height:1.6;">
              Your payment was successful. Here is your download link for:
            </p>

            <div style="background:#f0f4ff;border-left:4px solid #021d49;border-radius:4px;padding:16px 20px;margin:20px 0;">
              <strong style="color:#021d49;font-size:16px;">${bookTitle}</strong>
            </div>

            <div style="margin:24px 0;">
              ${downloadLinks}
            </div>

            <p style="color:#718096;font-size:13px;margin-top:28px;">
              Payment reference: <code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:12px;">${reference}</code>
            </p>

            <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
            <p style="color:#718096;font-size:13px;">
              Questions? Email us at
              <a href="mailto:info@arin-africa.org" style="color:#021d49;">info@arin-africa.org</a>
            </p>
          </div>
        </div>
      `,
    });
  }

  async findAll() {
    return this.purchaseModel.find().sort({ createdAt: -1 }).exec();
  }
}

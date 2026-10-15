import { Body, Controller, Get, Post, Param, Req, Headers, HttpCode, BadRequestException } from '@nestjs/common';
import { PurchasesService } from './purchases.service';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly service: PurchasesService) {}

  @Post('verify')
  async verify(
    @Body()
    body: {
      reference: string;
      email: string;
      name?: string;
      bookId: string;
      bookTitle: string;
      resources: string[];
      currency: string;
      quantity: number;
    },
  ) {
    if (!body.reference || !body.email || !body.bookId) {
      throw new BadRequestException('reference, email and bookId are required');
    }
    return this.service.verifyAndRecord(body);
  }

  // Configure in Paystack dashboard: Settings → API Keys & Webhooks → Webhook URL
  @Post('webhook')
  @HttpCode(200)
  async webhook(
    @Headers('x-paystack-signature') signature: string,
    @Req() req: any,
    @Body() body: any,
  ) {
    return this.service.handleWebhook(signature, req.rawBody, body);
  }

  @Post('sync')
  async sync() {
    return this.service.syncFromPaystack();
  }

  @Post(':id/resend')
  async resend(@Param('id') id: string) {
    return this.service.resendEmail(id);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }
}

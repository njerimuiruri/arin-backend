import { Body, Controller, Get, Post, BadRequestException } from '@nestjs/common';
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

  @Get()
  async findAll() {
    return this.service.findAll();
  }
}

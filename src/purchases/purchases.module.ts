import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Purchase, PurchaseSchema } from './purchases.schema';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { Books, BooksSchema } from '../books/books.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Purchase.name, schema: PurchaseSchema },
      { name: Books.name, schema: BooksSchema },
    ]),
  ],
  controllers: [PurchasesController],
  providers: [PurchasesService],
})
export class PurchasesModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CallForBooks, CallForBooksSchema } from './call-for-books.schema';
import { CallForBooksService } from './call-for-books.service';
import { CallForBooksController } from './call-for-books.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: CallForBooks.name, schema: CallForBooksSchema }])],
  providers: [CallForBooksService],
  controllers: [CallForBooksController],
  exports: [CallForBooksService],
})
export class CallForBooksModule {}

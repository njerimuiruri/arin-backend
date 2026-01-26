import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Books, BooksSchema } from './books.schema';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Books.name, schema: BooksSchema },
    ]),
  ],
  controllers: [BooksController],
  providers: [BooksService, require('../common/services/cloudinary.service').CloudinaryService],
})
export class BooksModule {}

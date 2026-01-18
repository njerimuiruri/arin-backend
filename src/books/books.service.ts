import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Books } from './books.schema';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Books.name) private bookModel: Model<Books>,
  ) {}

  async create(data: any) {
    try {
      const created = new this.bookModel(data);
      return await created.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(`Validation failed: ${error.message}`);
      }
      throw error;
    }
  }

  async findAll() {
    return this.bookModel.find().exec();
  }

  async findOne(id: string) {
    return this.bookModel.findById(id).exec();
  }

  async update(id: string, data: any) {
    return this.bookModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string) {
    return this.bookModel.findByIdAndDelete(id).exec();
  }
}
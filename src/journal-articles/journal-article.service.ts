import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JournalArticle } from './journal-article.schema';

@Injectable()
export class JournalArticleService {
  constructor(
    @InjectModel(JournalArticle.name) private articleModel: Model<JournalArticle>,
  ) {}

  async create(data: any) {
    try {
      const created = new this.articleModel(data);
      return await created.save();
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    return this.articleModel.find().exec();
  }

  async findOne(id: string) {
    return this.articleModel.findById(id).exec();
  }

  async update(id: string, data: any) {
    return this.articleModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string) {
    const deleted = await this.articleModel.findByIdAndDelete(id).exec();
    return deleted || null;
  }
}
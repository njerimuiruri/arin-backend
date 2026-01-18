import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Newsletters } from './newsletters.schema';

@Injectable()
export class NewslettersService {
  constructor(
    @InjectModel(Newsletters.name) private model: Model<Newsletters>,
  ) {}

  async create(data: any) {
    try {
      const created = new this.model(data);
      const saved = await created.save();
      return saved;
    } catch (error) {
      console.error('Error creating newsletter:', error);
      throw error;
    }
  }

  async findAll() {
    return this.model.find().exec();
  }

  async findOne(id: string) {
    const newsletter = await this.model.findById(id).exec();
    return newsletter || null;
  }

  async update(id: string, data: any) {
    const updated = await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    return updated || null;
  }

  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    return deleted || null;
  }
}
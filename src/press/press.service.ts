import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Press } from './press.schema';

@Injectable()
export class PressService {
  constructor(
    @InjectModel(Press.name) private model: Model<Press>,
  ) {}

  async create(data: any) {
    try {
      const created = new this.model(data);
      const saved = await created.save();
      return saved;
    } catch (error) {
      console.error('Error creating press item:', error);
      throw error;
    }
  }

  async findAll() {
    return this.model.find().exec();
  }

  async findOne(id: string) {
    const item = await this.model.findById(id).exec();
    return item || null;
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

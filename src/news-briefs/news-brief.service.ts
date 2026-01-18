import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewsBrief } from './news-brief.schema';

@Injectable()
export class NewsBriefService {
  constructor(
    @InjectModel(NewsBrief.name) private briefModel: Model<NewsBrief>,
  ) {}

  async create(data: any) {
    try {
      const created = new this.briefModel(data);
      return await created.save();
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    return this.briefModel.find().exec();
  }

  async findOne(id: string) {
    return this.briefModel.findById(id).exec();
  }

  async update(id: string, data: any) {
    return this.briefModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string) {
    return this.briefModel.findByIdAndDelete(id).exec();
  }
}
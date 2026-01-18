import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TechnicalReports } from './technical-reports.schema';

@Injectable()
export class TechnicalReportsService {
  constructor(
    @InjectModel(TechnicalReports.name) private reportModel: Model<TechnicalReports>,
  ) {}

  async create(data: any) {
    try {
      const created = new this.reportModel(data);
      return await created.save();
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    return this.reportModel.find().exec();
  }

  async findOne(id: string) {
    return this.reportModel.findById(id).exec();
  }

  async update(id: string, data: any) {
    return this.reportModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string) {
    return this.reportModel.findByIdAndDelete(id).exec();
  }
}
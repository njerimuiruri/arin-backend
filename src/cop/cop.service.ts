import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cop } from './cop.schema';

@Injectable()
export class CopService {
  constructor(@InjectModel(Cop.name) private copModel: Model<Cop>) {}

  async create(data: any): Promise<Cop> {
    const cop = new this.copModel(data);
    return cop.save();
  }

  async findAll(): Promise<Cop[]> {
    return this.copModel.find().sort({ date: -1 }).exec();
  }

  async findOne(id: string): Promise<Cop | null> {
    return this.copModel.findById(id).exec();
  }

  async update(id: string, data: any): Promise<Cop | null> {
    return this.copModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string): Promise<Cop | null> {
    return this.copModel.findByIdAndDelete(id).exec();
  }
}

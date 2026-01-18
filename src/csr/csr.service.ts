import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Csr } from './csr.schema';

@Injectable()
export class CsrService {
  constructor(
    @InjectModel(Csr.name) private csrModel: Model<Csr>,
  ) {}

  async create(data: any) {
    try {
      console.log('Attempting to create CSR with data:', data);
      const created = new this.csrModel(data);
      const saved = await created.save();
      console.log('CSR created successfully:', saved);
      return saved;
    } catch (error) {
      console.error('Error creating CSR:', error);
      if (error.name === 'ValidationError') {
        throw new BadRequestException(`Validation failed: ${error.message}`);
      }
      throw error;
    }
  }

  async findAll() {
    return this.csrModel.find().exec();
  }

  async findById(id: string) {
    const csr = await this.csrModel.findById(id).exec();
    if (!csr) throw new NotFoundException('CSR not found');
    return csr;
  }

  async update(id: string, data: any) {
    const updated = await this.csrModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('CSR not found');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.csrModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('CSR not found');
    return deleted;
  }
}
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PolicyBrief } from './policy-brief.schema';

@Injectable()
export class PolicyBriefService {
  constructor(
    @InjectModel(PolicyBrief.name) private projectModel: Model<PolicyBrief>,
  ) {}

  async create(data: any) {
    try {
      console.log('Attempting to create project with data:', data);
      const created = new this.projectModel(data);
      const saved = await created.save();
      console.log('Project created successfully:', saved);
      return saved;
    } catch (error) {
      console.error('Error creating project:', error);
      if (error.name === 'ValidationError') {
        throw new BadRequestException(`Validation failed: ${error.message}`);
      }
      throw error;
    }
  }

  async findAll() {
    return this.projectModel.find().exec();
  }

  async findById(id: string) {
    const project = await this.projectModel.findById(id).exec();
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, data: any) {
    const updated = await this.projectModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Project not found');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.projectModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Project not found');
    return deleted;
  }
}
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PolicyDialogue } from './policy-dialogues.schema';

@Injectable()
export class PolicyDialoguesService {
  constructor(
    @InjectModel(PolicyDialogue.name) private projectModel: Model<PolicyDialogue>,
  ) {}

  async create(data: any) {
    try {
      console.log('Attempting to create project with data:', data);
      const created = new this.projectModel(data);
      const saved = await created.save();
      console.log('Policy Dialogue created successfully:', saved);
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
    console.log('Finding dialogue by ID:', id);
    if (!id || id === 'undefined') {
      throw new BadRequestException('Invalid dialogue ID provided');
    }
    try {
      const project = await this.projectModel.findById(id).exec();
      if (!project) {
        throw new NotFoundException(`Policy Dialogue with ID ${id} not found`);
      }
      console.log('Found dialogue:', project._id);
      return project;
    } catch (error: any) {
      console.error('Error in findById:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      if (error.kind === 'ObjectId') {
        throw new BadRequestException(`Invalid dialogue ID format: ${id}`);
      }
      throw error;
    }
  }

  async update(id: string, data: any) {
    const updated = await this.projectModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Policy Dialogue not found');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.projectModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Policy Dialogue not found');
    return deleted;
  }
}
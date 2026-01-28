import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImpactStory } from './impact-story.schema';

@Injectable()
export class ImpactStoriesService {
  constructor(
    @InjectModel(ImpactStory.name) private storyModel: Model<ImpactStory>,
  ) {}

  async create(data: any) {
    try {
      const created = new this.storyModel(data);
      return await created.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(`Validation failed: ${error.message}`);
      }
      throw error;
    }
  }

  async findAll() {
    return this.storyModel.find().exec();
  }

  async findById(id: string) {
    const story = await this.storyModel.findById(id).exec();
    if (!story) throw new NotFoundException('Impact story not found');
    return story;
  }

  async update(id: string, data: any) {
    const updated = await this.storyModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Impact story not found');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.storyModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Impact story not found');
    return deleted;
  }
}

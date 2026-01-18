import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamMember } from './team-member.schema';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(TeamMember.name) private teamModel: Model<TeamMember>,
  ) {}

  async create(data: any) {
    try {
      if (!data.firstName || !data.lastName || !data.role) {
        throw new BadRequestException('Missing required fields: firstName, lastName, role');
      }
      const created = new this.teamModel(data);
      return await created.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(`Validation failed: ${error.message}`);
      }
      throw error;
    }
  }

  async findAll() {
    return this.teamModel.find().exec();
  }

  async findById(id: string) {
    const member = await this.teamModel.findById(id).exec();
    if (!member) throw new NotFoundException('Team member not found');
    return member;
  }

  async update(id: string, data: any) {
    const updated = await this.teamModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Team member not found');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.teamModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Team member not found');
    return deleted;
  }
}

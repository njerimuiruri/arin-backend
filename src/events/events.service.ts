import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './events.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
  ) {}

  async create(data: any) {
    try {
      console.log('Attempting to create event with data:', data);
      const created = new this.eventModel(data);
      const saved = await created.save();
      console.log('Event added successfully:', saved);
      return saved;
    } catch (error) {
      console.error('Error adding this event:', error);
      if (error.name === 'ValidationError') {
        throw new BadRequestException(`Validation failed: ${error.message}`);
      }
      throw error;
    }
  }

  async findAll() {
    return this.eventModel.find().exec();
  }

  async findById(id: string) {
    const event = await this.eventModel.findById(id).exec();
    if (!event) throw new NotFoundException('event not found');
    return event;
  }

  async update(id: string, data: any) {
    const updated = await this.eventModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Event not found');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.eventModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Event not found');
    return deleted;
  }
}
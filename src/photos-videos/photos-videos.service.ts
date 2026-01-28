import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PhotosVideos } from './schemas/photos-videos.schema';

@Injectable()
export class PhotosVideosService {
  constructor(
    @InjectModel(PhotosVideos.name) private readonly model: Model<PhotosVideos>,
  ) {}

  async create(data: Partial<PhotosVideos>): Promise<PhotosVideos> {
    return this.model.create(data);
  }

  async findAll(): Promise<PhotosVideos[]> {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<PhotosVideos> {
    const item = await this.model.findById(id).exec();
    if (!item) throw new NotFoundException('Not found');
    return item;
  }

  async update(id: string, data: Partial<PhotosVideos>): Promise<PhotosVideos> {
    const item = await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!item) throw new NotFoundException('Not found');
    return item;
  }

  async remove(id: string): Promise<void> {
    const res = await this.model.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Not found');
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotosVideosService } from './photos-videos.service';
import { PhotosVideos } from './schemas/photos-videos.schema';
import { uploadToCloudinary } from '../common/cloudinary-upload';

@Controller('videos')
export class VideosController {
  constructor(private readonly service: PhotosVideosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ): Promise<PhotosVideos> {
    if (!file) throw new BadRequestException('File is required');
    const url = await uploadToCloudinary(file);
    return this.service.create({
      title: body.title,
      description: body.description,
      type: 'video',
      url,
      thumbnail: body.thumbnail,
    });
  }

  @Get()
  async findAll(): Promise<PhotosVideos[]> {
    const all = await this.service.findAll();
    return all.filter(item => item.type === 'video');
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PhotosVideos> {
    const item = await this.service.findOne(id);
    if (item.type !== 'video') throw new BadRequestException('Not a video');
    return item;
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ): Promise<PhotosVideos> {
    let url = body.url;
    if (file) {
      url = await uploadToCloudinary(file);
    }
    return this.service.update(id, {
      title: body.title,
      description: body.description,
      type: 'video',
      url,
      thumbnail: body.thumbnail,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const item = await this.service.findOne(id);
    if (item.type !== 'video') throw new BadRequestException('Not a video');
    return this.service.remove(id);
  }
}

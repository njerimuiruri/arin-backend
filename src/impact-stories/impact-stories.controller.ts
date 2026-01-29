import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImpactStoriesService } from './impact-stories.service';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

function fileName(req, file, cb) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  cb(null, uniqueSuffix + extname(file.originalname));
}

@Controller('impact-stories')
export class ImpactStoriesController {
  constructor(
    private readonly service: ImpactStoriesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // Endpoint for uploading images to be embedded in description (WYSIWYG)
  @Post('upload-description-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadDescriptionImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed!');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Image size must be less than 5MB');
    }
    const url = await this.cloudinaryService.uploadImage(file.buffer, file.originalname);
    return { url };
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/impact-stories/images',
        filename: fileName,
      }),
    }),
  )
  async create(
    @Body() body: any,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (image) {
      body.image = `/uploads/impact-stories/images/${image.filename}`;
    }
    // Video upload can be handled similarly if needed
    return this.service.create(body);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/impact-stories/images',
        filename: fileName,
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (image) {
      body.image = `/uploads/impact-stories/images/${image.filename}`;
    }
    return this.service.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}

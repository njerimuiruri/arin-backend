import { CopService } from './cop.service';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { Controller, Post, Get, Put, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('cop')
export class CopController {
  constructor(
    private readonly service: CopService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { error: 'No file uploaded' };
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

  @Post('upload-resource')
  @UseInterceptors(FileInterceptor('resource'))
  async uploadResource(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { error: 'No file uploaded' };
    }
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed!');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('PDF size must be less than 10MB');
    }
    const url = await this.cloudinaryService.uploadImage(file.buffer, file.originalname);
    return { url };
  }

  @Post()
  async create(@Body() body: any) {
    console.log('Received COP create request with body:', body);
    
    // Validate required fields
    if (!body.title || !body.date || !body.description) {
      throw new BadRequestException('Missing required fields: title, date, or description');
    }

    // Ensure availableResources is an array
    if (!Array.isArray(body.availableResources)) {
      body.availableResources = [];
    }

    // Extract year from date if not provided
    if (!body.year && body.date) {
      body.year = new Date(body.date).getFullYear();
    }

    return this.service.create(body);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    // Ensure availableResources is an array
    if (!Array.isArray(body.availableResources)) {
      body.availableResources = [];
    }

    // Extract year from date if not provided
    if (!body.year && body.date) {
      body.year = new Date(body.date).getFullYear();
    }

    return this.service.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

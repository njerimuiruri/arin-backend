import { VacanciesService } from './vacancies.service';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { Controller, Post, Get, Put, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('vacancies')
export class VacanciesController {
  constructor(
    private readonly service: VacanciesService,
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

  @Post()
  async create(@Body() body: any) {
    console.log('Received Vacancy create request with body:', body);
    
    // Validate required fields
    if (!body.positionName || !body.employmentType || !body.description || !body.datePosted || !body.deadline) {
      throw new BadRequestException('Missing required fields: positionName, employmentType, description, datePosted, or deadline');
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
    return this.service.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

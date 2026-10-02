
import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogsService } from './blogs.service';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly service: BlogsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('upload-resource')
  @UseInterceptors(FileInterceptor('resource'))
  async uploadResource(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { error: 'No file uploaded' };
    }
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed!');
    }
    if (file.size > 50 * 1024 * 1024) {
      throw new BadRequestException('PDF size must be less than 50MB');
    }
    const url = await this.cloudinaryService.uploadPdf(file.buffer, file.originalname);
    return { url };
  }

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
  // @UseGuards(JwtAuthGuard) // Temporarily removed for debugging
  async create(@Body() body: any) {
    // Validate required fields
    if (!body.title || !body.date || !body.category || !body.description) {
      throw new BadRequestException('Missing required fields: title, date, category, or description');
    }
    if (!Array.isArray(body.authors)) {
      body.authors = [];
    }
    if (!Array.isArray(body.availableResources)) {
      body.availableResources = [];
    }
    if (!Array.isArray(body.projectTeam)) {
      body.projectTeam = [];
    }
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
  async update(@Param('id') id: string, @Body() body: any) {
    if (!Array.isArray(body.authors)) {
      body.authors = [];
    }
    if (!Array.isArray(body.availableResources)) {
      body.availableResources = [];
    }
    if (!Array.isArray(body.projectTeam)) {
      body.projectTeam = [];
    }
    return this.service.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
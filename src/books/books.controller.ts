import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BooksService } from './books.service';
import { CloudinaryService } from '../common/services/cloudinary.service';

@Controller('books')
export class BooksController {
  constructor(
    private readonly service: BooksService,
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
    if (!body.title || !body.description || !body.authors || body.authors.length === 0) {
      throw new BadRequestException('Missing required fields: title, description, or authors');
    }

    if (!Array.isArray(body.availableResources)) {
      body.availableResources = [];
    }

    if (!body.year && body.datePosted) {
      body.year = new Date(body.datePosted).getFullYear();
    }

    return this.service.create(body);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const book = await this.service.findOne(id);
    if (!book) {
      throw new BadRequestException('Book not found');
    }
    return book;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    if (!Array.isArray(body.availableResources)) {
      body.availableResources = [];
    }

    if (!body.year && body.datePosted) {
      body.year = new Date(body.datePosted).getFullYear();
    }

    const updated = await this.service.update(id, body);
    if (!updated) {
      throw new BadRequestException('Book not found');
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.service.remove(id);
    if (!deleted) {
      throw new BadRequestException('Book not found');
    }
    return { message: 'Book deleted successfully' };
  }
}
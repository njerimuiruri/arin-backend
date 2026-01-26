import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JournalArticleService } from './journal-article.service';
import { CloudinaryService } from '../common/services/cloudinary.service';

@Controller('journal-articles')
export class JournalArticleController {
  constructor(
    private readonly service: JournalArticleService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // Endpoint for uploading images to be embedded in description
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

  // Upload cover image
  @Post('upload-cover-image')
  @UseInterceptors(FileInterceptor('coverImage'))
  async uploadCoverImage(@UploadedFile() file: Express.Multer.File) {
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

  @Post('upload-resource')
  @UseInterceptors(FileInterceptor('resource'))
  async uploadResource(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed!');
    }
    if (file.size > 20 * 1024 * 1024) {
      throw new BadRequestException('PDF size must be less than 20MB');
    }
    const url = await this.cloudinaryService.uploadPdf(file.buffer, file.originalname);
    return { url };
  }

  @Post()
  async create(@Body() body: any) {
    if (!body.title || !body.authors || !Array.isArray(body.authors) || body.authors.length === 0 || !body.date || !body.description) {
      throw new BadRequestException('Missing required fields: title, authors, date, or description');
    }
    return this.service.create({
      title: body.title,
      authors: body.authors,
      description: body.description,
      date: body.date,
      coverImage: body.coverImage,
      resources: body.resources,
    });
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const article = await this.service.findOne(id);
    if (!article) {
      throw new BadRequestException('Journal article not found');
    }
    return article;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.author !== undefined) updateData.author = body.author;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.date !== undefined) updateData.date = body.date;
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage;
    if (body.resources !== undefined) updateData.resources = body.resources;
    const updated = await this.service.update(id, updateData);
    if (!updated) {
      throw new BadRequestException('Journal article not found');
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.service.remove(id);
    if (!deleted) {
      throw new BadRequestException('Journal article not found');
    }
    return { message: 'Journal article deleted successfully' };
  }
}
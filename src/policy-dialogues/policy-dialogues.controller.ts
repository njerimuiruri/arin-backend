import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PolicyDialoguesService } from './policy-dialogues.service';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('policy-dialogue')
export class PolicyDialoguesController {
  constructor(
    private readonly service: PolicyDialoguesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
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
    // Upload PDF to Cloudinary as raw file
    const url = await this.cloudinaryService.uploadImage(file.buffer, file.originalname);
    return { url };
  }

  @Post()
  // @UseGuards(JwtAuthGuard) // Temporarily removed for debugging
  async create(@Body() body: any) {
    console.log('Received create request with body:', body);
    
    // Validate required fields
    if (!body.title || !body.date || !body.status || !body.description) {
      throw new BadRequestException('Missing required fields: title, date, status, or description');
    }

    // Ensure availableResources is an array
    if (!Array.isArray(body.availableResources)) {
      body.availableResources = [];
    }

    return this.service.create(body);
  }

  @Get()
  async findAll() {
    const results = await this.service.findAll();
    console.log('Returning dialogues:', results.map(d => ({ _id: d._id, title: d.title })));
    return results;
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    if (!id || id === 'undefined') {
      throw new BadRequestException('Invalid dialogue ID');
    }
    try {
      return await this.service.findById(id);
    } catch (error) {
      console.error('Error fetching dialogue:', error);
      throw error;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
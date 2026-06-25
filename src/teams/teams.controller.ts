import { BadRequestException, InternalServerErrorException, Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TeamsService } from './teams.service';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { uploadToCloudinary } from '../common/cloudinary-upload';

@Controller('teams')
export class TeamsController {
  constructor(
    private readonly service: TeamsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file received  ensure the field name is "image"');
    }
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Image must be under 5 MB');
    }
    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('File buffer is empty');
    }
    try {
      const url = await uploadToCloudinary(file);
      return { url };
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Cloudinary upload failed: ${err?.message || err}`,
      );
    }
  }

  @Put('reorder')
  @UseGuards(JwtAuthGuard)
  async reorder(@Body() body: { ids: string[] }) {
    if (!Array.isArray(body.ids)) {
      throw new BadRequestException('ids must be an array');
    }
    return this.service.reorder(body.ids);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: any) {
    if (!body.firstName || !body.lastName || !body.role) {
      throw new BadRequestException('Missing required fields: firstName, lastName, role');
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
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}

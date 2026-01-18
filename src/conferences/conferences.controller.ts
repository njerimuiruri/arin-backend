import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { ConferencesService } from './conferences.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

function ensureUploadDir(): string {
  const uploadDir = path.join(__dirname, '../../uploads/conferences');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
}

@Controller('conferences')
export class ConferencesController {
  constructor(private readonly service: ConferencesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, ensureUploadDir());
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { error: 'No file uploaded' };
    }
    const url = `/uploads/conferences/${file.filename}`;
    return { url };
  }

  @Post('upload-resource')
  @UseInterceptors(FileInterceptor('resource', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, ensureUploadDir());
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, 'resource-' + uniqueSuffix + ext);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Only PDF files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  }))
  async uploadResource(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { error: 'No file uploaded' };
    }
    const url = `/uploads/conferences/${file.filename}`;
    return { url };
  }

  @Post()
  // @UseGuards(JwtAuthGuard) // Temporarily removed for debugging
  async create(@Body() body: any) {
    console.log('Received create request with body:', body);
    
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
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    // Extract year from date if not provided
    if (!body.year && body.date) {
      body.year = new Date(body.date).getFullYear();
    }

    return this.service.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
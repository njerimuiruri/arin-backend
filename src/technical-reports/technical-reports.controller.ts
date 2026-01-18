import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { TechnicalReportsService } from './technical-reports.service';

function ensureUploadDir(): string {
  const uploadDir = path.join(__dirname, '../../uploads/technical-reports');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
}

@Controller('technical-reports')
export class TechnicalReportsController {
  constructor(private readonly service: TechnicalReportsService) {}

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
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { error: 'No file uploaded' };
    }
    const url = `/uploads/technical-reports/${file.filename}`;
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
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  async uploadResource(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { error: 'No file uploaded' };
    }
    const url = `/uploads/technical-reports/${file.filename}`;
    return { url };
  }

  @Post()
  async create(@Body() body: any) {
    if (!body.title || !body.description) {
      throw new BadRequestException('Missing required fields: title or description');
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
    const report = await this.service.findOne(id);
    if (!report) {
      throw new BadRequestException('Technical report not found');
    }
    return report;
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
      throw new BadRequestException('Technical report not found');
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.service.remove(id);
    if (!deleted) {
      throw new BadRequestException('Technical report not found');
    }
    return { message: 'Technical report deleted successfully' };
  }
}
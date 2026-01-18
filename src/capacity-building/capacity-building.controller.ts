import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { CapacityBuildingService } from './capacity-building.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('capacity-building')
export class CapacityBuildingController {
  constructor(private readonly service: CapacityBuildingService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads/capacity-building'));
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
    const url = `/uploads/capacity-building/${file.filename}`;
    return { url };
  }

  // Upload available resources (PDF)
  @Post('upload-resource')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads/capacity-building'));
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
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  }))
  async uploadResource(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { error: 'No file uploaded' };
    }
    const url = `/uploads/capacity-building/${file.filename}`;
    return { url };
  }

  @Post()
  // @UseGuards(JwtAuthGuard) // Temporarily removed for debugging
  async create(@Body() body: any) {
    console.log('Received create request with body:', body);
    
    // Validate required fields
    if (!body.title || !body.date || !body.description || !body.status || !body.location) {
      throw new BadRequestException('Missing required fields: title, date, status, location, or description');
    }

    // Ensure projectTeam is an array
    if (!Array.isArray(body.projectTeam)) {
      body.projectTeam = [];
    }

    if (!Array.isArray(body.objectives)) body.objectives = [];
    if (!Array.isArray(body.partners)) body.partners = [];
    if (!Array.isArray(body.outcomes)) body.outcomes = [];
    if (!Array.isArray(body.availableResources)) body.availableResources = [];

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
    if (!Array.isArray(body.projectTeam)) body.projectTeam = [];
    if (!Array.isArray(body.objectives)) body.objectives = [];
    if (!Array.isArray(body.partners)) body.partners = [];
    if (!Array.isArray(body.outcomes)) body.outcomes = [];
    if (!Array.isArray(body.availableResources)) body.availableResources = [];
    return this.service.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
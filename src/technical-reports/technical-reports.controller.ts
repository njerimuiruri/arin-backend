import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { TechnicalReportsService } from './technical-reports.service';
import { CloudinaryService } from '../common/services/cloudinary.service';
import * as https from 'https';
import * as http from 'http';

@Controller('technical-reports')
export class TechnicalReportsController {
  constructor(
    private readonly service: TechnicalReportsService,
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
  @UseInterceptors(FileInterceptor('resource', {
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  }))
  async uploadResource(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { error: 'No file uploaded' };
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

  @Get('resource-proxy')
  async proxyResource(
    @Query('url') url: string,
    @Query('download') download: string,
    @Res() res: Response,
  ) {
    if (!url) {
      throw new BadRequestException('url query parameter is required');
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      throw new BadRequestException('Invalid URL');
    }

    if (!parsedUrl.hostname.includes('cloudinary.com') && !parsedUrl.hostname.includes('res.cloudinary.com')) {
      throw new BadRequestException('Only Cloudinary resource URLs are allowed');
    }

    const fetchUrl = url.replace(/[?&]dl=1/g, '').replace(/\?$/, '').replace(/&$/, '');

    return new Promise<void>((resolve, reject) => {
      const protocol = parsedUrl.protocol === 'https:' ? https : http;
      const request = protocol.get(fetchUrl, (upstream) => {
        const status = upstream.statusCode ?? 500;
        if (status < 200 || status >= 300) {
          res.status(status).send('Failed to fetch resource');
          resolve();
          return;
        }

        const contentType = upstream.headers['content-type'] || 'application/pdf';
        const disposition = download === 'true' ? 'attachment' : 'inline';

        const rawName = decodeURIComponent(parsedUrl.pathname.split('/').pop() ?? 'document.pdf');
        const filename = rawName.replace(/[^a-zA-Z0-9._\-() ]/g, '_') || 'document.pdf';

        res.setHeader('Content-Type', contentType.includes('pdf') ? 'application/pdf' : contentType);
        res.setHeader('Content-Disposition', `${disposition}; filename="${filename}"`);
        res.setHeader('Access-Control-Allow-Origin', '*');

        if (upstream.headers['content-length']) {
          res.setHeader('Content-Length', upstream.headers['content-length']);
        }

        upstream.pipe(res);
        upstream.on('end', resolve);
        upstream.on('error', reject);
      });

      request.on('error', (err) => {
        res.status(500).send('Error fetching resource');
        reject(err);
      });
    });
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
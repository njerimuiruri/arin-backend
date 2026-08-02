import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResearchProjectsService } from './research-projects.service';
import { CloudinaryService } from '../common/services/cloudinary.service';

const ALLOWED_RESOURCE_MIMETYPES = [
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
];

@Controller('research-projects')
export class ResearchProjectsController {
  constructor(
    private readonly service: ResearchProjectsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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

  // Upload a resource file: PDF, PowerPoint, Word, Excel, or Zip
  @Post('upload-resource')
  @UseInterceptors(FileInterceptor('resource'))
  async uploadResource(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!ALLOWED_RESOURCE_MIMETYPES.includes(file.mimetype)) {
      throw new BadRequestException('Only PDF, PowerPoint, Word, Excel, or Zip files are allowed!');
    }
    if (file.size > 50 * 1024 * 1024) {
      throw new BadRequestException('File size must be less than 50MB');
    }
    const url = file.mimetype === 'application/pdf'
      ? await this.cloudinaryService.uploadPdf(file.buffer, file.originalname)
      : await this.cloudinaryService.uploadRaw(file.buffer, file.originalname);
    return { url };
  }

  // Upload a gallery image
  @Post('upload-gallery-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadGalleryImage(@UploadedFile() file: Express.Multer.File) {
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

  // Upload an abstract submitter's photo
  @Post('upload-abstract-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadAbstractImage(@UploadedFile() file: Express.Multer.File) {
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

  @Post()
  async create(@Body() body: any) {
    if (!body.title || !body.author || !body.date || !body.description) {
      throw new BadRequestException('Missing required fields: title, author, date, or description');
    }
    return this.service.create({
      title: body.title,
      author: body.author,
      description: body.description,
      date: body.date,
      coverImage: body.coverImage,
      category: body.category,
      objectives: body.objectives,
      focusAreas: body.focusAreas,
      goal: body.goal,
      outputs: body.outputs,
      longTermOutcome: body.longTermOutcome,
      intermediateOutcomes: body.intermediateOutcomes,
      funders: body.funders,
      partners: body.partners,
      themes: body.themes,
      resources: body.resources,
      gallery: body.gallery,
      relatedInitiatives: body.relatedInitiatives,
      teamMembers: body.teamMembers,
      abstracts: body.abstracts,
    });
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
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.author !== undefined) updateData.author = body.author;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.date !== undefined) updateData.date = body.date;
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.objectives !== undefined) updateData.objectives = body.objectives;
    if (body.focusAreas !== undefined) updateData.focusAreas = body.focusAreas;
    if (body.goal !== undefined) updateData.goal = body.goal;
    if (body.outputs !== undefined) updateData.outputs = body.outputs;
    if (body.longTermOutcome !== undefined) updateData.longTermOutcome = body.longTermOutcome;
    if (body.intermediateOutcomes !== undefined) updateData.intermediateOutcomes = body.intermediateOutcomes;
    if (body.funders !== undefined) updateData.funders = body.funders;
    if (body.partners !== undefined) updateData.partners = body.partners;
    if (body.themes !== undefined) updateData.themes = body.themes;
    if (body.resources !== undefined) updateData.resources = body.resources;
    if (body.gallery !== undefined) updateData.gallery = body.gallery;
    if (body.relatedInitiatives !== undefined) updateData.relatedInitiatives = body.relatedInitiatives;
    if (body.teamMembers !== undefined) updateData.teamMembers = body.teamMembers;
    if (body.abstracts !== undefined) updateData.abstracts = body.abstracts;
    return this.service.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}

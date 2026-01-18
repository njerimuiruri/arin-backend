import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async create(
    @Body()
    contactData: {
      name: string;
      email: string;
      phone?: string;
      subject: string;
      message: string;
    },
  ) {
    return this.contactsService.create(contactData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('unread-count')
  async getUnreadCount() {
    const count = await this.contactsService.getUnreadCount();
    return { count };
  }

  @UseGuards(JwtAuthGuard)
  @Get('all/list')
  async findAllList() {
    return this.contactsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
    return this.contactsService.findAllPaginated(pageNum, limitNum);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contactsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.contactsService.markAsRead(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.contactsService.delete(id);
  }
}

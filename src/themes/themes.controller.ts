import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('themes')
export class ThemesController {
  constructor(private readonly service: ThemesService) {}

  @Put('reorder')
  @UseGuards(JwtAuthGuard)
  async reorder(@Body() body: { researchProject: string; ids: string[] }) {
    if (!body.researchProject) {
      throw new BadRequestException('researchProject is required');
    }
    if (!Array.isArray(body.ids)) {
      throw new BadRequestException('ids must be an array');
    }
    return this.service.reorder(body.researchProject, body.ids);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: any) {
    if (!body.researchProject || !body.name) {
      throw new BadRequestException('Missing required fields: researchProject, name');
    }
    return this.service.create(body);
  }

  @Get()
  async findAllByProject(@Query('researchProject') researchProject: string) {
    if (!researchProject) {
      throw new BadRequestException('researchProject query param is required');
    }
    return this.service.findAllByProject(researchProject);
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

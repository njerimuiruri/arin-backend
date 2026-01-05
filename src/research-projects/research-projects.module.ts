import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResearchProject, ResearchProjectSchema } from './research-project.schema';
import { ResearchProjectsService } from './research-projects.service';
import { ResearchProjectsController } from './research-projects.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ResearchProject.name, schema: ResearchProjectSchema },
    ]),
  ],
  controllers: [ResearchProjectsController],
  providers: [ResearchProjectsService],
})
export class ResearchProjectsModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImpactStory, ImpactStorySchema } from './impact-story.schema';
import { ImpactStoriesService } from './impact-stories.service';

import { CloudinaryService } from '../common/services/cloudinary.service';

import { ImpactStoriesController } from './impact-stories.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImpactStory.name, schema: ImpactStorySchema },
    ]),
  ],
  controllers: [ImpactStoriesController],
  providers: [ImpactStoriesService, CloudinaryService],
})
export class ImpactStoriesModule {}

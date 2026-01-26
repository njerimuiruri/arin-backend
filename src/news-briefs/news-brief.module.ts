import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsBrief, NewsBriefSchema } from './news-brief.schema';
import { NewsBriefService } from './news-brief.service';
import { NewsBriefController } from './news-brief.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NewsBrief.name, schema: NewsBriefSchema },
    ]),
  ],
  controllers: [NewsBriefController],
  providers: [NewsBriefService, require('../common/services/cloudinary.service').CloudinaryService],
})
export class NewsBriefModule {}

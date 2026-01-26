import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PolicyBrief, PolicyBriefSchema } from './policy-brief.schema';
import { PolicyBriefService } from './policy-brief.service';
import { PolicyBriefController } from './policy-brief.controller';
import { CloudinaryService } from '../common/services/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PolicyBrief.name, schema: PolicyBriefSchema },
    ]),
  ],
  controllers: [PolicyBriefController],
  providers: [PolicyBriefService, CloudinaryService],
})
export class PolicyBriefModule {}

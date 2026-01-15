import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PolicyBrief, PolicyBriefSchema } from './policy-brief.schema';
import { PolicyBriefService } from './policy-brief.service';
import { PolicyBriefController } from './policy-brief.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PolicyBrief.name, schema: PolicyBriefSchema },
    ]),
  ],
  controllers: [PolicyBriefController],
  providers: [PolicyBriefService],
})
export class PolicyBriefModule {}

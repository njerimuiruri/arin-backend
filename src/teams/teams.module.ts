import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamMember, TeamMemberSchema } from './team-member.schema';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { CloudinaryService } from '../common/services/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TeamMember.name, schema: TeamMemberSchema },
    ]),
  ],
  controllers: [TeamsController],
  providers: [TeamsService, CloudinaryService],
})
export class TeamsModule {}

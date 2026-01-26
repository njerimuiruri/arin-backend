import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PolicyDialogue, PolicyDialogueSchema } from './policy-dialogues.schema';
import { PolicyDialoguesService } from './policy-dialogues.service';
import { PolicyDialoguesController } from './policy-dialogues.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PolicyDialogue.name, schema: PolicyDialogueSchema },
    ]),
  ],
  controllers: [PolicyDialoguesController],
  providers: [PolicyDialoguesService, require('../common/services/cloudinary.service').CloudinaryService],
})
export class PolicyDialoguesModule {}

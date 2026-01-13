import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Conferences, ConferencesSchema } from './conferences.schema';
import { ConferencesService } from './conferences.service';
import { ConferencesController } from './conferences.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conferences.name, schema: ConferencesSchema },
    ]),
  ],
  controllers: [ConferencesController],
  providers: [ConferencesService],
})
export class ConferencesModule {}

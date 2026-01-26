import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CopController } from './cop.controller';
import { CopService } from './cop.service';
import { Cop, CopSchema } from './cop.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cop.name, schema: CopSchema }])],
  controllers: [CopController],
  providers: [CopService, require('../common/services/cloudinary.service').CloudinaryService],
})
export class CopModule {}

import { Module } from '@nestjs/common';
import { ResourcesController } from './resources.controller';
import { CloudinaryService } from '../common/services/cloudinary.service';

@Module({
  controllers: [ResourcesController],
  providers: [CloudinaryService],
})
export class ResourcesModule {}

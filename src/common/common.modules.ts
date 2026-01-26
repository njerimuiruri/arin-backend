import { Module } from '@nestjs/common';
import { CloudinaryService } from './services/cloudinary.service';
import { UploadController } from './controllers/upload.controllers';

@Module({
  controllers: [UploadController],
})
export class CommonModule {}
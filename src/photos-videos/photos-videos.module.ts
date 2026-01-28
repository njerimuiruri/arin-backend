import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhotosVideosService } from './photos-videos.service';
import { PhotosVideosController } from './photos-videos.controller';
import { PhotosController } from './photos.controller';
import { VideosController } from './videos.controller';
import { PhotosVideos, PhotosVideosSchema } from './schemas/photos-videos.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: PhotosVideos.name, schema: PhotosVideosSchema }])],
  controllers: [PhotosVideosController, PhotosController, VideosController],
  providers: [PhotosVideosService],
})
export class PhotosVideosModule {}

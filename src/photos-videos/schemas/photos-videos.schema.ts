import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PhotosVideos extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  type: 'photo' | 'video';

  @Prop({ required: true })
  url: string;

  @Prop()
  thumbnail?: string; // For video preview
}

export const PhotosVideosSchema = SchemaFactory.createForClass(PhotosVideos);

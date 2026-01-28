import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ImpactStory extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string; // WYSIWYG HTML or JSON

  @Prop({ required: true })
  date: Date;

  @Prop({ required: false })
  image?: string; // URL to uploaded image

  @Prop({ required: false })
  video?: string; // URL to uploaded video
}

export const ImpactStorySchema = SchemaFactory.createForClass(ImpactStory);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ResearchProject extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  description: string; // WYSIWYG HTML or JSON

  @Prop({ required: true })
  date: Date;

  @Prop({ required: false })
  coverImage?: string; // URL to cover image

  @Prop({ required: false, type: [String] })
  resources?: string[]; // URLs to uploaded PDFs
}

export const ResearchProjectSchema = SchemaFactory.createForClass(ResearchProject);
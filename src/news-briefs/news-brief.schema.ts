import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class NewsBrief extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string; // HTML from WYSIWYG

  @Prop({ type: [String], required: false })
  authors?: string[];

  @Prop({ required: false })
  coverImage?: string; // Main/cover image

  @Prop({ required: false })
  image?: string; // For backward compatibility or WYSIWYG images

  @Prop({ required: false })
  datePosted?: Date;

  @Prop({ type: [String], required: false })
  availableResources?: string[];

  @Prop({ required: false })
  year?: number;
}

export const NewsBriefSchema = SchemaFactory.createForClass(NewsBrief);
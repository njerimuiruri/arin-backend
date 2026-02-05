import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Blogs extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string; // WYSIWYG HTML

  @Prop({ type: [String], required: false })
  authors?: string[];

  @Prop({ required: false })
  image?: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: [String], required: false })
  availableResources?: string[];

  @Prop({ required: false, type: [String] })
  projectTeam?: string[];
}

export const BlogsSchema = SchemaFactory.createForClass(Blogs);
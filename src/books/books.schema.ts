import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Books extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  image?: string;

  @Prop({ required: true, type: [String] })
  authors: string[];

  @Prop({ required: false })
  datePosted?: Date;

  @Prop({ type: [String], required: false })
  availableResources?: string[];

  @Prop({ required: false })
  year?: number;
}

export const BooksSchema = SchemaFactory.createForClass(Books);
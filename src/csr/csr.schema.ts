import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })

export class Csr extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  description: string; // WYSIWYG HTML or JSON

  @Prop({ required: false })
  image?: string; // URL to cover image

  @Prop({ type: [String], required: false })
  availableResources?: string[]; // URLs to uploaded resources (e.g. images, pdfs)
}

export const CsrSchema = SchemaFactory.createForClass(Csr);
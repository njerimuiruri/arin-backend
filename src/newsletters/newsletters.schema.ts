import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Newsletters extends Document {
  @Prop({ required: true })
  title: string;


  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: false })
  authors?: string[];

  @Prop({ required: false })
  image?: string;

  @Prop({ required: false })
  datePosted?: Date;

  @Prop({ type: [String], required: false })
  availableResources?: string[];

  @Prop({ required: false })
  year?: number;
}

export const NewslettersSchema = SchemaFactory.createForClass(Newsletters);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Conferences extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  image?: string;

  @Prop({ required: false })
  venue?: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: false })
  category?: string;

  @Prop({ type: [String], required: false })
  availableResources?: string[];

  @Prop({ required: false })
  year?: number;
}

export const ConferencesSchema = SchemaFactory.createForClass(Conferences);
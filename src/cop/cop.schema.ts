import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Cop extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  image?: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: [String], required: false })
  availableResources?: string[];

  @Prop({ required: false })
  year?: number;
}

export const CopSchema = SchemaFactory.createForClass(Cop);

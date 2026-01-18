import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AnnualReports extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  image?: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: [String], default: [] })
  availableResources?: string[];

  @Prop({ required: false })
  year?: string;
}

export const AnnualReportsSchema = SchemaFactory.createForClass(AnnualReports);
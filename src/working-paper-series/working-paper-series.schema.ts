import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WorkingPaperSeriesDocument = HydratedDocument<WorkingPaperSeries>;

@Schema({ timestamps: true })
export class WorkingPaperSeries {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  image?: string;

  @Prop({ type: [String], default: [] })
  authors?: string[];

  @Prop({ type: [String], default: [] })
  availableResources?: string[];

  @Prop()
  datePosted?: Date;

  @Prop()
  year?: number;

  @Prop({ default: new Date() })
  createdAt?: Date;

  @Prop({ default: new Date() })
  updatedAt?: Date;
}

export const WorkingPaperSeriesSchema = SchemaFactory.createForClass(WorkingPaperSeries);

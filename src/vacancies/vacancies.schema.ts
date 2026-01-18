import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Vacancy extends Document {
  @Prop({ required: true })
  positionName: string;

  @Prop({ required: true, enum: ['Full-time', 'Part-time'] })
  employmentType: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  image?: string;

  @Prop({ required: true })
  datePosted: Date;

  @Prop({ required: true })
  deadline: Date;
}

export const VacancySchema = SchemaFactory.createForClass(Vacancy);

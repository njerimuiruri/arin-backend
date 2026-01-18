import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ResearchProject extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  image?: string; // Main project image

  @Prop({ required: false, type: [String] })
  descriptionImages?: string[]; // Images embedded in description

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, type: [String] })
  projectTeam: string[];
}

export const ResearchProjectSchema = SchemaFactory.createForClass(ResearchProject);
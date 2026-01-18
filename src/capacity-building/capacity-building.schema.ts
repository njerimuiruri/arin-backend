import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CapacityBuilding extends Document {
  @Prop({ required: true })
  title: string;


  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  image?: string;

  @Prop({ required: true, enum: ['Ongoing', 'Completed'], default: 'Ongoing' })
  status: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: false })
  category?: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, type: [String] })
  projectTeam: string[];

  @Prop({ required: false, type: [String], default: [] })
  objectives?: string[];

  @Prop({ required: false, type: [String], default: [] })
  partners?: string[];

  @Prop({ required: false, type: [String], default: [] })
  outcomes?: string[];

  @Prop({ required: false, type: [String], default: [] })
  availableResources?: string[]; // URLs to PDFs/downloadables
}

export const CapacityBuildingSchema = SchemaFactory.createForClass(CapacityBuilding);
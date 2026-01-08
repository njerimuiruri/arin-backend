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

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, type: [String] })
  projectTeam: string[];
}

export const CapacityBuildingSchema = SchemaFactory.createForClass(CapacityBuilding);
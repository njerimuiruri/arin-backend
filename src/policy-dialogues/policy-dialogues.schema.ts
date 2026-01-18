import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PolicyDialogue extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string; // HTML content from TipTap editor

  @Prop({ required: false })
  image?: string; // Main image URL

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, enum: ['Ongoing', 'Completed', 'Incomplete'] })
  status: string;

  @Prop({ type: [String], default: [] })
  availableResources: string[]; // PDF URLs for downloadable resources
}

export const PolicyDialogueSchema = SchemaFactory.createForClass(PolicyDialogue);
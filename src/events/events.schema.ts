import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string; // HTML content from TipTap editor

  @Prop({ required: false })
  image?: string; // Main image URL

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: string; // e.g., "09:00 AM"

  @Prop({ required: true })
  location: string;

  @Prop({ required: true, enum: ['Upcoming', 'Past'] })
  status: string;

  @Prop({
    required: true,
    enum: ['Conference', 'Workshop', 'Webinar', 'Dialogue', 'Friday Reviews'],
  })
  category: string;

  @Prop({ type: [String], default: [] })
  availableResources: string[]; // PDF URLs for downloadable resources
}

export const EventsSchema = SchemaFactory.createForClass(Event);
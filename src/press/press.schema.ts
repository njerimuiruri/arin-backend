import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PressDocument = HydratedDocument<Press>;

@Schema({ timestamps: true })
export class Press {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  image?: string;

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

export const PressSchema = SchemaFactory.createForClass(Press);

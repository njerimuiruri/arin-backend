import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CallForBooksDocument = HydratedDocument<CallForBooks>;

@Schema({ timestamps: true })
export class CallForBooks {
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
  deadline?: Date;

  @Prop()
  year?: number;

  @Prop({ default: new Date() })
  createdAt?: Date;

  @Prop({ default: new Date() })
  updatedAt?: Date;
}

export const CallForBooksSchema = SchemaFactory.createForClass(CallForBooks);

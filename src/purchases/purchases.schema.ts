import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Purchase extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  bookId: string;

  @Prop({ required: true })
  bookTitle: string;

  @Prop({ required: true, unique: true })
  reference: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, default: 'USD' })
  currency: string;

  @Prop({ required: true, default: 1 })
  quantity: number;

  @Prop({ type: [String], default: [] })
  resources: string[];

  @Prop({ required: true, default: 'success' })
  status: string;

  @Prop({ default: false })
  emailSent: boolean;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);

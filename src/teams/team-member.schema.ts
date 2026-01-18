import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class TeamMember extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: false })
  bio?: string;

  @Prop({ required: false })
  image?: string; // URL to uploaded image
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);

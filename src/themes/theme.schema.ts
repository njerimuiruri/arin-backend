import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ResourceItem, ResourceItemSchema } from '../research-projects/research-project.schema';

@Schema({ _id: false })
export class LearningModule {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false })
  url?: string;

  @Prop({ required: false, default: 'reading' })
  type?: string; // reading | video | course | tool

  @Prop({ required: false, default: 0 })
  order?: number;
}
export const LearningModuleSchema = SchemaFactory.createForClass(LearningModule);

// A single headline figure for a programme-style project area, e.g.
// { label: "Levels", value: "3" } or { label: "Pass Mark", value: "70%" }.
@Schema({ _id: false })
export class SubProjectStat {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  value: string;
}
export const SubProjectStatSchema = SchemaFactory.createForClass(SubProjectStat);

// One "Mode of Study" entry, e.g.
// { title: "Live Zoom Masterclasses", description: "Interactive sessions with thematic experts" }.
@Schema({ _id: false })
export class SubProjectFormat {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description?: string;
}
export const SubProjectFormatSchema = SchemaFactory.createForClass(SubProjectFormat);

// One tier in a fellowship/programme structure, e.g. Beginner / Intermediate / Advanced.
@Schema({ _id: false })
export class SubProjectLevel {
  @Prop({ required: true })
  name: string; // "Beginner"

  @Prop({ required: false })
  subtitle?: string; // "Foundation & Technical Core"

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false, type: [String], default: [] })
  points?: string[]; // assessment / requirement bullets

  @Prop({ required: false })
  certificate?: string; // "Certificate in Foundations of AI for Climate Resilience"
}
export const SubProjectLevelSchema = SchemaFactory.createForClass(SubProjectLevel);

@Schema({ timestamps: true })
export class Theme extends Document {
  @Prop({ type: Types.ObjectId, ref: 'ResearchProject', required: true, index: true })
  researchProject: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  subtitle?: string; // e.g. "In partnership with Taylor & Francis"

  @Prop({ required: false })
  coverImage?: string;

  @Prop({ required: false })
  overview?: string; // brief description shown on the theme's hero/intro

  @Prop({ required: false })
  detailedContent?: string; // rich HTML, shown behind "View More Details"

  @Prop({ required: false })
  externalUrl?: string; // link to an external platform, e.g. the e-learning site

  @Prop({ required: false })
  externalUrlLabel?: string; // CTA label for externalUrl, e.g. "Go to the e-learning platform"

  @Prop({ required: false, type: [String], default: [] })
  objectives?: string[];

  @Prop({ required: false, type: [SubProjectStatSchema], default: [] })
  stats?: SubProjectStat[]; // headline figures (Levels / Pass Mark / Certificates ...)

  @Prop({ required: false, type: [SubProjectLevelSchema], default: [] })
  levels?: SubProjectLevel[]; // programme structure

  @Prop({ required: false, type: [SubProjectFormatSchema], default: [] })
  format?: SubProjectFormat[]; // mode of study

  @Prop({ required: false, type: [String], default: [] })
  learningOutcomes?: string[];

  @Prop({ required: false, type: [LearningModuleSchema], default: [] })
  learningModules?: LearningModule[];

  @Prop({ required: false, type: [ResourceItemSchema], default: [] })
  resources?: ResourceItem[];

  @Prop({ required: false, default: 0 })
  order?: number;
}

export const ThemeSchema = SchemaFactory.createForClass(Theme);

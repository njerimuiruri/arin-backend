import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const RESOURCE_TYPES = [
  'pdf',
  'presentation',
  'report',
  'publication',
  'toolkit',
  'guideline',
  'other',
] as const;

@Schema({ _id: false })
export class ResourceItem {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false, default: 'other' })
  type?: string; // one of RESOURCE_TYPES

  @Prop({ required: false })
  group?: string; // optional theme/sub-project label, e.g. "AI for Climate Resilience"

  @Prop({ required: false })
  image?: string; // optional cover image shown on the resource card and its detail page
}
export const ResourceItemSchema = SchemaFactory.createForClass(ResourceItem);

@Schema({ _id: false })
export class GalleryItem {
  @Prop({ required: true })
  url: string;

  @Prop({ required: false })
  caption?: string;
}
export const GalleryItemSchema = SchemaFactory.createForClass(GalleryItem);

@Schema({ _id: false })
export class RelatedInitiative {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: false })
  image?: string;
}
export const RelatedInitiativeSchema = SchemaFactory.createForClass(RelatedInitiative);

@Schema({ _id: false })
export class AbstractItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  title?: string; // e.g. role/affiliation

  @Prop({ required: false })
  photo?: string;

  @Prop({ required: true })
  body: string; // the abstract text

  @Prop({ required: false })
  group?: string; // name of the ThemeItem this abstract belongs to, if any
}
export const AbstractItemSchema = SchemaFactory.createForClass(AbstractItem);

@Schema({ _id: false })
export class OrgItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  logo?: string;
}
export const OrgItemSchema = SchemaFactory.createForClass(OrgItem);

@Schema({ _id: false })
export class ThemeItem {
  @Prop({ required: true })
  name: string; // e.g. "AI for Climate Resilience"

  @Prop({ required: false })
  description?: string; // shown as the intro blurb on the theme's tab
}
export const ThemeItemSchema = SchemaFactory.createForClass(ThemeItem);

@Schema({ timestamps: true })
export class ResearchProject extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  description: string; // WYSIWYG HTML or JSON

  @Prop({ required: true })
  date: Date;

  @Prop({ required: false })
  coverImage?: string; // URL to cover image

  @Prop({ required: false })
  category?: string;

  @Prop({ required: false, type: [String], default: [] })
  objectives?: string[];

  @Prop({ required: false, type: [String], default: [] })
  focusAreas?: string[];

  @Prop({ required: false })
  goal?: string; // one-line project goal statement

  @Prop({ required: false })
  outputs?: string; // WYSIWYG HTML, same as description

  @Prop({ required: false })
  longTermOutcome?: string;

  @Prop({ required: false, type: [String], default: [] })
  intermediateOutcomes?: string[];

  @Prop({ required: false, type: [OrgItemSchema], default: [] })
  funders?: OrgItem[];

  @Prop({ required: false, type: [OrgItemSchema], default: [] })
  partners?: OrgItem[];

  @Prop({ required: false, type: [ResourceItemSchema], default: [] })
  resources?: ResourceItem[];

  @Prop({ required: false, type: [GalleryItemSchema], default: [] })
  gallery?: GalleryItem[];

  @Prop({ required: false, type: [RelatedInitiativeSchema], default: [] })
  relatedInitiatives?: RelatedInitiative[];

  @Prop({ required: false, type: [String] })
  teamMembers?: string[]; // Array of names

  @Prop({ required: false, type: [AbstractItemSchema], default: [] })
  abstracts?: AbstractItem[];

  @Prop({ required: false, type: [ThemeItemSchema], default: [] })
  themes?: ThemeItem[];
}

export const ResearchProjectSchema = SchemaFactory.createForClass(ResearchProject);

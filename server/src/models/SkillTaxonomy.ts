import mongoose, { Schema, Document } from 'mongoose';
import { ISkillTaxonomy } from '../types';

export interface ISkillTaxonomyDocument extends Omit<ISkillTaxonomy, '_id'>, Document {}

const SkillTaxonomySchema = new Schema<ISkillTaxonomyDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'PROGRAMMING_LANGUAGE',
        'FRAMEWORK_LIBRARY',
        'DATABASE',
        'CLOUD_DEVOPS',
        'TESTING',
        'SOFT_SKILL',
        'TOOLS',
      ],
      required: true,
      index: true,
    },
    synonyms: {
      type: [String],
      default: [],
    },
    popularityScore: {
      type: Number,
      default: 50,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const SkillTaxonomy = mongoose.model<ISkillTaxonomyDocument>('SkillTaxonomy', SkillTaxonomySchema);

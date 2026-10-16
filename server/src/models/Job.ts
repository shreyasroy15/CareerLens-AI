import mongoose, { Schema, Document } from 'mongoose';
import { IJob } from '../types';

export interface IJobDocument extends Omit<IJob, '_id'>, Document {}

const JobSchema = new Schema<IJobDocument>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requiredSkills: {
      type: [String],
      required: true,
      default: [],
      index: true,
    },
    preferredSkills: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    employmentType: {
      type: String,
      enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE'],
      default: 'FULL_TIME',
      index: true,
    },
    experienceLevel: {
      type: String,
      enum: ['ENTRY', 'MID', 'SENIOR', 'LEAD'],
      default: 'ENTRY',
      index: true,
    },
    salaryRange: {
      type: String,
      default: 'Competitive',
    },
    applicationUrl: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      default: 'Curated Placement Portal',
    },
    isSampleData: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true,
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

// Compound text index for search
JobSchema.index({ title: 'text', company: 'text', description: 'text', requiredSkills: 'text' });

export const Job = mongoose.model<IJobDocument>('Job', JobSchema);

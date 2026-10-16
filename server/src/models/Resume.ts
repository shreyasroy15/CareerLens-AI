import mongoose, { Schema, Document } from 'mongoose';
import { IResume } from '../types';

export interface IResumeDocument extends Omit<IResume, '_id'>, Document {}

const ContactInfoSchema = new Schema(
  {
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    portfolio: { type: String, trim: true },
  },
  { _id: false }
);

const ExtractedSectionsSchema = new Schema(
  {
    summary: { type: String, default: '' },
    education: { type: [String], default: [] },
    workExperience: { type: [String], default: [] },
    technicalSkills: { type: [String], default: [] },
    softSkills: { type: [String], default: [] },
    projects: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    contactInfo: { type: ContactInfoSchema, default: {} },
  },
  { _id: false }
);

const ResumeSchema = new Schema<IResumeDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: true,
      index: true,
    },
    originalFilename: {
      type: String,
      required: true,
      trim: true,
    },
    storageFilename: {
      type: String,
      required: true,
      trim: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSizeBytes: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
      default: '',
    },
    extractedSections: {
      type: ExtractedSectionsSchema,
      default: () => ({}),
    },
    extractedSkills: {
      type: [String],
      default: [],
      index: true,
    },
    processingStatus: {
      type: String,
      enum: ['PENDING', 'PARSED', 'FAILED'],
      default: 'PENDING',
      index: true,
    },
    errorMessage: {
      type: String,
    },
    cloudinaryUrl: {
      type: String,
      default: '',
    },
    cloudinaryPublicId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        // Don't leak raw absolute filesystem path to client
        delete ret.filePath;
        return ret;
      },
    },
  }
);

export const Resume = mongoose.model<IResumeDocument>('Resume', ResumeSchema);

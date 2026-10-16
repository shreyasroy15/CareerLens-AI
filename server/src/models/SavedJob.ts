import mongoose, { Schema, Document } from 'mongoose';
import { ISavedJob } from '../types';

export interface ISavedJobDocument extends Omit<ISavedJob, '_id'>, Document {}

const SavedJobSchema = new Schema<ISavedJobDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: true,
      index: true,
    },
    jobId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Job',
      required: true,
      index: true,
    },
    applicationStatus: {
      type: String,
      enum: ['SAVED', 'APPLIED', 'INTERVIEWING', 'OFFERED', 'REJECTED'],
      default: 'SAVED',
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
    appliedDate: {
      type: Date,
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

SavedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export const SavedJob = mongoose.model<ISavedJobDocument>('SavedJob', SavedJobSchema);

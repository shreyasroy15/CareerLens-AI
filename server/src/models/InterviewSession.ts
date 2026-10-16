import mongoose, { Schema, Document } from 'mongoose';
import { IInterviewSession } from '../types';

export interface IInterviewSessionDocument extends Omit<IInterviewSession, '_id'>, Document {}

const InterviewQASchema = new Schema(
  {
    id: { type: String, required: true },
    category: {
      type: String,
      enum: ['TECHNICAL', 'BEHAVIORAL', 'PROJECT_BASED'],
      required: true,
    },
    question: { type: String, required: true },
    contextOrRationale: { type: String, default: '' },
    suggestedAnswerStructure: { type: String, default: '' },
    userResponse: { type: String, default: '' },
    feedback: { type: String, default: '' },
  },
  { _id: false }
);

const InterviewSessionSchema = new Schema<IInterviewSessionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: true,
      index: true,
    },
    resumeId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Resume',
      required: true,
      index: true,
    },
    jobId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Job',
      default: null,
    },
    roleTitle: {
      type: String,
      required: true,
    },
    questions: {
      type: [InterviewQASchema],
      default: [],
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

export const InterviewSession = mongoose.model<IInterviewSessionDocument>(
  'InterviewSession',
  InterviewSessionSchema
);

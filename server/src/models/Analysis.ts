import mongoose, { Schema, Document } from 'mongoose';
import { IAnalysis } from '../types';

export interface IAnalysisDocument extends Omit<IAnalysis, '_id'>, Document {}

const ScoreBreakdownSchema = new Schema(
  {
    skillMatch: { type: Number, required: true, min: 0, max: 100 },
    textSimilarity: { type: Number, required: true, min: 0, max: 100 },
    keywordCoverage: { type: Number, required: true, min: 0, max: 100 },
    relevanceScore: { type: Number, required: true, min: 0, max: 100 },
    completenessScore: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false }
);

const AIRecommendationsSchema = new Schema(
  {
    summaryFeedback: { type: String, default: '' },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    improvementSuggestions: { type: [String], default: [] },
    projectRecommendations: { type: [String], default: [] },
    interviewTips: { type: [String], default: [] },
    isFallback: { type: Boolean, default: false },
  },
  { _id: false }
);

const AnalysisSchema = new Schema<IAnalysisDocument>(
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
    targetRoleTitle: {
      type: String,
      required: true,
      trim: true,
    },
    targetJobDescription: {
      type: String,
      required: true,
    },
    inputType: {
      type: String,
      enum: ['SAVED_JOB', 'CUSTOM_TEXT'],
      default: 'CUSTOM_TEXT',
    },
    componentScores: {
      type: ScoreBreakdownSchema,
      required: true,
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      index: true,
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    partiallyMatchedSkills: {
      type: [String],
      default: [],
    },
    recommendations: {
      type: AIRecommendationsSchema,
      required: true,
    },
    algorithmVersion: {
      type: String,
      default: '1.0.0-tfidf-hybrid',
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

export const Analysis = mongoose.model<IAnalysisDocument>('Analysis', AnalysisSchema);

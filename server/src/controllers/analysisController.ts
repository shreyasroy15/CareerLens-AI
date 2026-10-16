import { Request, Response, NextFunction } from 'express';
import { Analysis } from '../models/Analysis';
import { Resume } from '../models/Resume';
import { Job } from '../models/Job';
import { calculateMatchScore } from '../services/matchingEngine';
import { generateResumeRecommendations } from '../services/geminiService';
import { AppError } from '../middleware/errorHandler';

export const createAnalysis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const { resumeId, jobId, targetRoleTitle, targetJobDescription, inputType } = req.body;

    // Verify resume belongs to authenticated user
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user.id });
    if (!resume) {
      throw new AppError('Resume not found or access denied.', 404);
    }

    let roleTitle = targetRoleTitle || 'Target Role';
    let jobDescriptionText = targetJobDescription || '';
    let requiredSkills: string[] = [];
    let preferredSkills: string[] = [];

    // If matching against a saved or curated job
    if (jobId) {
      const job = await Job.findById(jobId);
      if (!job) {
        throw new AppError('Job listing not found.', 404);
      }
      roleTitle = job.title;
      jobDescriptionText = job.description;
      requiredSkills = job.requiredSkills || [];
      preferredSkills = job.preferredSkills || [];
    }

    if (!jobDescriptionText || jobDescriptionText.trim().length < 10) {
      throw new AppError('A valid job description or role requirement is required for analysis.', 400);
    }

    // 1. Calculate transparent deterministic matching score
    const matchResult = calculateMatchScore({
      resumeText: resume.extractedText,
      resumeSkills: resume.extractedSkills,
      resumeSections: resume.extractedSections,
      jobTitle: roleTitle,
      jobDescription: jobDescriptionText,
      requiredSkills,
      preferredSkills,
    });

    // 2. Generate AI / Fallback recommendations
    const recommendations = await generateResumeRecommendations(
      resume.extractedText,
      roleTitle,
      jobDescriptionText,
      matchResult.matchedSkills,
      matchResult.missingSkills
    );

    // 3. Save to database
    const analysis = await Analysis.create({
      userId: req.user.id,
      resumeId: resume._id,
      jobId: jobId || null,
      targetRoleTitle: roleTitle,
      targetJobDescription: jobDescriptionText,
      inputType: jobId ? 'SAVED_JOB' : 'CUSTOM_TEXT',
      componentScores: matchResult.componentScores,
      overallScore: matchResult.overallScore,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      partiallyMatchedSkills: matchResult.partiallyMatchedSkills,
      recommendations,
      algorithmVersion: '1.0.0-tfidf-hybrid',
    });

    res.status(201).json({
      success: true,
      message: 'Resume analyzed successfully.',
      analysis,
      scoreExplanation: matchResult.scoreExplanation,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserAnalyses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await Analysis.countDocuments({ userId: req.user.id });
    const analyses = await Analysis.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('resumeId', 'originalFilename processingStatus')
      .populate('jobId', 'title company location');

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      analyses,
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalysisById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user.id,
    })
      .populate('resumeId', 'originalFilename extractedSections extractedSkills')
      .populate('jobId', 'title company location salaryRange');

    if (!analysis) {
      throw new AppError('Analysis record not found.', 404);
    }

    res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAnalysis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!analysis) {
      throw new AppError('Analysis not found.', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Analysis record deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getUserStatsSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const totalAnalyses = await Analysis.countDocuments({ userId: req.user.id });
    const recentAnalyses = await Analysis.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('targetRoleTitle overallScore createdAt componentScores');

    const latestAnalysis = recentAnalyses[0] || null;

    // Average score
    const avgResult = await Analysis.aggregate([
      { $match: { userId: new (require('mongoose').Types.ObjectId)(req.user.id) } },
      { $group: { _id: null, avgScore: { $avg: '$overallScore' } } },
    ]);
    const averageScore = avgResult.length > 0 ? Math.round(avgResult[0].avgScore) : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalAnalyses,
        averageScore,
        latestAnalysis,
        recentAnalyses,
      },
    });
  } catch (error) {
    next(error);
  }
};

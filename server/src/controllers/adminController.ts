import { Request, Response, NextFunction } from 'express';
import os from 'os';
import { User } from '../models/User';
import { Resume } from '../models/Resume';
import { Analysis } from '../models/Analysis';
import { Job } from '../models/Job';
import { SavedJob } from '../models/SavedJob';
import { SkillTaxonomy } from '../models/SkillTaxonomy';
import { AppError } from '../middleware/errorHandler';

export const getAdminAnalytics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [totalUsers, totalResumes, totalAnalyses, totalJobs, totalSavedJobs] = await Promise.all([
      User.countDocuments(),
      Resume.countDocuments(),
      Analysis.countDocuments(),
      Job.countDocuments(),
      SavedJob.countDocuments(),
    ]);

    // Average system match score
    const avgResult = await Analysis.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$overallScore' } } },
    ]);
    const systemAverageScore = avgResult.length > 0 ? Math.round(avgResult[0].avgScore) : 0;

    // Top requested skills across job listings
    const skillsAggregation = await Job.aggregate([
      { $unwind: '$requiredSkills' },
      { $group: { _id: '$requiredSkills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    // System resource metrics
    const systemHealth = {
      platform: os.platform(),
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      totalMemoryMb: Math.round(os.totalmem() / 1024 / 1024),
      freeMemoryMb: Math.round(os.freemem() / 1024 / 1024),
      cpuCores: os.cpus().length,
    };

    res.status(200).json({
      success: true,
      metrics: {
        totalUsers,
        totalResumes,
        totalAnalyses,
        totalJobs,
        totalSavedJobs,
        systemAverageScore,
        topJobSkills: skillsAggregation.map(s => ({ skill: s._id, count: s.count })),
      },
      systemHealth,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 15;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();
    const users = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const createAdminJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const job = await Job.create({
      ...req.body,
      isSampleData: false, // created by admin
    });

    res.status(201).json({
      success: true,
      message: 'Job listing published successfully.',
      job,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) {
      throw new AppError('Job listing not found.', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Job listing updated successfully.',
      job,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdminJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      throw new AppError('Job not found.', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Job listing deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const addSkillTaxonomy = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, category, synonyms } = req.body;
    const skill = await SkillTaxonomy.create({
      name,
      category,
      synonyms: synonyms || [],
    });

    res.status(201).json({
      success: true,
      message: 'Skill added to taxonomy.',
      skill,
    });
  } catch (error) {
    next(error);
  }
};

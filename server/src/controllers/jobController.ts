import { Request, Response, NextFunction } from 'express';
import { Job } from '../models/Job';
import { SavedJob } from '../models/SavedJob';
import { AppError } from '../middleware/errorHandler';

export const getJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      search,
      location,
      employmentType,
      experienceLevel,
      page = 1,
      limit = 12,
    } = req.query;

    const filter: any = { status: 'ACTIVE' };

    if (search) {
      filter.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { company: { $regex: search as string, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(search as string, 'i')] } },
      ];
    }

    if (location) {
      filter.location = { $regex: location as string, $options: 'i' };
    }

    if (employmentType && employmentType !== 'ALL') {
      filter.employmentType = employmentType;
    }

    if (experienceLevel && experienceLevel !== 'ALL') {
      filter.experienceLevel = experienceLevel;
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // If user is authenticated, check which jobs they have saved
    let savedJobIds: string[] = [];
    if (req.user) {
      const userSaved = await SavedJob.find({ userId: req.user.id }).select('jobId applicationStatus');
      savedJobIds = userSaved.map(s => s.jobId.toString());
    }

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      jobs,
      savedJobIds,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      throw new AppError('Job listing not found.', 404);
    }

    let savedInfo: any = null;
    if (req.user) {
      savedInfo = await SavedJob.findOne({ userId: req.user.id, jobId: job._id });
    }

    res.status(200).json({
      success: true,
      job,
      isSaved: !!savedInfo,
      savedStatus: savedInfo ? savedInfo.applicationStatus : null,
      savedNotes: savedInfo ? savedInfo.notes : '',
    });
  } catch (error) {
    next(error);
  }
};

export const saveJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      throw new AppError('Job listing not found.', 404);
    }

    const existing = await SavedJob.findOne({ userId: req.user.id, jobId });
    if (existing) {
      res.status(200).json({
        success: true,
        message: 'Job is already saved in your dashboard.',
        savedJob: existing,
      });
      return;
    }

    const savedJob = await SavedJob.create({
      userId: req.user.id,
      jobId,
      applicationStatus: 'SAVED',
    });

    res.status(201).json({
      success: true,
      message: 'Job saved to your career dashboard.',
      savedJob,
    });
  } catch (error) {
    next(error);
  }
};

export const removeSavedJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const jobId = req.params.id;
    await SavedJob.findOneAndDelete({ userId: req.user.id, jobId });

    res.status(200).json({
      success: true,
      message: 'Job removed from saved list.',
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const jobId = req.params.id;
    const { applicationStatus, notes } = req.body;

    let savedJob = await SavedJob.findOne({ userId: req.user.id, jobId });

    if (!savedJob) {
      savedJob = await SavedJob.create({
        userId: req.user.id,
        jobId,
        applicationStatus,
        notes: notes || '',
        appliedDate: applicationStatus === 'APPLIED' ? new Date() : undefined,
      });
    } else {
      savedJob.applicationStatus = applicationStatus;
      if (notes !== undefined) savedJob.notes = notes;
      if (applicationStatus === 'APPLIED' && !savedJob.appliedDate) {
        savedJob.appliedDate = new Date();
      }
      await savedJob.save();
    }

    res.status(200).json({
      success: true,
      message: `Job status updated to ${applicationStatus}.`,
      savedJob,
    });
  } catch (error) {
    next(error);
  }
};

export const getSavedJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const savedJobs = await SavedJob.find({ userId: req.user.id })
      .populate('jobId')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: savedJobs.length,
      savedJobs,
    });
  } catch (error) {
    next(error);
  }
};

import { Request, Response, NextFunction } from 'express';
import { InterviewSession } from '../models/InterviewSession';
import { Resume } from '../models/Resume';
import { Job } from '../models/Job';
import { generateInterviewQuestions } from '../services/geminiService';
import { AppError } from '../middleware/errorHandler';

export const createInterviewSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const { resumeId, jobId, roleTitle } = req.body;

    const resume = await Resume.findOne({ _id: resumeId, userId: req.user.id });
    if (!resume) {
      throw new AppError('Resume not found.', 404);
    }

    let jobRole = roleTitle || 'Software Engineer';
    if (jobId) {
      const job = await Job.findById(jobId);
      if (job) jobRole = job.title;
    }

    const questions = await generateInterviewQuestions(
      resume.extractedText,
      jobRole,
      resume.extractedSkills || []
    );

    const session = await InterviewSession.create({
      userId: req.user.id,
      resumeId: resume._id,
      jobId: jobId || null,
      roleTitle: jobRole,
      questions,
    });

    res.status(201).json({
      success: true,
      message: 'Interview preparation session created.',
      session,
    });
  } catch (error) {
    next(error);
  }
};

export const getInterviewSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const sessions = await InterviewSession.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('resumeId', 'originalFilename')
      .populate('jobId', 'title company');

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    next(error);
  }
};

export const getInterviewSessionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const session = await InterviewSession.findOne({
      _id: req.params.id,
      userId: req.user.id,
    })
      .populate('resumeId', 'originalFilename extractedSkills')
      .populate('jobId', 'title company');

    if (!session) {
      throw new AppError('Interview session not found.', 404);
    }

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};

export const submitInterviewAnswer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const { questionId, userResponse } = req.body;
    const session = await InterviewSession.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!session) {
      throw new AppError('Interview session not found.', 404);
    }

    const questionIndex = session.questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) {
      throw new AppError('Question not found in this session.', 404);
    }

    session.questions[questionIndex].userResponse = userResponse;
    // Provide instant automated feedback guidance
    const wordCount = (userResponse || '').trim().split(/\s+/).length;
    session.questions[questionIndex].feedback = wordCount >= 50
      ? 'Good depth. Ensure you clearly state the metric of impact (e.g., latency, users, code quality) and what tools you personally used.'
      : 'Response is slightly brief. Expand on the "Action" and "Result" stages using the STAR format.';

    await session.save();

    res.status(200).json({
      success: true,
      message: 'Answer saved.',
      session,
    });
  } catch (error) {
    next(error);
  }
};

import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { Resume } from '../models/Resume';
import { parseResumeFile } from '../services/resumeParser';
import { AppError } from '../middleware/errorHandler';
import {
  isCloudinaryConfigured,
  uploadToCloudinary,
  deleteFromCloudinary,
} from '../config/cloudinary';

export const uploadResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!req.file) {
      throw new AppError('Please upload a PDF or DOCX resume file.', 400);
    }

    const { originalname, filename, path: filePath, size, mimetype } = req.file;

    // Parse the file
    let parsedData;
    let processingStatus: 'PARSED' | 'FAILED' = 'PARSED';
    let errorMessage: string | undefined;

    try {
      parsedData = await parseResumeFile(filePath);
    } catch (parseErr: any) {
      processingStatus = 'FAILED';
      errorMessage = parseErr.message;
      parsedData = {
        extractedText: '',
        extractedSections: {},
        extractedSkills: [],
        isScannedOrEmpty: true,
      };
    }

    // Optional cloud backup to Cloudinary
    let cloudinaryUrl = '';
    let cloudinaryPublicId = '';

    if (isCloudinaryConfigured()) {
      try {
        const cloudUpload = await uploadToCloudinary(filePath, 'careerlens/resumes');
        cloudinaryUrl = cloudUpload.secureUrl;
        cloudinaryPublicId = cloudUpload.publicId;
      } catch (cloudErr: any) {
        console.warn('[Cloudinary Warning] Cloud upload failed, continuing with local storage:', cloudErr.message);
      }
    }

    const resume = await Resume.create({
      userId: req.user.id,
      originalFilename: originalname,
      storageFilename: filename,
      filePath,
      fileSizeBytes: size,
      mimeType: mimetype,
      extractedText: parsedData.extractedText,
      extractedSections: parsedData.extractedSections,
      extractedSkills: parsedData.extractedSkills,
      processingStatus,
      errorMessage,
      cloudinaryUrl,
      cloudinaryPublicId,
    });

    res.status(201).json({
      success: true,
      message: parsedData.isScannedOrEmpty
        ? 'Resume uploaded, but minimal text was extracted. If this is a scanned document, please consider uploading a text-searchable PDF.'
        : 'Resume uploaded and parsed successfully.',
      resume,
      isScannedOrEmpty: parsedData.isScannedOrEmpty,
    });
  } catch (error) {
    // If multer saved the file but DB save failed, clean up file
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (_) {}
    }
    next(error);
  }
};

export const getUserResumes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const resumes = await Resume.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('-extractedText'); // omit large raw text from list view for fast payload

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    next(error);
  }
};

export const getResumeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) {
      throw new AppError('Resume not found or access denied.', 404);
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    next(error);
  }
};

export const updateResumeExtractedInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const { extractedSections, extractedSkills } = req.body;

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) {
      throw new AppError('Resume not found or access denied.', 404);
    }

    if (extractedSections) {
      resume.extractedSections = { ...resume.extractedSections, ...extractedSections };
    }

    if (Array.isArray(extractedSkills)) {
      resume.extractedSkills = extractedSkills;
    }

    await resume.save();

    res.status(200).json({
      success: true,
      message: 'Resume profile updated successfully.',
      resume,
    });
  } catch (error) {
    next(error);
  }
};

export const downloadResumeFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) {
      throw new AppError('Resume file not found.', 404);
    }

    if (!fs.existsSync(resume.filePath)) {
      if (resume.cloudinaryUrl) {
        return res.redirect(resume.cloudinaryUrl);
      }
      throw new AppError('The requested file is no longer present on the server storage.', 404);
    }

    // Set secure download headers
    res.setHeader('Content-Type', resume.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(resume.originalFilename)}"`);

    const fileStream = fs.createReadStream(resume.filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) {
      throw new AppError('Resume not found.', 404);
    }

    // Delete file from Cloudinary if present
    if (resume.cloudinaryPublicId) {
      await deleteFromCloudinary(resume.cloudinaryPublicId);
    }

    // Delete file from disk safely
    if (fs.existsSync(resume.filePath)) {
      try {
        fs.unlinkSync(resume.filePath);
      } catch (err: any) {
        console.warn('Could not delete physical resume file:', err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

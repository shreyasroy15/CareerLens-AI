import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { AppError } from './errorHandler';

// Ensure private upload directory exists
const uploadDir = path.resolve(env.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed MIME types and extensions
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc'];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // Generate secure random filename to prevent collisions and path traversal
    const ext = path.extname(file.originalname).toLowerCase();
    const randomName = `${Date.now()}-${crypto.randomBytes(16).toString('hex')}${ext}`;
    cb(null, randomName);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: env.UPLOAD_MAX_SIZE_MB * 1024 * 1024, // 5MB
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext) || !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new AppError(
          'Invalid file type. Only PDF and DOCX files are supported (max 5MB).',
          400
        )
      );
    }
    cb(null, true);
  },
});

// Middleware to verify file signature (Magic Bytes) after disk storage
export const verifyMagicBytes = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.file) {
    return next(new AppError('No file uploaded. Please provide a resume file.', 400));
  }

  const filePath = req.file.path;

  try {
    const buffer = Buffer.alloc(8);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 8, 0);
    fs.closeSync(fd);

    const isPdf = buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46; // %PDF
    const isDocx = buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04; // PK.. (Zip header for docx)

    const ext = path.extname(req.file.originalname).toLowerCase();

    if (ext === '.pdf' && !isPdf) {
      fs.unlinkSync(filePath); // delete unsafe file
      return next(new AppError('Uploaded file appears corrupted or is not a valid PDF.', 400));
    }

    if (ext === '.docx' && !isDocx) {
      fs.unlinkSync(filePath); // delete unsafe file
      return next(new AppError('Uploaded file appears corrupted or is not a valid DOCX.', 400));
    }

    next();
  } catch (error: any) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    next(new AppError('Failed to inspect uploaded file integrity: ' + error.message, 400));
  }
};

import { Router } from 'express';
import {
  uploadResume,
  getUserResumes,
  getResumeById,
  updateResumeExtractedInfo,
  downloadResumeFile,
  deleteResume,
} from '../controllers/resumeController';
import { requireAuth } from '../middleware/auth';
import { upload, verifyMagicBytes } from '../middleware/upload';

const router = Router();

// All resume routes require authentication
router.use(requireAuth);

router.post('/', upload.single('resume'), verifyMagicBytes, uploadResume);
router.get('/', getUserResumes);
router.get('/:id', getResumeById);
router.put('/:id', updateResumeExtractedInfo);
router.get('/:id/file', downloadResumeFile);
router.delete('/:id', deleteResume);

export default router;

import { Router } from 'express';
import authRoutes from './authRoutes';
import resumeRoutes from './resumeRoutes';
import analysisRoutes from './analysisRoutes';
import jobRoutes from './jobRoutes';
import skillRoutes from './skillRoutes';
import interviewRoutes from './interviewRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/resumes', resumeRoutes);
router.use('/analyses', analysisRoutes);
router.use('/jobs', jobRoutes);
router.use('/skills', skillRoutes);
router.use('/interviews', interviewRoutes);
router.use('/admin', adminRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CareerLens AI Backend API',
    version: '1.0.0',
  });
});

export default router;

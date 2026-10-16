import { Router } from 'express';
import {
  getJobs,
  getJobById,
  saveJob,
  removeSavedJob,
  updateApplicationStatus,
  getSavedJobs,
} from '../controllers/jobController';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { updateApplicationStatusSchema } from '../validators/jobValidators';

const router = Router();

// Middleware to optionally populate req.user if a token is present, without throwing 401
const optionalAuth = (req: any, _res: any, next: any) => {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const jwt = require('jsonwebtoken');
      const { env } = require('../config/env');
      req.user = jwt.verify(token, env.JWT_SECRET);
    }
  } catch (_) {}
  next();
};

router.get('/', optionalAuth, getJobs);
router.get('/saved/all', requireAuth, getSavedJobs);
router.get('/:id', optionalAuth, getJobById);

router.post('/:id/save', requireAuth, saveJob);
router.delete('/:id/save', requireAuth, removeSavedJob);
router.patch('/:id/status', requireAuth, validateBody(updateApplicationStatusSchema), updateApplicationStatus);

export default router;

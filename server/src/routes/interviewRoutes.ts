import { Router } from 'express';
import {
  createInterviewSession,
  getInterviewSessions,
  getInterviewSessionById,
  submitInterviewAnswer,
} from '../controllers/interviewController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.post('/', createInterviewSession);
router.get('/', getInterviewSessions);
router.get('/:id', getInterviewSessionById);
router.put('/:id/answer', submitInterviewAnswer);

export default router;

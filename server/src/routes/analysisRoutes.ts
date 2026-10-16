import { Router } from 'express';
import {
  createAnalysis,
  getUserAnalyses,
  getAnalysisById,
  deleteAnalysis,
  getUserStatsSummary,
} from '../controllers/analysisController';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createAnalysisSchema } from '../validators/analysisValidators';

const router = Router();

router.use(requireAuth);

router.post('/', validateBody(createAnalysisSchema), createAnalysis);
router.get('/', getUserAnalyses);
router.get('/stats/summary', getUserStatsSummary);
router.get('/:id', getAnalysisById);
router.delete('/:id', deleteAnalysis);

export default router;

import { Router } from 'express';
import { getSkillTaxonomy, getSkillGapAnalysis } from '../controllers/skillController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', getSkillTaxonomy);
router.get('/gap-analysis/:analysisId', requireAuth, getSkillGapAnalysis);

export default router;

import { Router } from 'express';
import {
  getAdminAnalytics,
  getAdminUsers,
  createAdminJob,
  updateAdminJob,
  deleteAdminJob,
  addSkillTaxonomy,
} from '../controllers/adminController';
import { requireAuth, requireRole } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createJobSchema, updateJobSchema } from '../validators/jobValidators';

const router = Router();

// Strict RBAC: All admin endpoints require ADMIN role
router.use(requireAuth);
router.use(requireRole('ADMIN'));

router.get('/analytics', getAdminAnalytics);
router.get('/users', getAdminUsers);
router.post('/jobs', validateBody(createJobSchema), createAdminJob);
router.patch('/jobs/:id', validateBody(updateJobSchema), updateAdminJob);
router.delete('/jobs/:id', deleteAdminJob);
router.post('/skills', addSkillTaxonomy);

export default router;

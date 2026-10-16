import { z } from 'zod';

export const createAnalysisSchema = z.object({
  resumeId: z.string().min(1, 'Resume ID is required'),
  jobId: z.string().optional(),
  targetRoleTitle: z.string().min(2, 'Role title is required').max(150).optional(),
  targetJobDescription: z.string().min(10, 'Job description must have content').optional(),
  inputType: z.enum(['SAVED_JOB', 'CUSTOM_TEXT']).default('CUSTOM_TEXT'),
});

import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(2, 'Job title is required').max(150),
  company: z.string().min(2, 'Company name is required').max(150),
  description: z.string().min(20, 'Job description must be at least 20 characters'),
  requiredSkills: z.array(z.string()).min(1, 'At least one required skill is recommended'),
  preferredSkills: z.array(z.string()).optional().default([]),
  location: z.string().min(2, 'Location is required').max(100),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']).default('FULL_TIME'),
  experienceLevel: z.enum(['ENTRY', 'MID', 'SENIOR', 'LEAD']).default('ENTRY'),
  salaryRange: z.string().optional().default('Competitive'),
  applicationUrl: z.string().url().optional().or(z.literal('')),
  isSampleData: z.boolean().optional().default(false),
  status: z.enum(['ACTIVE', 'ARCHIVED']).default('ACTIVE'),
});

export const updateJobSchema = createJobSchema.partial();

export const updateApplicationStatusSchema = z.object({
  applicationStatus: z.enum(['SAVED', 'APPLIED', 'INTERVIEWING', 'OFFERED', 'REJECTED']),
  notes: z.string().max(1000).optional(),
});

export type UserRole = 'USER' | 'ADMIN';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  emailVerified: boolean;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExtractedSections {
  summary?: string;
  education?: string[];
  workExperience?: string[];
  technicalSkills?: string[];
  softSkills?: string[];
  projects?: string[];
  certifications?: string[];
  contactInfo?: {
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

export interface IResume {
  _id: string;
  userId: string;
  originalFilename: string;
  storageFilename: string;
  filePath: string;
  fileSizeBytes: number;
  mimeType: string;
  extractedText: string;
  extractedSections: IExtractedSections;
  extractedSkills: string[];
  processingStatus: 'PENDING' | 'PARSED' | 'FAILED';
  errorMessage?: string;
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';
export type ExperienceLevel = 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';

export interface IJob {
  _id: string;
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  location: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  salaryRange?: string;
  applicationUrl?: string;
  source: string;
  isSampleData: boolean;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

export interface IScoreBreakdown {
  skillMatch: number;          // 40%
  textSimilarity: number;      // 25%
  keywordCoverage: number;     // 15%
  relevanceScore: number;      // 10%
  completenessScore: number;   // 10%
}

export interface IAIRecommendations {
  summaryFeedback?: string;
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  projectRecommendations: string[];
  interviewTips: string[];
  isFallback: boolean;
}

export interface IAnalysis {
  _id: string;
  userId: string;
  resumeId: string;
  jobId?: string;
  targetRoleTitle: string;
  targetJobDescription: string;
  inputType: 'SAVED_JOB' | 'CUSTOM_TEXT';
  componentScores: IScoreBreakdown;
  overallScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  partiallyMatchedSkills?: string[];
  recommendations: IAIRecommendations;
  algorithmVersion: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ApplicationStatus = 'SAVED' | 'APPLIED' | 'INTERVIEWING' | 'OFFERED' | 'REJECTED';

export interface ISavedJob {
  _id: string;
  userId: string;
  jobId: string;
  applicationStatus: ApplicationStatus;
  notes?: string;
  appliedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInterviewQA {
  id: string;
  category: 'TECHNICAL' | 'BEHAVIORAL' | 'PROJECT_BASED';
  question: string;
  contextOrRationale: string;
  suggestedAnswerStructure: string;
  userResponse?: string;
  feedback?: string;
}

export interface IInterviewSession {
  _id: string;
  userId: string;
  resumeId: string;
  jobId?: string;
  roleTitle: string;
  questions: IInterviewQA[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISkillTaxonomy {
  _id: string;
  name: string;
  category: 'PROGRAMMING_LANGUAGE' | 'FRAMEWORK_LIBRARY' | 'DATABASE' | 'CLOUD_DEVOPS' | 'TESTING' | 'SOFT_SKILL' | 'TOOLS';
  synonyms: string[];
  popularityScore?: number;
}

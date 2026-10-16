export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  avatarUrl?: string;
  createdAt?: string;
}

export interface ExtractedSections {
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

export interface Resume {
  id: string;
  userId: string;
  originalFilename: string;
  storageFilename: string;
  fileSizeBytes: number;
  mimeType: string;
  extractedText?: string;
  extractedSections: ExtractedSections;
  extractedSkills: string[];
  processingStatus: 'PENDING' | 'PARSED' | 'FAILED';
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';
export type ExperienceLevel = 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';

export interface Job {
  _id: string;
  id?: string;
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
  createdAt: string;
}

export interface ScoreBreakdown {
  skillMatch: number;
  textSimilarity: number;
  keywordCoverage: number;
  relevanceScore: number;
  completenessScore: number;
}

export interface AIRecommendations {
  summaryFeedback?: string;
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  projectRecommendations: string[];
  interviewTips: string[];
  isFallback: boolean;
}

export interface Analysis {
  id: string;
  userId: string;
  resumeId: string | { _id: string; originalFilename: string };
  jobId?: string | { _id: string; title: string; company: string; location: string };
  targetRoleTitle: string;
  targetJobDescription: string;
  inputType: 'SAVED_JOB' | 'CUSTOM_TEXT';
  componentScores: ScoreBreakdown;
  overallScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  partiallyMatchedSkills?: string[];
  recommendations: AIRecommendations;
  algorithmVersion: string;
  createdAt: string;
}

export type ApplicationStatus = 'SAVED' | 'APPLIED' | 'INTERVIEWING' | 'OFFERED' | 'REJECTED';

export interface SavedJob {
  id: string;
  userId: string;
  jobId: Job;
  applicationStatus: ApplicationStatus;
  notes?: string;
  appliedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewQA {
  id: string;
  category: 'TECHNICAL' | 'BEHAVIORAL' | 'PROJECT_BASED';
  question: string;
  contextOrRationale: string;
  suggestedAnswerStructure: string;
  userResponse?: string;
  feedback?: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  resumeId: { _id: string; originalFilename: string } | string;
  jobId?: { _id: string; title: string; company: string } | string;
  roleTitle: string;
  questions: InterviewQA[];
  createdAt: string;
}

export interface LearningPathway {
  skill: string;
  status: string;
  recommendation: string;
  docsUrl: string;
  courseTitle: string;
  exercise: string;
  projectIdea: string;
}

export interface SkillGapAnalysisResponse {
  success: boolean;
  roleTitle: string;
  overallScore: number;
  demonstratedSkills: string[];
  missingSkills: string[];
  partiallyMatchedSkills: string[];
  learningPathways: LearningPathway[];
  disclaimer: string;
}

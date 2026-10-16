import { IScoreBreakdown, IExtractedSections } from '../types';
import { computeTfidfCosineSimilarity, computeKeywordCoverage } from '../utils/tfidf';
import { extractSkillsFromText, findCanonicalSkill } from '../utils/skillsDictionary';

export interface MatchingResult {
  componentScores: IScoreBreakdown;
  overallScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  partiallyMatchedSkills: string[];
  scoreExplanation: {
    skillMatchExplanation: string;
    textSimilarityExplanation: string;
    keywordCoverageExplanation: string;
    relevanceExplanation: string;
    completenessExplanation: string;
    overallSummary: string;
  };
}

export interface MatchingInput {
  resumeText: string;
  resumeSkills: string[];
  resumeSections: IExtractedSections;
  jobTitle: string;
  jobDescription: string;
  requiredSkills: string[];
  preferredSkills?: string[];
}

/**
 * Calculates resume completeness score (0-100) based on presence of essential professional sections.
 */
export const calculateCompletenessScore = (sections: IExtractedSections, text: string): number => {
  let score = 0;
  if (!sections) return text.length > 200 ? 50 : 20;

  // Contact Info (20 points)
  if (sections.contactInfo?.email) score += 10;
  if (sections.contactInfo?.phone || sections.contactInfo?.linkedin || sections.contactInfo?.github) score += 10;

  // Summary (15 points)
  if (sections.summary && sections.summary.length > 30) score += 15;

  // Technical Skills (25 points)
  if (sections.technicalSkills && sections.technicalSkills.length >= 3) score += 25;
  else if (sections.technicalSkills && sections.technicalSkills.length > 0) score += 15;

  // Work Experience / Internships (20 points)
  if (sections.workExperience && sections.workExperience.length > 0) score += 20;

  // Education (10 points)
  if (sections.education && sections.education.length > 0) score += 10;

  // Projects or Certifications (10 points)
  if ((sections.projects && sections.projects.length > 0) || (sections.certifications && sections.certifications.length > 0)) {
    score += 10;
  }

  return Math.min(100, Math.max(0, score));
};

/**
 * Calculates project & experience relevance (0-100) comparing projects/experience lines against job description keywords.
 */
export const calculateRelevanceScore = (sections: IExtractedSections, jobDescription: string): number => {
  const jobKeywords = extractSkillsFromText(jobDescription);
  const relevantLines = [
    ...(sections.workExperience || []),
    ...(sections.projects || [])
  ].join(' ');

  if (!relevantLines.trim()) {
    // If no explicit projects/experience parsed, estimate from general text
    return 30;
  }

  if (jobKeywords.length === 0) {
    return 70;
  }

  const coverage = computeKeywordCoverage(jobKeywords, relevantLines);
  return coverage;
};

/**
 * Core transparent multi-factor matching engine.
 */
export const calculateMatchScore = (input: MatchingInput): MatchingResult => {
  const {
    resumeText,
    resumeSkills = [],
    resumeSections = {},
    jobTitle,
    jobDescription,
    requiredSkills = [],
    preferredSkills = [],
  } = input;

  // 1. SKILL MATCHING (40% Weight)
  // Canonicalize required skills
  const normalizedRequired = Array.from(new Set(
    (requiredSkills.length > 0 ? requiredSkills : extractSkillsFromText(jobDescription))
      .map(s => findCanonicalSkill(s))
  ));

  // Canonicalize candidate's skills (both explicit list + extracted from text)
  const candidateSkillsSet = new Set<string>([
    ...resumeSkills.map(s => findCanonicalSkill(s).toLowerCase()),
    ...extractSkillsFromText(resumeText).map(s => s.toLowerCase()),
  ]);

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  const partiallyMatchedSkills: string[] = [];

  for (const skill of normalizedRequired) {
    const sLower = skill.toLowerCase();
    if (candidateSkillsSet.has(sLower)) {
      matchedSkills.push(skill);
    } else if (resumeText.toLowerCase().includes(sLower)) {
      // Mentioned in text but not categorized
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  // Handle zero required skills safely to avoid division by zero
  let skillMatch = 100;
  if (normalizedRequired.length > 0) {
    skillMatch = Math.round((matchedSkills.length / normalizedRequired.length) * 1000) / 10;
  }

  // Check preferred skills for partial credit
  for (const pref of preferredSkills) {
    const pLower = pref.toLowerCase();
    if (candidateSkillsSet.has(pLower) || resumeText.toLowerCase().includes(pLower)) {
      partiallyMatchedSkills.push(pref);
    }
  }

  // 2. TEXT SIMILARITY (25% Weight) - TF-IDF & Cosine Similarity
  const fullJobText = `${jobTitle} ${jobDescription}`;
  const textSimilarity = computeTfidfCosineSimilarity(resumeText, fullJobText);

  // 3. KEYWORD COVERAGE (15% Weight)
  const allJobKeywords = Array.from(new Set([
    ...normalizedRequired,
    ...preferredSkills.map(s => findCanonicalSkill(s)),
    ...extractSkillsFromText(fullJobText)
  ]));
  const keywordCoverage = computeKeywordCoverage(allJobKeywords, resumeText);

  // 4. PROJECT & EXPERIENCE RELEVANCE (10% Weight)
  const relevanceScore = calculateRelevanceScore(resumeSections, jobDescription);

  // 5. RESUME COMPLETENESS (10% Weight)
  const completenessScore = calculateCompletenessScore(resumeSections, resumeText);

  // WEIGHTED FORMULA
  // 0.40 * skillMatch + 0.25 * textSimilarity + 0.15 * keywordCoverage + 0.10 * relevanceScore + 0.10 * completenessScore
  const rawOverall = (
    skillMatch * 0.40 +
    textSimilarity * 0.25 +
    keywordCoverage * 0.15 +
    relevanceScore * 0.10 +
    completenessScore * 0.10
  );

  const overallScore = Math.min(100, Math.max(0, Math.round(rawOverall * 10) / 10));

  const componentScores: IScoreBreakdown = {
    skillMatch,
    textSimilarity,
    keywordCoverage,
    relevanceScore,
    completenessScore,
  };

  const scoreExplanation = {
    skillMatchExplanation: normalizedRequired.length > 0
      ? `Candidate demonstrates ${matchedSkills.length} of ${normalizedRequired.length} essential requirements (${skillMatch}%).`
      : 'No mandatory requirements specified in job posting; general profile alignment assumed.',
    textSimilarityExplanation: `TF-IDF & Cosine Vector alignment scored at ${textSimilarity}%, reflecting terminology and domain vocabulary overlap.`,
    keywordCoverageExplanation: `Resume covers ${keywordCoverage}% of key technical terms, competencies, and tool references present in the job description.`,
    relevanceExplanation: `Project portfolio and work history relevance scored at ${relevanceScore}% based on hands-on project descriptions.`,
    completenessExplanation: `Resume structural integrity is evaluated at ${completenessScore}% across standard industry sections.`,
    overallSummary: `Estimated profile match compatibility is ${overallScore}%. This metric reflects alignment with documented job requirements and should be evaluated alongside interviews and code demonstrations.`,
  };

  return {
    componentScores,
    overallScore,
    matchedSkills,
    missingSkills,
    partiallyMatchedSkills,
    scoreExplanation,
  };
};

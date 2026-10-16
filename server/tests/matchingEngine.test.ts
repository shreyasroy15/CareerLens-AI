import { describe, it, expect } from 'vitest';
import { calculateMatchScore, calculateCompletenessScore } from '../src/services/matchingEngine';
import { computeTfidfCosineSimilarity, computeKeywordCoverage, tokenize, computeTF } from '../src/utils/tfidf';
import { extractSkillsFromText, findCanonicalSkill } from '../src/utils/skillsDictionary';

describe('Matching Engine & NLP Similarity Tests', () => {
  it('should verify that all scoring component weights sum exactly to 1.00', () => {
    const weights = {
      skillMatch: 0.40,
      textSimilarity: 0.25,
      keywordCoverage: 0.15,
      relevanceScore: 0.10,
      completenessScore: 0.10,
    };
    const sum = Object.values(weights).reduce((acc, curr) => acc + curr, 0);
    expect(sum).toBeCloseTo(1.0, 5);
  });

  it('should handle zero required skills safely without division by zero', () => {
    const result = calculateMatchScore({
      resumeText: 'Frontend engineer with React and JavaScript experience.',
      resumeSkills: ['React', 'JavaScript'],
      resumeSections: {
        summary: 'Experienced React developer with web expertise.',
        technicalSkills: ['React', 'JavaScript'],
      },
      jobTitle: 'Frontend Engineer',
      jobDescription: 'Looking for a general developer to collaborate on web products.',
      requiredSkills: [], // 0 required skills
    });

    expect(result.componentScores.skillMatch).toBe(100);
    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.missingSkills).toEqual([]);
  });

  it('should calculate accurate skill matches and missing skills', () => {
    const result = calculateMatchScore({
      resumeText: 'Full stack developer proficient in React, Node.js, and MongoDB.',
      resumeSkills: ['React', 'Node.js', 'MongoDB'],
      resumeSections: {
        summary: 'Full stack engineer with 2 years of Node and React projects.',
        technicalSkills: ['React', 'Node.js', 'MongoDB'],
      },
      jobTitle: 'Full Stack Engineer',
      jobDescription: 'Requirements: React, Node.js, MongoDB, Docker, Kubernetes.',
      requiredSkills: ['React', 'Node.js', 'MongoDB', 'Docker', 'Kubernetes'],
    });

    // 3 matched out of 5 required -> 60%
    expect(result.matchedSkills).toContain('React');
    expect(result.matchedSkills).toContain('Node.js');
    expect(result.matchedSkills).toContain('MongoDB');
    expect(result.missingSkills).toContain('Docker');
    expect(result.missingSkills).toContain('Kubernetes');
    expect(result.componentScores.skillMatch).toBe(60);
  });

  it('should compute TF-IDF cosine similarity between 0 and 100', () => {
    const docA = 'React TypeScript frontend engineer building scalable web user interfaces.';
    const docB = 'Looking for a React TypeScript developer to engineer web user interfaces.';
    const score = computeTfidfCosineSimilarity(docA, docB);

    expect(score).toBeGreaterThan(50);
    expect(score).toBeLessThanOrEqual(100);

    // Completely unrelated text
    const docC = 'Astronomy telescope observational astrophysics galaxy cluster redshift.';
    const lowScore = computeTfidfCosineSimilarity(docA, docC);
    expect(lowScore).toBeLessThan(10);
  });

  it('should calculate keyword coverage accurately', () => {
    const keywords = ['React', 'TypeScript', 'Docker', 'AWS'];
    const text = 'Expert in React and TypeScript with cloud experience.';
    const coverage = computeKeywordCoverage(keywords, text);
    // 2 out of 4 = 50%
    expect(coverage).toBe(50);
  });

  it('should extract canonical skills and handle aliases correctly', () => {
    const raw = 'I build apps using nodejs, react.js, k8s, and postgresql.';
    const extracted = extractSkillsFromText(raw);

    expect(extracted).toContain('Node.js');
    expect(extracted).toContain('React');
    expect(extracted).toContain('Kubernetes');
    expect(extracted).toContain('PostgreSQL');
  });

  it('should evaluate resume completeness score based on sections', () => {
    const fullSections = {
      contactInfo: { email: 'student@example.com', phone: '9876543210' },
      summary: 'Passionate computer application graduate with full-stack skills.',
      technicalSkills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
      workExperience: ['Software Engineer Intern at Tech Corp'],
      education: ['Bachelor of Computer Applications (BCA)'],
      projects: ['CareerLens AI - Automated Resume Analyzer'],
    };

    const score = calculateCompletenessScore(fullSections, 'Comprehensive resume text');
    expect(score).toBe(100);

    const emptyScore = calculateCompletenessScore({}, '');
    expect(emptyScore).toBeLessThan(30);
  });
});

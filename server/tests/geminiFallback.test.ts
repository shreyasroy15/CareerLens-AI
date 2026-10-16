import { describe, it, expect } from 'vitest';
import { getFallbackRecommendations, generateInterviewQuestions } from '../src/services/geminiService';

describe('AI Graceful Fallback System', () => {
  it('should generate structured recommendations deterministically without crashing when offline', () => {
    const feedback = getFallbackRecommendations(
      'Full Stack Developer',
      ['React', 'Node.js'],
      ['Docker', 'AWS']
    );

    expect(feedback).toBeDefined();
    expect(feedback.isFallback).toBe(true);
    expect(feedback.strengths.length).toBeGreaterThan(0);
    expect(feedback.weaknesses.length).toBeGreaterThan(0);
    expect(feedback.improvementSuggestions.length).toBeGreaterThan(0);
    expect(feedback.projectRecommendations.length).toBeGreaterThan(0);
    expect(feedback.interviewTips.length).toBeGreaterThan(0);

    // Should mention the missing skills in improvement suggestions
    const mentionsMissing = feedback.improvementSuggestions.some(s => s.includes('Docker'));
    expect(mentionsMissing).toBe(true);
  });

  it('should generate categorized interview questions with STAR answer structures', async () => {
    const questions = await generateInterviewQuestions(
      'Experience in React, Express, MongoDB.',
      'Full Stack Developer',
      ['React', 'MongoDB']
    );

    expect(Array.isArray(questions)).toBe(true);
    expect(questions.length).toBeGreaterThanOrEqual(3);

    const categories = questions.map(q => q.category);
    expect(categories).toContain('TECHNICAL');
    expect(categories).toContain('BEHAVIORAL');

    for (const q of questions) {
      expect(q.question).toBeTruthy();
      expect(q.contextOrRationale).toBeTruthy();
      expect(q.suggestedAnswerStructure).toBeTruthy();
    }
  });
});

import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';
import { IAIRecommendations, IInterviewQA } from '../types';

let genAI: GoogleGenerativeAI | null = null;
if (env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim() !== '') {
  try {
    genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  } catch (err: any) {
    console.warn('[Gemini AI Warning] Failed to initialize GoogleGenerativeAI client:', err.message);
  }
}

/**
 * Deterministic fallback recommendations when Gemini AI is not configured or fails.
 */
export const getFallbackRecommendations = (
  jobTitle: string,
  matchedSkills: string[],
  missingSkills: string[]
): IAIRecommendations => {
  const strengths = matchedSkills.length > 0
    ? [
        `Strong demonstrated alignment with core technologies: ${matchedSkills.slice(0, 4).join(', ')}.`,
        'Solid foundational structure and identifiable technical skill groupings.',
        'Relevant qualifications that provide a good starting baseline for the target position.',
      ]
    : [
        'Resume has a clear layout that allows quick scanning by recruiters.',
        'Core education and baseline project foundations are noted.',
      ];

  const weaknesses = missingSkills.length > 0
    ? [
        `Target role emphasizes: ${missingSkills.slice(0, 3).join(', ')}, which were not detected in the resume.`,
        'Quantifiable impact metrics (e.g. % performance increase, latency reduction, user growth) could be strengthened.',
        'Project descriptions would benefit from STAR (Situation, Task, Action, Result) methodology phrasing.',
      ]
    : [
        'Ensure work experience bullet points consistently quantify business impact.',
        'Consider tailoring repository links or live demos for each featured project.',
      ];

  const improvementSuggestions = [
    missingSkills.length > 0
      ? `Incorporate practical project work or certifications in ${missingSkills.slice(0, 3).join(', ')}.`
      : 'Highlight leadership, mentoring, or architecture contributions in your project descriptions.',
    'Use strong action verbs (e.g., "Architected", "Engineered", "Optimized", "Spearheaded") at the start of each bullet.',
    'Format section headings consistently so both human hiring managers and ATS parsers parse details accurately.',
    'Include live links to GitHub repositories or deployed applications for your major portfolio items.',
  ];

  const projectRecommendations = missingSkills.length > 0
    ? [
        `Build a full-stack production application integrating ${missingSkills[0]} with automated CI/CD and deployment.`,
        `Contribute to open-source or create a modular demo demonstrating best practices in ${missingSkills.slice(0, 2).join(' & ')}.`,
      ]
    : [
        'Build a real-time collaborative system or high-throughput microservice showcasing system design and caching.',
        'Implement an end-to-end cloud-native project with automated integration testing and Docker containerization.',
      ];

  const interviewTips = [
    `Be prepared to explain deep architectural decisions and trade-offs regarding ${matchedSkills[0] || 'your primary stack'}.`,
    'Practice explaining past bug resolution scenarios using the STAR method (Situation, Task, Action, Result).',
    'Review foundational data structures, algorithms, and system design principles relevant to ' + jobTitle + '.',
  ];

  return {
    summaryFeedback: `Your resume demonstrates good aptitude for the ${jobTitle} domain. By addressing key gaps in ${missingSkills.slice(0, 2).join(', ') || 'specialized tooling'} and backing accomplishments with measurable data, your profile competitiveness will significantly increase.`,
    strengths,
    weaknesses,
    improvementSuggestions,
    projectRecommendations,
    interviewTips,
    isFallback: true,
  };
};

/**
 * Generates AI-powered resume enhancement recommendations using Gemini 2.5 Flash.
 */
export const generateResumeRecommendations = async (
  resumeText: string,
  jobTitle: string,
  jobDescription: string,
  matchedSkills: string[],
  missingSkills: string[]
): Promise<IAIRecommendations> => {
  if (!genAI || !env.GEMINI_API_KEY) {
    return getFallbackRecommendations(jobTitle, matchedSkills, missingSkills);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: env.GEMINI_MODEL,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2, // low temperature for deterministic, analytical results
      },
    });

    const truncatedResume = resumeText.slice(0, 4000);
    const truncatedJD = jobDescription.slice(0, 2000);

    const prompt = `
You are an expert technical recruiter and resume strategist evaluating a candidate for the role: "${jobTitle}".

CANDIDATE RESUME SUMMARY/EXCERPT:
${truncatedResume}

JOB REQUIREMENTS:
${truncatedJD}

MATCHED SKILLS: ${matchedSkills.join(', ')}
MISSING SKILLS: ${missingSkills.join(', ')}

Analyze the candidate's alignment with this target role and generate high-impact, actionable feedback.
You MUST output valid JSON matching this exact schema:
{
  "summaryFeedback": "string (concise 2-3 sentence executive evaluation)",
  "strengths": ["string", "string", "string"],
  "weaknesses": ["string", "string", "string"],
  "improvementSuggestions": ["string", "string", "string", "string"],
  "projectRecommendations": ["string", "string"],
  "interviewTips": ["string", "string", "string"]
}
Do not include markdown backticks around the JSON. Return only the raw JSON.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    return {
      summaryFeedback: parsed.summaryFeedback || 'Analysis complete.',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      improvementSuggestions: Array.isArray(parsed.improvementSuggestions) ? parsed.improvementSuggestions : [],
      projectRecommendations: Array.isArray(parsed.projectRecommendations) ? parsed.projectRecommendations : [],
      interviewTips: Array.isArray(parsed.interviewTips) ? parsed.interviewTips : [],
      isFallback: false,
    };
  } catch (error: any) {
    console.warn('[Gemini AI Warning] Recommendation generation failed, falling back to deterministic engine:', error.message);
    return getFallbackRecommendations(jobTitle, matchedSkills, missingSkills);
  }
};

/**
 * Generates tailored interview questions based on candidate resume and target job.
 */
export const generateInterviewQuestions = async (
  resumeText: string,
  roleTitle: string,
  skills: string[]
): Promise<IInterviewQA[]> => {
  const fallbackQuestions: IInterviewQA[] = [
    {
      id: 'q-1',
      category: 'TECHNICAL',
      question: `Can you explain the core architectural principles of ${skills[0] || 'your core framework'} and how you handle state management or scalability?`,
      contextOrRationale: 'Tests foundational depth and understanding of primary technologies listed on your resume.',
      suggestedAnswerStructure: '1. Definition & core mechanisms\n2. Real-world implementation example from your project\n3. Trade-offs and performance considerations.',
    },
    {
      id: 'q-2',
      category: 'PROJECT_BASED',
      question: 'Walk us through the most challenging technical project listed on your resume. What was your specific architectural contribution and what obstacle did you overcome?',
      contextOrRationale: 'Assesses hands-on ownership and problem-solving agility.',
      suggestedAnswerStructure: 'Situation: Project goal and stack\nTask: Specific challenge or bottleneck\nAction: Exact debugging steps, tools, and code written\nResult: Measurable outcome or lessons learned.',
    },
    {
      id: 'q-3',
      category: 'BEHAVIORAL',
      question: 'Describe a situation where a project requirement changed shortly before a deadline. How did you adapt your priorities and communicate with your team?',
      contextOrRationale: 'Evaluates adaptability, team collaboration, and professional composure.',
      suggestedAnswerStructure: 'STAR method: Explain initial scope, the sudden change, how you reassessed trade-offs, transparent communication, and successful delivery.',
    },
    {
      id: 'q-4',
      category: 'TECHNICAL',
      question: `How do you approach database schema design, indexing, and query optimization when working with ${skills[1] || 'modern databases'}?`,
      contextOrRationale: 'Tests data modeling rigor and production-minded engineering practices.',
      suggestedAnswerStructure: 'Mention normalization vs denormalization choices, query execution profiling (explain plans), and caching layers like Redis.',
    },
  ];

  if (!genAI || !env.GEMINI_API_KEY) {
    return fallbackQuestions;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: env.GEMINI_MODEL,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const prompt = `
You are a senior hiring manager conducting an interview for the position: "${roleTitle}".
The candidate's resume mentions these key skills: ${skills.slice(0, 8).join(', ')}.
Resume context excerpt: ${resumeText.slice(0, 2500)}

Generate 5 high-yield, realistic interview questions (mix of TECHNICAL, BEHAVIORAL, and PROJECT_BASED) tailored to this candidate.
Output valid JSON matching this schema:
[
  {
    "id": "q-1",
    "category": "TECHNICAL",
    "question": "string",
    "contextOrRationale": "string",
    "suggestedAnswerStructure": "string"
  }
]
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);

    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item, idx) => ({
        id: item.id || `q-${idx + 1}`,
        category: ['TECHNICAL', 'BEHAVIORAL', 'PROJECT_BASED'].includes(item.category)
          ? item.category
          : 'TECHNICAL',
        question: item.question || 'Interview question',
        contextOrRationale: item.contextOrRationale || '',
        suggestedAnswerStructure: item.suggestedAnswerStructure || '',
      }));
    }

    return fallbackQuestions;
  } catch (error: any) {
    console.warn('[Gemini AI Warning] Interview question generation failed, using fallback:', error.message);
    return fallbackQuestions;
  }
};

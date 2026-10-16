import { Request, Response, NextFunction } from 'express';
import { Analysis } from '../models/Analysis';
import { SkillTaxonomy } from '../models/SkillTaxonomy';
import { CANONICAL_SKILLS } from '../utils/skillsDictionary';
import { AppError } from '../middleware/errorHandler';

// Curated learning pathways & resources for high-demand skills
const SKILL_RESOURCES: Record<string, {
  docsUrl: string;
  courseTitle: string;
  exercise: string;
  projectIdea: string;
}> = {
  'TypeScript': {
    docsUrl: 'https://www.typescriptlang.org/docs/',
    courseTitle: 'TypeScript Official Handbook & Deep Dive',
    exercise: 'Convert a legacy JavaScript utility library into strict, strongly-typed TypeScript with generics.',
    projectIdea: 'Build a type-safe API client and data validation pipeline using TypeScript and Zod.',
  },
  'Docker': {
    docsUrl: 'https://docs.docker.com/get-started/',
    courseTitle: 'Docker & Containerization Fundamentals',
    exercise: 'Write a multi-stage Dockerfile optimizing an Express/Node app image down to under 150MB.',
    projectIdea: 'Create a multi-container Docker Compose environment with Node API, Redis caching, and MongoDB.',
  },
  'Kubernetes': {
    docsUrl: 'https://kubernetes.io/docs/home/',
    courseTitle: 'Kubernetes Up & Running (K8s Basics)',
    exercise: 'Deploy a replicated microservice with ConfigMaps, Secrets, and a ClusterIP Service using Minikube.',
    projectIdea: 'Implement zero-downtime rolling updates and automated pod autoscaling (HPA).',
  },
  'PostgreSQL': {
    docsUrl: 'https://www.postgresql.org/docs/',
    courseTitle: 'PostgreSQL High Performance & Schema Design',
    exercise: 'Analyze query execution plans using EXPLAIN ANALYZE and implement B-tree and GIN indexes.',
    projectIdea: 'Design a high-volume financial ledger or e-commerce relational schema with ACID transactions.',
  },
  'Redis': {
    docsUrl: 'https://redis.io/documentation',
    courseTitle: 'Redis for Caching & Real-Time Data',
    exercise: 'Implement rate limiting and session caching middleware in an Express REST API using Redis.',
    projectIdea: 'Build a pub/sub live notification server and leaderboard caching microservice.',
  },
  'AWS': {
    docsUrl: 'https://aws.amazon.com/getting-started/',
    courseTitle: 'AWS Certified Cloud Practitioner & Solutions Architect',
    exercise: 'Deploy a serverless REST endpoint utilizing AWS Lambda, API Gateway, and DynamoDB.',
    projectIdea: 'Architect a secure S3 static website connected to CloudFront CDN and ACM SSL certificate.',
  },
  'GraphQL': {
    docsUrl: 'https://graphql.org/learn/',
    courseTitle: 'Full-Stack GraphQL with Apollo & React',
    exercise: 'Build a GraphQL schema with queries, mutations, and DataLoader to solve the N+1 query problem.',
    projectIdea: 'Build an interactive dashboard consuming unified GraphQL endpoints with Apollo Client.',
  },
  'CI/CD': {
    docsUrl: 'https://docs.github.com/en/actions',
    courseTitle: 'Automated CI/CD with GitHub Actions',
    exercise: 'Configure a pipeline that runs automated linter, unit tests, and Docker build on pull requests.',
    projectIdea: 'Build a full deployment pipeline that deploys automatically to staging and production.',
  },
  'Next.js': {
    docsUrl: 'https://nextjs.org/docs',
    courseTitle: 'Next.js App Router & Server Components Masterclass',
    exercise: 'Build an SEO-friendly blog utilizing Incremental Static Regeneration (ISR) and Server Actions.',
    projectIdea: 'Develop a high-performance modern web application with Next.js 14, SSR, and dynamic metadata.',
  },
  'React': {
    docsUrl: 'https://react.dev/learn',
    courseTitle: 'React 18 Architecture, Custom Hooks & Optimization',
    exercise: 'Refactor complex prop drilling into custom hooks and React Context with memoization.',
    projectIdea: 'Build a responsive SaaS dashboard with real-time analytics, filtering, and theme support.',
  },
  'Python': {
    docsUrl: 'https://docs.python.org/3/tutorial/',
    courseTitle: 'Python for Production & Data Engineering',
    exercise: 'Build an automated web data scraper and pipeline with BeautifulSoup and Pandas.',
    projectIdea: 'Build a FastAPI microservice for data processing with asynchronous background tasks.',
  },
};

export const getSkillTaxonomy = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dbSkills = await SkillTaxonomy.find().sort({ popularityScore: -1 });

    if (dbSkills.length > 0) {
      res.status(200).json({ success: true, count: dbSkills.length, skills: dbSkills });
      return;
    }

    // Return built-in canonical skills if DB hasn't been seeded yet
    res.status(200).json({
      success: true,
      count: CANONICAL_SKILLS.length,
      skills: CANONICAL_SKILLS.map((s, idx) => ({
        id: `builtin-${idx}`,
        name: s.canonical,
        category: s.category,
        synonyms: s.aliases,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const getSkillGapAnalysis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const { analysisId } = req.params;
    const analysis = await Analysis.findOne({ _id: analysisId, userId: req.user.id });

    if (!analysis) {
      throw new AppError('Analysis record not found.', 404);
    }

    const matchedSkills = analysis.matchedSkills || [];
    const missingSkills = analysis.missingSkills || [];
    const partiallyMatchedSkills = analysis.partiallyMatchedSkills || [];

    // Map each missing skill to structured learning roadmap items
    const learningPathways = missingSkills.map(skill => {
      const resource = SKILL_RESOURCES[skill] || {
        docsUrl: `https://www.google.com/search?q=${encodeURIComponent(skill + ' official documentation tutorials')}`,
        courseTitle: `${skill} Fundamentals & Industry Best Practices`,
        exercise: `Build a small focused module implementing ${skill} to demonstrate foundational competency.`,
        projectIdea: `Create an open-source GitHub showcase repository highlighting real-world ${skill} patterns.`,
      };

      return {
        skill,
        status: 'MISSING_IN_RESUME',
        recommendation: `Note: This skill was not detected in your resume text. If you possess experience with ${skill}, update your resume to highlight concrete contributions.`,
        ...resource,
      };
    });

    res.status(200).json({
      success: true,
      roleTitle: analysis.targetRoleTitle,
      overallScore: analysis.overallScore,
      demonstratedSkills: matchedSkills,
      missingSkills,
      partiallyMatchedSkills,
      learningPathways,
      disclaimer: "The system identifies skills explicitly mentioned in your resume. It does not measure your full real-world potential. You can verify and add newly acquired skills in your resume profile.",
    });
  } catch (error) {
    next(error);
  }
};

import React from 'react';
import {
  GraduationCap,
  Code2,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Target,
  Sparkles,
  Server,
  Database,
} from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold">
          <GraduationCap className="w-4 h-4" />
          <span>Final-Year Major Project • BCA 2027</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          About CareerLens AI
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          An AI-powered resume analyzer and intelligent job matching platform engineered with transparent NLP scoring, deterministic fallbacks, and ethical career guidance.
        </p>
      </div>

      {/* Problem Statement & Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">The Problem Statement</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Students and job seekers frequently apply to technical roles without clear understanding of why their resumes are filtered out. Proprietary ATS algorithms are shrouded in mystery, leading to misleading internet myths. Furthermore, generic AI resume tools often hallucinate qualifications or provide superficial advice without transparent mathematical proof.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Project Objectives</h2>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
            <li>Build an explainable multi-factor matching engine based on mathematical TF-IDF and cosine similarity.</li>
            <li>Maintain an editable canonical skill taxonomy with synonym resolution.</li>
            <li>Detect skill gaps and provide actionable documentation links and portfolio project roadmaps.</li>
            <li>Integrate Google Gemini 2.5 with offline fallbacks so matching always operates seamlessly.</li>
            <li>Provide role-tailored mock interview prep questions structured with the STAR methodology.</li>
          </ul>
        </Card>
      </div>

      {/* 5-Pillar Mathematical Formula Disclosure */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-600" />
            5-Pillar Mathematical Scoring Formula
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            CareerLens AI explicitly rejects black-box opacity. The match score is computed using five normalized components (0 to 100):
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 font-mono text-xs sm:text-sm text-brand-700 dark:text-brand-300 overflow-x-auto">
          Score = (0.40 × SkillMatch) + (0.25 × TF-IDF_Similarity) + (0.15 × KeywordCoverage) + (0.10 × Relevance) + (0.10 × Completeness)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">1. Skills Match (40%)</span>
            <span className="text-slate-500 leading-relaxed">
              Ratio of matched mandatory skills against total job requirements. Uses canonical skill aliases.
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">2. TF-IDF Cosine (25%)</span>
            <span className="text-slate-500 leading-relaxed">
              Vector space cosine similarity evaluating semantic overlap, terminology, and domain vocabulary.
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">3. Keyword Coverage (15%)</span>
            <span className="text-slate-500 leading-relaxed">
              Breadth of essential technical tool references present across the candidate resume.
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">4. Project Relevance (10%)</span>
            <span className="text-slate-500 leading-relaxed">
              Alignment between candidate's work history / academic projects and job requirements.
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">5. Completeness (10%)</span>
            <span className="text-slate-500 leading-relaxed">
              Structural integrity evaluating presence of Contact Info, Summary, Experience, Education, and Skills.
            </span>
          </div>
        </div>
      </Card>

      {/* Technology Stack Grid */}
      <Card className="p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          Full-Stack Technology Architecture
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-brand-600 block">Frontend Stack</span>
            <p className="text-slate-500">React 18, Vite, TypeScript, Tailwind CSS, TanStack Query, Recharts, Lucide React.</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-indigo-600 block">Backend Server</span>
            <p className="text-slate-500">Node.js, Express, TypeScript, REST API, Zod Validation, Multer, Helmet, Cookie-Parser.</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-emerald-600 block">Database & Auth</span>
            <p className="text-slate-500">MongoDB 7.0, Mongoose ODM, JWT Authentication, bcryptjs, HTTP-only Cookies, RBAC.</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-purple-600 block">AI & Parsing</span>
            <p className="text-slate-500">Google Gemini 2.5 Flash, pdf-parse, mammoth, TF-IDF vectorizer, canonical taxonomy.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  Target,
  Layers,
  TrendingUp,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Search,
  BookOpen,
  Award,
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { ScoreGauge } from '../components/ScoreGauge';
import { extractSkillsFromText } from '../utils/skillsDemo';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [demoInput, setDemoInput] = useState(
    'BCA graduate with experience in React, TypeScript, Node.js, and MongoDB. Built full-stack web applications with Docker containerization and Git version control.'
  );

  const demoExtracted = extractSkillsFromText(demoInput);

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-brand-50/60 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/80 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-6 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Final-Year Major Project • AI & Explainable NLP Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Build a Stronger Resume.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500">
                Discover Better Career Matches.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Analyze your resume, understand your skill gaps, and discover job opportunities that align with your skills and goals.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/analyses" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto shadow-lg shadow-brand-500/25"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Analyze My Resume
                </Button>
              </Link>
              <a href="#features" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Explore Features
                </Button>
              </a>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free & Student Focused
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Explainable TF-IDF Scoring
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No Proprietary ATS Myths
              </span>
            </div>
          </div>

          {/* PRODUCT DASHBOARD PREVIEW - Built with real UI components */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Fake Window Bar */}
              <div className="h-10 bg-slate-100 dark:bg-slate-800/80 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  careerlens.ai/analyses/preview
                </span>
                <Badge variant="brand" size="sm">Live Engine Preview</Badge>
              </div>

              {/* Inner Dashboard Mockup */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1: Score & Metric */}
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <ScoreGauge score={84} size="lg" label="Overall Compatibility" />
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
                    Weighted 5-Pillar Compatibility Score for <span className="font-semibold text-slate-700 dark:text-slate-200">Full Stack Engineer</span>
                  </p>
                </div>

                {/* Column 2: 5-Pillar Breakdown */}
                <div className="p-5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                    Transparent Score Breakdown
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Required Skills (40% Weight)</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">85%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-1.5 rounded-full w-[85%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-600 dark:text-slate-400">TF-IDF Text Similarity (25% Weight)</span>
                        <span className="font-bold text-brand-600 dark:text-brand-400">80%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-brand-500 h-1.5 rounded-full w-[80%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Keyword Coverage (15% Weight)</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">90%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-indigo-500 h-1.5 rounded-full w-[90%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Project Relevance (10% Weight)</span>
                        <span className="font-bold text-brand-600 dark:text-brand-400">85%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-brand-500 h-1.5 rounded-full w-[85%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Resume Completeness (10% Weight)</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">95%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-1.5 rounded-full w-[95%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Skills Alignment */}
                <div className="p-5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Skills Alignment
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                          Matched Skills (4)
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {['React', 'TypeScript', 'Node.js', 'MongoDB'].map(s => (
                            <Badge key={s} variant="success" size="sm">{s}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 block mb-1">
                          Missing in Resume (2)
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {['Docker', 'AWS'].map(s => (
                            <Badge key={s} variant="danger" size="sm">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link to="/dashboard" className="mt-4">
                    <Button variant="primary" size="sm" className="w-full">
                      Test With Your Own Resume →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE SKILL DEMO SECTION */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Try Instant Skill Extraction
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Type or paste any resume excerpt below to see our canonical NLP skill taxonomy in real-time.
            </p>
          </div>

          <Card className="p-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Interactive Test Text
            </label>
            <textarea
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              placeholder="Paste skills or resume text..."
            />
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mr-2">
                Recognized Canonical Skills ({demoExtracted.length}):
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {demoExtracted.length > 0 ? (
                  demoExtracted.map(skill => (
                    <Badge key={skill} variant="brand" size="md">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No canonical skills recognized yet. Try typing 'React, Python, AWS'.</span>
                )}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2">
              End-to-End Career Intelligence
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Features Built for Real Tech Hires
            </h3>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
              Engineered with mathematical transparency, actionable roadmap steps, and zero fabricated claims.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Resume Analysis
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Extracts sections, verifies contact information, scores structural completeness, and highlights missing crucial details from PDF and DOCX uploads.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Job Matching Engine
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Transparent TF-IDF vectorization and cosine similarity formula (0.40 skills + 0.25 text similarity + 0.15 keyword coverage + 0.10 relevance + 0.10 completeness).
              </p>
            </Card>

            {/* Feature 3 */}
            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Skill Gap Detection
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Clear distinction between absent text and unpossessed abilities, mapped directly to curated documentation, hands-on exercises, and portfolio project suggestions.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                AI Resume Suggestions
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Powered by Google Gemini 2.5 with offline deterministic fallbacks. Provides targeted summary feedback, bullet improvements, and actionable enhancements.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Job Recommendations
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Browse verified campus and industry listings, filter by experience and location, bookmark opportunities, and track application milestones.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card hoverEffect className="p-6">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Interview Preparation
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Generate technical, behavioral, and project-based questions tailored specifically to your resume. Includes model answer structures utilizing the STAR method.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2">
              Transparent Methodology
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              How CareerLens AI Works in 4 Steps
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-center relative">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm shadow-md">
                1
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">Upload Resume</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Upload your PDF or DOCX file. Text is extracted, magic bytes verified, and skills mapped to canonical taxonomy.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-center relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm shadow-md">
                2
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">Choose or Paste Job</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Pick from curated active jobs on the platform or paste any target job description from external job portals.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-center relative">
              <div className="w-10 h-10 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm shadow-md">
                3
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">Review Match Analysis</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Examine your transparent 5-pillar compatibility score, matched keywords, and missing requirements without black-box bias.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-center relative">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm shadow-md">
                4
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">Improve Skills & Prep</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Access curated documentation links, implement targeted portfolio projects, and practice AI interview questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY SECTION */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Your Privacy & Data Ownership Pledge
          </h3>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Resumes uploaded to CareerLens AI are stored in protected, private filesystem directories. They are never published publicly, never sold to recruiters or data brokers, and never used to train external public models. You retain full ownership and can permanently delete your resume and analysis history at any time with a single click.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link to="/privacy">
              <Button variant="outline" size="sm">
                Read Full Privacy Policy
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Accelerate Your Career Preparation?
          </h3>
          <p className="mt-4 text-base text-brand-100 max-w-xl mx-auto">
            Get instant, explainable resume compatibility feedback and targeted skill roadmap in less than 30 seconds.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-brand-700 hover:bg-brand-50 shadow-lg">
                Create Free Account
              </Button>
            </Link>
            <Link to="/jobs">
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 border border-white/30">
                Explore Tech Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

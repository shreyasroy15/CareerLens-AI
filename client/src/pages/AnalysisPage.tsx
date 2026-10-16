import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Printer,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  BookOpen,
  Code,
} from 'lucide-react';
import { api } from '../services/api';
import { Resume, Job, Analysis } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { ScoreGauge } from '../components/ScoreGauge';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const AnalysisPage: React.FC = () => {
  const { id: routeAnalysisId } = useParams<{ id?: string }>();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');

  // Target mode: 'CURATED_JOB' or 'CUSTOM_JD'
  const [targetMode, setTargetMode] = useState<'CURATED_JOB' | 'CUSTOM_JD'>('CURATED_JOB');
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('Frontend Engineer');
  const [customDescription, setCustomDescription] = useState<string>(
    'Looking for a Frontend Engineer with experience in React, TypeScript, and modern CSS frameworks like Tailwind CSS. Must have knowledge of state management, REST APIs, and responsive design.'
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  const [scoreExplanation, setScoreExplanation] = useState<any>(null);
  const [analysisHistory, setAnalysisHistory] = useState<Analysis[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [resumesRes, jobsRes, historyRes] = await Promise.all([
          api.resumes.list(),
          api.jobs.list({ limit: 50 }),
          api.analyses.list(1, 20),
        ]);

        const resumeList = resumesRes.resumes || [];
        setResumes(resumeList);
        if (resumeList.length > 0) {
          setSelectedResumeId(resumeList[0].id || (resumeList[0] as any)._id);
        }

        const jobList = jobsRes.jobs || [];
        setJobs(jobList);
        if (jobList.length > 0) {
          setSelectedJobId(jobList[0]._id || jobList[0].id || '');
        }

        const pastAnalyses = historyRes.analyses || [];
        setAnalysisHistory(pastAnalyses);

        // If route has an analysis ID, fetch and load it directly
        if (routeAnalysisId) {
          const single = await api.analyses.getById(routeAnalysisId);
          if (single.analysis) {
            setCurrentAnalysis(single.analysis);
          }
        } else if (pastAnalyses.length > 0) {
          // Default load the latest past analysis
          const single = await api.analyses.getById(pastAnalyses[0]._id || pastAnalyses[0].id);
          if (single.analysis) {
            setCurrentAnalysis(single.analysis);
          }
        }
      } catch (err) {
        console.error('Failed to load initial analysis setup:', err);
      } finally {
        setIsLoadingInitial(false);
      }
    };

    init();
  }, [routeAnalysisId]);

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResumeId) {
      alert('Please upload or select a resume first.');
      return;
    }

    setIsAnalyzing(true);
    setCurrentAnalysis(null);

    try {
      const payload: any = {
        resumeId: selectedResumeId,
        inputType: targetMode === 'CURATED_JOB' ? 'SAVED_JOB' : 'CUSTOM_TEXT',
      };

      if (targetMode === 'CURATED_JOB') {
        payload.jobId = selectedJobId;
      } else {
        payload.targetRoleTitle = customTitle;
        payload.targetJobDescription = customDescription;
      }

      const res = await api.analyses.create(payload);
      setCurrentAnalysis(res.analysis);
      setScoreExplanation(res.scoreExplanation);

      // Refresh history
      const hist = await api.analyses.list(1, 20);
      setAnalysisHistory(hist.analyses || []);
    } catch (err: any) {
      alert(err.message || 'Analysis failed. Please ensure job description is provided.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoadingInitial) {
    return <LoadingSpinner message="Initializing Matching Engine..." size="lg" />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Resume Analyzer & Match Engine
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            5-Pillar explainable compatibility assessment powered by TF-IDF vectorization and Google Gemini 2.5 recommendations.
          </p>
        </div>

        {currentAnalysis && (
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Export / Print Report
          </Button>
        )}
      </div>

      {/* Analysis Configuration Form */}
      <Card className="p-6">
        <form onSubmit={handleRunAnalysis} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Resume Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Step 1: Choose Your Resume
              </label>
              {resumes.length > 0 ? (
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {resumes.map((r) => {
                    const id = r.id || (r as any)._id;
                    return (
                      <option key={id} value={id}>
                        {r.originalFilename} ({r.extractedSkills?.length || 0} detected skills)
                      </option>
                    );
                  })}
                </select>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-amber-300 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between">
                  <span>No resume uploaded yet.</span>
                  <Link to="/resumes">
                    <Button size="sm" variant="primary">Upload Now</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* 2. Target Mode Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Step 2: Target Job Specification
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetMode('CURATED_JOB')}
                  className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all ${
                    targetMode === 'CURATED_JOB'
                      ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Curated Job Listing
                </button>
                <button
                  type="button"
                  onClick={() => setTargetMode('CUSTOM_JD')}
                  className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all ${
                    targetMode === 'CUSTOM_JD'
                      ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Paste Custom Job Description
                </button>
              </div>
            </div>
          </div>

          {/* Conditional Target Input */}
          {targetMode === 'CURATED_JOB' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Select Active Job Listing
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {jobs.map((job) => {
                  const jId = job._id || job.id;
                  return (
                    <option key={jId} value={jId}>
                      {job.title} — {job.company} ({job.location})
                    </option>
                  );
                })}
              </select>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Role Title
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Job Description Text & Requirements
                </label>
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  rows={4}
                  placeholder="Paste complete job description or key required qualifications..."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isAnalyzing}
              disabled={resumes.length === 0}
              rightIcon={<Sparkles className="w-4 h-4" />}
            >
              {isAnalyzing ? 'Calculating 5-Pillar Score...' : 'Run Compatibility Analysis'}
            </Button>
          </div>
        </form>
      </Card>

      {/* ANALYSIS RESULTS SECTION */}
      {currentAnalysis && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
              <ScoreGauge
                score={currentAnalysis.overallScore}
                size="lg"
                label="Compatibility Assessment"
              />
              <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                {currentAnalysis.targetRoleTitle}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                Estimated profile qualification match based on transparent mathematical NLP criteria.
              </p>
              {currentAnalysis.recommendations?.isFallback && (
                <div className="mt-3 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  <span>Deterministic NLP Engine Active</span>
                </div>
              )}
            </Card>

            {/* 5-Pillar Weights Breakdown */}
            <Card className="md:col-span-2 p-6 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-4 flex items-center justify-between">
                  <span>5-Pillar Mathematical Score Formula</span>
                  <span className="text-[11px] font-normal lowercase text-brand-600 dark:text-brand-400">
                    weights sum to 100%
                  </span>
                </h4>

                <div className="space-y-3 text-xs">
                  {/* Pillar 1 */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        1. Required Skills Match (40% Weight)
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {currentAnalysis.componentScores?.skillMatch || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${currentAnalysis.componentScores?.skillMatch || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Pillar 2 */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        2. TF-IDF Text Similarity (25% Weight)
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {currentAnalysis.componentScores?.textSimilarity || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-brand-500 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${currentAnalysis.componentScores?.textSimilarity || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Pillar 3 */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        3. Relevant Keyword Coverage (15% Weight)
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {currentAnalysis.componentScores?.keywordCoverage || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${currentAnalysis.componentScores?.keywordCoverage || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Pillar 4 */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        4. Project & Experience Relevance (10% Weight)
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {currentAnalysis.componentScores?.relevanceScore || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${currentAnalysis.componentScores?.relevanceScore || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Pillar 5 */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        5. Resume Completeness (10% Weight)
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {currentAnalysis.componentScores?.completenessScore || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${currentAnalysis.componentScores?.completenessScore || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                Formula: Overall = 0.40(Skills) + 0.25(TF-IDF) + 0.15(Keywords) + 0.10(Relevance) + 0.10(Completeness)
              </div>
            </Card>
          </div>

          {/* Matched vs Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  Demonstrated / Matched Skills ({currentAnalysis.matchedSkills?.length || 0})
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                These qualifications were verified both in your resume profile and the target job requirements.
              </p>
              <div className="flex flex-wrap gap-2">
                {currentAnalysis.matchedSkills && currentAnalysis.matchedSkills.length > 0 ? (
                  currentAnalysis.matchedSkills.map(skill => (
                    <Badge key={skill} variant="success" size="md">
                      ✓ {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No exact mandatory skill matches found.</span>
                )}
              </div>
            </Card>

            {/* Missing Required Skills */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-rose-500" />
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  Missing Requirements in Resume ({currentAnalysis.missingSkills?.length || 0})
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Target job expects these competencies. If you have experience, edit your resume or check our learning roadmap.
              </p>
              <div className="flex flex-wrap gap-2">
                {currentAnalysis.missingSkills && currentAnalysis.missingSkills.length > 0 ? (
                  currentAnalysis.missingSkills.map(skill => (
                    <Badge key={skill} variant="danger" size="md">
                      ✕ {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-emerald-600 font-medium">All mandatory requirements detected!</span>
                )}
              </div>

              {currentAnalysis.missingSkills && currentAnalysis.missingSkills.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    to={`/skill-gap?analysisId=${currentAnalysis.id || (currentAnalysis as any)._id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    View Targeted Learning Roadmap for Missing Skills →
                  </Link>
                </div>
              )}
            </Card>
          </div>

          {/* AI Recommendations & Feedback */}
          {currentAnalysis.recommendations && (
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Strategic AI Improvement Recommendations
                  </h3>
                  <span className="text-xs text-slate-400">
                    Curated technical feedback for {currentAnalysis.targetRoleTitle}
                  </span>
                </div>
              </div>

              {/* Summary Feedback */}
              {currentAnalysis.recommendations.summaryFeedback && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-white block mb-1">
                    Executive Evaluation:
                  </span>
                  {currentAnalysis.recommendations.summaryFeedback}
                </div>
              )}

              {/* Strengths & Weaknesses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Profile Strengths
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    {currentAnalysis.recommendations.strengths?.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Areas for Refinement
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    {currentAnalysis.recommendations.weaknesses?.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Suggestions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" /> Actionable Resume Enhancements
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentAnalysis.recommendations.improvementSuggestions?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Portfolio Projects */}
              {currentAnalysis.recommendations.projectRecommendations && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-indigo-500" /> Recommended Portfolio Projects
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    {currentAnalysis.recommendations.projectRecommendations.map((proj, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 text-slate-700 dark:text-slate-300"
                      >
                        🚀 {proj}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Steps: Practice Interview Questions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-500">
                  Ready to practice questions specifically tailored to this match?
                </span>
                <Link
                  to={`/interviews?resumeId=${
                    typeof currentAnalysis.resumeId === 'object'
                      ? currentAnalysis.resumeId._id
                      : currentAnalysis.resumeId
                  }&roleTitle=${encodeURIComponent(currentAnalysis.targetRoleTitle)}`}
                >
                  <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Start Mock Interview Prep
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Analysis History Drawer/List */}
      {analysisHistory.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
            Previous Analyses ({analysisHistory.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {analysisHistory.map((item) => {
              const aId = item.id || (item as any)._id;
              const isSelected = currentAnalysis && (currentAnalysis.id === aId || (currentAnalysis as any)._id === aId);

              return (
                <button
                  key={aId}
                  onClick={() => setCurrentAnalysis(item)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.targetRoleTitle}
                    </span>
                    <Badge
                      variant={item.overallScore >= 75 ? 'success' : item.overallScore >= 50 ? 'warning' : 'danger'}
                      size="sm"
                    >
                      {item.overallScore}%
                    </Badge>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  TrendingUp,
  CheckCircle2,
  XCircle,
  BookOpen,
  Code2,
  ExternalLink,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../services/api';
import { Analysis, SkillGapAnalysisResponse } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

export const SkillGapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const analysisIdParam = searchParams.get('analysisId');

  const [pastAnalyses, setPastAnalyses] = useState<Analysis[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>(analysisIdParam || '');
  const [gapData, setGapData] = useState<SkillGapAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingGap, setIsFetchingGap] = useState(false);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await api.analyses.list(1, 30);
        const list = res.analyses || [];
        setPastAnalyses(list);

        const targetId = analysisIdParam || (list.length > 0 ? (list[0].id || (list[0] as any)._id) : '');
        if (targetId) {
          setSelectedAnalysisId(targetId);
          loadGapAnalysis(targetId);
        }
      } catch (err) {
        console.error('Failed to load analyses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyses();
  }, [analysisIdParam]);

  const loadGapAnalysis = async (aId: string) => {
    setIsFetchingGap(true);
    try {
      const data = await api.skills.gapAnalysis(aId);
      setGapData(data);
    } catch (err) {
      console.error('Failed to load gap analysis:', err);
    } finally {
      setIsFetchingGap(false);
    }
  };

  const handleSelectChange = (aId: string) => {
    setSelectedAnalysisId(aId);
    loadGapAnalysis(aId);
  };

  if (isLoading) {
    return <LoadingSpinner message="Evaluating skill taxonomies..." size="lg" />;
  }

  if (pastAnalyses.length === 0) {
    return (
      <EmptyState
        icon={<TrendingUp className="w-8 h-8" />}
        title="No match analyses found"
        description="Run a compatibility analysis between your resume and a target job to generate a tailored skill gap roadmap."
        actionText="Analyze Resume"
        onAction={() => (window.location.href = '/analyses')}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Analysis Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Skill Gap Detection & Learning Roadmap
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Actionable learning pathways, documentation links, and portfolio project suggestions for missing competencies.
          </p>
        </div>

        {/* Dropdown to switch between analyses */}
        <div className="w-full md:w-72">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Select Analysis Match
          </label>
          <select
            value={selectedAnalysisId}
            onChange={(e) => handleSelectChange(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {pastAnalyses.map((a) => {
              const id = a.id || (a as any)._id;
              return (
                <option key={id} value={id}>
                  {a.targetRoleTitle} ({a.overallScore}%)
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Disclaimers & Ethics Alert */}
      <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Important Evaluation Principle: </span>
          The system distinguishes between a skill that is <em>absent from your resume text</em> versus a skill you may possess in real life. If you have experience in any of the listed technologies, update your resume to highlight concrete contributions!
        </div>
      </div>

      {isFetchingGap ? (
        <LoadingSpinner message="Generating learning roadmap..." size="md" />
      ) : gapData ? (
        <div className="space-y-8">
          {/* Summary Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
                {gapData.demonstratedSkills.length}
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Demonstrated</span>
                <p className="text-xs text-slate-500">Skills present in resume</p>
              </div>
            </Card>

            <Card className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold">
                {gapData.missingSkills.length}
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Missing Gaps</span>
                <p className="text-xs text-slate-500">Required by job posting</p>
              </div>
            </Card>

            <Card className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold">
                {gapData.overallScore}%
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Match Compatibility</span>
                <p className="text-xs text-slate-500">{gapData.roleTitle}</p>
              </div>
            </Card>
          </div>

          {/* Detailed Learning Pathways for Missing Skills */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-600" />
              Tailored Learning Roadmap ({gapData.learningPathways.length})
            </h2>

            {gapData.learningPathways.length > 0 ? (
              <div className="space-y-6">
                {gapData.learningPathways.map((pathway, idx) => (
                  <Card key={idx} hoverEffect className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 font-bold flex items-center justify-center text-xs">
                          {idx + 1}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {pathway.skill}
                        </h3>
                        <Badge variant="danger" size="sm">
                          Absent in Resume
                        </Badge>
                      </div>

                      <a
                        href={pathway.docsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        Official Documentation <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                      💡 {pathway.recommendation}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {/* Practical Exercise */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5" /> Hands-On Practice Exercise
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {pathway.exercise}
                        </p>
                      </div>

                      {/* Portfolio Project Suggestion */}
                      <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> Showcase Portfolio Project
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {pathway.projectIdea}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Zero Missing Required Skills!
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Your resume covers 100% of the mandatory technologies requested for this position.
                </p>
              </Card>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

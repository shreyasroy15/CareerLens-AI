import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  Briefcase,
  TrendingUp,
  BookmarkCheck,
  ArrowRight,
  Plus,
  Clock,
  Layers,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { ScoreGauge } from '../components/ScoreGauge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [resumesCount, setResumesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, savedJobsRes, resumesRes] = await Promise.all([
          api.analyses.stats().catch(() => ({ stats: {} })),
          api.jobs.getSaved().catch(() => ({ count: 0 })),
          api.resumes.list().catch(() => ({ count: 0 })),
        ]);

        setStats(statsRes.stats || {});
        setSavedJobsCount(savedJobsRes.count || 0);
        setResumesCount(resumesRes.count || 0);
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading your career dashboard..." size="lg" />;
  }

  const totalAnalyses = stats?.totalAnalyses || 0;
  const averageScore = stats?.averageScore || 0;
  const latestAnalysis = stats?.latestAnalysis || null;
  const recentAnalyses = stats?.recentAnalyses || [];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor your resume match scores, skill improvements, and targeted job listings.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/resumes">
            <Button variant="outline" size="sm" leftIcon={<FileText className="w-4 h-4" />}>
              Upload Resume
            </Button>
          </Link>
          <Link to="/analyses">
            <Button variant="primary" size="sm" leftIcon={<Sparkles className="w-4 h-4" />}>
              Analyze Resume
            </Button>
          </Link>
          <Link to="/jobs">
            <Button variant="secondary" size="sm" leftIcon={<Briefcase className="w-4 h-4" />}>
              Browse Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Real Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{resumesCount}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Uploaded Resumes</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{totalAnalyses}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Completed Analyses</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {averageScore > 0 ? `${averageScore}%` : 'N/A'}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg Compatibility</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{savedJobsCount}</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Saved & Tracked Jobs</p>
          </div>
        </Card>
      </div>

      {/* Main Grid: Latest Match Overview & Recent Analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Match Card */}
        <Card className="lg:col-span-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Latest Resume Match
              </h3>
              {latestAnalysis && (
                <Badge variant="brand" size="sm">Latest</Badge>
              )}
            </div>

            {latestAnalysis ? (
              <div className="space-y-6">
                <ScoreGauge
                  score={latestAnalysis.overallScore}
                  size="lg"
                  label={latestAnalysis.targetRoleTitle}
                />

                <div className="space-y-2 text-xs pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Required Skills Match:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {latestAnalysis.componentScores?.skillMatch || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>TF-IDF Text Similarity:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {latestAnalysis.componentScores?.textSimilarity || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Keyword Coverage:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {latestAnalysis.componentScores?.keywordCoverage || 0}%
                    </span>
                  </div>
                </div>

                <Link to={`/analyses/${latestAnalysis._id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Full 5-Pillar Report →
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No analyses run yet</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                  Upload a resume and compare it against any tech job to view your compatibility rating.
                </p>
                <Link to="/analyses">
                  <Button variant="primary" size="sm">Start First Analysis</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 leading-tight">
            * CareerLens scores evaluate qualification overlap and are not an employer guarantee.
          </div>
        </Card>

        {/* Recent Analyses & Activity */}
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Recent Analyses & History
              </h3>
              <Link to="/analyses" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                View All →
              </Link>
            </div>

            {recentAnalyses.length > 0 ? (
              <div className="space-y-3">
                {recentAnalyses.map((item: any) => (
                  <Link
                    key={item._id}
                    to={`/analyses/${item._id}`}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-brand-200 dark:hover:border-brand-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-xs">
                        {item.overallScore}%
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                          {item.targetRoleTitle}
                        </h4>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant={item.overallScore >= 75 ? 'success' : item.overallScore >= 50 ? 'warning' : 'danger'}
                        size="sm"
                      >
                        {item.overallScore >= 75 ? 'Strong Match' : item.overallScore >= 50 ? 'Moderate' : 'Low'}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Clock className="w-6 h-6" />}
                title="No recent analyses"
                description="Your matched resumes and role compatibility reports will be tracked here."
                actionText="Analyze Resume"
                onAction={() => (window.location.href = '/analyses')}
              />
            )}
          </div>

          {/* Quick Help & Next Steps Banner */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-slate-800/60 dark:to-slate-800/30 border border-brand-100 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-brand-900 dark:text-brand-200">
                Want to practice before your technical interview?
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Generate AI interview questions based on your resume and target role.
              </p>
            </div>
            <Link to="/interviews">
              <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Practice Q&A
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  MapPin,
  Bookmark,
  BookmarkCheck,
  Building,
  Sparkles,
  ExternalLink,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../services/api';
import { Job } from '../types';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

export const JobsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (locationFilter) params.location = locationFilter;
      if (typeFilter !== 'ALL') params.employmentType = typeFilter;
      if (levelFilter !== 'ALL') params.experienceLevel = levelFilter;

      const res = await api.jobs.list(params);
      setJobs(res.jobs || []);
      setSavedJobIds(res.savedJobIds || []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [typeFilter, levelFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const toggleSaveJob = async (jobId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const isAlreadySaved = savedJobIds.includes(jobId);
    try {
      if (isAlreadySaved) {
        await api.jobs.removeSaved(jobId);
        setSavedJobIds(prev => prev.filter(id => id !== jobId));
      } else {
        await api.jobs.save(jobId);
        setSavedJobIds(prev => [...prev, jobId]);
      }
    } catch (err: any) {
      alert(err.message || 'Error updating bookmark.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Curated Tech Jobs Board
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Discover verified job listings. Match your resume instantly to see qualification overlap and missing skills.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 sm:p-5">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Title / Keyword search */}
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by job title, company, or skills (e.g. React, Node.js, Python)..."
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Location search */}
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Location (e.g. Remote, Bangalore)..."
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Dropdown Filters & Search Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="ALL">All Employment Types</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </div>

              <div>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="ALL">All Experience Levels</option>
                  <option value="ENTRY">Entry Level / Freshers</option>
                  <option value="MID">Mid Level</option>
                  <option value="SENIOR">Senior Level</option>
                </select>
              </div>
            </div>

            <Button type="submit" variant="primary" size="sm" leftIcon={<Search className="w-3.5 h-3.5" />}>
              Search Jobs
            </Button>
          </div>
        </form>
      </Card>

      {/* Jobs Grid */}
      {isLoading ? (
        <LoadingSpinner message="Searching opportunities..." size="lg" />
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => {
            const jobId = job._id || job.id || '';
            const isSaved = savedJobIds.includes(jobId);

            return (
              <Card key={jobId} hoverEffect className="p-5 flex flex-col justify-between">
                <div>
                  {/* Top Bar with Company & Bookmark */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <Building className="w-3.5 h-3.5" />
                        <span>{job.company}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {job.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => toggleSaveJob(jobId)}
                      className={`p-2 rounded-lg transition-colors ${
                        isSaved
                          ? 'text-brand-600 bg-brand-50 dark:bg-brand-950/60'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save job'}
                    >
                      {isSaved ? <BookmarkCheck className="w-5 h-5 fill-brand-600" /> : <Bookmark className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Location & Tags */}
                  <div className="flex flex-wrap items-center gap-2 my-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span>{job.employmentType.replace('_', ' ')}</span>
                    {job.salaryRange && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {job.salaryRange}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Sample Data Indicator */}
                  {job.isSampleData && (
                    <div className="my-1.5">
                      <Badge variant="neutral" size="sm">
                        Curated Sample Data
                      </Badge>
                    </div>
                  )}

                  {/* Description Excerpt */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 my-3 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Required Skills Badges */}
                  <div className="space-y-1.5 my-3">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Required Skills:
                    </span>
                    <div className="flex flex-wrap gap-1 max-h-16 overflow-hidden">
                      {job.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="brand" size="sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <Link to={`/analyses?jobId=${jobId}`} className="flex-1">
                    <Button variant="primary" size="sm" className="w-full" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                      Match With Resume
                    </Button>
                  </Link>

                  {job.applicationUrl && (
                    <a
                      href={job.applicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Direct application link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Briefcase className="w-8 h-8" />}
          title="No jobs matching your filters"
          description="Try broadening your search keywords or resetting employment type and experience level."
          actionText="Reset Filters"
          onAction={() => {
            setSearch('');
            setLocationFilter('');
            setTypeFilter('ALL');
            setLevelFilter('ALL');
          }}
        />
      )}
    </div>
  );
};

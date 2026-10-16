import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookmarkCheck,
  Building,
  MapPin,
  Trash2,
  Sparkles,
  ExternalLink,
  Edit2,
  Calendar,
} from 'lucide-react';
import { api } from '../services/api';
import { SavedJob, ApplicationStatus } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; variant: 'brand' | 'success' | 'warning' | 'danger' | 'neutral' | 'purple' }> = {
  SAVED: { label: 'Bookmarked', variant: 'neutral' },
  APPLIED: { label: 'Applied', variant: 'brand' },
  INTERVIEWING: { label: 'Interviewing', variant: 'purple' },
  OFFERED: { label: 'Offer Received', variant: 'success' },
  REJECTED: { label: 'Archived / Rejected', variant: 'danger' },
};

export const SavedJobsPage: React.FC = () => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      const res = await api.jobs.getSaved();
      setSavedJobs(res.savedJobs || []);
    } catch (err) {
      console.error('Failed to load saved jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleStatusChange = async (jobId: string, newStatus: ApplicationStatus) => {
    try {
      await api.jobs.updateStatus(jobId, { applicationStatus: newStatus });
      setSavedJobs(prev =>
        prev.map(item =>
          ((item.jobId as any)._id === jobId || item.jobId.id === jobId)
            ? { ...item, applicationStatus: newStatus }
            : item
        )
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update application status.');
    }
  };

  const handleRemove = async (jobId: string) => {
    if (!window.confirm('Remove this job from your tracking board?')) return;
    try {
      await api.jobs.removeSaved(jobId);
      setSavedJobs(prev =>
        prev.filter(item => (item.jobId as any)._id !== jobId && item.jobId.id !== jobId)
      );
    } catch (err: any) {
      alert(err.message || 'Error removing job.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading tracked applications..." size="lg" />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Application Tracker & Saved Jobs
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track interview stages, application deadlines, and notes for your target companies.
        </p>
      </div>

      {savedJobs.length > 0 ? (
        <div className="space-y-4">
          {savedJobs.map((record) => {
            const job = record.jobId;
            if (!job) return null;
            const jobId = (job as any)._id || job.id;
            const statusMeta = STATUS_CONFIG[record.applicationStatus] || STATUS_CONFIG.SAVED;

            return (
              <Card key={record.id || (record as any)._id} hoverEffect className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Job Details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" />
                        {job.company}
                      </span>
                      <Badge variant={statusMeta.variant} size="sm">
                        {statusMeta.label}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {job.location}
                      </span>
                      <span>•</span>
                      <span>{job.employmentType.replace('_', ' ')}</span>
                      {record.appliedDate && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-brand-600 dark:text-brand-400">
                            <Calendar className="w-3 h-3" />
                            Applied on {new Date(record.appliedDate).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex flex-wrap items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    <div>
                      <select
                        value={record.applicationStatus}
                        onChange={(e) => handleStatusChange(jobId, e.target.value as ApplicationStatus)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="SAVED">Stage: Bookmarked</option>
                        <option value="APPLIED">Stage: Applied</option>
                        <option value="INTERVIEWING">Stage: Interviewing</option>
                        <option value="OFFERED">Stage: Offer Received</option>
                        <option value="REJECTED">Stage: Rejected</option>
                      </select>
                    </div>

                    <Link to={`/analyses?jobId=${jobId}`}>
                      <Button variant="outline" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                        Analyze Match
                      </Button>
                    </Link>

                    {job.applicationUrl && (
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Open job posting"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      onClick={() => handleRemove(jobId)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Remove from board"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<BookmarkCheck className="w-8 h-8" />}
          title="No saved jobs yet"
          description="Browse our curated jobs board and click the bookmark icon on roles that interest you."
          actionText="Browse Jobs"
          onAction={() => (window.location.href = '/jobs')}
        />
      )}
    </div>
  );
};

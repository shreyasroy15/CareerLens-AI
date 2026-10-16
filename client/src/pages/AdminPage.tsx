import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  FileText,
  Sparkles,
  Briefcase,
  Activity,
  Plus,
  Trash2,
  Server,
  Cpu,
  Clock,
  Layers,
} from 'lucide-react';
import { api } from '../services/api';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const AdminPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Job creation modal state
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newLocation, setNewLocation] = useState('Bangalore, India');
  const [newType, setNewType] = useState('FULL_TIME');
  const [newLevel, setNewLevel] = useState('ENTRY');
  const [newSalary, setNewSalary] = useState('Competitive');
  const [newDescription, setNewDescription] = useState('');
  const [newSkillsInput, setNewSkillsInput] = useState('');
  const [isCreatingJob, setIsCreatingJob] = useState(false);

  const fetchData = async () => {
    try {
      const [analyticsRes, usersRes, jobsRes] = await Promise.all([
        api.admin.analytics(),
        api.admin.users(1),
        api.jobs.list({ limit: 50 }),
      ]);

      setMetrics(analyticsRes.metrics);
      setSystemHealth(analyticsRes.systemHealth);
      setUsers(usersRes.users || []);
      setJobs(jobsRes.jobs || []);
    } catch (err: any) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const skills = newSkillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (skills.length === 0) {
      alert('Please enter at least one required skill.');
      return;
    }

    setIsCreatingJob(true);
    try {
      await api.admin.createJob({
        title: newTitle,
        company: newCompany,
        location: newLocation,
        employmentType: newType,
        experienceLevel: newLevel,
        salaryRange: newSalary,
        description: newDescription,
        requiredSkills: skills,
        isSampleData: false,
      });

      setIsAddJobOpen(false);
      // Reset form
      setNewTitle('');
      setNewCompany('');
      setNewDescription('');
      setNewSkillsInput('');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error publishing job.');
    } finally {
      setIsCreatingJob(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job listing?')) return;
    try {
      await api.admin.deleteJob(id);
      setJobs(prev => prev.filter(j => (j._id || j.id) !== id));
    } catch (err: any) {
      alert(err.message || 'Error deleting job.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Verifying administrator credentials..." size="lg" />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Administrator Console
            </h1>
            <Badge variant="purple" size="sm">Admin Role</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time platform usage metrics, user directories, job publishing, and server health.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddJobOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Publish New Job
        </Button>
      </div>

      {/* Analytics KPI Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="p-4">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Users</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{metrics.totalUsers}</p>
          </Card>
          <Card className="p-4">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Resumes</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{metrics.totalResumes}</p>
          </Card>
          <Card className="p-4">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Analyses</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{metrics.totalAnalyses}</p>
          </Card>
          <Card className="p-4">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Jobs</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{metrics.totalJobs}</p>
          </Card>
          <Card className="p-4">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Saved Jobs</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{metrics.totalSavedJobs}</p>
          </Card>
          <Card className="p-4">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Avg Match</span>
            <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 mt-1">{metrics.systemAverageScore}%</p>
          </Card>
        </div>
      )}

      {/* System Health */}
      {systemHealth && (
        <Card className="p-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-500" />
            Backend Node.js Server Telemetry
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Environment:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{systemHealth.platform} ({systemHealth.nodeVersion})</span>
            </div>
            <div>
              <span className="text-slate-400 block">CPU Cores:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{systemHealth.cpuCores} Cores</span>
            </div>
            <div>
              <span className="text-slate-400 block">Heap Memory:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{systemHealth.memoryUsageMb} MB Used</span>
            </div>
            <div>
              <span className="text-slate-400 block">Server Uptime:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{Math.floor(systemHealth.uptimeSeconds / 60)} minutes</span>
            </div>
          </div>
        </Card>
      )}

      {/* Registered Users Table */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-brand-600" />
          Registered Users ({users.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Email</th>
                <th className="p-3 font-semibold">Role</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => (
                <tr key={u.id || u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-3 font-medium text-slate-900 dark:text-white">{u.name}</td>
                  <td className="p-3 text-slate-500">{u.email}</td>
                  <td className="p-3">
                    <Badge variant={u.role === 'ADMIN' ? 'purple' : 'brand'} size="sm">
                      {u.role}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge variant="success" size="sm">Verified</Badge>
                  </td>
                  <td className="p-3 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Managed Job Postings Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-600" />
            Manage Job Postings ({jobs.length})
          </h3>
          <Button variant="outline" size="sm" onClick={() => setIsAddJobOpen(true)}>
            + Add Listing
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3 font-semibold">Title</th>
                <th className="p-3 font-semibold">Company</th>
                <th className="p-3 font-semibold">Location</th>
                <th className="p-3 font-semibold">Type</th>
                <th className="p-3 font-semibold">Required Skills</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {jobs.map((job) => {
                const jId = job._id || job.id;
                return (
                  <tr key={jId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">{job.title}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{job.company}</td>
                    <td className="p-3 text-slate-500">{job.location}</td>
                    <td className="p-3">
                      <Badge variant="neutral" size="sm">{job.employmentType}</Badge>
                    </td>
                    <td className="p-3 max-w-xs truncate text-slate-500">
                      {job.requiredSkills?.join(', ')}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteJob(jId)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Job Modal */}
      <Modal
        isOpen={isAddJobOpen}
        onClose={() => setIsAddJobOpen(false)}
        title="Publish New Job Listing"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateJob} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                placeholder="e.g. Senior Backend Engineer"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                required
                placeholder="e.g. CloudTech Inc."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Employment Type
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="CONTRACT">Contract</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Salary Range
              </label>
              <input
                type="text"
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
                placeholder="₹10,00,000 - ₹15,00,000"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Required Skills (comma-separated)
            </label>
            <input
              type="text"
              value={newSkillsInput}
              onChange={(e) => setNewSkillsInput(e.target.value)}
              required
              placeholder="React, TypeScript, Node.js, MongoDB, Docker"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Job Description
            </label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              required
              rows={4}
              placeholder="Outline role responsibilities, required qualifications, and company culture..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddJobOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isCreatingJob}>
              Publish Job
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

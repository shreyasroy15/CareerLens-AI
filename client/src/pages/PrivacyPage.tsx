import React from 'react';
import { ShieldCheck, Lock, Trash2, EyeOff, Server, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/Card';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Privacy Policy & Data Security
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          CareerLens AI takes user data ownership, confidential resume handling, and student privacy with utmost seriousness.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300">
        <Card className="p-6 space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-600" />
            1. Private Resume Storage
          </h2>
          <p className="text-xs leading-relaxed">
            All uploaded PDF and DOCX files are stored within a protected, non-public directory on the server. No permanent public URLs are ever created or exposed to third parties. File downloads are authenticated and strictly limited to the user who uploaded the document.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-brand-600" />
            2. No Data Selling or Model Training
          </h2>
          <p className="text-xs leading-relaxed">
            We do not sell, license, or broker your personal information, resume text, or contact details to third-party advertisers, recruiters, or data brokers. Resumes are processed solely to compute qualification compatibility against the jobs you choose to evaluate.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-brand-600" />
            3. Right to Erasure (Complete Deletion)
          </h2>
          <p className="text-xs leading-relaxed">
            You retain absolute ownership of your data. You can delete any uploaded resume or analysis record at any time from your Resume Manager and Dashboard. When you click delete, the physical file is unlinked and permanently purged from server storage.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-brand-600" />
            4. Unbiased & Ethical Matching
          </h2>
          <p className="text-xs leading-relaxed">
            Matching algorithms in CareerLens AI rely exclusively on verifiable technical qualifications, skills, and project experience. Demographic variables such as age, gender, race, religion, caste, or disability status are neither collected nor factored into candidate scoring.
          </p>
        </Card>
      </div>
    </div>
  );
};

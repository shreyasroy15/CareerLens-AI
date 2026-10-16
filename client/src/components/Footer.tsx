import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield, Sparkles, Heart, Github, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                CareerLens <span className="text-brand-600 dark:text-brand-400">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Transparent, AI-powered resume analysis, mathematical TF-IDF matching, and curated skill roadmap for modern tech careers.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Shield className="w-3.5 h-3.5" />
              <span>Private & Secure Uploads</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/resumes" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Resume Parser & Upload
                </Link>
              </li>
              <li>
                <Link to="/analyses" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Job Match Engine
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Curated Jobs Board
                </Link>
              </li>
              <li>
                <Link to="/interviews" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  AI Interview Practice
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Context */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-brand-600" />
              Academic Project
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Final-Year BCA Major Project (Bachelor of Computer Applications 2027). Designed with enterprise full-stack standards and transparent NLP explainability.
            </p>
            <Link to="/about" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              View Project Objectives & Architecture →
            </Link>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">
              Transparency
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/privacy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Privacy Policy & Data Rights
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Scoring Formula Disclosures
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white"
                >
                  <Github className="w-4 h-4" />
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} CareerLens AI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for tech career empowerment.
          </p>
        </div>
      </div>
    </footer>
  );
};

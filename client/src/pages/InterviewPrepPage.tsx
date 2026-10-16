import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Layers,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Send,
  MessageSquare,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { api } from '../services/api';
import { Resume, Job, InterviewSession, InterviewQA } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

export const InterviewPrepPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialResumeId = searchParams.get('resumeId');
  const initialRoleTitle = searchParams.get('roleTitle');

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>(initialResumeId || '');
  const [targetRole, setTargetRole] = useState<string>(initialRoleTitle || 'Full Stack Engineer');

  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Expanded answer structures
  const [expandedAnswers, setExpandedAnswers] = useState<Record<string, boolean>>({});
  // Responses state for current question
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const [resumesRes, sessionsRes] = await Promise.all([
          api.resumes.list(),
          api.interviews.list(),
        ]);

        const resumeList = resumesRes.resumes || [];
        setResumes(resumeList);
        if (resumeList.length > 0 && !selectedResumeId) {
          setSelectedResumeId(resumeList[0].id || (resumeList[0] as any)._id);
        }

        const sessionList = sessionsRes.sessions || [];
        setSessions(sessionList);
        if (sessionList.length > 0) {
          setCurrentSession(sessionList[0]);
          // Populate existing answers
          const ansMap: Record<string, string> = {};
          sessionList[0].questions?.forEach((q: any) => {
            if (q.userResponse) ansMap[q.id] = q.userResponse;
          });
          setUserAnswers(ansMap);
        }
      } catch (err) {
        console.error('Failed to initialize interview prep:', err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const handleGenerateQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResumeId) {
      alert('Please upload and select a resume.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await api.interviews.create({
        resumeId: selectedResumeId,
        roleTitle: targetRole,
      });

      setCurrentSession(res.session);
      setSessions(prev => [res.session, ...prev]);
      setUserAnswers({});
    } catch (err: any) {
      alert(err.message || 'Failed to generate interview practice session.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveResponse = async (questionId: string) => {
    if (!currentSession) return;
    const answerText = userAnswers[questionId] || '';
    if (!answerText.trim()) return;

    setIsSubmittingAnswer(questionId);
    const sessionId = currentSession.id || (currentSession as any)._id;

    try {
      const res = await api.interviews.submitAnswer(sessionId, {
        questionId,
        userResponse: answerText,
      });
      setCurrentSession(res.session);
    } catch (err: any) {
      alert(err.message || 'Error saving answer response.');
    } finally {
      setIsSubmittingAnswer(null);
    }
  };

  const toggleExpand = (qId: string) => {
    setExpandedAnswers(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  if (isLoading) {
    return <LoadingSpinner message="Preparing interview practice workspace..." size="lg" />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Interview Preparation & Mock Sessions
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Practice technical, behavioral, and project-based interview questions generated directly from your resume and target role.
        </p>
      </div>

      {/* Generator Configuration Form */}
      <Card className="p-6">
        <form onSubmit={handleGenerateQuestions} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Select Resume for Profile Context
              </label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {resumes.map((r) => {
                  const id = r.id || (r as any)._id;
                  return (
                    <option key={id} value={id}>
                      {r.originalFilename}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Position / Role Title
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full Stack Software Engineer"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isGenerating}
              disabled={resumes.length === 0}
              rightIcon={<Sparkles className="w-4 h-4" />}
            >
              Generate Tailored Q&A Session
            </Button>
          </div>
        </form>
      </Card>

      {/* Current Active Session Questions */}
      {currentSession ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Interview Session: {currentSession.roleTitle}
              </h2>
              <span className="text-xs text-slate-400">
                Created on {new Date(currentSession.createdAt).toLocaleDateString()}
              </span>
            </div>
            <Badge variant="brand" size="sm">
              {currentSession.questions.length} Tailored Questions
            </Badge>
          </div>

          <div className="space-y-6">
            {currentSession.questions.map((q, idx) => {
              const isExpanded = expandedAnswers[q.id];
              const userResp = userAnswers[q.id] || q.userResponse || '';

              return (
                <Card key={q.id || idx} className="p-6 space-y-4">
                  {/* Category & Title */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            q.category === 'TECHNICAL'
                              ? 'brand'
                              : q.category === 'BEHAVIORAL'
                              ? 'purple'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {q.category}
                        </Badge>
                        <span className="text-xs text-slate-400">Question {idx + 1}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {q.question}
                      </h3>
                    </div>
                  </div>

                  {/* Context & Rationale */}
                  {q.contextOrRationale && (
                    <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Why recruiters ask this: </span>
                      {q.contextOrRationale}
                    </div>
                  )}

                  {/* Suggested Answer Structure (STAR) Accordion */}
                  {q.suggestedAnswerStructure && (
                    <div>
                      <button
                        type="button"
                        onClick={() => toggleExpand(q.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {isExpanded ? 'Hide Suggested Answer Structure (STAR)' : 'View Model Answer Structure (STAR)'}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 p-3.5 rounded-xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/40 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                          {q.suggestedAnswerStructure}
                        </div>
                      )}
                    </div>
                  )}

                  {/* User Response Textarea */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Your Practice Response & Talking Points:
                    </label>
                    <textarea
                      value={userAnswers[q.id] !== undefined ? userAnswers[q.id] : q.userResponse || ''}
                      onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                      rows={3}
                      placeholder="Draft your answer here following Situation, Task, Action, and Result (STAR)..."
                      className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />

                    <div className="flex items-center justify-between">
                      {q.feedback ? (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          ✓ Feedback: {q.feedback}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          Draft your response to save notes.
                        </span>
                      )}

                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleSaveResponse(q.id)}
                        isLoading={isSubmittingAnswer === q.id}
                        leftIcon={<Send className="w-3.5 h-3.5" />}
                      >
                        Save Answer
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<Layers className="w-8 h-8" />}
          title="No interview sessions generated yet"
          description="Select your uploaded resume and click Generate above to create tailored mock interview questions with STAR answers."
        />
      )}

      {/* Past Sessions Drawer */}
      {sessions.length > 1 && (
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
            Revisit Previous Sessions ({sessions.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sessions.map((sess) => {
              const sId = sess.id || (sess as any)._id;
              const isSelected = currentSession && (currentSession.id === sId || (currentSession as any)._id === sId);

              return (
                <button
                  key={sId}
                  onClick={() => {
                    setCurrentSession(sess);
                    const ansMap: Record<string, string> = {};
                    sess.questions?.forEach((q: any) => {
                      if (q.userResponse) ansMap[q.id] = q.userResponse;
                    });
                    setUserAnswers(ansMap);
                  }}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {sess.roleTitle}
                  </p>
                  <span className="text-[11px] text-slate-400">
                    {new Date(sess.createdAt).toLocaleDateString()} • {sess.questions?.length || 0} questions
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

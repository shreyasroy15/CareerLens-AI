import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  FileText,
  Trash2,
  Download,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit3,
  Plus,
  X,
  FileUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { Resume } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

export const ResumeManagerPage: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Selected resume for detailed preview / edit modal
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Edit form state
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fetchResumes = async () => {
    try {
      const data = await api.resumes.list();
      setResumes(data.resumes || []);
    } catch (err: any) {
      console.error('Failed to fetch resumes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    setUploadSuccess(null);

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File exceeds maximum allowed size of 5MB.');
      return;
    }

    // Validate extension
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!['.pdf', '.docx', '.doc'].includes(ext)) {
      setUploadError('Unsupported format. Please upload a PDF or DOCX file.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const res = await api.resumes.upload(formData);
      setUploadSuccess(res.message);
      await fetchResumes();

      // Open preview automatically for review
      if (res.resume) {
        openPreview(res.resume);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload and parse resume.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      return;
    }

    try {
      await api.resumes.delete(id);
      setResumes(prev => prev.filter(r => r.id !== id && (r as any)._id !== id));
      if (selectedResume && (selectedResume.id === id || (selectedResume as any)._id === id)) {
        setIsPreviewOpen(false);
        setIsEditOpen(false);
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting resume.');
    }
  };

  const openPreview = async (resume: Resume) => {
    try {
      const full = await api.resumes.getById(resume.id || (resume as any)._id);
      setSelectedResume(full.resume);
      setIsPreviewOpen(true);
    } catch (err) {
      setSelectedResume(resume);
      setIsPreviewOpen(true);
    }
  };

  const openEditModal = (resume: Resume) => {
    setSelectedResume(resume);
    setEditSkills(resume.extractedSkills || []);
    setEditSummary(resume.extractedSections?.summary || '');
    setIsEditOpen(true);
  };

  const handleAddSkill = () => {
    const clean = newSkillInput.trim();
    if (clean && !editSkills.includes(clean)) {
      setEditSkills([...editSkills, clean]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditSkills(editSkills.filter(s => s !== skillToRemove));
  };

  const handleSaveEdits = async () => {
    if (!selectedResume) return;
    setIsSavingEdit(true);
    const resumeId = selectedResume.id || (selectedResume as any)._id;

    try {
      const res = await api.resumes.update(resumeId, {
        extractedSkills: editSkills,
        extractedSections: {
          summary: editSummary,
        },
      });

      setSelectedResume(res.resume);
      setResumes(prev => prev.map(r => ((r.id || (r as any)._id) === resumeId ? res.resume : r)));
      setIsEditOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update resume details.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading your resume documents..." size="lg" />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Resume Manager & Parser
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Upload and review your PDF/DOCX resumes. Inspect parsed contact info, sections, and detected technical skills.
        </p>
      </div>

      {/* Drag & Drop Upload Zone */}
      <Card
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        className={`p-8 border-2 border-dashed transition-all text-center ${
          isDragOver
            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />

        <div className="max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-sm">
            <FileUp className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Drag & Drop your resume here
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports text-searchable PDF and DOCX files up to 5MB.
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => fileInputRef.current?.click()}
            isLoading={isUploading}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            {isUploading ? 'Extracting Text & Skills...' : 'Select File from Computer'}
          </Button>

          {uploadError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2 justify-center">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 justify-center">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Resumes List */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Your Resumes ({resumes.length})
        </h2>

        {resumes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {resumes.map((resume) => {
              const resumeId = resume.id || (resume as any)._id;
              const skillCount = resume.extractedSkills?.length || 0;
              const sizeKb = Math.round(resume.fileSizeBytes / 1024);

              return (
                <Card key={resumeId} hoverEffect className="p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate" title={resume.originalFilename}>
                            {resume.originalFilename}
                          </h4>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(resume.createdAt).toLocaleDateString()} • {sizeKb} KB
                          </span>
                        </div>
                      </div>

                      <Badge
                        variant={resume.processingStatus === 'PARSED' ? 'success' : 'danger'}
                        size="sm"
                      >
                        {resume.processingStatus}
                      </Badge>
                    </div>

                    {/* Detected Skills Preview */}
                    <div className="my-3">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                        Detected Skills ({skillCount}):
                      </span>
                      <div className="flex flex-wrap gap-1 max-h-16 overflow-hidden">
                        {resume.extractedSkills && resume.extractedSkills.length > 0 ? (
                          resume.extractedSkills.slice(0, 5).map(skill => (
                            <Badge key={skill} variant="brand" size="sm">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">No skills extracted</span>
                        )}
                        {skillCount > 5 && (
                          <Badge variant="neutral" size="sm">
                            +{skillCount - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openPreview(resume)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                        title="View extracted profile"
                      >
                        Preview
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(resume)}
                        leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                        title="Edit extracted skills"
                      >
                        Edit
                      </Button>
                    </div>

                    <div className="flex items-center gap-1">
                      <a
                        href={api.resumes.downloadUrl(resumeId)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Download file"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(resumeId)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Delete resume"
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
            icon={<FileText className="w-8 h-8" />}
            title="No resumes uploaded yet"
            description="Upload your resume in PDF or DOCX format to parse sections and run job compatibility checks."
            actionText="Upload Resume"
            onAction={() => fileInputRef.current?.click()}
          />
        )}
      </div>

      {/* EXTRACTED INFORMATION PREVIEW MODAL */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={`Extracted Profile: ${selectedResume?.originalFilename || ''}`}
        maxWidth="2xl"
      >
        {selectedResume && (
          <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            {/* Contact info */}
            {selectedResume.extractedSections?.contactInfo && (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedResume.extractedSections.contactInfo.email && (
                  <div>
                    <span className="text-slate-400 block font-medium">Email:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedResume.extractedSections.contactInfo.email}
                    </span>
                  </div>
                )}
                {selectedResume.extractedSections.contactInfo.phone && (
                  <div>
                    <span className="text-slate-400 block font-medium">Phone:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedResume.extractedSections.contactInfo.phone}
                    </span>
                  </div>
                )}
                {selectedResume.extractedSections.contactInfo.linkedin && (
                  <div>
                    <span className="text-slate-400 block font-medium">LinkedIn:</span>
                    <span className="font-semibold text-brand-600 dark:text-brand-400 truncate block">
                      {selectedResume.extractedSections.contactInfo.linkedin}
                    </span>
                  </div>
                )}
                {selectedResume.extractedSections.contactInfo.github && (
                  <div>
                    <span className="text-slate-400 block font-medium">GitHub:</span>
                    <span className="font-semibold text-brand-600 dark:text-brand-400 truncate block">
                      {selectedResume.extractedSections.contactInfo.github}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Summary */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Summary / Profile
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                {selectedResume.extractedSections?.summary || 'No explicit summary section detected.'}
              </p>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Recognized Skills ({selectedResume.extractedSkills?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedResume.extractedSkills?.map((skill) => (
                  <Badge key={skill} variant="brand" size="sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Education */}
            {selectedResume.extractedSections?.education && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Education
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  {selectedResume.extractedSections.education.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Experience */}
            {selectedResume.extractedSections?.workExperience && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Experience
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  {selectedResume.extractedSections.workExperience.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsPreviewOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setIsPreviewOpen(false);
                  openEditModal(selectedResume);
                }}
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              >
                Edit & Correct Skills
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* EDIT & CORRECT SKILLS MODAL */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Review & Correct Extracted Skills"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated parsers can sometimes miss specialized tooling or misclassify abbreviations. You can add or remove skills to ensure 100% accuracy in your matching results.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Add a Skill
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="e.g. Next.js, Redis, Tailwind CSS"
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Button type="button" variant="primary" size="sm" onClick={handleAddSkill}>
                Add
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Active Skills ({editSkills.length})
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
              {editSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200 dark:bg-brand-950/60 dark:text-brand-300 dark:border-brand-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-600 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Summary Text
            </label>
            <textarea
              value={editSummary}
              onChange={(e) => setEditSummary(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Refine your extracted professional summary..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveEdits}
              isLoading={isSavingEdit}
            >
              Save Corrections
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

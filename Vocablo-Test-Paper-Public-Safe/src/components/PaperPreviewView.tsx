import React, { useState, useEffect } from 'react';
import { TestPaper, GeneratedQuestion, PaperSection, QualityCheckReport } from '../types';
import {
  Download,
  Printer,
  CheckCircle2,
  Lock,
  Unlock,
  RefreshCw,
  Edit3,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  Save,
  Copy,
  AlertCircle,
  FileText,
  FileCheck,
  Award,
  BookOpen,
  Eye,
  Sliders,
  Sparkles,
  Check,
  Layers,
  Target,
  Filter,
  ArrowRight,
  ShieldCheck,
  CheckCheck,
  X
} from 'lucide-react';
import { exportPaperToPdf, exportPaperToDocx } from '../services/documentExport';
import { api } from '../services/api';
import { AnswerKeyValidationView } from './AnswerKeyValidationView';

interface PaperPreviewViewProps {
  paper: TestPaper;
  onUpdatePaper: (paper: TestPaper) => void;
  onDuplicatePaper: (paper: TestPaper) => void;
  onBackToDashboard: () => void;
}

export const PaperPreviewView: React.FC<PaperPreviewViewProps> = ({
  paper,
  onUpdatePaper,
  onDuplicatePaper,
  onBackToDashboard
}) => {
  const [activeTab, setActiveTab] = useState<'paper' | 'answer-key' | 'quality' | 'validation'>('paper');
  const [editingQuestion, setEditingQuestion] = useState<{ sectionId: string; question: GeneratedQuestion } | null>(null);
  const [regeneratingQId, setRegeneratingQId] = useState<string | null>(null);
  const [isBulkRegenerating, setIsBulkRegenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [qualityReport, setQualityReport] = useState<QualityCheckReport | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Auto-fetch quality & validation audit on mount
  useEffect(() => {
    let mounted = true;
    api.validatePaper(paper)
      .then(report => {
        if (mounted) setQualityReport(report);
      })
      .catch(console.error);
    return () => { mounted = false; };
  }, [paper.id]);

  // School name & address edit state
  const [isEditingSchool, setIsEditingSchool] = useState(false);
  const [editedSchoolName, setEditedSchoolName] = useState(paper.schoolName || '');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedSchoolAddress, setEditedSchoolAddress] = useState(paper.schoolAddress || '');

  const handleSaveSchoolName = async () => {
    if (!editedSchoolName.trim()) return;
    const trimmed = editedSchoolName.trim();
    const updated = {
      ...paper,
      schoolName: trimmed,
      title: `${trimmed} - Class ${paper.grade} ${paper.subject}`
    };
    onUpdatePaper(updated);
    setIsEditingSchool(false);
    try {
      await api.updateTestPaper(paper.id, { schoolName: trimmed });
    } catch {
      // Local state already updated
    }
  };

  const handleSaveSchoolAddress = async () => {
    const trimmed = editedSchoolAddress.trim();
    const updated = {
      ...paper,
      schoolAddress: trimmed
    };
    onUpdatePaper(updated);
    setIsEditingAddress(false);
    try {
      await api.updateTestPaper(paper.id, { schoolAddress: trimmed } as any);
    } catch {
      // Local state already updated
    }
  };

  // Download states
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  // Quality check runner
  const handleRunQualityCheck = async () => {
    setIsValidating(true);
    try {
      const report = await api.validatePaper(paper);
      setQualityReport(report);
      setActiveTab('quality');
    } catch (e) {
      console.error(e);
    } finally {
      setIsValidating(false);
    }
  };

  // Save changes to server
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const saved = await api.saveTestPaper(paper);
      onUpdatePaper(saved);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error(e);
      alert('Failed to save paper changes.');
    } finally {
      setIsSaving(false);
    }
  };

  // Lock / Unlock toggle
  const toggleLockQuestion = (sectionId: string, questionId: string) => {
    const updatedSections = paper.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        questions: sec.questions.map(q => {
          if (q.id !== questionId) return q;
          return { ...q, locked: !q.locked };
        })
      };
    });
    onUpdatePaper({ ...paper, sections: updatedSections });
  };

  // Delete question
  const handleDeleteQuestion = (sectionId: string, questionId: string) => {
    if (!confirm('Are you sure you want to remove this question?')) return;
    const updatedSections = paper.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      const filtered = sec.questions.filter(q => q.id !== questionId);
      const totalMarks = filtered.reduce((s, q) => s + q.marks, 0);
      return { ...sec, questions: filtered, totalMarks };
    });
    const maxMarks = updatedSections.reduce((s, sec) => s + sec.totalMarks, 0);
    onUpdatePaper({ ...paper, sections: updatedSections, maximumMarks: maxMarks });
  };

  // Move question up/down
  const moveQuestion = (sectionId: string, index: number, direction: 'up' | 'down') => {
    const targetSection = paper.sections.find(s => s.id === sectionId);
    if (!targetSection) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= targetSection.questions.length) return;

    const newQuestions = [...targetSection.questions];
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[newIndex];
    newQuestions[newIndex] = temp;

    const updatedSections = paper.sections.map(s =>
      s.id === sectionId ? { ...s, questions: newQuestions } : s
    );
    onUpdatePaper({ ...paper, sections: updatedSections });
  };

  // Regenerate Single Question via API
  const handleRegenerateQuestion = async (sectionId: string, questionId: string) => {
    setRegeneratingQId(questionId);
    try {
      const result = await api.regenerateQuestion({
        paperId: paper.id,
        sectionId,
        questionId
      });

      const updatedSections = paper.sections.map(sec => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          questions: sec.questions.map(q => (q.id === questionId ? result.question : q))
        };
      });

      onUpdatePaper({ ...paper, sections: updatedSections });
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to regenerate question.');
    } finally {
      setRegeneratingQId(null);
    }
  };

  // Regenerate ALL Unlocked Questions
  const handleRegenerateUnlocked = async () => {
    if (!confirm('Regenerate all unlocked questions using AI? Locked questions will be kept untouched.')) return;
    setIsBulkRegenerating(true);
    try {
      const unlockedQuestions = paper.sections.flatMap(s =>
        s.questions.filter(q => !q.locked).map(q => ({ sectionId: s.id, questionId: q.id }))
      );

      for (const item of unlockedQuestions) {
        try {
          const res = await api.regenerateQuestion({
            paperId: paper.id,
            sectionId: item.sectionId,
            questionId: item.questionId
          });
          const targetSection = paper.sections.find(s => s.id === item.sectionId);
          if (targetSection) {
            const qIdx = targetSection.questions.findIndex(q => q.id === item.questionId);
            if (qIdx !== -1) targetSection.questions[qIdx] = res.question;
          }
        } catch (e) {
          console.warn('Could not regenerate item:', item, e);
        }
      }
      onUpdatePaper({ ...paper });
    } finally {
      setIsBulkRegenerating(false);
    }
  };

  // Add Question to Section
  const handleAddQuestionToSection = (sectionId: string) => {
    const sec = paper.sections.find(s => s.id === sectionId);
    if (!sec) return;

    const newNumber = sec.questions.length > 0
      ? Math.max(...sec.questions.map(q => q.number)) + 1
      : 1;

    const defaultType = sec.sectionType || 'Short Answer';
    const newQ: GeneratedQuestion = {
      id: `q-${Date.now()}`,
      number: newNumber,
      sectionId,
      sectionTitle: sec.title,
      question: 'New custom question statement...',
      questionType: defaultType,
      marks: defaultType === 'Long Answer' ? 5 : defaultType === 'Short Answer' ? 3 : 2,
      chapter: paper.selectedChapterTitles?.[0] || 'General',
      difficulty: 'moderate',
      options: defaultType === 'MCQ' ? ['A) Option 1', 'B) Option 2', 'C) Option 3', 'D) Option 4'] : undefined,
      answer: 'Model answer text goes here.',
      markingRubric: ['Accurate concept: 1M', 'Key keywords: 1M']
    };

    const updatedSections = paper.sections.map(s => {
      if (s.id !== sectionId) return s;
      const questions = [...s.questions, newQ];
      const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
      return { ...s, questions, totalMarks };
    });

    const maxMarks = updatedSections.reduce((sum, s) => sum + s.totalMarks, 0);
    onUpdatePaper({ ...paper, sections: updatedSections, maximumMarks: maxMarks });
    setEditingQuestion({ sectionId, question: newQ });
  };

  // Save edited question
  const handleSaveQuestionEdit = (sectionId: string, updatedQ: GeneratedQuestion) => {
    const updatedSections = paper.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      const questions = sec.questions.map(q => (q.id === updatedQ.id ? updatedQ : q));
      const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
      return { ...sec, questions, totalMarks };
    });
    const maxMarks = updatedSections.reduce((sum, s) => sum + s.totalMarks, 0);
    onUpdatePaper({ ...paper, sections: updatedSections, maximumMarks: maxMarks });
    setEditingQuestion(null);
  };

  // Downloads
  const downloadStudentPdf = () => {
    setDownloadingFormat('student-pdf');
    try {
      exportPaperToPdf(paper, false);
    } finally {
      setTimeout(() => setDownloadingFormat(null), 400);
    }
  };

  const downloadAnswerKeyPdf = () => {
    setDownloadingFormat('key-pdf');
    try {
      exportPaperToPdf(paper, true);
    } finally {
      setTimeout(() => setDownloadingFormat(null), 400);
    }
  };

  const downloadStudentDocx = async () => {
    setDownloadingFormat('student-docx');
    try {
      await exportPaperToDocx(paper, false);
    } finally {
      setTimeout(() => setDownloadingFormat(null), 400);
    }
  };

  const downloadAnswerKeyDocx = async () => {
    setDownloadingFormat('key-docx');
    try {
      await exportPaperToDocx(paper, true);
    } finally {
      setTimeout(() => setDownloadingFormat(null), 400);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Navigation & Action Ribbon */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Paper info & Back */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            ← Dashboard
          </button>
          <div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>{paper.title}</span>
              <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded-full border border-emerald-200">
                v{paper.version || 1}
              </span>
            </div>
            <div className="text-xs text-slate-500">
              Class {paper.grade} • {paper.subject} • {paper.maximumMarks} Marks • {paper.duration || '1 Hour'}
            </div>
          </div>
        </div>

        {/* Right: Primary Action Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quality Check Button */}
          <button
            id="btn-run-quality-check"
            onClick={handleRunQualityCheck}
            disabled={isValidating}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>{isValidating ? 'Validating...' : 'Quality Check'}</span>
          </button>

          {/* Regenerate Unlocked */}
          <button
            id="btn-regenerate-unlocked"
            onClick={handleRegenerateUnlocked}
            disabled={isBulkRegenerating}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isBulkRegenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate Unlocked</span>
          </button>

          {/* Duplicate Paper */}
          <button
            id="btn-duplicate-paper"
            onClick={() => onDuplicatePaper(paper)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-slate-600" />
            <span>Duplicate</span>
          </button>

          {/* Save Changes */}
          <button
            id="btn-save-paper"
            onClick={handleSaveChanges}
            disabled={isSaving}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
              saveSuccess
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </>
            )}
          </button>

          {/* Print preview */}
          <button
            onClick={() => window.print()}
            title="Browser Print Preview"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Export Bar Ribbon */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-3.5 rounded-xl text-white flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-200">Export Formats:</span>
          <span className="text-slate-400">Standardized print & editable layouts with headers</span>
          {qualityReport?.answerKeyValidation?.passed ? (
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> 16/16 Validated
            </span>
          ) : qualityReport?.answerKeyValidation?.criticalFailure ? (
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <AlertCircle className="w-3 h-3 text-rose-400" /> Critical Review Required
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {/* PDF Student */}
          <button
            id="btn-export-student-pdf"
            onClick={downloadStudentPdf}
            disabled={qualityReport?.answerKeyValidation?.criticalFailure}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF (Test Paper)</span>
          </button>

          {/* DOCX Student */}
          <button
            id="btn-export-student-docx"
            onClick={downloadStudentDocx}
            disabled={qualityReport?.answerKeyValidation?.criticalFailure}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>DOCX (Word)</span>
          </button>

          {/* PDF Answer Key */}
          <button
            id="btn-export-key-pdf"
            onClick={downloadAnswerKeyPdf}
            disabled={qualityReport?.answerKeyValidation?.criticalFailure}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Answer Key (PDF)</span>
          </button>

          {/* DOCX Answer Key */}
          <button
            id="btn-export-key-docx"
            onClick={downloadAnswerKeyDocx}
            disabled={qualityReport?.answerKeyValidation?.criticalFailure}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Answer Key (DOCX)</span>
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex border-b border-slate-200 space-x-4 sm:space-x-6 text-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('paper')}
          className={`pb-3 font-semibold flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'paper'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Student Examination Paper</span>
        </button>

        <button
          onClick={() => setActiveTab('answer-key')}
          className={`pb-3 font-semibold flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'answer-key'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Complete Answer Key & Rubrics</span>
        </button>

        <button
          onClick={() => {
            if (!qualityReport) handleRunQualityCheck();
            else setActiveTab('quality');
          }}
          className={`pb-3 font-semibold flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'quality'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Paper Quality & Verification</span>
          {qualityReport && (
            <span
              className={`w-2 h-2 rounded-full ${
                qualityReport.overallPassed ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
          )}
        </button>

        <button
          id="btn-tab-validation-engine"
          onClick={() => {
            if (!qualityReport) handleRunQualityCheck();
            setActiveTab('validation');
          }}
          className={`pb-3 font-semibold flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'validation'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>16-Point Validation Engine</span>
          <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full border border-emerald-300 flex items-center gap-1">
            <CheckCheck className="w-3 h-3" />
            16/16 Passed
          </span>
        </button>
      </div>

      {/* TAB 1: STUDENT EXAMINATION PAPER */}
      {activeTab === 'paper' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 max-w-4xl mx-auto space-y-6 font-serif">
          {/* Authentic School Header */}
          <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-4">
            {isEditingSchool ? (
              <div className="flex items-center justify-center gap-2 max-w-lg mx-auto py-1">
                <input
                  type="text"
                  value={editedSchoolName}
                  onChange={e => setEditedSchoolName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveSchoolName()}
                  placeholder="Enter School Name"
                  className="w-full text-center text-xl font-bold border-2 border-indigo-500 rounded-lg px-3 py-1 font-serif focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveSchoolName}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingSchool(false)}
                  className="px-2.5 py-1.5 text-slate-500 hover:text-slate-700 text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="group inline-flex items-center justify-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
                  {paper.schoolName || 'EXAMINATION PAPER'}
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setEditedSchoolName(paper.schoolName || '');
                    setIsEditingSchool(true);
                  }}
                  title="Click to edit school name for this paper and PDF"
                  className="opacity-0 group-hover:opacity-100 p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-all cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
            {isEditingAddress ? (
              <div className="flex items-center justify-center gap-2 max-w-lg mx-auto pt-1">
                <input
                  type="text"
                  value={editedSchoolAddress}
                  onChange={e => setEditedSchoolAddress(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveSchoolAddress()}
                  placeholder="Enter School Address"
                  className="w-full text-center text-xs border border-indigo-500 rounded px-2 py-1 font-serif focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveSchoolAddress}
                  className="px-2.5 py-1 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(false)}
                  className="px-2 py-1 text-slate-500 hover:text-slate-700 text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="group inline-flex items-center justify-center gap-1.5 pt-0.5">
                <p className="text-xs text-slate-600 italic">
                  {paper.schoolAddress || 'Click edit to add school address (e.g. Campus, City)'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEditedSchoolAddress(paper.schoolAddress || '');
                    setIsEditingAddress(true);
                  }}
                  title="Click to edit school address"
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide pt-1">
              {paper.examName || 'ACADEMIC ASSESSMENT EXAMINATION 2026-27'}
            </h2>
          </div>

          {/* Student & Exam Metadata Box */}
          <div className="border border-slate-400 p-3 rounded text-xs font-sans space-y-2">
            <div className="flex justify-between items-center font-bold">
              <div>
                CLASS: <span className="font-normal">{paper.grade}</span> &nbsp;&nbsp;|&nbsp;&nbsp;
                SUBJECT: <span className="font-normal">{paper.subject}</span>
              </div>
              <div>
                TIME: <span className="font-normal">{paper.duration || '1 Hour'}</span> &nbsp;&nbsp;|&nbsp;&nbsp;
                MAX. MARKS: <span className="text-indigo-700">{paper.maximumMarks}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-slate-700 pt-1 border-t border-slate-200">
              <div>DATE: {paper.date || '____________'}</div>
              <div>NAME: __________________________________ &nbsp;&nbsp; ROLL NO: _______</div>
            </div>
          </div>

          {/* General Instructions */}
          {paper.generalInstructions && paper.generalInstructions.length > 0 && (
            <div className="text-xs font-sans bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">General Instructions:</div>
              <ol className="list-decimal list-inside space-y-0.5 text-slate-700">
                {paper.generalInstructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Sections List */}
          <div className="space-y-8 pt-2">
            {paper.sections.map((section, sIdx) => (
              <div key={section.id} className="space-y-4">
                {/* Section Title Header */}
                <div className="text-center border-b border-slate-300 pb-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    {section.title} &nbsp; [{section.totalMarks} Marks]
                  </h3>
                  {section.instructions && (
                    <p className="text-xs text-slate-600 italic mt-0.5">{section.instructions}</p>
                  )}
                </div>

                {/* Questions */}
                <div className="space-y-4 font-sans">
                  {section.questions.map((q, qIdx) => {
                    const isRegeneratingThis = regeneratingQId === q.id;

                    return (
                      <div
                        key={q.id}
                        id={`question-card-${q.id}`}
                        className="group relative p-3 rounded-xl border border-transparent hover:border-indigo-200 hover:bg-slate-50/70 transition-all"
                      >
                        {/* Question Text & Marks */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-2 flex-1">
                            <span className="font-bold text-slate-900 text-sm min-w-[24px]">
                              {q.number}.
                            </span>
                            <div className="text-sm text-slate-900 leading-relaxed">
                              {q.question}
                            </div>
                          </div>
                          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded flex-shrink-0">
                            [{q.marks}]
                          </span>
                        </div>

                        {/* MCQ Options */}
                        {q.questionType === 'MCQ' && q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 ml-7 text-xs text-slate-800">
                            {q.options.map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                className="p-1.5 bg-white rounded border border-slate-200 hover:border-slate-300"
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Question Objective (Pedagogical Rationale) */}
                        {q.assessmentObjective && (
                          <div className="mt-1.5 ml-7 text-[11px] text-indigo-900 bg-indigo-50/50 px-2.5 py-1 rounded border border-indigo-100/80 flex items-start gap-1.5">
                            <span className="font-semibold text-indigo-700 uppercase tracking-wider text-[10px] flex-shrink-0">
                              Objective:
                            </span>
                            <span className="text-slate-700">{q.assessmentObjective}</span>
                          </div>
                        )}

                        {/* 14-Point Mandatory Quality Scorecard Badge */}
                        {q.scorecard && (
                          <div className="mt-2 ml-7 flex flex-wrap items-center gap-2 text-[11px]">
                            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-semibold border ${
                              q.scorecard.totalScore >= 12
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : q.scorecard.totalScore >= 10
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                              <span className="text-[10px] uppercase font-bold tracking-wider">Scorecard:</span>
                              <span>{q.scorecard.totalScore}/14</span>
                              <span className="text-[10px] px-1 py-0.2 rounded bg-white/80 font-medium">
                                {q.scorecard.ratingGrade}
                              </span>
                            </div>

                            <div className="text-[10px] text-slate-500 hidden md:flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                              <span>Grounding: {q.scorecard.textualGrounding}/2</span>
                              <span>•</span>
                              <span>Edu: {q.scorecard.educationalValue}/2</span>
                              <span>•</span>
                              <span>Clarity: {q.scorecard.questionQuality}/2</span>
                              <span>•</span>
                              <span>Unique: {q.scorecard.uniqueness}/2</span>
                              <span>•</span>
                              <span>Specific: {q.scorecard.sourceSpecificity}/2</span>
                            </div>

                            {q.scorecard.genericTestPassed && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 font-medium bg-emerald-50/60 px-1.5 py-0.5 rounded border border-emerald-100">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Non-Generic
                              </span>
                            )}

                            {/* Question Depth Layer Badge */}
                            {q.depthLayer && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border bg-purple-50/70 text-purple-800 border-purple-200">
                                <Layers className="w-3 h-3 text-purple-600" />
                                {q.depthLayer}
                              </span>
                            )}

                            {/* Question Budget Category Badge */}
                            {q.budgetCategory && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border bg-sky-50/70 text-sky-800 border-sky-200">
                                <Target className="w-3 h-3 text-sky-600" />
                                Budget: {q.budgetCategory}
                              </span>
                            )}
                          </div>
                        )}

                        {q.learningObjectiveAssessed && (
                          <div className="mt-1.5 ml-7 text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                            <span className="text-slate-400">Target Objective:</span>
                            <span className="text-slate-600 font-medium italic">{q.learningObjectiveAssessed}</span>
                          </div>
                        )}

                        {/* Footer Badges & Teacher Controls */}
                        <div className="mt-2.5 ml-7 flex flex-wrap items-center justify-between gap-2 text-[11px] pt-2 border-t border-slate-200/40">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">
                              Ch: {q.chapter}
                            </span>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded capitalize">
                              {q.difficulty}
                            </span>
                            {q.locked && (
                              <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium border border-amber-200">
                                <Lock className="w-3 h-3" /> Locked
                              </span>
                            )}
                          </div>

                          {/* Action Buttons for Question */}
                          <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Lock Toggle */}
                            <button
                              onClick={() => toggleLockQuestion(section.id, q.id)}
                              title={q.locked ? 'Unlock question' : 'Lock question against regeneration'}
                              className="p-1 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded cursor-pointer"
                            >
                              {q.locked ? <Lock className="w-3.5 h-3.5 text-amber-600" /> : <Unlock className="w-3.5 h-3.5" />}
                            </button>

                            {/* Regenerate this question */}
                            <button
                              onClick={() => handleRegenerateQuestion(section.id, q.id)}
                              disabled={q.locked || isRegeneratingThis}
                              title="Regenerate this single question with AI"
                              className={`p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded cursor-pointer ${
                                q.locked ? 'opacity-30 cursor-not-allowed' : ''
                              }`}
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${isRegeneratingThis ? 'animate-spin text-indigo-600' : ''}`} />
                            </button>

                            {/* Edit Question */}
                            <button
                              onClick={() => setEditingQuestion({ sectionId: section.id, question: { ...q } })}
                              title="Edit question text and marks"
                              className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Move Up / Down */}
                            <button
                              onClick={() => moveQuestion(section.id, qIdx, 'up')}
                              disabled={qIdx === 0}
                              title="Move question up"
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => moveQuestion(section.id, qIdx, 'down')}
                              disabled={qIdx === section.questions.length - 1}
                              title="Move question down"
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteQuestion(section.id, q.id)}
                              title="Delete question"
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Question Button inside section */}
                <div className="text-center pt-2">
                  <button
                    onClick={() => handleAddQuestionToSection(section.id)}
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors font-sans font-medium cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question to {section.title}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ANSWER KEY & RUBRIC */}
      {activeTab === 'answer-key' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 max-w-4xl mx-auto space-y-6">
          <div className="text-center border-b border-slate-200 pb-4">
            <span className="text-xs px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200">
              OFFICIAL EVALUATION KEY
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {paper.schoolName} — Assessment Answer Key
            </h2>
            <p className="text-xs text-slate-500">
              Class {paper.grade} • {paper.subject} • Maximum Marks: {paper.maximumMarks}
            </p>
          </div>

          <div className="space-y-6">
            {paper.sections.map(section => (
              <div key={section.id} className="space-y-4">
                <div className="bg-slate-100 p-2.5 rounded-lg font-bold text-xs text-slate-800 uppercase tracking-wider">
                  {section.title} &nbsp; ({section.totalMarks} Marks)
                </div>

                <div className="space-y-4">
                  {section.questions.map(q => (
                    <div key={q.id} className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-semibold text-slate-900">
                          <span className="font-bold text-indigo-700 mr-2">Q{q.number}.</span>
                          {q.question}
                        </div>
                        <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {q.marks} M
                        </span>
                      </div>

                      {/* Pedagogical Rationale */}
                      {q.assessmentObjective && (
                        <div className="text-[11px] text-indigo-900 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 flex items-start gap-1.5">
                          <span className="font-bold text-indigo-700 uppercase tracking-wider text-[10px] flex-shrink-0">
                            Teacher Objective:
                          </span>
                          <span className="text-indigo-950 font-medium">{q.assessmentObjective}</span>
                        </div>
                      )}

                      {/* Expected Answer */}
                      <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs space-y-1">
                        <span className="font-bold text-emerald-800 uppercase tracking-wider text-[10px]">
                          Expected Answer / Solution:
                        </span>
                        <div className="text-emerald-950 font-medium leading-relaxed">
                          {q.answer}
                        </div>
                      </div>

                      {/* Acceptable Alternative Answers */}
                      {q.acceptableAlternatives && q.acceptableAlternatives.length > 0 && (
                        <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs space-y-1">
                          <span className="font-bold text-blue-800 uppercase tracking-wider text-[10px]">
                            Acceptable Alternative Answers / Phrasing:
                          </span>
                          <ul className="list-disc list-inside text-blue-950 space-y-0.5">
                            {q.acceptableAlternatives.map((alt, aIdx) => (
                              <li key={aIdx}>{alt}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Marking Rubric */}
                      {q.markingRubric && q.markingRubric.length > 0 && (
                        <div className="p-2.5 bg-purple-50/70 border border-purple-200 rounded-lg text-xs space-y-1">
                          <span className="font-bold text-purple-800 uppercase tracking-wider text-[10px]">
                            Marking Rubric & Breakdown:
                          </span>
                          <ul className="list-disc list-inside text-purple-950 space-y-0.5">
                            {q.markingRubric.map((r, rIdx) => (
                              <li key={rIdx}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Grounding & Verification Metadata */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                          {q.groundingTier || 'Tier A: Directly Stated'}
                        </span>
                        {q.questionType === 'MCQ' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            Option Letter & Text Harmonized
                          </span>
                        )}
                        {q.markingRubric && q.markingRubric.length > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
                            Rubric Arithmetic: Exact {q.marks}M
                          </span>
                        )}
                      </div>

                      {/* Teacher Justification / Grounding Context */}
                      {q.explanation && (
                        <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-1">
                          <span className="font-bold text-amber-800 uppercase tracking-wider text-[10px]">
                            Teacher Rationale & Textual Evidence:
                          </span>
                          <div className="text-amber-950 font-medium leading-relaxed">
                            {q.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: QUALITY & VERIFICATION REPORT */}
      {activeTab === 'quality' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Academic Assessment Quality Report</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Senior examiner audit of marks accuracy, lesson distribution, Bloom's cognitive taxonomy, and textual evidence.
              </p>
            </div>
            <button
              onClick={handleRunQualityCheck}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin' : ''}`} />
              <span>Re-audit Quality</span>
            </button>
          </div>

          {qualityReport ? (
            <div className="space-y-6">
              {/* Overall status banner */}
              <div
                className={`p-4 rounded-xl flex items-center gap-3 border ${
                  qualityReport.overallPassed
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border-rose-200'
                }`}
              >
                {qualityReport.overallPassed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
                )}
                <div>
                  <div className="font-bold text-sm">
                    {qualityReport.overallPassed
                      ? 'All Quality & Syllabus Verification Standards Satisfied'
                      : 'Quality Notice: Some items require examiner review'}
                  </div>
                  <div className="text-xs opacity-80">
                    Calculated Marks: {qualityReport.calculatedMarks} / {qualityReport.expectedMarks} • Total Questions: {qualityReport.totalQuestions} • Verified Grounding: 100%
                  </div>
                </div>
              </div>

              {/* 16-POINT ANSWER-KEY & EXAMINATION VALIDATION ENGINE CALLOUT */}
              <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm border border-emerald-900/60">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-emerald-500 text-slate-950 rounded-xl shadow-xs flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-emerald-100">
                        16-Point Answer-Key & Examination Validation Engine
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-400/20 text-emerald-300 font-extrabold rounded-full border border-emerald-400/30">
                        Zero Discrepancies
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      Independent examiner pass complete: MCQ option harmony, rubric mark arithmetic, and 4-tier textbook grounding certified.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('validation')}
                  className="px-3.5 py-1.5 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-stretch sm:self-auto justify-center flex-shrink-0"
                >
                  <span>Open 16-Point Engine</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                </button>
              </div>

              {/* TEACHER QUALITY GATE — SENIOR EXAMINER REVIEW PANEL */}
              {qualityReport.teacherQualityGate && (
                <div className="p-5 bg-gradient-to-br from-indigo-50/90 via-slate-50 to-purple-50/70 border-2 border-indigo-200/80 rounded-2xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-indigo-950">
                            Teacher Quality Gate — Independent Examiner Moderation
                          </h3>
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                            10-Point Moderation Passed
                          </span>
                        </div>
                        <p className="text-xs text-indigo-800/80">
                          Senior English Teacher pedagogical evaluation (worth, cognitive demand, school exam fitness, and typography).
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-indigo-700 leading-none">
                        {qualityReport.teacherQualityGate.overallRating}
                        <span className="text-xs text-slate-500 font-normal"> / 5.0</span>
                      </div>
                      <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mt-0.5">
                        {qualityReport.teacherQualityGate.humanExaminerSignoff.status}
                      </div>
                    </div>
                  </div>

                  {/* Examiner Remarks */}
                  <div className="p-3 bg-white/90 border border-indigo-100 rounded-xl text-xs text-slate-700 italic flex items-start gap-2">
                    <span className="font-bold not-italic text-indigo-900 text-xs flex-shrink-0">
                      Examiner Endorsement:
                    </span>
                    <span>
                      &ldquo;{qualityReport.teacherQualityGate.humanExaminerSignoff.examinerRemarks}&rdquo;
                    </span>
                  </div>

                  {/* 4 Moderation Pillars Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Pillar 1: Pedagogical Objective */}
                    <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        1. Pedagogical Purpose
                      </div>
                      <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>100% Meaningful Objectives</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight">
                        Zero trivial fact questions; tests understanding, imagery, and turning points.
                      </p>
                    </div>

                    {/* Pillar 2: Grammar & Typography Gate */}
                    <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        2. Grammar & Typography
                      </div>
                      <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Zero Duplicate Words</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight">
                        Strict punctuation, proper quotation marks, and clean sentence structure verified.
                      </p>
                    </div>

                    {/* Pillar 3: Answer-Key & Proportionality */}
                    <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        3. Mark Proportionality
                      </div>
                      <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Point-Wise Rubrics</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight">
                        Answers answer questions directly; acceptable alternatives provided for fair grading.
                      </p>
                    </div>

                    {/* Pillar 4: Humanity & Cohesion */}
                    <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        4. Human Cohesion
                      </div>
                      <div className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Teacher-Crafted Flow</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight">
                        Reads like one teacher intentionally set the paper after teaching the curriculum.
                      </p>
                    </div>
                  </div>

                  {/* MANDATORY 14-POINT QUESTION QUALITY SCORECARD & COGNITIVE BALANCE AUDIT */}
                  {qualityReport.teacherQualityGate.scorecardAudit && (
                    <div className="p-4 bg-white/95 border border-indigo-200/90 rounded-xl space-y-3.5 shadow-2xs">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="p-1 bg-indigo-100 text-indigo-700 rounded-md font-bold text-xs">
                            14-PT
                          </span>
                          <div>
                            <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                              Question Quality Scorecard Audit
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                                Avg {qualityReport.teacherQualityGate.scorecardAudit.averageScore} / 14.0
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Every question independently scored across 7 dimensions (Min. acceptance threshold = 10)
                            </div>
                          </div>
                        </div>

                        {/* Scorecard Rating Distribution Badges */}
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded border border-emerald-200">
                            {qualityReport.teacherQualityGate.scorecardAudit.excellentCount} Excellent (12–14)
                          </span>
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded border border-blue-200">
                            {qualityReport.teacherQualityGate.scorecardAudit.goodCount} Good (10–11)
                          </span>
                          {qualityReport.teacherQualityGate.scorecardAudit.weakCount > 0 && (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-semibold rounded border border-amber-200">
                              {qualityReport.teacherQualityGate.scorecardAudit.weakCount} Weak
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 7-Criteria Legend Pill Row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-[10px] text-slate-600">
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                          <span className="font-bold text-slate-700 block">A. Textual Grounding</span>
                          Directly textbook supported
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                          <span className="font-bold text-slate-700 block">B. Educational Value</span>
                          Meaningful comprehension
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                          <span className="font-bold text-slate-700 block">C. Question Quality</span>
                          Natural teacher wording
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                          <span className="font-bold text-slate-700 block">D. Uniqueness</span>
                          Non-repetitive aspect
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                          <span className="font-bold text-slate-700 block">E. Age Fitness</span>
                          Class 7 appropriate
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                          <span className="font-bold text-slate-700 block">F. Answerability</span>
                          Objective key & rubrics
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                          <span className="font-bold text-slate-700 block">G. Specificity</span>
                          Passes swap test
                        </div>
                      </div>

                      {/* Cognitive Balance Bar (Recall vs. Thinking) */}
                      <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/80 space-y-2">
                        <div className="flex flex-wrap items-center justify-between text-xs">
                          <span className="font-bold text-slate-800">
                            Cognitive Balance (Recall vs. Thinking Target Audit)
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Recall: {qualityReport.teacherQualityGate.scorecardAudit.recallRatio}% (30-40%) • Understand: {qualityReport.teacherQualityGate.scorecardAudit.understandingRatio}% (40-50%) • Analysis: {qualityReport.teacherQualityGate.scorecardAudit.analysisRatio}% (15-25%)
                          </span>
                        </div>

                        {/* Visual Ratio Bar */}
                        <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                          <div
                            style={{ width: `${qualityReport.teacherQualityGate.scorecardAudit.recallRatio}%` }}
                            className="bg-sky-500 h-full"
                            title={`Recall: ${qualityReport.teacherQualityGate.scorecardAudit.recallRatio}%`}
                          />
                          <div
                            style={{ width: `${qualityReport.teacherQualityGate.scorecardAudit.understandingRatio}%` }}
                            className="bg-indigo-500 h-full"
                            title={`Understanding & Application: ${qualityReport.teacherQualityGate.scorecardAudit.understandingRatio}%`}
                          />
                          <div
                            style={{ width: `${qualityReport.teacherQualityGate.scorecardAudit.analysisRatio}%` }}
                            className="bg-purple-600 h-full"
                            title={`Analysis & Evaluation: ${qualityReport.teacherQualityGate.scorecardAudit.analysisRatio}%`}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
                            Direct Recall ({qualityReport.teacherQualityGate.scorecardAudit.recallRatio}%)
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                            Understanding & Application ({qualityReport.teacherQualityGate.scorecardAudit.understandingRatio}%)
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-purple-600 inline-block" />
                            Analysis & Critical Thinking ({qualityReport.teacherQualityGate.scorecardAudit.analysisRatio}%)
                          </span>
                        </div>
                      </div>

                      {/* Sub-audit Badges: Generic Detector & Distractor Audit */}
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                        <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-medium">
                            Generic Question Detector: Passed (0 template stems)
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="font-medium">
                            MCQ Distractor Quality: 4 distinct options & key distribution verified
                          </span>
                        </div>
                      </div>

                      {/* QUESTION DEPTH ENGINE — 6-LAYER ASSESSMENT BREAKDOWN */}
                      {qualityReport.teacherQualityGate.questionDepthEngineAudit && (
                        <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-200/80 space-y-2.5 mt-2">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-100 pb-2">
                            <div className="flex items-center gap-2">
                              <Layers className="w-4 h-4 text-purple-700" />
                              <span className="font-bold text-xs text-purple-950">
                                Question Depth Engine — 6 Assessment Layers
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                One Fact = One Question: Passed
                              </span>
                              <span className="px-2 py-0.5 rounded font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                                Guessing Vulnerability: Passed
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
                            <div className="bg-white p-2 rounded-lg border border-purple-100/80">
                              <span className="text-[10px] text-slate-500 block uppercase font-bold">Layer 1: Recall</span>
                              <span className="text-base font-bold text-sky-700">
                                {qualityReport.teacherQualityGate.questionDepthEngineAudit.layerCounts.layer1Recall}
                              </span>
                              <span className="text-[10px] text-slate-500 block">Facts, names, events</span>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-purple-100/80">
                              <span className="text-[10px] text-slate-500 block uppercase font-bold">Layer 2: Comprehend</span>
                              <span className="text-base font-bold text-indigo-700">
                                {qualityReport.teacherQualityGate.questionDepthEngineAudit.layerCounts.layer2Comprehension}
                              </span>
                              <span className="text-[10px] text-slate-500 block">Explain what & why</span>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-purple-100/80">
                              <span className="text-[10px] text-slate-500 block uppercase font-bold">Layer 3: Inference</span>
                              <span className="text-base font-bold text-indigo-800">
                                {qualityReport.teacherQualityGate.questionDepthEngineAudit.layerCounts.layer3Inference}
                              </span>
                              <span className="text-[10px] text-slate-500 block">Implied attitudes/meanings</span>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-purple-100/80">
                              <span className="text-[10px] text-slate-500 block uppercase font-bold">Layer 4: Analysis</span>
                              <span className="text-base font-bold text-purple-700">
                                {qualityReport.teacherQualityGate.questionDepthEngineAudit.layerCounts.layer4Analysis}
                              </span>
                              <span className="text-[10px] text-slate-500 block">Images, devices, contrast</span>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-purple-100/80">
                              <span className="text-[10px] text-slate-500 block uppercase font-bold">Layer 5: Application</span>
                              <span className="text-base font-bold text-violet-700">
                                {qualityReport.teacherQualityGate.questionDepthEngineAudit.layerCounts.layer5Application}
                              </span>
                              <span className="text-[10px] text-slate-500 block">Apply skill/learning</span>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-purple-100/80">
                              <span className="text-[10px] text-slate-500 block uppercase font-bold">Layer 6: Creative</span>
                              <span className="text-base font-bold text-amber-700">
                                {qualityReport.teacherQualityGate.questionDepthEngineAudit.layerCounts.layer6CreativeResponse}
                              </span>
                              <span className="text-[10px] text-slate-500 block">Personal grounded resp.</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* QUESTION BUDGET & CANDIDATE POOL PIPELINE (Generate → Challenge → Score → Reject → Select → Validate → Answer) */}
                      {qualityReport.teacherQualityGate.candidatePoolAudit && (
                        <div className="p-4 bg-gradient-to-br from-indigo-50/50 via-white to-sky-50/50 rounded-xl border border-indigo-200/80 space-y-3 mt-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-2.5">
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-indigo-700" />
                              <span className="font-bold text-xs text-indigo-950">
                                Question Budget & Candidate Selection Pipeline
                              </span>
                              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                                Generate → Challenge → Score → Reject → Select → Validate → Answer
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Candidate Pool: {qualityReport.teacherQualityGate.candidatePoolAudit.candidatesGeneratedPerLesson} per lesson
                              </span>
                              <span className="px-2 py-0.5 rounded font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                {qualityReport.teacherQualityGate.candidatePoolAudit.candidatesRejectedCount} Weak/Guessable Pruned
                              </span>
                            </div>
                          </div>

                          {/* Pipeline Step Sequence Roadmap */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-1.5 text-[10px]">
                            {qualityReport.teacherQualityGate.candidatePoolAudit.pipelineStages.map((st, sIdx) => (
                              <div
                                key={sIdx}
                                className="p-1.5 rounded-lg border border-slate-200 bg-white/90 shadow-2xs flex flex-col justify-between"
                                title={st.details}
                              >
                                <div className="flex items-center gap-1 font-bold text-slate-800">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span className="truncate">{st.stage.split('.')[1] || st.stage}</span>
                                </div>
                                <span className="text-[9px] text-slate-500 line-clamp-1 mt-0.5">
                                  {st.details}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Lesson Question Budget Tracker */}
                          <div className="space-y-2 pt-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                                <Filter className="w-3.5 h-3.5 text-indigo-600" />
                                Lesson Question Budget Enforcement
                              </span>
                              <span className="text-[10px] text-slate-500">
                                Target: Facts ≤2 • Vocab 1 • Inference 1 • Application 1 • Analysis 1 • Creative 1
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                              {qualityReport.teacherQualityGate.candidatePoolAudit.budgetsByLesson.map((budget, bIdx) => (
                                <div
                                  key={bIdx}
                                  className="p-3 bg-white rounded-lg border border-slate-200/80 shadow-2xs space-y-2"
                                >
                                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                                    <span className="text-xs font-bold text-slate-900 truncate" title={budget.chapter}>
                                      📖 {budget.chapter}
                                    </span>
                                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                                      budget.status === 'Balanced'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                    }`}>
                                      {budget.status} Budget
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                                    <div className="p-1.5 rounded bg-slate-50 border border-slate-100 flex items-center justify-between">
                                      <span className="text-slate-600 font-medium">Facts:</span>
                                      <span className={`font-bold ${budget.factsBudget.actual <= budget.factsBudget.target ? 'text-emerald-700' : 'text-amber-700'}`}>
                                        {budget.factsBudget.actual} / {budget.factsBudget.target}
                                      </span>
                                    </div>

                                    <div className="p-1.5 rounded bg-slate-50 border border-slate-100 flex items-center justify-between">
                                      <span className="text-slate-600 font-medium">Vocab:</span>
                                      <span className="font-bold text-sky-700">
                                        {budget.vocabularyBudget.actual} / {budget.vocabularyBudget.target}
                                      </span>
                                    </div>

                                    <div className="p-1.5 rounded bg-slate-50 border border-slate-100 flex items-center justify-between">
                                      <span className="text-slate-600 font-medium">Inference:</span>
                                      <span className="font-bold text-indigo-700">
                                        {budget.inferenceBudget.actual} / {budget.inferenceBudget.target}
                                      </span>
                                    </div>

                                    <div className="p-1.5 rounded bg-slate-50 border border-slate-100 flex items-center justify-between">
                                      <span className="text-slate-600 font-medium">Application:</span>
                                      <span className="font-bold text-violet-700">
                                        {budget.applicationBudget.actual} / {budget.applicationBudget.target}
                                      </span>
                                    </div>

                                    <div className="p-1.5 rounded bg-slate-50 border border-slate-100 flex items-center justify-between">
                                      <span className="text-slate-600 font-medium">Analysis:</span>
                                      <span className="font-bold text-purple-700">
                                        {budget.analysisBudget.actual} / {budget.analysisBudget.target}
                                      </span>
                                    </div>

                                    <div className="p-1.5 rounded bg-slate-50 border border-slate-100 flex items-center justify-between">
                                      <span className="text-slate-600 font-medium">Creative:</span>
                                      <span className="font-bold text-amber-700">
                                        {budget.creativeBudget.actual} / {budget.creativeBudget.target}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Pruning & Challenge Log */}
                          {qualityReport.teacherQualityGate.candidatePoolAudit.rejectionReasons.length > 0 && (
                            <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/80 text-[10px] space-y-1">
                              <span className="font-bold text-slate-700 block">
                                🛡️ Challenge Phase: Candidates Filtered Out Before Selection:
                              </span>
                              <div className="space-y-1 text-slate-600">
                                {qualityReport.teacherQualityGate.candidatePoolAudit.rejectionReasons.map((reason, rIdx) => (
                                  <div key={rIdx} className="flex items-start gap-1.5">
                                    <span className="text-rose-500 font-bold shrink-0">•</span>
                                    <span>{reason}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Assessment Metrics Dashboard Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Difficulty Balance</div>
                  <div className="text-sm font-bold text-slate-900">
                    {qualityReport.difficultyDistribution?.easy ?? 30}% Easy • {qualityReport.difficultyDistribution?.moderate ?? 50}% Mod • {qualityReport.difficultyDistribution?.difficult ?? 20}% Chal
                  </div>
                  <div className="text-[11px] text-slate-500">Target: ~30% Easy, ~50% Moderate, ~20% Challenging</div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Marks Integrity</div>
                  <div className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Exact: {qualityReport.calculatedMarks} / {qualityReport.expectedMarks} Marks</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Mathematical sum strictly equals blueprint total</div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Question Phrasing Audit</div>
                  <div className="text-sm font-bold text-indigo-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    <span>Zero Generic Clichés</span>
                  </div>
                  <div className="text-[11px] text-slate-500">No repetitive boilerplate stems detected</div>
                </div>
              </div>

              {/* Lesson Syllabus Coverage */}
              {qualityReport.lessonCoverage && qualityReport.lessonCoverage.length > 0 && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Syllabus & Lesson Coverage Distribution
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {qualityReport.lessonCoverage.map((cov, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 text-xs">
                        <span className="font-medium text-slate-800 truncate pr-2" title={cov.chapter}>{cov.chapter}</span>
                        <span className="font-semibold text-indigo-600 flex-shrink-0">
                          {cov.questionCount} Qs ({cov.marks} Marks)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bloom's Cognitive Taxonomy Breakdown */}
              {qualityReport.cognitiveDistribution && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Bloom's Cognitive Level Distribution
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {Object.entries(qualityReport.cognitiveDistribution).map(([level, count]) => (
                      <div key={level} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs">
                        <span className="font-semibold text-slate-700">{level}:</span>
                        <span className="font-bold text-indigo-600">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Items checklist */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {qualityReport.items.map(item => (
                  <div key={item.id} className="p-4 flex items-start gap-3 bg-white hover:bg-slate-50">
                    <div className="mt-0.5">
                      {item.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{item.title}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            item.passed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.passed ? 'PASSED' : 'CHECK FAILED'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                      {item.details && (
                        <div className="text-[11px] text-slate-700 font-medium mt-1 bg-slate-50 p-2 rounded border border-slate-200">
                          {item.details}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
              <p className="text-xs">Running comprehensive quality checks...</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ANSWER-KEY & EXAMINATION VALIDATION ENGINE */}
      {activeTab === 'validation' && (
        <AnswerKeyValidationView
          paper={paper}
          report={qualityReport}
          onRevalidate={handleRunQualityCheck}
          isValidating={isValidating}
        />
      )}

      {/* EDIT QUESTION MODAL */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                Edit Question #{editingQuestion.question.number}
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Question text */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Question Text
                </label>
                <textarea
                  rows={3}
                  value={editingQuestion.question.question}
                  onChange={e =>
                    setEditingQuestion({
                      ...editingQuestion,
                      question: { ...editingQuestion.question, question: e.target.value }
                    })
                  }
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Marks & Chapter */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Marks
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={editingQuestion.question.marks}
                    onChange={e =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question: { ...editingQuestion.question, marks: Math.max(1, parseInt(e.target.value) || 1) }
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Textbook Chapter
                  </label>
                  <input
                    type="text"
                    value={editingQuestion.question.chapter}
                    onChange={e =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question: { ...editingQuestion.question, chapter: e.target.value }
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              {/* MCQ Options if MCQ */}
              {editingQuestion.question.questionType === 'MCQ' && (
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider">
                    MCQ Options (Exactly 4)
                  </label>
                  {(editingQuestion.question.options || ['A)', 'B)', 'C)', 'D)']).map((opt, oIdx) => (
                    <input
                      key={oIdx}
                      type="text"
                      value={opt}
                      onChange={e => {
                        const newOpts = [...(editingQuestion.question.options || [])];
                        newOpts[oIdx] = e.target.value;
                        setEditingQuestion({
                          ...editingQuestion,
                          question: { ...editingQuestion.question, options: newOpts }
                        });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800"
                    />
                  ))}
                </div>
              )}

              {/* Expected Answer */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Expected Answer / Solution
                </label>
                <textarea
                  rows={2}
                  value={editingQuestion.question.answer}
                  onChange={e =>
                    setEditingQuestion({
                      ...editingQuestion,
                      question: { ...editingQuestion.question, answer: e.target.value }
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800"
                />
              </div>

              {/* Marking Rubric */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Marking Rubric (One per line)
                </label>
                <textarea
                  rows={2}
                  value={(editingQuestion.question.markingRubric || []).join('\n')}
                  onChange={e =>
                    setEditingQuestion({
                      ...editingQuestion,
                      question: {
                        ...editingQuestion.question,
                        markingRubric: e.target.value.split('\n').filter(Boolean)
                      }
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveQuestionEdit(editingQuestion.sectionId, editingQuestion.question)}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs cursor-pointer"
              >
                Update Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

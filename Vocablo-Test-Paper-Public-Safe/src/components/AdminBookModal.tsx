import React, { useState } from 'react';
import { Book, Chapter } from '../types';
import { api } from '../services/api';
import {
  X,
  Upload,
  BookOpen,
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';

interface AdminBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookCreated: (book: Book, chapters: Chapter[]) => void;
  existingBooks: Book[];
  onBookDeleted?: (bookId: string) => void;
}

const COMMON_SUBJECTS = [
  'English',
  'Science',
  'Environmental Studies',
  'Mathematics',
  'Social Studies',
  'Hindi',
  'Computer Science'
];

const GRADE_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const AdminBookModal: React.FC<AdminBookModalProps> = ({
  isOpen,
  onClose,
  onBookCreated,
  existingBooks,
  onBookDeleted
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Science');
  const [customSubject, setCustomSubject] = useState('');
  const [grade, setGrade] = useState('7');
  const [board, setBoard] = useState('CBSE');
  const [academicYear, setAcademicYear] = useState('2026-27');
  const [description, setDescription] = useState('');
  const [chapterInputMode, setChapterInputMode] = useState<'paste' | 'file' | 'manual'>('paste');

  // Chapters input
  const [pastedChapters, setPastedChapters] = useState(
    '1. Living Organisms and Surroundings\n2. Light, Shadows and Reflections\n3. Electricity and Circuits\n4. Fun with Magnets\n5. Water and Air'
  );
  const [manualChapters, setManualChapters] = useState<Array<{ title: string; type: string }>>([
    { title: 'Introduction & Foundations', type: 'Concept' },
    { title: 'Core Principles & Analysis', type: 'Concept' }
  ]);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileText, setUploadedFileText] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const effectiveSubject = subject === 'Other' ? customSubject.trim() || 'General' : subject;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setUploadedFileText(text || '');

      // Try auto-extracting chapter names from lines
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
      const detected: string[] = [];
      lines.forEach(l => {
        if (/^(chapter|unit|lesson|\d+[\.\-\)])/i.test(l) && l.length < 80) {
          detected.push(l.replace(/^(chapter|unit|lesson|\d+[\.\-\)])\s*/i, '').trim());
        }
      });

      if (detected.length > 0) {
        setPastedChapters(detected.join('\n'));
        setChapterInputMode('paste');
      }
    };
    reader.readAsText(file);
  };

  const handleAddManualChapter = () => {
    setManualChapters(prev => [...prev, { title: '', type: 'Concept' }]);
  };

  const handleRemoveManualChapter = (index: number) => {
    setManualChapters(prev => prev.filter((_, i) => i !== index));
  };

  const parseChapters = (): Array<{ title: string; type?: string; contentSummary?: string; fullTextOrExcerpts?: string }> => {
    if (chapterInputMode === 'paste') {
      const lines = pastedChapters
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);
      return lines.map((l, i) => {
        const cleanTitle = l.replace(/^\d+[\.\-\)]\s*/, '').trim();
        return {
          title: cleanTitle || `Chapter ${i + 1}`,
          type: effectiveSubject.toLowerCase().includes('english') ? 'Prose' : 'Concept',
          contentSummary: `Curriculum study chapter on ${cleanTitle} covering core definitions, topics, and exercises.`,
          fullTextOrExcerpts: `Detailed study material and lesson concepts for ${cleanTitle}.`
        };
      });
    } else if (chapterInputMode === 'manual') {
      return manualChapters
        .filter(c => c.title.trim().length > 0)
        .map(c => ({
          title: c.title.trim(),
          type: c.type,
          contentSummary: `Core textbook module on ${c.title.trim()}`,
          fullTextOrExcerpts: `Detailed lessons and questions for ${c.title.trim()}`
        }));
    } else {
      // File mode
      if (uploadedFileText) {
        const chunks = uploadedFileText.split(/(?:Chapter\s+\d+|Unit\s+\d+)/i).filter(c => c.trim().length > 30);
        if (chunks.length > 1) {
          return chunks.map((chunk, idx) => {
            const firstLine = chunk.trim().split('\n')[0]?.replace(/^[:\s-]+/, '').slice(0, 50) || `Chapter ${idx + 1}`;
            return {
              title: firstLine,
              contentSummary: chunk.trim().slice(0, 300),
              fullTextOrExcerpts: chunk.trim().slice(0, 1500)
            };
          });
        }
      }
      return [
        { title: 'Chapter 1: Foundational Topics', contentSummary: 'Core textbook topics.' },
        { title: 'Chapter 2: In-Depth Concepts', contentSummary: 'Key conceptual lessons.' },
        { title: 'Chapter 3: Assessment & Exercises', contentSummary: 'Review exercises and problems.' }
      ];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a book title.');
      return;
    }

    const preparedChapters = parseChapters();
    if (preparedChapters.length === 0) {
      setErrorMsg('Please provide at least one chapter.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      let resultBook: Book;
      let resultChapters: Chapter[];

      if (chapterInputMode === 'file' || uploadedFileText || uploadedFileName) {
        const scanRes = await api.scanAndProcessBook({
          title: title.trim(),
          subject: effectiveSubject,
          grade,
          board,
          academicYear,
          fileName: uploadedFileName,
          rawContent: uploadedFileText || pastedChapters
        });
        resultBook = scanRes.book;
        resultChapters = scanRes.chapters;
      } else {
        const payload = {
          title: title.trim(),
          subject: effectiveSubject,
          grade,
          board,
          academicYear,
          description: description.trim() || `Course book for ${effectiveSubject} Class ${grade} (${board}).`,
          chapters: preparedChapters
        };
        const uploadRes = await api.adminUploadBook(payload);
        resultBook = uploadRes.book;
        resultChapters = uploadRes.chapters;
      }

      setSuccessMsg(`Book "${resultBook.title}" scanned and synchronized with ${resultChapters.length} lessons!`);
      onBookCreated(resultBook, resultChapters);

      // Reset fields
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setUploadedFileName('');
        setUploadedFileText('');
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Failed to upload/scan book:', err);
      setErrorMsg(err.message || 'Failed to scan and save book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.deleteBook(bookId);
      if (onBookDeleted) onBookDeleted(bookId);
      setSuccessMsg('Book removed successfully.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete book.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 leading-tight">
                Administrator: Curriculum Book Management
              </h3>
              <p className="text-[11px] text-slate-500">
                Upload & manage textbooks for English, Science, Mathematics, or custom subjects.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-6 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`py-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors mr-6 ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Upload / Add New Book
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manage')}
            className={`py-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'manage'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Manage Existing Books ({existingBooks.length})
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Upload Book Form */}
        {activeTab === 'upload' ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Book Title */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Book Title <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Jophiel Science Explorer Class 08, Living Science, Honeycomb English"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Subject <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {COMMON_SUBJECTS.map(subj => (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => {
                      setSubject(subj);
                      setCustomSubject('');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors border ${
                      subject === subj
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {subj}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setSubject('Other')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors border ${
                    subject === 'Other'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Custom Subject...
                </button>
              </div>

              {subject === 'Other' && (
                <input
                  type="text"
                  value={customSubject}
                  onChange={e => setCustomSubject(e.target.value)}
                  placeholder="Enter custom subject name (e.g., Sanskrit, Economics, Civics)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 transition-colors mt-1.5"
                  required
                />
              )}
            </div>

            {/* Class / Grade Number Options (1 to 8) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Class / Grade (1st to 8th) <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {GRADE_OPTIONS.map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGrade(num)}
                      className={`py-2 px-2 text-center rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                        grade === num
                          ? 'bg-slate-900 text-white border-slate-900 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Class {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Board & Academic Year
                </label>
                <div className="flex gap-2">
                  <select
                    value={board}
                    onChange={e => setBoard(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State Board">State Board</option>
                    <option value="General Curriculum">General Curriculum</option>
                  </select>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={e => setAcademicYear(e.target.value)}
                    placeholder="2026-27"
                    className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Chapters Input Method */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-slate-700">
                  Book Chapters <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setChapterInputMode('paste')}
                    className={`text-[11px] px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                      chapterInputMode === 'paste'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Paste / Type List
                  </button>
                  <button
                    type="button"
                    onClick={() => setChapterInputMode('file')}
                    className={`text-[11px] px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                      chapterInputMode === 'file'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Upload Document
                  </button>
                  <button
                    type="button"
                    onClick={() => setChapterInputMode('manual')}
                    className={`text-[11px] px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                      chapterInputMode === 'manual'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Add One by One
                  </button>
                </div>
              </div>

              {chapterInputMode === 'paste' && (
                <div>
                  <textarea
                    value={pastedChapters}
                    onChange={e => setPastedChapters(e.target.value)}
                    rows={5}
                    placeholder="Enter chapter titles one per line, e.g.:&#10;1. Living Organisms and Surroundings&#10;2. Light, Shadows and Reflections&#10;3. Electricity and Circuits"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Tip: Enter chapter titles one per line. Numbers like "1." will be formatted cleanly.
                  </p>
                </div>
              )}

              {chapterInputMode === 'file' && (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-indigo-300 transition-colors bg-slate-50/50">
                  <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-700 mb-1">
                    {uploadedFileName ? uploadedFileName : 'Upload Book Outline or Syllabus Document (.txt, .pdf)'}
                  </p>
                  <p className="text-[11px] text-slate-400 mb-3">
                    Extracts chapters and textual content automatically for paper generation.
                  </p>
                  <label className="inline-block px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium cursor-pointer transition-colors shadow-xs">
                    Choose File
                    <input
                      type="file"
                      accept=".txt,.pdf,.docx,.json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {chapterInputMode === 'manual' && (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {manualChapters.map((chap, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400 w-6 text-right">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={chap.title}
                        onChange={e => {
                          const val = e.target.value;
                          setManualChapters(prev =>
                            prev.map((c, i) => (i === idx ? { ...c, title: val } : c))
                          );
                        }}
                        placeholder={`Chapter ${idx + 1} Title`}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveManualChapter(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddManualChapter}
                    className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 mt-2 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Chapter</span>
                  </button>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-all shadow-xs cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Syncing with Backend...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Upload & Save Book</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Tab 2: Manage Existing Books */
          <div className="p-6">
            <p className="text-xs text-slate-500 mb-4">
              All books stored in the backend curriculum catalog. Deleting a book will remove its chapters from selection.
            </p>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {existingBooks.map(book => (
                <div
                  key={book.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      {book.grade || '1'}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">{book.title}</h4>
                      <p className="text-[11px] text-slate-400">
                        {book.subject} • Class {book.grade} • {book.chaptersCount || 0} chapters
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(book.id)}
                    title="Delete Book"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

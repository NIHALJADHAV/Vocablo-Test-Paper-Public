import React, { useState } from 'react';
import { Book, Chapter } from '../types';
import {
  BookOpen,
  Plus,
  Upload,
  Layers,
  ChevronRight,
  FileText,
  CheckCircle2,
  Sparkles,
  Info,
  X,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

interface BooksManagementViewProps {
  books: Book[];
  onRefreshBooks: () => void;
}

export const BooksManagementView: React.FC<BooksManagementViewProps> = ({
  books,
  onRefreshBooks
}) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(books[0] || null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);
  const [viewingChapter, setViewingChapter] = useState<Chapter | null>(null);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadBookTitle, setUploadBookTitle] = useState('');
  const [uploadGrade, setUploadGrade] = useState('7');
  const [uploadSubject, setUploadSubject] = useState('English');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadContent, setUploadContent] = useState('');
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);

  // Load chapters when book selected
  const handleSelectBook = async (book: Book) => {
    setSelectedBook(book);
    setIsLoadingChapters(true);
    try {
      const data = await api.getChapters(book.id);
      setChapters(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingChapters(false);
    }
  };

  // Initial load
  React.useEffect(() => {
    if (selectedBook) {
      handleSelectBook(selectedBook);
    }
  }, [selectedBook?.id]);

  // Handle Simulated Textbook Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFileName(file.name);
    if (!uploadBookTitle) {
      setUploadBookTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    // Read file as text
    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      setUploadContent(text || 'Chapter 1: Foundations and Principles\nExtracted content...');
    };
    reader.readAsText(file);
  };

  const handleProcessUpload = async () => {
    if (!uploadBookTitle || !uploadGrade || !uploadSubject) {
      alert('Please enter Book Title, Grade, and Subject.');
      return;
    }

    setIsProcessingUpload(true);
    try {
      const result = await api.extractTextbook({
        fileName: uploadFileName || 'textbook.pdf',
        fileContent: uploadContent || `Chapter 1: Core Fundamentals\nDetailed reading excerpts.\n\nChapter 2: Literary Analysis\nAnalytical insights.`,
        bookTitle: uploadBookTitle,
        grade: uploadGrade,
        subject: uploadSubject
      });

      alert(`Successfully processed "${result.book.title}" with ${result.chapters.length} chapters!`);
      setIsUploadModalOpen(false);
      onRefreshBooks();
      handleSelectBook(result.book);
    } catch (e) {
      console.error(e);
      alert('Failed to process textbook upload.');
    } finally {
      setIsProcessingUpload(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curriculum Management</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Textbooks & Chapter Bank</h1>
          <p className="text-sm text-slate-500 mt-1">
            Grounding repository for school curricula, prose, poetry, and learning outcomes.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Textbook (PDF / DOCX / TXT)</span>
        </button>
      </div>

      {/* Main Grid: Left Books List, Right Chapters Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Books List */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Available Textbooks ({books.length})
          </h3>

          <div className="space-y-2">
            {books.map(b => {
              const isSelected = selectedBook?.id === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => handleSelectBook(b)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-400 ring-1 ring-indigo-400/40'
                      : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className={`text-sm font-bold truncate ${isSelected ? 'text-indigo-950' : 'text-slate-900'}`}>
                      {b.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Class {b.grade} • {b.subject} • {b.board || 'CBSE'}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Chapters Details */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-semibold text-indigo-600 uppercase">Textbook Content</div>
              <h2 className="text-lg font-bold text-slate-900">
                {selectedBook ? selectedBook.title : 'Select a Book'}
              </h2>
              <p className="text-xs text-slate-500">
                {chapters.length} Chapters indexed with key facts, vocabulary & excerpts
              </p>
            </div>
          </div>

          {isLoadingChapters ? (
            <div className="py-16 text-center text-slate-400">Loading chapters...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[550px] overflow-y-auto pr-1">
              {chapters.map(ch => (
                <div
                  key={ch.id}
                  onClick={() => setViewingChapter(ch)}
                  className="p-4 rounded-xl border border-slate-200/80 hover:border-indigo-300 bg-slate-50/40 hover:bg-slate-50 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      Ch. {ch.chapterNumber}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">
                      {ch.type || 'Prose'}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{ch.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{ch.contentSummary}</p>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{ch.vocabulary?.length || 0} terms</span>
                    <span className="text-indigo-600 font-semibold hover:underline">View Excerpts →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chapter Excerpt Modal */}
      {viewingChapter && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-bold text-indigo-600">Chapter {viewingChapter.chapterNumber}</span>
                <h3 className="font-bold text-lg text-slate-900">{viewingChapter.title}</h3>
              </div>
              <button
                onClick={() => setViewingChapter(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h5 className="font-bold text-slate-700 uppercase tracking-wider mb-1">Content Overview</h5>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {viewingChapter.contentSummary}
                </p>
              </div>

              {viewingChapter.fullTextOrExcerpts && (
                <div>
                  <h5 className="font-bold text-slate-700 uppercase tracking-wider mb-1">Textbook Excerpts & Stanzas</h5>
                  <div className="text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px] whitespace-pre-line max-h-48 overflow-y-auto">
                    {viewingChapter.fullTextOrExcerpts}
                  </div>
                </div>
              )}

              {viewingChapter.vocabulary && viewingChapter.vocabulary.length > 0 && (
                <div>
                  <h5 className="font-bold text-slate-700 uppercase tracking-wider mb-1">Vocabulary & Key Terms</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingChapter.vocabulary.map((v, i) => (
                      <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full font-medium">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {viewingChapter.importantFacts && viewingChapter.importantFacts.length > 0 && (
                <div>
                  <h5 className="font-bold text-slate-700 uppercase tracking-wider mb-1">Important Factual Details</h5>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {viewingChapter.importantFacts.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Textbook Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900">Upload Textbook (OCR & Extractor)</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Book Title *</label>
                <input
                  type="text"
                  value={uploadBookTitle}
                  onChange={e => setUploadBookTitle(e.target.value)}
                  placeholder="e.g. Cambridge English Class 7"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grade / Class *</label>
                  <input
                    type="text"
                    value={uploadGrade}
                    onChange={e => setUploadGrade(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    value={uploadSubject}
                    onChange={e => setUploadSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Document File (PDF, DOCX, TXT)</label>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Extracted Text Preview / Paste Content</label>
                <textarea
                  rows={4}
                  value={uploadContent}
                  onChange={e => setUploadContent(e.target.value)}
                  placeholder="Paste or preview chapter text here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px] font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessUpload}
                disabled={isProcessingUpload}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg cursor-pointer flex items-center gap-2"
              >
                {isProcessingUpload ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Extracting & Parsing Chapters...</span>
                  </>
                ) : (
                  <span>Index Textbook & Chapters</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

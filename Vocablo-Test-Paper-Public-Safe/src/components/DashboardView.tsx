import React, { useState } from 'react';
import { TestPaper, Book, QuestionBankItem } from '../types';
import {
  FileText,
  PlusCircle,
  Clock,
  CheckCircle,
  Copy,
  Download,
  Trash2,
  RefreshCw,
  Search,
  BookOpen,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Layers,
  FileCheck,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { exportPaperToPdf, exportPaperToDocx } from '../services/documentExport';

interface DashboardViewProps {
  papers: TestPaper[];
  books: Book[];
  questionBankCount: number;
  onOpenPaper: (paper: TestPaper) => void;
  onNewPaper: () => void;
  onDuplicatePaper: (paper: TestPaper) => void;
  onDeletePaper: (paperId: string) => void;
  onRegeneratePaper: (paper: TestPaper) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  papers,
  books,
  questionBankCount,
  onOpenPaper,
  onNewPaper,
  onDuplicatePaper,
  onDeletePaper,
  onRegeneratePaper
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Statistics
  const totalPapers = papers.length;
  const generatedPapers = papers.filter(p => p.status === 'Generated' || p.status === 'Approved').length;
  const draftPapers = papers.filter(p => p.status === 'Draft').length;
  const totalBooks = books.length;

  const filteredPapers = papers.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.grade.includes(searchQuery);
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDownloadPdf = (paper: TestPaper) => {
    setDownloadingId(paper.id);
    try {
      exportPaperToPdf(paper, false);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setDownloadingId(null), 500);
    }
  };

  const handleDownloadDocx = async (paper: TestPaper) => {
    setDownloadingId(paper.id);
    try {
      await exportPaperToDocx(paper, false);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setDownloadingId(null), 500);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3 h-3" />
            <span>AI Assessment Platform</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Examination Papers Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Design, synthesize, and export textbook-grounded tests and answer keys.
          </p>
        </div>
        <button
          id="btn-dashboard-new-paper"
          onClick={onNewPaper}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-sm transition-all cursor-pointer flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Test Paper</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Papers</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalPapers}</div>
          <div className="text-[11px] text-slate-400 mt-1">All examination records</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Generated</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{generatedPapers}</div>
          <div className="text-[11px] text-slate-400 mt-1">Ready for print & export</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Drafts</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{draftPapers}</div>
          <div className="text-[11px] text-slate-400 mt-1">Pending finalization</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Question Bank</div>
          <div className="text-2xl font-bold text-indigo-700 mt-1">{questionBankCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Verified questions</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available Books</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalBooks}</div>
          <div className="text-[11px] text-slate-400 mt-1">Curriculum textbooks</div>
        </div>
      </div>

      {/* Recent Papers Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Controls */}
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Examination Papers</h2>
            <p className="text-xs text-slate-500">Manage, preview, regenerate, or download DOCX/PDF formats.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                id="input-dashboard-search"
                placeholder="Search title, subject, grade..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-56 text-slate-800"
              />
            </div>

            {/* Status Filter */}
            <select
              id="select-status-filter"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              aria-label="Filter by paper status"
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Generated">Generated</option>
              <option value="Draft">Draft</option>
              <option value="Approved">Approved</option>
            </select>
          </div>
        </div>

        {/* Papers Table */}
        <div className="overflow-x-auto">
          {filteredPapers.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No test papers found</p>
              <p className="text-xs text-slate-400 mt-1">
                {searchQuery ? 'Try adjusting your search criteria.' : 'Create your first test paper using the button above.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Paper Title & Details</th>
                  <th className="px-4 py-3.5">Class</th>
                  <th className="px-4 py-3.5">Subject</th>
                  <th className="px-4 py-3.5">Marks</th>
                  <th className="px-4 py-3.5">Duration</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPapers.map(paper => {
                  const isDownloading = downloadingId === paper.id;
                  const totalQuestionsCount = paper.sections.reduce((s, sec) => s + sec.questions.length, 0);

                  return (
                    <tr key={paper.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          <span
                            onClick={() => onOpenPaper(paper)}
                            className="hover:text-indigo-600 cursor-pointer hover:underline"
                          >
                            {paper.title}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-slate-400" />
                            {paper.bookTitle}
                          </span>
                          <span>•</span>
                          <span>{paper.selectedChapterTitles?.length || 0} chapters</span>
                          <span>•</span>
                          <span>{totalQuestionsCount} questions</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 font-medium text-slate-700">
                        Class {paper.grade}
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded">
                          {paper.subject}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-semibold text-slate-900">
                        {paper.maximumMarks} M
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-600 flex-nowrap">
                        {paper.duration || '1 Hour'}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            paper.status === 'Generated' || paper.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {paper.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          {/* Open / Preview */}
                          <button
                            id={`btn-open-paper-${paper.id}`}
                            onClick={() => onOpenPaper(paper)}
                            title="Open Paper Preview & Editor"
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          {/* Duplicate */}
                          <button
                            id={`btn-duplicate-paper-${paper.id}`}
                            onClick={() => onDuplicatePaper(paper)}
                            title="Duplicate Paper Blueprint"
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Generate Again */}
                          <button
                            id={`btn-regenerate-paper-${paper.id}`}
                            onClick={() => onRegeneratePaper(paper)}
                            title="Generate Again with AI"
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>

                          {/* PDF Download */}
                          <button
                            id={`btn-download-pdf-${paper.id}`}
                            onClick={() => handleDownloadPdf(paper)}
                            title="Download Print-Ready PDF"
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                          >
                            <Download className="w-4 h-4 text-rose-500" />
                          </button>

                          {/* DOCX Download */}
                          <button
                            id={`btn-download-docx-${paper.id}`}
                            onClick={() => handleDownloadDocx(paper)}
                            title="Download Editable DOCX"
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          >
                            <Download className="w-4 h-4 text-blue-600" />
                          </button>

                          {/* Delete */}
                          <button
                            id={`btn-delete-paper-${paper.id}`}
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${paper.title}"?`)) {
                                onDeletePaper(paper.id);
                              }
                            }}
                            title="Delete Paper"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

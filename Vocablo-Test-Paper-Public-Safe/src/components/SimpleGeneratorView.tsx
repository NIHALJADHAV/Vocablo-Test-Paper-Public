import React, { useState, useEffect, useRef } from 'react';
import { Book, Chapter, TestPaper } from '../types';
import { api } from '../services/api';
import {
  Info,
  BookOpen,
  HelpCircle,
  Search,
  Check,
  ChevronsUpDown,
  Loader2,
  AlertCircle,
  GraduationCap
} from 'lucide-react';

interface QuestionStructureRow {
  id: string;
  type: string;
  count: number;
  marksPerQuestion: number;
}

interface SimpleGeneratorViewProps {
  books: Book[];
  onPaperGenerated: (paper: TestPaper) => void;
  onBooksUpdated?: (books: Book[]) => void;
  preSelectedBookId?: string;
  onOpenAdmin?: () => void;
}

const DEFAULT_ROWS: QuestionStructureRow[] = [
  { id: '1', type: 'mcq', count: 5, marksPerQuestion: 2 },
  { id: '2', type: 'Fill in Blanks', count: 5, marksPerQuestion: 2 },
  { id: '3', type: 'True/False', count: 5, marksPerQuestion: 2 },
  { id: '4', type: 'Answer the following questions', count: 5, marksPerQuestion: 3 },
  { id: '5', type: 'Long Answer', count: 3, marksPerQuestion: 5 }
];

export const SimpleGeneratorView: React.FC<SimpleGeneratorViewProps> = ({
  books,
  onPaperGenerated,
  preSelectedBookId,
  onOpenAdmin
}) => {
  // 1. General Details (matching screenshots)
  const [schoolName, setSchoolName] = useState('Aura International School');
  const [schoolAddress, setSchoolAddress] = useState('Survey No. 42/1, Hillside Campus, Bengaluru, Karnataka 560068');
  const [grade, setGrade] = useState('7');
  const [duration, setDuration] = useState('1');

  // 2. Content Source
  const [selectedBookId, setSelectedBookId] = useState<string>(preSelectedBookId || '');
  const [bookDropdownOpen, setBookDropdownOpen] = useState(false);
  const [bookSearch, setBookSearch] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(false);

  // 3. Question Structure (matching screenshot)
  const [rows, setRows] = useState<QuestionStructureRow[]>(DEFAULT_ROWS);

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // If preSelectedBookId is passed or changes, update selectedBookId
  useEffect(() => {
    if (preSelectedBookId) {
      setSelectedBookId(preSelectedBookId);
    }
  }, [preSelectedBookId]);

  // If no book selected yet, try to auto-select Jophiel English Class 07 or first book
  useEffect(() => {
    if (!selectedBookId && books.length > 0) {
      const defaultBook = books.find(b => b.title.includes('English Class 07') || b.title.includes('Class 7') || String(b.grade) === '7');
      if (defaultBook) {
        setSelectedBookId(defaultBook.id);
      }
    }
  }, [books, selectedBookId]);

  // Fetch chapters whenever selected book changes
  useEffect(() => {
    if (!selectedBookId) {
      setChapters([]);
      setSelectedChapterIds([]);
      return;
    }

    setLoadingChapters(true);
    api.getChapters(selectedBookId)
      .then(res => {
        setChapters(res);
        // By default, select all chapters
        setSelectedChapterIds(res.map(c => c.id));
      })
      .catch(err => {
        console.error('Failed to load chapters:', err);
      })
      .finally(() => {
        setLoadingChapters(false);
      });
  }, [selectedBookId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setBookDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update question structure rows
  const updateRowCount = (id: string, count: number) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, count: Math.max(1, count) } : r));
  };

  const updateRowMarks = (id: string, marks: number) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, marksPerQuestion: Math.max(1, marks) } : r));
  };

  // Chapter selection handlers
  const toggleChapter = (id: string) => {
    setSelectedChapterIds(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleSelectAllChapters = () => {
    setSelectedChapterIds(chapters.map(c => c.id));
  };

  const handleClearAllChapters = () => {
    setSelectedChapterIds([]);
  };

  // Calculate total marks
  const totalMaxMarks = rows.reduce((sum, r) => sum + (r.count * r.marksPerQuestion), 0);

  // Selected book object
  const selectedBook = books.find(b => b.id === selectedBookId);

  // Filtered books for search in dropdown
  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.subject.toLowerCase().includes(bookSearch.toLowerCase()) ||
    String(b.grade).includes(bookSearch)
  );

  // Validation
  const hasChapters = selectedChapterIds.length > 0 || chapters.length > 0;
  const isValid =
    schoolName.trim().length > 0 &&
    grade.trim().length > 0 &&
    duration.trim().length > 0 &&
    selectedBookId.length > 0 &&
    hasChapters &&
    rows.length > 0;

  // Generate Paper handler
  const handleGenerate = async () => {
    if (!isValid) return;

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      // If user had not checked any chapter explicitly but chapters are loaded, use all
      const effectiveChapterIds = selectedChapterIds.length > 0
        ? selectedChapterIds
        : chapters.map(c => c.id);

      const selectedChapters = chapters.filter(c => effectiveChapterIds.includes(c.id));
      const sectionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

      const blueprintSections = rows.map((r, idx) => ({
        id: `bp-${r.id}`,
        sectionTitle: `SECTION ${sectionLetters[idx] || 'A'}: ${r.type.toUpperCase()}`,
        questionType: (r.type === 'mcq'
          ? 'MCQ'
          : r.type === 'Fill in Blanks'
          ? 'Fill in the Blanks'
          : r.type === 'True/False'
          ? 'True / False'
          : r.type.toLowerCase().includes('long')
          ? 'Long Answer'
          : 'Short Answer') as any,
        numberOfQuestions: r.count,
        marksPerQuestion: r.marksPerQuestion,
        totalMarks: r.count * r.marksPerQuestion,
        instructions: r.type === 'mcq'
          ? 'Choose the correct option.'
          : r.type === 'Fill in Blanks'
          ? 'Fill in the blanks with suitable words.'
          : r.type === 'True/False'
          ? 'State whether true or false.'
          : 'Answer the following questions.'
      }));

      const payload = {
        title: `${selectedBook?.subject || 'Examination'} Test Paper`,
        schoolName: schoolName.trim(),
        schoolAddress: schoolAddress.trim(),
        grade: grade.trim() || String(selectedBook?.grade || '7'),
        subject: selectedBook?.subject || 'English',
        bookId: selectedBook?.id || selectedBookId,
        bookTitle: selectedBook?.title || 'Course Textbook',
        selectedChapterIds: effectiveChapterIds,
        selectedChapters: selectedChapters.length > 0 ? selectedChapters : chapters,
        blueprintSections,
        difficulty: 'Medium' as const,
        totalMarks: totalMaxMarks,
        duration: duration.trim(),
        instructions: [
          'All questions are compulsory.',
          'Marks for each question are indicated against it.',
          'Read questions carefully before answering.'
        ]
      };

      const result = await api.generateTestPaper(payload);
      const paper = (result as any).paper || result;
      if (!paper || !paper.sections) {
        throw new Error('Invalid response structure received from generator.');
      }
      onPaperGenerated(paper);
    } catch (err: any) {
      console.error('Paper generation failed:', err);
      setErrorMessage(err.message || 'Failed to generate test paper. Please check selections and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Generation Notice</p>
            <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CARD 1: GENERAL DETAILS (Matching Screenshot) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] p-6 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-xs font-semibold">
            <Info className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-semibold text-slate-900 text-base">General Details</h2>
        </div>
        <p className="text-xs text-slate-500 mb-5 ml-7">
          Provide the basic information for the test paper header.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* School Name */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              School Name <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={e => setSchoolName(e.target.value)}
              placeholder="Enter school name"
              className="w-full bg-[#f1f5f9] border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Class */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Class <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={grade}
              onChange={e => {
                const val = e.target.value;
                setGrade(val);
                // Also auto-switch book if a book matches this grade
                const match = books.find(b => String(b.grade) === val);
                if (match) setSelectedBookId(match.id);
              }}
              placeholder="e.g., 10th Grade"
              className="w-full bg-[#f1f5f9] border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* School Address */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              School Address <span className="text-slate-400 font-normal">(Printed on test paper & exports)</span>
            </label>
            <input
              type="text"
              value={schoolAddress}
              onChange={e => setSchoolAddress(e.target.value)}
              placeholder="e.g., Survey No. 42/1, Hillside Campus, Bengaluru, Karnataka 560068"
              className="w-full bg-[#f1f5f9] border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Duration */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Duration <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="e.g., 2 hours"
              className="w-full bg-[#f1f5f9] border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD 2: CONTENT SOURCE (Matching Screenshot) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] p-6 mb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-900" />
            <h2 className="font-semibold text-slate-900 text-base">Content Source</h2>
          </div>

          {onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
              title="Upload and scan books in Tutor LMS Admin"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Tutor LMS Admin</span>
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500 mb-5 ml-7">
          Select the book and chapters to include in the test.
        </p>

        {/* Select Book Dropdown (Matching Screenshot Image 6) */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Select Book <span className="text-rose-500 font-bold">*</span>
          </label>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              id="btn-select-book-dropdown"
              onClick={() => setBookDropdownOpen(!bookDropdownOpen)}
              className="w-full bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-sm text-left flex items-center justify-between hover:border-blue-400 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <span className={selectedBook ? 'text-slate-900 font-medium' : 'text-slate-400'}>
                {selectedBook ? selectedBook.title : 'Select book'}
              </span>
              <ChevronsUpDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
            </button>

            {/* Custom Dropdown List Matching Image 6 */}
            {bookDropdownOpen && (
              <div className="absolute z-30 top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-80 flex flex-col">
                {/* Search book... */}
                <div className="p-2.5 border-b border-slate-100 flex items-center gap-2 bg-white">
                  <Search className="w-4 h-4 text-slate-400 flex-shrink-0 ml-1" />
                  <input
                    type="text"
                    placeholder="Search book..."
                    value={bookSearch}
                    onChange={e => setBookSearch(e.target.value)}
                    className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                    autoFocus
                  />
                </div>

                {/* List of Books */}
                <div className="overflow-y-auto flex-1 py-1 divide-y divide-slate-50">
                  {filteredBooks.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No books found.
                    </div>
                  ) : (
                    filteredBooks.map(b => {
                      const isSelected = b.id === selectedBookId;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            setSelectedBookId(b.id);
                            if (b.grade) setGrade(String(b.grade));
                            setBookDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-xs flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                            isSelected ? 'bg-blue-50/50 text-slate-900 font-medium' : 'text-slate-700'
                          }`}
                        >
                          <span className="truncate">{b.title}</span>
                          {isSelected && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Footer link to Tutor LMS Admin */}
                {onOpenAdmin && (
                  <div className="p-2 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Need to add more books?</span>
                    <button
                      type="button"
                      onClick={() => {
                        setBookDropdownOpen(false);
                        onOpenAdmin();
                      }}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      + Upload in Tutor LMS Admin →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Select Chapters (Matching Image 1, 2, 3, 4) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-medium text-slate-700">
              Select Chapters <span className="text-rose-500 font-bold">*</span>
            </label>

            {selectedBookId && chapters.length > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleSelectAllChapters}
                  className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={handleClearAllChapters}
                  className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* If No Book Selected: Shows "Please select a book to view available chapters" (Matching Image 1 & 3) */}
          {!selectedBookId ? (
            <div className="py-4 text-sm text-slate-500 font-normal">
              Please select a book to view available chapters
            </div>
          ) : loadingChapters ? (
            <div className="py-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Loading chapters...</span>
            </div>
          ) : chapters.length === 0 ? (
            <div className="py-4 text-xs text-slate-400">
              No chapters found for this book.
            </div>
          ) : (
            /* 3-Column Chapter Grid Matching Image 2 and Image 4 */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {chapters.map(chapter => {
                const isSelected = selectedChapterIds.includes(chapter.id);
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => toggleChapter(chapter.id)}
                    className={`px-3.5 py-3 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-[#eff6ff] text-slate-900 font-medium'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {/* Blue Checkbox box matching Image 2 & 4 */}
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-blue-600 border border-blue-600 text-white'
                          : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <span className="text-xs truncate flex-1" title={chapter.title}>
                      {chapter.title}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD 3: QUESTION STRUCTURE (Matching Image 5) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] p-6 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle className="w-5 h-5 text-slate-900" />
          <h2 className="font-semibold text-slate-900 text-base">Question Structure</h2>
        </div>
        <p className="text-xs text-slate-500 mb-5 ml-7">
          Define the types of questions, their counts, and marks for each.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-medium pb-2">
                <th className="py-2 font-medium">Question Type</th>
                <th className="py-2 font-medium text-center">No. of Questions</th>
                <th className="py-2 font-medium text-center">Marks per Question</th>
                <th className="py-2 font-medium text-right pr-2">Total Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(row => {
                const total = row.count * row.marksPerQuestion;
                return (
                  <tr key={row.id} className="hover:bg-slate-50/40">
                    <td className="py-3 font-medium text-slate-800">{row.type}</td>
                    <td className="py-3 text-center">
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={row.count}
                        onChange={e => updateRowCount(row.id, parseInt(e.target.value) || 1)}
                        className="w-16 bg-white border border-slate-200 rounded-md py-1 px-2 text-center text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="py-3 text-center">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={row.marksPerQuestion}
                        onChange={e => updateRowMarks(row.id, parseInt(e.target.value) || 1)}
                        className="w-16 bg-white border border-slate-200 rounded-md py-1 px-2 text-center text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="py-3 text-right font-medium text-slate-800 pr-2">
                      {total}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Total Summary Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end pr-2 text-xs font-semibold text-slate-900">
          <span>Maximum Marks:</span>
          <span className="ml-4 text-sm font-bold">{totalMaxMarks}</span>
        </div>
      </div>

      {/* Action Button & Disclaimer (Matching Screenshot) */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!isValid || isGenerating}
          className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            !isValid || isGenerating
              ? 'bg-[#94a3b8] text-white cursor-not-allowed opacity-90'
              : 'bg-[#64748b] hover:bg-[#475569] text-white shadow-xs'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Test Paper...</span>
            </>
          ) : (
            <span>Generate Test Paper</span>
          )}
        </button>

        <p className="text-xs text-slate-400 text-center mt-2.5">
          Please fill in all required fields to generate the test paper
        </p>
      </div>
    </div>
  );
};

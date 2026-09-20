import React, { useState, useEffect } from 'react';
import {
  School,
  Book,
  Chapter,
  PaperPattern,
  BlueprintRow,
  QuestionType,
  DifficultyLevel,
  TestPaper
} from '../types';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Calendar,
  Clock,
  Award,
  Layers,
  Search,
  Plus,
  Trash2,
  Sliders,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Info,
  CheckSquare,
  Square,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

interface NewTestPaperViewProps {
  schools: School[];
  currentSchool: School | null;
  books: Book[];
  paperPatterns: PaperPattern[];
  onPaperGenerated: (paper: TestPaper) => void;
  onCancel: () => void;
  initialPaperData?: Partial<TestPaper> | null;
}

const QUESTION_TYPES: QuestionType[] = [
  'MCQ',
  'Fill in the Blanks',
  'True / False',
  'Match the Following',
  'One Word Answer',
  'Identify and Write',
  'Short Answer',
  'Long Answer',
  'Very Short Answer',
  'Complete the Sentence',
  'Rearrange the Words',
  'Grammar Questions',
  'Reading Comprehension',
  'Writing Questions',
  'Application / HOTS'
];

export const NewTestPaperView: React.FC<NewTestPaperViewProps> = ({
  schools,
  currentSchool,
  books,
  paperPatterns,
  onPaperGenerated,
  onCancel,
  initialPaperData
}) => {
  // General Details State
  const [selectedSchoolId, setSelectedSchoolId] = useState(
    initialPaperData?.schoolId || currentSchool?.id || schools[0]?.id || ''
  );
  const [grade, setGrade] = useState(initialPaperData?.grade || '7');
  const [subject, setSubject] = useState(initialPaperData?.subject || 'English');
  const [examName, setExamName] = useState(initialPaperData?.examName || 'Annual Assessment Examination 2026-27');
  const [academicYear, setAcademicYear] = useState(initialPaperData?.academicYear || '2026-27');
  const [date, setDate] = useState(
    initialPaperData?.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  );
  const [duration, setDuration] = useState(initialPaperData?.duration || '1 Hour');

  // Content Source & Chapters
  const [selectedBookId, setSelectedBookId] = useState(
    initialPaperData?.bookId || 'book-jophiel-eng-7'
  );
  const [availableChapters, setAvailableChapters] = useState<Chapter[]>([]);
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>(
    initialPaperData?.selectedChapterIds || ['chap-13', 'chap-16', 'chap-19']
  );
  const [chapterSearch, setChapterSearch] = useState('');
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);

  // Blueprint / Structure
  const defaultPattern = paperPatterns.find(p => p.isDefault) || paperPatterns[0];
  const [selectedPatternId, setSelectedPatternId] = useState<string>(defaultPattern?.id || '');
  const [blueprintRows, setBlueprintRows] = useState<BlueprintRow[]>(
    defaultPattern?.sections || [
      { id: '1', questionType: 'MCQ', numberOfQuestions: 5, marksPerQuestion: 2, totalMarks: 10, sectionTitle: 'SECTION A: MULTIPLE CHOICE QUESTIONS' },
      { id: '2', questionType: 'Fill in the Blanks', numberOfQuestions: 5, marksPerQuestion: 2, totalMarks: 10, sectionTitle: 'SECTION B: FILL IN THE BLANKS' },
      { id: '3', questionType: 'True / False', numberOfQuestions: 5, marksPerQuestion: 2, totalMarks: 10, sectionTitle: 'SECTION C: TRUE / FALSE' },
      { id: '4', questionType: 'Short Answer', numberOfQuestions: 5, marksPerQuestion: 3, totalMarks: 15, sectionTitle: 'SECTION D: SHORT ANSWER QUESTIONS' },
      { id: '5', questionType: 'Long Answer', numberOfQuestions: 3, marksPerQuestion: 5, totalMarks: 15, sectionTitle: 'SECTION E: LONG ANSWER QUESTIONS' }
    ]
  );

  // Difficulty & Advanced Settings
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('mixed');
  const [difficultyDistribution, setDifficultyDistribution] = useState({
    easy: 30,
    moderate: 50,
    difficult: 20
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [allowBroaderSyllabus, setAllowBroaderSyllabus] = useState(false);
  const [restartNumberingPerSection, setRestartNumberingPerSection] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Generation Pipeline Progress State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Load chapters when selectedBookId changes
  useEffect(() => {
    async function loadBookChapters() {
      if (!selectedBookId) return;
      setIsLoadingChapters(true);
      try {
        const chapters = await api.getChapters(selectedBookId);
        setAvailableChapters(chapters);

        // If the current selected chapters don't belong to this book, reset or select defaults
        if (!initialPaperData) {
          if (selectedBookId === 'book-jophiel-eng-7') {
            // Default select the Acceptance Test chapters: If..., Roads to Mass Murder, A Night among the Pines
            const defaultChaps = chapters.filter(c =>
              c.title === 'If...' || c.title === 'Roads to Mass Murder' || c.title === 'A Night among the Pines'
            ).map(c => c.id);
            setSelectedChapterIds(defaultChaps.length > 0 ? defaultChaps : chapters.slice(0, 3).map(c => c.id));
          } else {
            setSelectedChapterIds(chapters.slice(0, 3).map(c => c.id));
          }
        }
      } catch (err) {
        console.error('Failed to load chapters:', err);
      } finally {
        setIsLoadingChapters(false);
      }
    }
    loadBookChapters();
  }, [selectedBookId]);

  // Handle Preset Pattern Selection
  const handleSelectPattern = (patternId: string) => {
    setSelectedPatternId(patternId);
    const pattern = paperPatterns.find(p => p.id === patternId);
    if (pattern) {
      setBlueprintRows(JSON.parse(JSON.stringify(pattern.sections)));
      if (pattern.defaultDuration) {
        setDuration(pattern.defaultDuration);
      }
    }
  };

  // Blueprint Calculations
  const calculatedMaxMarks = blueprintRows.reduce((sum, r) => sum + (Number(r.numberOfQuestions || 0) * Number(r.marksPerQuestion || 0)), 0);
  const totalQuestionsCount = blueprintRows.reduce((sum, r) => sum + Number(r.numberOfQuestions || 0), 0);

  // Update a row in the blueprint
  const updateRow = (index: number, field: keyof BlueprintRow, value: any) => {
    const updated = [...blueprintRows];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    if (field === 'numberOfQuestions' || field === 'marksPerQuestion') {
      const q = field === 'numberOfQuestions' ? Number(value) : Number(updated[index].numberOfQuestions);
      const m = field === 'marksPerQuestion' ? Number(value) : Number(updated[index].marksPerQuestion);
      updated[index].totalMarks = q * m;
    }
    setBlueprintRows(updated);
  };

  const addRow = () => {
    const newLetter = String.fromCharCode(65 + blueprintRows.length);
    setBlueprintRows([
      ...blueprintRows,
      {
        id: `row-${Date.now()}`,
        questionType: 'Short Answer',
        numberOfQuestions: 3,
        marksPerQuestion: 2,
        totalMarks: 6,
        sectionTitle: `SECTION ${newLetter}: SHORT ANSWER QUESTIONS`,
        instructions: 'Answer in 2-3 sentences.'
      }
    ]);
  };

  const removeRow = (index: number) => {
    if (blueprintRows.length <= 1) return;
    setBlueprintRows(blueprintRows.filter((_, i) => i !== index));
  };

  // Chapter Toggle Handlers
  const toggleChapter = (chapterId: string) => {
    setSelectedChapterIds(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const selectAllChapters = () => {
    setSelectedChapterIds(availableChapters.map(c => c.id));
  };

  const deselectAllChapters = () => {
    setSelectedChapterIds([]);
  };

  const filteredChapters = availableChapters.filter(c =>
    c.title.toLowerCase().includes(chapterSearch.toLowerCase()) ||
    c.contentSummary.toLowerCase().includes(chapterSearch.toLowerCase())
  );

  // Execution: Submit & Generate
  const handleGenerate = async () => {
    setGenerationError(null);

    // Strict Validations
    if (!selectedSchoolId) {
      setGenerationError('Please select a school.');
      return;
    }
    if (!grade || !subject) {
      setGenerationError('Grade and Subject are required.');
      return;
    }
    if (selectedChapterIds.length === 0) {
      setGenerationError('Please select at least one chapter from the textbook.');
      return;
    }
    if (blueprintRows.length === 0) {
      setGenerationError('Paper blueprint must have at least one question section.');
      return;
    }
    if (calculatedMaxMarks <= 0) {
      setGenerationError('Maximum marks must be greater than zero.');
      return;
    }
    for (const r of blueprintRows) {
      if (r.numberOfQuestions <= 0 || r.marksPerQuestion <= 0) {
        setGenerationError(`Section with ${r.questionType} must have positive question count and marks.`);
        return;
      }
    }

    setIsGenerating(true);
    setGenerationStep(0);

    // Animated sequence to reassure teacher
    const stepTimer1 = setTimeout(() => setGenerationStep(1), 700);
    const stepTimer2 = setTimeout(() => setGenerationStep(2), 1600);
    const stepTimer3 = setTimeout(() => setGenerationStep(3), 2500);

    try {
      const payload = {
        schoolId: selectedSchoolId,
        grade,
        subject,
        bookId: selectedBookId,
        selectedChapterIds,
        examName,
        academicYear,
        date,
        duration,
        blueprintSections: blueprintRows,
        difficulty,
        difficultyDistribution,
        allowBroaderSyllabus,
        restartNumberingPerSection,
        specialInstructions
      };

      const result = await api.generateTestPaper(payload);

      setGenerationStep(4);
      setTimeout(() => {
        setIsGenerating(false);
        onPaperGenerated(result.paper);
      }, 600);
    } catch (err: any) {
      console.error(err);
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsGenerating(false);
      setGenerationError(err.message || 'AI Generation encountered an issue. Please try again.');
    }
  };

  const generationSteps = [
    { title: 'Validating blueprint structure & mark calculations...', sub: 'Formula: Total Marks = Questions × Marks per Question' },
    { title: 'Retrieving textbook content from selected chapters...', sub: 'Extracting key facts, stanzas, characters, and vocabulary' },
    { title: 'Synthesizing questions strictly grounded in curriculum...', sub: 'Creating MCQs, Blanks, True/False, Short & Long questions' },
    { title: 'Running Quality Assurance & Duplicate-Prevention Engine...', sub: 'Validating 4 MCQ options, rubrics, and chapter representation' },
    { title: 'Finalizing examination paper & answer key...', sub: 'Assembling document model for PDF & DOCX export' }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Assessment Generator</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Test Paper</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure blueprint, select chapters, and generate a print-ready school examination.
          </p>
        </div>

        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* Error alert if any */}
      {generationError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">Validation Notice</div>
            <div>{generationError}</div>
          </div>
        </div>
      )}

      {/* SECTION 1: GENERAL DETAILS */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Section 1</span>
            <h2 className="text-lg font-bold text-slate-900">General Examination Details</h2>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500">Calculated Maximum Marks:</span>
            <div className="text-xl font-bold text-indigo-600">{calculatedMaxMarks} Marks</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* School Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              School Name *
            </label>
            <select
              id="input-school-name"
              value={selectedSchoolId}
              onChange={e => setSelectedSchoolId(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {schools.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Academic Year
            </label>
            <input
              type="text"
              id="input-academic-year"
              value={academicYear}
              onChange={e => setAcademicYear(e.target.value)}
              placeholder="e.g. 2026-27"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Class / Grade */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Class / Grade *
            </label>
            <select
              id="select-class-grade"
              value={grade}
              onChange={e => setGrade(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => (
                <option key={g} value={String(g)}>
                  Class {g}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Subject *
            </label>
            <select
              id="select-subject"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="English">English</option>
              <option value="Science">Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Social Studies">Social Studies</option>
              <option value="Environmental Studies">Environmental Studies (EVS)</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Duration *
            </label>
            <input
              type="text"
              id="input-duration"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="e.g. 1 Hour"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Exam Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Examination / Test Title
            </label>
            <input
              type="text"
              id="input-exam-title"
              value={examName}
              onChange={e => setExamName(e.target.value)}
              placeholder="e.g. Annual Assessment Examination 2026-27"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Date
            </label>
            <input
              type="text"
              id="input-date"
              value={date}
              onChange={e => setDate(e.target.value)}
              placeholder="e.g. 15 Mar 2026"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: CONTENT SOURCE */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Section 2</span>
          <h2 className="text-lg font-bold text-slate-900">Content Source & Textbook</h2>
          <p className="text-xs text-slate-500 mt-0.5">Select the textbook to automatically load its dedicated chapters.</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Select Textbook *
          </label>
          <div className="relative">
            <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="select-textbook"
              value={selectedBookId}
              onChange={e => setSelectedBookId(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              {books.map(b => (
                <option key={b.id} value={b.id}>
                  {b.title} ({b.grade ? `Class ${b.grade}` : ''} - {b.subject})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* SECTION 3: CHAPTER SELECTION */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Section 3</span>
            <h2 className="text-lg font-bold text-slate-900">Chapter Selection</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              The generated paper will be strictly grounded in the selected chapters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
              {selectedChapterIds.length} of {availableChapters.length} Selected
            </span>
            <button
              onClick={selectAllChapters}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold px-2 py-1 rounded hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              Select All
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={deselectAllChapters}
              className="text-xs text-slate-500 hover:text-slate-700 font-semibold px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Search Chapters Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="input-chapter-search"
            placeholder="Search chapters by title or keywords..."
            value={chapterSearch}
            onChange={e => setChapterSearch(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Chapters Grid */}
        {isLoadingChapters ? (
          <div className="py-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
            <span className="text-xs">Loading textbook chapters...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
            {filteredChapters.map(chap => {
              const isSelected = selectedChapterIds.includes(chap.id);
              return (
                <div
                  key={chap.id}
                  id={`chapter-card-${chap.id}`}
                  onClick={() => toggleChapter(chap.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-400 ring-1 ring-indigo-400/40'
                      : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isSelected ? (
                      <div className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center text-xs shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded border border-slate-300 bg-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-bold text-slate-400">
                        Ch. {chap.chapterNumber}
                      </span>
                      {chap.type && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-slate-200/60 text-slate-600 rounded">
                          {chap.type}
                        </span>
                      )}
                    </div>
                    <div className={`text-sm font-semibold truncate mt-0.5 ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                      {chap.title}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      {chap.contentSummary}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION 4: PAPER BLUEPRINT / QUESTION STRUCTURE */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Section 4</span>
            <h2 className="text-lg font-bold text-slate-900">Paper Blueprint & Question Structure</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly controls question types, counts, and marks per question.
            </p>
          </div>

          {/* Quick Pattern Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Load Pattern:</span>
            <select
              id="select-paper-pattern"
              value={selectedPatternId}
              onChange={e => handleSelectPattern(e.target.value)}
              aria-label="Preset Question Paper Pattern"
              className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-indigo-700 focus:outline-none cursor-pointer"
            >
              {paperPatterns.map(pat => (
                <option key={pat.id} value={pat.id}>
                  {pat.name} ({pat.totalMarks} Marks)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Blueprint Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Section Title & Instructions</th>
                <th className="px-4 py-3">Question Type</th>
                <th className="px-4 py-3 text-center">Questions</th>
                <th className="px-4 py-3 text-center">Marks / Q</th>
                <th className="px-4 py-3 text-right">Total Marks</th>
                <th className="px-3 py-3 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {blueprintRows.map((row, idx) => {
                const sectionLetter = String.fromCharCode(65 + idx);
                return (
                  <tr key={row.id || idx} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 min-w-[200px]">
                      <input
                        type="text"
                        value={row.sectionTitle || `SECTION ${sectionLetter}`}
                        onChange={e => updateRow(idx, 'sectionTitle', e.target.value)}
                        className="w-full text-xs font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={row.instructions || ''}
                        placeholder="Section instructions (e.g. Choose correct answer)"
                        onChange={e => updateRow(idx, 'instructions', e.target.value)}
                        className="w-full text-[11px] text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none mt-1"
                      />
                    </td>

                    <td className="px-4 py-3 min-w-[160px]">
                      <select
                        value={row.questionType}
                        onChange={e => updateRow(idx, 'questionType', e.target.value as QuestionType)}
                        aria-label={`Question type for section ${sectionLetter}`}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      >
                        {QUESTION_TYPES.map(t => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={row.numberOfQuestions}
                        onChange={e => updateRow(idx, 'numberOfQuestions', Math.max(1, parseInt(e.target.value) || 1))}
                        aria-label={`Number of questions for section ${sectionLetter}`}
                        className="w-16 text-center text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={row.marksPerQuestion}
                        onChange={e => updateRow(idx, 'marksPerQuestion', Math.max(1, parseInt(e.target.value) || 1))}
                        aria-label={`Marks per question for section ${sectionLetter}`}
                        className="w-16 text-center text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    <td className="px-4 py-3 text-right font-bold text-slate-900">
                      {row.numberOfQuestions * row.marksPerQuestion} M
                    </td>

                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => removeRow(idx)}
                        disabled={blueprintRows.length <= 1}
                        title="Remove section row"
                        className={`p-1 rounded text-slate-400 hover:text-rose-600 transition-colors ${
                          blueprintRows.length <= 1 ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-xs text-slate-800">
              <tr>
                <td className="px-4 py-3">Total Blueprint Summary</td>
                <td className="px-4 py-3">{blueprintRows.length} Sections</td>
                <td className="px-4 py-3 text-center">{totalQuestionsCount} Questions</td>
                <td className="px-4 py-3 text-center">—</td>
                <td className="px-4 py-3 text-right text-indigo-700 text-sm">
                  {calculatedMaxMarks} Marks
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <button
          onClick={addRow}
          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Section</span>
        </button>
      </section>

      {/* SECTION 5: DIFFICULTY & ADVANCED CONTROLS */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Section 5</span>
            <h2 className="text-lg font-bold text-slate-900">Difficulty & Generation Rules</h2>
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}</span>
          </button>
        </div>

        {/* Difficulty Level Buttons */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Target Difficulty Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['easy', 'moderate', 'difficult', 'mixed'] as DifficultyLevel[]).map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => setDifficulty(lvl)}
                className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all capitalize cursor-pointer ${
                  difficulty === lvl
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Mixed Distribution Sliders */}
        {difficulty === 'mixed' && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="text-xs font-semibold text-slate-700">
              Mixed Difficulty Distribution: {difficultyDistribution.easy}% Easy, {difficultyDistribution.moderate}% Moderate, {difficultyDistribution.difficult}% Difficult
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Easy: {difficultyDistribution.easy}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={difficultyDistribution.easy}
                  onChange={e => setDifficultyDistribution({ ...difficultyDistribution, easy: Number(e.target.value) })}
                  className="w-full accent-indigo-600 mt-1 cursor-pointer"
                />
              </div>
              <div>
                <span className="text-slate-500 font-medium">Moderate: {difficultyDistribution.moderate}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={difficultyDistribution.moderate}
                  onChange={e => setDifficultyDistribution({ ...difficultyDistribution, moderate: Number(e.target.value) })}
                  className="w-full accent-indigo-600 mt-1 cursor-pointer"
                />
              </div>
              <div>
                <span className="text-slate-500 font-medium">Difficult: {difficultyDistribution.difficult}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={difficultyDistribution.difficult}
                  onChange={e => setDifficultyDistribution({ ...difficultyDistribution, difficult: Number(e.target.value) })}
                  className="w-full accent-indigo-600 mt-1 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Advanced Options Accordion */}
        {showAdvanced && (
          <div className="pt-4 border-t border-slate-200 space-y-4">
            {/* Broader Syllabus Toggle */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allowBroaderSyllabus}
                onChange={e => setAllowBroaderSyllabus(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
              />
              <div>
                <div className="text-xs font-bold text-slate-800">Allow Broader Syllabus Content</div>
                <div className="text-[11px] text-slate-500">
                  By default disabled: questions are restricted strictly to selected textbook chapters.
                </div>
              </div>
            </label>

            {/* Restart Numbering Per Section */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={restartNumberingPerSection}
                onChange={e => setRestartNumberingPerSection(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
              />
              <div>
                <div className="text-xs font-bold text-slate-800">Restart Numbering in Each Section</div>
                <div className="text-[11px] text-slate-500">
                  By default disabled: question numbering continues seamlessly across all sections (1 to {totalQuestionsCount}).
                </div>
              </div>
            </label>

            {/* Special Instructions for AI */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Special Examiner Instructions (Optional)
              </label>
              <textarea
                rows={2}
                value={specialInstructions}
                onChange={e => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Include 1 question focusing on the poetic devices in stanza 2 of 'If...'."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </section>

      {/* ACTION BAR: GENERATE BUTTON */}
      <div className="bg-slate-900 p-6 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div>
          <div className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Ready to Assemble</div>
          <div className="text-lg font-bold">
            {selectedChapterIds.length} Chapters • {totalQuestionsCount} Questions • {calculatedMaxMarks} Marks
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Strict grounded question synthesis with duplicate-check and answer key generation.
          </div>
        </div>

        <button
          id="btn-generate-test-paper"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Generating Paper...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>GENERATE TEST PAPER</span>
            </>
          )}
        </button>
      </div>

      {/* GENERATION PROGRESS MODAL */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Synthesizing Examination Paper</h3>
              <p className="text-xs text-slate-500">
                Grounding questions in selected textbook chapters with strict blueprint constraints.
              </p>
            </div>

            {/* Step list */}
            <div className="space-y-3">
              {generationSteps.map((step, idx) => {
                const isCompleted = generationStep > idx;
                const isCurrent = generationStep === idx;
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                      isCurrent
                        ? 'bg-indigo-50/80 border border-indigo-200'
                        : isCompleted
                        ? 'text-slate-600'
                        : 'text-slate-300'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`text-xs font-semibold ${isCurrent ? 'text-indigo-950 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                        {step.title}
                      </div>
                      <div className="text-[10px] text-slate-500">{step.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

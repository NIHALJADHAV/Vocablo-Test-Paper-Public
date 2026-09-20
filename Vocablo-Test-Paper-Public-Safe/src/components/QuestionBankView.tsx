import React, { useState, useEffect } from 'react';
import { QuestionBankItem, QuestionType, DifficultyLevel } from '../types';
import {
  Database,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  BookOpen,
  Award,
  Sparkles,
  Tag,
  Copy,
  Check
} from 'lucide-react';
import { api } from '../services/api';

export const QuestionBankView: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New question modal state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newQuestionData, setNewQuestionData] = useState<Partial<QuestionBankItem>>({
    question: '',
    questionType: 'Short Answer',
    subject: 'English',
    grade: '7',
    chapter: '',
    difficulty: 'moderate',
    marks: 3,
    answer: '',
    markingRubric: ['Accurate concept: 1M', 'Key textual facts: 2M']
  });

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const data = await api.getQuestionBank();
      setQuestions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleCopyQuestion = (q: QuestionBankItem) => {
    navigator.clipboard.writeText(`${q.question}\nAnswer: ${q.answer}`);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleCreateQuestion = async () => {
    if (!newQuestionData.question || !newQuestionData.answer) {
      alert('Question and answer are required.');
      return;
    }
    try {
      const created = await api.saveToQuestionBank(newQuestionData as QuestionBankItem);
      setQuestions([created, ...questions]);
      setIsAddingNew(false);
      setNewQuestionData({
        question: '',
        questionType: 'Short Answer',
        subject: 'English',
        grade: '7',
        chapter: '',
        difficulty: 'moderate',
        marks: 3,
        answer: '',
        markingRubric: ['Accurate concept: 1M', 'Key textual facts: 2M']
      });
    } catch (e) {
      console.error(e);
      alert('Failed to add question to bank');
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch =
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.chapter.toLowerCase().includes(search.toLowerCase()) ||
      q.answer.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = selectedSubject === 'ALL' || q.subject === selectedSubject;
    const matchesType = selectedType === 'ALL' || q.questionType === selectedType;
    const matchesDiff = selectedDifficulty === 'ALL' || q.difficulty === selectedDifficulty;
    return matchesSearch && matchesSubject && matchesType && matchesDiff;
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Centralized Assessment Repository</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Question Bank</h1>
          <p className="text-sm text-slate-500 mt-1">
            Curated and verified questions from approved curriculum textbooks and past exams.
          </p>
        </div>

        <button
          id="btn-add-question-bank"
          onClick={() => setIsAddingNew(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Question</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions by keyword or chapter..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <select
          value={selectedSubject}
          onChange={e => setSelectedSubject(e.target.value)}
          aria-label="Filter by subject"
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="ALL">All Subjects</option>
          <option value="English">English</option>
          <option value="Science">Science</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Social Studies">Social Studies</option>
          <option value="EVS">EVS</option>
        </select>

        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          aria-label="Filter by question type"
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="ALL">All Question Types</option>
          <option value="MCQ">MCQ</option>
          <option value="Fill in the Blanks">Fill in the Blanks</option>
          <option value="True / False">True / False</option>
          <option value="Short Answer">Short Answer</option>
          <option value="Long Answer">Long Answer</option>
          <option value="Application / HOTS">Application / HOTS</option>
        </select>

        <select
          value={selectedDifficulty}
          onChange={e => setSelectedDifficulty(e.target.value)}
          aria-label="Filter by difficulty"
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="ALL">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="moderate">Moderate</option>
          <option value="difficult">Difficult</option>
        </select>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-16 text-slate-400">Loading questions...</div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-white rounded-xl border border-slate-200">
            No questions found matching the selected filters.
          </div>
        ) : (
          filteredQuestions.map(q => (
            <div
              key={q.id}
              className="bg-white p-5 rounded-xl border border-slate-200/80 hover:border-indigo-200 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded">
                    {q.questionType}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Class {q.grade} • {q.subject}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    • Ch: {q.chapter}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {q.marks} Marks
                  </span>
                  <button
                    onClick={() => handleCopyQuestion(q)}
                    title="Copy question text & answer"
                    className="p-1 text-slate-400 hover:text-indigo-600 rounded cursor-pointer"
                  >
                    {copiedId === q.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-sm font-semibold text-slate-900 leading-relaxed">
                {q.question}
              </div>

              {q.options && q.options.length > 0 && (
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {q.options.map((opt, i) => (
                    <div key={i}>{opt}</div>
                  ))}
                </div>
              )}

              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-lg text-xs space-y-1">
                <span className="font-bold text-emerald-800 uppercase tracking-wider text-[10px]">
                  Model Answer:
                </span>
                <div className="text-emerald-950 font-medium">{q.answer}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Question Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900">Add Question to Question Bank</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Question Text</label>
                <textarea
                  rows={3}
                  value={newQuestionData.question}
                  onChange={e => setNewQuestionData({ ...newQuestionData, question: e.target.value })}
                  placeholder="Enter complete question statement..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={newQuestionData.subject}
                    onChange={e => setNewQuestionData({ ...newQuestionData, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class / Grade</label>
                  <input
                    type="text"
                    value={newQuestionData.grade}
                    onChange={e => setNewQuestionData({ ...newQuestionData, grade: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marks</label>
                  <input
                    type="number"
                    value={newQuestionData.marks}
                    onChange={e => setNewQuestionData({ ...newQuestionData, marks: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chapter Name</label>
                <input
                  type="text"
                  value={newQuestionData.chapter}
                  onChange={e => setNewQuestionData({ ...newQuestionData, chapter: e.target.value })}
                  placeholder="e.g. Roads to Mass Murder"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Expected Answer</label>
                <textarea
                  rows={2}
                  value={newQuestionData.answer}
                  onChange={e => setNewQuestionData({ ...newQuestionData, answer: e.target.value })}
                  placeholder="Full solution or answer key..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateQuestion}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg cursor-pointer"
              >
                Save to Bank
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

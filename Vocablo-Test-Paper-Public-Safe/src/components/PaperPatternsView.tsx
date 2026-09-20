import React, { useState } from 'react';
import { PaperPattern, BlueprintRow } from '../types';
import { Award, Plus, Trash2, CheckCircle2, Clock, Layers } from 'lucide-react';
import { api } from '../services/api';

interface PaperPatternsViewProps {
  patterns: PaperPattern[];
  onRefreshPatterns: () => void;
  onUsePattern: (pattern: PaperPattern) => void;
}

export const PaperPatternsView: React.FC<PaperPatternsViewProps> = ({
  patterns,
  onRefreshPatterns,
  onUsePattern
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [defaultDuration, setDefaultDuration] = useState('1 Hour');
  const [sections, setSections] = useState<BlueprintRow[]>([
    { id: '1', questionType: 'MCQ', numberOfQuestions: 5, marksPerQuestion: 2, totalMarks: 10, sectionTitle: 'SECTION A: MCQs' },
    { id: '2', questionType: 'Short Answer', numberOfQuestions: 5, marksPerQuestion: 3, totalMarks: 15, sectionTitle: 'SECTION B: SHORT ANSWERS' }
  ]);

  const updateSection = (index: number, field: keyof BlueprintRow, val: any) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: val };
    if (field === 'numberOfQuestions' || field === 'marksPerQuestion') {
      const q = field === 'numberOfQuestions' ? Number(val) : Number(updated[index].numberOfQuestions);
      const m = field === 'marksPerQuestion' ? Number(val) : Number(updated[index].marksPerQuestion);
      updated[index].totalMarks = q * m;
    }
    setSections(updated);
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: `row-${Date.now()}`,
        questionType: 'Long Answer',
        numberOfQuestions: 2,
        marksPerQuestion: 5,
        totalMarks: 10,
        sectionTitle: `SECTION ${String.fromCharCode(65 + sections.length)}: LONG ANSWERS`
      }
    ]);
  };

  const removeSection = (idx: number) => {
    if (sections.length <= 1) return;
    setSections(sections.filter((_, i) => i !== idx));
  };

  const totalCalculatedMarks = sections.reduce((s, r) => s + (r.numberOfQuestions * r.marksPerQuestion), 0);

  const handleSavePattern = async () => {
    if (!name.trim()) {
      alert('Pattern name is required');
      return;
    }
    try {
      await api.savePaperPattern({
        id: `pat-${Date.now()}`,
        name,
        description,
        grade: '7',
        subject: 'English',
        totalMarks: totalCalculatedMarks,
        defaultDuration,
        sections
      });
      setIsCreating(false);
      onRefreshPatterns();
    } catch (e) {
      console.error(e);
      alert('Failed to save paper pattern');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Standardized Blueprints</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Examination Paper Patterns</h1>
          <p className="text-sm text-slate-500 mt-1">
            Standard question distributions, mark allocations, and preset section architectures.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Blueprint</span>
        </button>
      </div>

      {/* Grid of Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patterns.map(pat => (
          <div
            key={pat.id}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{pat.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{pat.description}</p>
                </div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-lg border border-indigo-100">
                  {pat.totalMarks} Marks
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Sections & Distribution ({pat.sections.length})
                </div>
                <div className="space-y-1 text-xs">
                  {pat.sections.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100 text-slate-700"
                    >
                      <span className="font-medium">{s.sectionTitle || s.questionType}</span>
                      <span className="text-slate-500">
                        {s.numberOfQuestions} Qs × {s.marksPerQuestion} M = <strong>{s.numberOfQuestions * s.marksPerQuestion} M</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Duration: {pat.defaultDuration || '1 Hour'}
              </span>
              <button
                onClick={() => onUsePattern(pat)}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Use in New Paper →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900">Define Custom Paper Blueprint</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pattern Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Mid-Term 50 Marks"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g. For Class 7-8 English Term Exam"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Sections Architecture</label>
                {sections.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={s.sectionTitle}
                      onChange={e => updateSection(idx, 'sectionTitle', e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs"
                    />
                    <input
                      type="number"
                      value={s.numberOfQuestions}
                      onChange={e => updateSection(idx, 'numberOfQuestions', Number(e.target.value))}
                      className="w-14 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-center"
                    />
                    <span>×</span>
                    <input
                      type="number"
                      value={s.marksPerQuestion}
                      onChange={e => updateSection(idx, 'marksPerQuestion', Number(e.target.value))}
                      className="w-14 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-center"
                    />
                    <span className="font-bold w-12 text-right">{s.numberOfQuestions * s.marksPerQuestion}M</span>
                    <button
                      onClick={() => removeSection(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addSection}
                  className="text-indigo-600 text-xs font-semibold hover:underline"
                >
                  + Add Section
                </button>
              </div>

              <div className="text-right font-bold text-slate-800 pt-2 border-t border-slate-100">
                Total Pattern Marks: {totalCalculatedMarks} M
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePattern}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg cursor-pointer"
              >
                Save Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

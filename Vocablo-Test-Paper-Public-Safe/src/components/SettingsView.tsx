import React from 'react';
import { Sparkles, Shield, Cpu, Database, CheckCircle2, HelpCircle } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
          <Cpu className="w-3.5 h-3.5" />
          <span>System & Academic Configurations</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Server-side AI synthesis models, blueprint guidelines, and security policies.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Assessment Model Pipeline</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Powered by Google DeepMind's Gemini API via server-side execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="font-bold text-slate-800">Active Model</div>
            <div className="text-indigo-600 font-mono font-semibold">gemini-3.8-flash</div>
            <div className="text-slate-500 text-[11px] pt-1">
              Optimized for high-speed curriculum grounding, strict JSON schema output, and question synthesis.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="font-bold text-slate-800">Architecture Security</div>
            <div className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Server-side Proxy Active
            </div>
            <div className="text-slate-500 text-[11px] pt-1">
              Zero client-side API key exposure. All prompts and outputs undergo server-side quality validation.
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-5 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Quality Assurance Rules
          </h4>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Blueprint Mark Equality:</strong> Every test paper strictly adheres to Section Questions × Marks per Question = Maximum Marks.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Textbook Grounding:</strong> Questions are synthesized exclusively from selected chapters unless the teacher explicitly toggles broader syllabus.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Answer Key Generation:</strong> Every single generated question includes a complete model solution and point-by-point marking rubric.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>MCQ 4-Option Rule:</strong> Multiple choice questions are validated to always feature 4 distinct options (A, B, C, D).
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

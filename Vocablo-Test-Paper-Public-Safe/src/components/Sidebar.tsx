import React, { useState } from 'react';
import { TestPaper } from '../types';
import { Plus, FileText, Trash2, ChevronsUpDown, GraduationCap } from 'lucide-react';

interface SidebarProps {
  papers: TestPaper[];
  activePaperId: string | null;
  onSelectPaper: (paper: TestPaper) => void;
  onNewPaper: () => void;
  isNewPaperActive: boolean;
  onDeletePaper: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onOpenAdmin?: () => void;
  isAdminActive?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  papers,
  activePaperId,
  onSelectPaper,
  onNewPaper,
  isNewPaperActive,
  onDeletePaper,
  isOpen,
  onOpenAdmin,
  isAdminActive = false
}) => {
  const [hoveredPaperId, setHoveredPaperId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 h-screen select-none">
      {/* Brand Header matching screenshot */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h1 className="font-bold text-slate-900 text-lg tracking-tight">
          Ace GPT AI
        </h1>
      </div>

      {/* New Test Paper Button */}
      <div className="p-4">
        <button
          id="btn-new-test-paper"
          onClick={() => {
            onNewPaper();
          }}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
            isNewPaperActive && !isAdminActive
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs hover:border-slate-300'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>New Test Paper</span>
        </button>
      </div>

      {/* Test Papers List */}
      <div className="flex-1 px-3 overflow-y-auto space-y-1">
        <div className="px-3 py-1 text-[11px] font-medium text-slate-400">
          Test Papers
        </div>

        {papers.length === 0 ? (
          <div className="px-3 py-6 text-center text-xs text-slate-400">
            No test papers yet. Click "+ New Test Paper" to create one.
          </div>
        ) : (
          papers.map(paper => {
            const isSelected = !isAdminActive && !isNewPaperActive && activePaperId === paper.id;
            return (
              <div
                key={paper.id}
                onMouseEnter={() => setHoveredPaperId(paper.id)}
                onMouseLeave={() => setHoveredPaperId(null)}
                className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                onClick={() => onSelectPaper(paper)}
              >
                <FileText className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-slate-800' : 'text-slate-400'}`} />
                <span className="flex-1 truncate" title={paper.title}>
                  {paper.title || 'Untitled Test Paper'}
                </span>

                {hoveredPaperId === paper.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this test paper?')) {
                        onDeletePaper(paper.id);
                      }
                    }}
                    title="Delete paper"
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-600 text-slate-400 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Admin Panel Quick Link */}
      {onOpenAdmin && (
        <div className="px-3 py-2 border-t border-slate-100">
          <button
            onClick={onOpenAdmin}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              isAdminActive
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span className="flex-1 text-left">Tutor LMS Admin</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 font-bold">
              Admin
            </span>
          </button>
        </div>
      )}

      {/* User Profile Footer */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs">
              U
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 leading-tight">User</span>
              <span className="text-[11px] text-slate-400 leading-tight">user@example.com</span>
            </div>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </aside>
  );
};

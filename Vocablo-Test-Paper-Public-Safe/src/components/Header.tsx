import React from 'react';
import { PanelLeft, Sun, ChevronRight, GraduationCap, BookOpen, Lock } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  currentBreadcrumb?: string;
  isGenerating?: boolean;
  onOpenAdmin?: () => void;
  onOpenUserView?: () => void;
  onLogoutAdmin?: () => void;
  isAdminActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  currentBreadcrumb = 'Test Paper Generator',
  onOpenAdmin,
  onOpenUserView,
  onLogoutAdmin,
  isAdminActive = false
}) => {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-5 flex items-center justify-between flex-shrink-0 select-none">
      {/* Left: Sidebar toggle + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          title="Toggle Sidebar"
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="hover:text-slate-800 cursor-pointer">Home</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="hover:text-slate-800 cursor-pointer">
            {isAdminActive ? 'Admin' : 'Tools'}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-semibold truncate max-w-md">
            {isAdminActive ? 'Tutor LMS Curriculum Manager' : currentBreadcrumb}
          </span>
        </nav>
      </div>

      {/* Right: Tutor LMS Admin Switcher & Theme */}
      <div className="flex items-center gap-2">
        {isAdminActive ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenUserView}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Switch to Front-End Generator</span>
            </button>
            {onLogoutAdmin && (
              <button
                onClick={onLogoutAdmin}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold transition-colors cursor-pointer"
                title="Lock and sign out of admin mode"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Admin</span>
              </button>
            )}
          </div>
        ) : (
          onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Open Tutor LMS Admin Panel (Password Protected)"
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Tutor LMS Admin</span>
            </button>
          )
        )}

        <button
          title="Toggle Theme"
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
        >
          <Sun className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};


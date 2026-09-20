import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SimpleGeneratorView } from './components/SimpleGeneratorView';
import { PaperPreviewView } from './components/PaperPreviewView';
import { AdminLMSPanel } from './components/AdminLMSPanel';
import { AdminAuthModal } from './components/AdminAuthModal';
import { Book, TestPaper } from './types';
import { api } from './services/api';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [testPapers, setTestPapers] = useState<TestPaper[]>([]);
  const [activePaper, setActivePaper] = useState<TestPaper | null>(null);
  const [isNewPaperActive, setIsNewPaperActive] = useState(true);
  const [isAdminActive, setIsAdminActive] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return (
      localStorage.getItem('ace_admin_auth') === 'true' ||
      sessionStorage.getItem('ace_admin_auth') === 'true'
    );
  });
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [preSelectedBookId, setPreSelectedBookId] = useState<string | undefined>(undefined);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // Initial Data Fetch
  const loadInitialData = async () => {
    try {
      const [fetchedBooks, fetchedPapers] = await Promise.all([
        api.getBooks(),
        api.getTestPapers()
      ]);

      setBooks(fetchedBooks);
      setTestPapers(fetchedPapers);

      // If papers exist, default active paper
      if (fetchedPapers.length > 0) {
        setActivePaper(fetchedPapers[0]);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsLoadingInitial(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Handlers
  const handleSelectPaper = (paper: TestPaper) => {
    setActivePaper(paper);
    setIsNewPaperActive(false);
    setIsAdminActive(false);
  };

  const handleRequestAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminActive(true);
    } else {
      setShowAdminAuthModal(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    setShowAdminAuthModal(false);
    setIsAdminActive(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('ace_admin_auth');
    sessionStorage.removeItem('ace_admin_auth');
    setIsAdminAuthenticated(false);
    setIsAdminActive(false);
  };

  const handleNewPaperClick = () => {
    setIsNewPaperActive(true);
    setIsAdminActive(false);
  };

  const handlePaperGenerated = (newPaper: TestPaper) => {
    setTestPapers(prev => [newPaper, ...prev]);
    setActivePaper(newPaper);
    setIsNewPaperActive(false);
    setIsAdminActive(false);
  };

  const handleUpdateActivePaper = (updated: TestPaper) => {
    setActivePaper(updated);
    setTestPapers(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const handleDuplicatePaper = async (paper: TestPaper) => {
    try {
      const duplicated = await api.duplicateTestPaper(paper.id);
      setTestPapers(prev => [duplicated, ...prev]);
      setActivePaper(duplicated);
      setIsNewPaperActive(false);
      setIsAdminActive(false);
    } catch (e) {
      console.error(e);
      alert('Failed to duplicate paper');
    }
  };

  const handleDeletePaper = async (paperId: string) => {
    try {
      await api.deleteTestPaper(paperId);
      const remaining = testPapers.filter(p => p.id !== paperId);
      setTestPapers(remaining);
      if (activePaper?.id === paperId) {
        if (remaining.length > 0) {
          setActivePaper(remaining[0]);
          setIsNewPaperActive(false);
        } else {
          setActivePaper(null);
          setIsNewPaperActive(true);
        }
      }
    } catch (e) {
      console.error(e);
      alert('Failed to delete paper');
    }
  };

  if (isLoadingInitial) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#f8fafc] text-slate-800 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
        <div className="text-sm font-semibold text-slate-700">Loading Ace GPT AI...</div>
      </div>
    );
  }

  const currentBreadcrumb = isNewPaperActive
    ? 'Test Paper Generator'
    : activePaper?.title || 'Untitled Test Paper';

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#f8fafc] font-sans text-slate-900">
      {/* Sleek Left Sidebar */}
      <Sidebar
        papers={testPapers}
        activePaperId={activePaper?.id || null}
        onSelectPaper={handleSelectPaper}
        onNewPaper={handleNewPaperClick}
        isNewPaperActive={isNewPaperActive}
        onDeletePaper={handleDeletePaper}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onOpenAdmin={handleRequestAdmin}
        isAdminActive={isAdminActive}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8fafc]">
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          currentBreadcrumb={currentBreadcrumb}
          onOpenAdmin={handleRequestAdmin}
          onOpenUserView={() => setIsAdminActive(false)}
          onLogoutAdmin={handleAdminLogout}
          isAdminActive={isAdminActive}
        />

        {/* Dynamic Center View */}
        <main className="flex-1 overflow-y-auto">
          {isAdminActive ? (
            <AdminLMSPanel
              books={books}
              onBooksUpdated={(updated) => setBooks(updated)}
              onBackToUserView={() => setIsAdminActive(false)}
              onLogoutAdmin={handleAdminLogout}
              onSelectBookForUser={(bookId) => {
                setPreSelectedBookId(bookId);
                setIsAdminActive(false);
                setIsNewPaperActive(true);
              }}
            />
          ) : isNewPaperActive || !activePaper ? (
            <SimpleGeneratorView
              books={books}
              preSelectedBookId={preSelectedBookId}
              onBooksUpdated={(updated) => setBooks(updated)}
              onPaperGenerated={handlePaperGenerated}
              onOpenAdmin={handleRequestAdmin}
            />
          ) : (
            <div className="max-w-5xl mx-auto py-6 px-4">
              <PaperPreviewView
                paper={activePaper}
                onUpdatePaper={handleUpdateActivePaper}
                onDuplicatePaper={handleDuplicatePaper}
                onBackToDashboard={handleNewPaperClick}
              />
            </div>
          )}
        </main>
      </div>

      {/* Admin Authentication Security Gate Modal */}
      <AdminAuthModal
        isOpen={showAdminAuthModal}
        onClose={() => setShowAdminAuthModal(false)}
        onSuccess={handleAdminAuthSuccess}
      />
    </div>
  );
}

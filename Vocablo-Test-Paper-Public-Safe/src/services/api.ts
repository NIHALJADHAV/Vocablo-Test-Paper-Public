import { Book, Chapter, PaperPattern, School, TestPaper, QuestionBankItem, QualityCheckReport, GeneratedQuestion } from '../types';

export const api = {
  // Health
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  // Schools
  async getSchools(): Promise<School[]> {
    const res = await fetch('/api/schools');
    if (!res.ok) throw new Error('Failed to fetch schools');
    return res.json();
  },

  async getSchool(id: string): Promise<School> {
    const res = await fetch(`/api/schools/${id}`);
    if (!res.ok) throw new Error('Failed to fetch school');
    return res.json();
  },

  async saveSchool(school: School): Promise<School> {
    const res = await fetch('/api/schools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(school)
    });
    if (!res.ok) throw new Error('Failed to save school');
    return res.json();
  },

  // Books
  async getBooks(): Promise<Book[]> {
    const res = await fetch('/api/books');
    if (!res.ok) throw new Error('Failed to fetch books');
    return res.json();
  },

  async getBook(id: string): Promise<Book> {
    const res = await fetch(`/api/books/${id}`);
    if (!res.ok) throw new Error('Failed to fetch book');
    return res.json();
  },

  async createBook(book: Partial<Book>): Promise<Book> {
    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book)
    });
    if (!res.ok) throw new Error('Failed to create book');
    return res.json();
  },

  async adminUploadBook(data: {
    title: string;
    subject: string;
    grade: string;
    board?: string;
    academicYear?: string;
    description?: string;
    chapters?: Array<{ title: string; contentSummary?: string; fullTextOrExcerpts?: string }>;
  }): Promise<{ book: Book; chapters: Chapter[] }> {
    const res = await fetch('/api/admin/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to upload book' }));
      throw new Error(err.error || 'Failed to upload book');
    }
    return res.json();
  },

  async scanAndProcessBook(data: {
    title?: string;
    subject: string;
    grade: string;
    board?: string;
    academicYear?: string;
    fileName?: string;
    fileData?: string;
    rawContent?: string;
  }): Promise<{ success: boolean; message: string; book: Book; chapters: Chapter[] }> {
    const res = await fetch('/api/books/scan-and-process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to scan and process book' }));
      throw new Error(err.error || 'Failed to scan textbook and extract lessons');
    }
    return res.json();
  },

  async updateBook(id: string, updates: Partial<Book>): Promise<Book> {
    const res = await fetch(`/api/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update book');
    return res.json();
  },

  async deleteBook(id: string): Promise<boolean> {
    const res = await fetch(`/api/books/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete book');
    return true;
  },

  // Chapters
  async getChapters(bookId?: string): Promise<Chapter[]> {
    const url = bookId ? `/api/chapters?bookId=${encodeURIComponent(bookId)}` : '/api/chapters';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch chapters');
    return res.json();
  },

  async addChapter(bookId: string, chapter: Partial<Chapter>): Promise<Chapter> {
    const res = await fetch(`/api/books/${bookId}/chapters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chapter)
    });
    if (!res.ok) throw new Error('Failed to add chapter');
    return res.json();
  },

  async updateChapter(id: string, updates: Partial<Chapter>): Promise<Chapter> {
    const res = await fetch(`/api/chapters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update chapter');
    return res.json();
  },

  async deleteChapter(id: string): Promise<boolean> {
    const res = await fetch(`/api/chapters/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete chapter');
    return true;
  },

  // Extract textbook
  async extractTextbook(payload: {
    fileName: string;
    fileContent: string;
    bookTitle: string;
    grade: string;
    subject: string;
  }): Promise<{ message: string; book: Book; chapters: Chapter[] }> {
    const res = await fetch('/api/extract-textbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to process textbook upload');
    return res.json();
  },

  // Paper Patterns
  async getPaperPatterns(): Promise<PaperPattern[]> {
    const res = await fetch('/api/paper-patterns');
    if (!res.ok) throw new Error('Failed to fetch paper patterns');
    return res.json();
  },

  async savePaperPattern(pattern: PaperPattern): Promise<PaperPattern> {
    const res = await fetch('/api/paper-patterns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pattern)
    });
    if (!res.ok) throw new Error('Failed to save paper pattern');
    return res.json();
  },

  // Test Papers
  async getTestPapers(): Promise<TestPaper[]> {
    const res = await fetch('/api/test-papers');
    if (!res.ok) throw new Error('Failed to fetch test papers');
    return res.json();
  },

  async getTestPaper(id: string): Promise<TestPaper> {
    const res = await fetch(`/api/test-papers/${id}`);
    if (!res.ok) throw new Error('Failed to fetch test paper');
    return res.json();
  },

  async saveTestPaper(paper: TestPaper): Promise<TestPaper> {
    const method = paper.id && !paper.id.startsWith('draft-') ? 'PUT' : 'POST';
    const url = method === 'PUT' ? `/api/test-papers/${paper.id}` : '/api/test-papers';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paper)
    });
    if (!res.ok) throw new Error('Failed to save test paper');
    return res.json();
  },

  async updateTestPaper(id: string, updates: Partial<TestPaper>): Promise<TestPaper> {
    const res = await fetch(`/api/test-papers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update test paper');
    return res.json();
  },

  async deleteTestPaper(id: string): Promise<void> {
    const res = await fetch(`/api/test-papers/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete test paper');
  },

  async duplicateTestPaper(id: string): Promise<TestPaper> {
    const res = await fetch(`/api/test-papers/${id}/duplicate`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to duplicate test paper');
    return res.json();
  },

  // Generation
  async generateTestPaper(payload: any): Promise<{ message: string; paper: TestPaper }> {
    const res = await fetch('/api/generate-paper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate test paper');
    }
    return res.json();
  },

  // Single Question Regeneration
  async regenerateQuestion(payload: {
    paperId: string;
    sectionId: string;
    questionId: string;
  }): Promise<{ message: string; question: GeneratedQuestion }> {
    const res = await fetch('/api/regenerate-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to regenerate question');
    }
    return res.json();
  },

  // Validation
  async validatePaper(paper: TestPaper): Promise<QualityCheckReport> {
    const res = await fetch('/api/validate-paper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paper)
    });
    if (!res.ok) throw new Error('Failed to validate paper');
    return res.json();
  },

  // Question Bank
  async getQuestionBank(params?: { subject?: string; grade?: string; questionType?: string }): Promise<QuestionBankItem[]> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`/api/question-bank?${query}`);
    if (!res.ok) throw new Error('Failed to fetch question bank');
    return res.json();
  },

  async saveToQuestionBank(item: QuestionBankItem): Promise<QuestionBankItem> {
    const res = await fetch('/api/question-bank', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to save to question bank');
    return res.json();
  }
};

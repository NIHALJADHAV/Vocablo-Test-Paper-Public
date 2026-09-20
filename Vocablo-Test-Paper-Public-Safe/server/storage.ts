import {
  School,
  Book,
  Chapter,
  PaperPattern,
  TestPaper,
  GeneratedQuestion,
  QuestionBankItem
} from '../src/types';
import {
  INITIAL_SCHOOLS,
  INITIAL_BOOKS,
  INITIAL_CHAPTERS,
  INITIAL_PAPER_PATTERNS
} from '../src/data/seedData';

export class ServerStorage {
  private schools: Map<string, School> = new Map();
  private books: Map<string, Book> = new Map();
  private chapters: Map<string, Chapter> = new Map();
  private paperPatterns: Map<string, PaperPattern> = new Map();
  private testPapers: Map<string, TestPaper> = new Map();
  private questionBank: Map<string, QuestionBankItem> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    INITIAL_SCHOOLS.forEach(s => this.schools.set(s.id, s));
    INITIAL_BOOKS.forEach(b => this.books.set(b.id, b));
    INITIAL_CHAPTERS.forEach(c => this.chapters.set(c.id, c));
    INITIAL_PAPER_PATTERNS.forEach(p => this.paperPatterns.set(p.id, p));
  }

  // School methods
  getSchools(): School[] {
    return Array.from(this.schools.values());
  }
  getSchool(id: string): School | undefined {
    return this.schools.get(id);
  }
  saveSchool(school: School): School {
    this.schools.set(school.id, school);
    return school;
  }

  // Book methods
  getBooks(): Book[] {
    return Array.from(this.books.values());
  }
  getBook(id: string): Book | undefined {
    return this.books.get(id);
  }
  saveBook(book: Book): Book {
    this.books.set(book.id, book);
    return book;
  }
  updateBook(id: string, updates: Partial<Book>): Book | undefined {
    const existing = this.books.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.books.set(id, updated);
    return updated;
  }
  deleteBook(id: string): boolean {
    const deleted = this.books.delete(id);
    for (const [chapId, chap] of this.chapters.entries()) {
      if (chap.bookId === id) {
        this.chapters.delete(chapId);
      }
    }
    return deleted;
  }

  // Chapter methods
  getChapters(bookId?: string): Chapter[] {
    const all = Array.from(this.chapters.values());
    if (bookId) {
      return all.filter(c => c.bookId === bookId).sort((a, b) => a.chapterNumber - b.chapterNumber);
    }
    return all.sort((a, b) => a.chapterNumber - b.chapterNumber);
  }
  getChapter(id: string): Chapter | undefined {
    return this.chapters.get(id);
  }
  saveChapter(chapter: Chapter): Chapter {
    this.chapters.set(chapter.id, chapter);
    const book = this.books.get(chapter.bookId);
    if (book) {
      const count = this.getChapters(chapter.bookId).length;
      book.chaptersCount = count;
      this.books.set(book.id, book);
    }
    return chapter;
  }
  updateChapter(id: string, updates: Partial<Chapter>): Chapter | undefined {
    const existing = this.chapters.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.chapters.set(id, updated);
    return updated;
  }
  deleteChapter(id: string): boolean {
    const existing = this.chapters.get(id);
    if (!existing) return false;
    const bookId = existing.bookId;
    this.chapters.delete(id);
    const book = this.books.get(bookId);
    if (book) {
      const count = this.getChapters(bookId).length;
      book.chaptersCount = count;
      this.books.set(book.id, book);
    }
    return true;
  }

  // Paper Pattern methods
  getPaperPatterns(): PaperPattern[] {
    return Array.from(this.paperPatterns.values());
  }
  getPaperPattern(id: string): PaperPattern | undefined {
    return this.paperPatterns.get(id);
  }
  savePaperPattern(pattern: PaperPattern): PaperPattern {
    this.paperPatterns.set(pattern.id, pattern);
    return pattern;
  }

  // Test Paper methods
  getTestPapers(): TestPaper[] {
    return Array.from(this.testPapers.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }
  getTestPaper(id: string): TestPaper | undefined {
    return this.testPapers.get(id);
  }
  saveTestPaper(paper: TestPaper): TestPaper {
    this.testPapers.set(paper.id, paper);
    return paper;
  }
  deleteTestPaper(id: string): boolean {
    return this.testPapers.delete(id);
  }

  // Question bank
  getQuestionBank(filter?: { subject?: string; grade?: string; questionType?: string }): QuestionBankItem[] {
    let list = Array.from(this.questionBank.values());
    if (filter?.subject) list = list.filter(q => q.subject.toLowerCase() === filter.subject!.toLowerCase());
    if (filter?.grade) list = list.filter(q => q.grade === filter.grade);
    if (filter?.questionType) list = list.filter(q => q.questionType === filter.questionType);
    return list;
  }
  saveQuestionToBank(item: QuestionBankItem): QuestionBankItem {
    this.questionBank.set(item.id, item);
    return item;
  }
}

export const storage = new ServerStorage();

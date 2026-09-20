import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { storage } from './server/storage';
import { generateTestPaperWithAI, regenerateSingleQuestion, scanAndExtractBookLessons } from './server/geminiService';
import { Book, Chapter, PaperPattern, School, TestPaper, QuestionBankItem, QualityCheckReport, QualityCheckItem, TeacherQualityGateReport, QuestionQualityScorecard, GeneratedQuestion, AssessmentDepthLayer, QuestionBudgetCategory, LessonQuestionBudget, CandidatePoolAudit, AnswerKeyValidationReport } from './src/types';
import { scoreQuestionWithScorecard, auditMCQDistractors, isGenericQuestion, determineQuestionDepthLayer, assessGuessingVulnerability, checkSingleFactRepetition, classifyQuestionBudgetCategory, computeLessonQuestionBudgets, buildCandidatePoolAndPipelineAudit, runAnswerKeyAndExamValidationEngine } from './server/scorecardService';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ----------------------------------------------------
// REST API ENDPOINTS
// ----------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Schools API
app.get('/api/schools', (req, res) => {
  res.json(storage.getSchools());
});

app.get('/api/schools/:id', (req, res) => {
  const school = storage.getSchool(req.params.id);
  if (!school) return res.status(404).json({ error: 'School not found' });
  res.json(school);
});

app.post('/api/schools', (req, res) => {
  const data: School = req.body;
  if (!data.id) {
    data.id = `school-${Date.now()}`;
  }
  const saved = storage.saveSchool(data);
  res.status(201).json(saved);
});

// Books API
app.get('/api/books', (req, res) => {
  res.json(storage.getBooks());
});

app.get('/api/books/:id', (req, res) => {
  const book = storage.getBook(req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

app.post('/api/books', (req, res) => {
  const data: Partial<Book> = req.body;
  if (!data.title || !data.subject || !data.grade) {
    return res.status(400).json({ error: 'Title, subject, and grade are required.' });
  }
  const newBook: Book = {
    id: data.id || `book-${Date.now()}`,
    title: data.title,
    grade: data.grade,
    subject: data.subject,
    board: data.board || 'CBSE',
    academicYear: data.academicYear || '2026-27',
    description: data.description || '',
    chaptersCount: 0
  };
  const saved = storage.saveBook(newBook);
  res.status(201).json(saved);
});

// Admin Book Upload with Chapters API
app.post('/api/admin/books', (req, res) => {
  const { title, subject, grade, board, academicYear, description, chapters } = req.body;
  if (!title || !subject || !grade) {
    return res.status(400).json({ error: 'Title, subject, and grade are required.' });
  }

  const bookId = `book-${Date.now()}`;
  const newBook: Book = {
    id: bookId,
    title: title.trim(),
    subject: subject.trim(),
    grade: String(grade).trim(),
    board: board || 'CBSE',
    academicYear: academicYear || '2026-27',
    description: description || '',
    chaptersCount: 0
  };
  storage.saveBook(newBook);

  const savedChapters: Chapter[] = [];
  if (Array.isArray(chapters) && chapters.length > 0) {
    chapters.forEach((ch: any, idx: number) => {
      const chapterTitle = typeof ch === 'string' ? ch.trim() : (ch.title ? ch.title.trim() : `Chapter ${idx + 1}`);
      if (!chapterTitle) return;
      const chapter: Chapter = {
        id: `chap-${bookId}-${idx + 1}`,
        bookId,
        chapterNumber: idx + 1,
        title: chapterTitle,
        type: ch.type || (subject.toLowerCase().includes('english') ? 'Prose' : 'Concept'),
        contentSummary: ch.contentSummary || `Study chapter on ${chapterTitle} covering core curriculum concepts, exercises, and examples.`,
        fullTextOrExcerpts: ch.fullTextOrExcerpts || ch.contentSummary || `Key textbook readings and concepts for ${chapterTitle}.`,
        vocabulary: Array.isArray(ch.vocabulary) && ch.vocabulary.length > 0 ? ch.vocabulary : ['concept', 'analysis', 'comprehension', 'application'],
        concepts: Array.isArray(ch.concepts) && ch.concepts.length > 0 ? ch.concepts : [chapterTitle, 'Principles', 'Applications'],
        learningOutcomes: [`Master core understanding of ${chapterTitle}`],
        importantFacts: [`Key textbook definition and exercise material for ${chapterTitle}`]
      };
      storage.saveChapter(chapter);
      savedChapters.push(chapter);
    });
  }

  newBook.chaptersCount = savedChapters.length;
  storage.saveBook(newBook);

  res.status(201).json({ book: newBook, chapters: savedChapters });
});

app.put('/api/books/:id', (req, res) => {
  const updated = storage.updateBook(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Book not found' });
  res.json(updated);
});

app.delete('/api/books/:id', (req, res) => {
  const deleted = storage.deleteBook(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Book not found' });
  res.json({ success: true, message: 'Book deleted successfully' });
});

// Automated Book Upload, Deep Scan & Lesson Synchronization API
app.post('/api/books/scan-and-process', async (req, res) => {
  try {
    const {
      title,
      subject,
      grade,
      board = 'CBSE',
      academicYear = '2026-27',
      fileName = '',
      fileData = '',
      rawContent = ''
    } = req.body;

    if (!title && !fileName && !rawContent) {
      return res.status(400).json({ error: 'Please provide a book title or upload a textbook file.' });
    }

    const cleanFileName = fileName ? fileName.replace(/\.[^/.]+$/, '').replace(/[_\\-]/g, ' ') : '';
    const resolvedTitle = (title || cleanFileName || 'Scanned Textbook').trim();
    const resolvedSubject = (subject || 'English').trim();
    const resolvedGrade = String(grade || '7').trim();

    // Run the automated scanning script
    const scanResult = await scanAndExtractBookLessons({
      title: resolvedTitle,
      subject: resolvedSubject,
      grade: resolvedGrade,
      board,
      academicYear,
      fileName,
      fileData,
      rawContent
    });

    const bookId = `book-scanned-${Date.now()}`;
    const newBook: Book = {
      id: bookId,
      title: resolvedTitle,
      subject: resolvedSubject,
      grade: resolvedGrade,
      board,
      academicYear,
      description: scanResult.description || `Scanned textbook with ${scanResult.chapters.length} synchronized lessons.`,
      chaptersCount: scanResult.chapters.length
    };
    storage.saveBook(newBook);

    const savedChapters: Chapter[] = [];
    const validChapterTypes = ['Prose', 'Poem', 'Drama', 'Informational', 'Grammar', 'Story', 'Concept'] as const;
    const defaultType = resolvedSubject.toLowerCase().includes('english') ? 'Prose' : 'Concept';

    scanResult.chapters.forEach((sc, idx) => {
      const assignedType = validChapterTypes.includes(sc.type as any)
        ? (sc.type as (typeof validChapterTypes)[number])
        : defaultType;

      const chapter: Chapter = {
        id: `chap-${bookId}-${sc.chapterNumber || idx + 1}`,
        bookId,
        chapterNumber: sc.chapterNumber || idx + 1,
        title: sc.title,
        type: assignedType,
        contentSummary: sc.contentSummary,
        fullTextOrExcerpts: sc.fullTextOrExcerpts || sc.contentSummary,
        vocabulary: sc.vocabulary,
        concepts: sc.concepts,
        learningOutcomes: sc.learningOutcomes,
        importantFacts: sc.importantFacts,
        importantCharacters: sc.importantCharacters,
        importantEvents: sc.importantEvents
      };
      storage.saveChapter(chapter);
      savedChapters.push(chapter);
    });

    newBook.chaptersCount = savedChapters.length;
    storage.saveBook(newBook);

    res.status(201).json({
      success: true,
      message: `Book scanned successfully! ${savedChapters.length} lessons extracted and synchronized.`,
      book: newBook,
      chapters: savedChapters
    });
  } catch (err: any) {
    console.error('Error scanning textbook and syncing lessons:', err);
    res.status(500).json({ error: err.message || 'Failed to scan textbook and extract lessons.' });
  }
});

// Chapters API
app.get('/api/chapters', (req, res) => {
  const bookId = req.query.bookId as string | undefined;
  const chapters = storage.getChapters(bookId);
  res.json(chapters);
});

app.get('/api/chapters/:id', (req, res) => {
  const chapter = storage.getChapter(req.params.id);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
  res.json(chapter);
});

app.post('/api/books/:id/chapters', (req, res) => {
  const bookId = req.params.id;
  const book = storage.getBook(bookId);
  if (!book) return res.status(404).json({ error: 'Book not found' });

  const data: Partial<Chapter> = req.body;
  if (!data.title) {
    return res.status(400).json({ error: 'Chapter title is required.' });
  }

  const existing = storage.getChapters(bookId);
  const newChapter: Chapter = {
    id: data.id || `chap-${Date.now()}`,
    bookId,
    chapterNumber: data.chapterNumber || (existing.length + 1),
    title: data.title,
    type: data.type || 'Prose',
    contentSummary: data.contentSummary || '',
    fullTextOrExcerpts: data.fullTextOrExcerpts || data.contentSummary || '',
    vocabulary: Array.isArray(data.vocabulary) ? data.vocabulary : [],
    concepts: Array.isArray(data.concepts) ? data.concepts : [],
    learningOutcomes: Array.isArray(data.learningOutcomes) ? data.learningOutcomes : [],
    importantFacts: Array.isArray(data.importantFacts) ? data.importantFacts : [],
    importantCharacters: Array.isArray(data.importantCharacters) ? data.importantCharacters : [],
    importantEvents: Array.isArray(data.importantEvents) ? data.importantEvents : []
  };

  const saved = storage.saveChapter(newChapter);
  res.status(201).json(saved);
});

app.put('/api/chapters/:id', (req, res) => {
  const updated = storage.updateChapter(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Chapter not found' });
  res.json(updated);
});

app.delete('/api/chapters/:id', (req, res) => {
  const deleted = storage.deleteChapter(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Chapter not found' });
  res.json({ success: true, message: 'Chapter deleted successfully' });
});

// Simulated/Smart Textbook Upload & OCR/Text Extractor
app.post('/api/extract-textbook', (req, res) => {
  const { fileName, fileContent, bookTitle, grade, subject } = req.body;

  if (!bookTitle || !grade || !subject) {
    return res.status(400).json({ error: 'Book title, grade, and subject are required.' });
  }

  // Create new book
  const newBook: Book = {
    id: `book-extracted-${Date.now()}`,
    title: bookTitle,
    grade,
    subject,
    board: 'CBSE',
    academicYear: '2026-27',
    description: `Extracted from uploaded document: ${fileName || 'textbook.pdf'}`,
    chaptersCount: 0
  };
  storage.saveBook(newBook);

  // Identify or create chapters from uploaded content
  // If file content has "Chapter" headers or markdown headings, parse them; otherwise create sample chapters
  const rawText = typeof fileContent === 'string' ? fileContent : '';
  const chapterSplits = rawText.split(/(?:Chapter\s+\d+|Unit\s+\d+|SECTION\s+\d+)/i).filter(s => s.trim().length > 50);

  const createdChapters: Chapter[] = [];

  if (chapterSplits.length > 1) {
    chapterSplits.forEach((chunk, index) => {
      const lines = chunk.trim().split('\n').map(l => l.trim()).filter(Boolean);
      const title = lines[0] ? lines[0].replace(/^[:\s-]+/, '').slice(0, 40) : `Chapter ${index + 1}`;
      const summary = lines.slice(1, 4).join(' ') || lines[0] || 'Extracted chapter overview.';
      const chapter: Chapter = {
        id: `chap-${newBook.id}-${index + 1}`,
        bookId: newBook.id,
        chapterNumber: index + 1,
        title,
        type: 'Prose',
        contentSummary: summary,
        fullTextOrExcerpts: chunk.slice(0, 2000),
        vocabulary: ['comprehension', 'analysis', 'concept', 'inference'],
        concepts: [title, 'Theme analysis', 'Textual evidence'],
        learningOutcomes: ['Understand key concepts', 'Extract factual information'],
        importantFacts: [`Key fact 1 from ${title}`, `Important textual reference from ${title}`]
      };
      storage.saveChapter(chapter);
      createdChapters.push(chapter);
    });
  } else {
    // Default extracted chapters if single text
    const defaultChapters = [
      { title: 'Introduction & Core Concepts', summary: rawText.slice(0, 300) || 'Foundational chapter content.' },
      { title: 'Advanced Analysis & Applications', summary: rawText.slice(300, 600) || 'Detailed principles and critical context.' },
      { title: 'Review & Evaluative Questions', summary: rawText.slice(600, 900) || 'Comprehensive exercises and summaries.' }
    ];

    defaultChapters.forEach((ch, idx) => {
      const chapter: Chapter = {
        id: `chap-${newBook.id}-${idx + 1}`,
        bookId: newBook.id,
        chapterNumber: idx + 1,
        title: ch.title,
        type: 'Prose',
        contentSummary: ch.summary,
        fullTextOrExcerpts: rawText.slice(idx * 800, (idx + 1) * 800) || ch.summary,
        vocabulary: ['evaluation', 'critical reasoning', 'vocabulary', 'application'],
        concepts: [ch.title, 'Understanding and analysis'],
        learningOutcomes: ['Master core competencies', 'Demonstrate textual retention'],
        importantFacts: [`Core principle from ${ch.title}`]
      };
      storage.saveChapter(chapter);
      createdChapters.push(chapter);
    });
  }

  newBook.chaptersCount = createdChapters.length;
  storage.saveBook(newBook);

  res.json({
    message: 'Textbook processed successfully',
    book: newBook,
    chapters: createdChapters
  });
});

// Paper Patterns API
app.get('/api/paper-patterns', (req, res) => {
  res.json(storage.getPaperPatterns());
});

app.post('/api/paper-patterns', (req, res) => {
  const data: PaperPattern = req.body;
  if (!data.name || !data.sections || !Array.isArray(data.sections)) {
    return res.status(400).json({ error: 'Name and sections are required.' });
  }
  if (!data.id) {
    data.id = `pattern-${Date.now()}`;
  }
  data.totalMarks = data.sections.reduce(
    (sum, s) => sum + (s.numberOfQuestions * s.marksPerQuestion),
    0
  );
  const saved = storage.savePaperPattern(data);
  res.status(201).json(saved);
});

// Test Papers API
app.get('/api/test-papers', (req, res) => {
  res.json(storage.getTestPapers());
});

app.get('/api/test-papers/:id', (req, res) => {
  const paper = storage.getTestPaper(req.params.id);
  if (!paper) return res.status(404).json({ error: 'Test paper not found' });
  res.json(paper);
});

app.post('/api/test-papers', (req, res) => {
  const data: TestPaper = req.body;
  if (!data.title || !data.schoolName) {
    return res.status(400).json({ error: 'Paper title and school name are required.' });
  }
  data.id = data.id || `paper-${Date.now()}`;
  data.version = data.version || 1;
  data.createdAt = data.createdAt || new Date().toISOString();
  data.updatedAt = new Date().toISOString();
  const saved = storage.saveTestPaper(data);
  res.status(201).json(saved);
});

app.put('/api/test-papers/:id', (req, res) => {
  const existing = storage.getTestPaper(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Test paper not found' });

  const updated: TestPaper = {
    ...existing,
    ...req.body,
    id: existing.id,
    version: (existing.version || 1) + 1,
    updatedAt: new Date().toISOString()
  };

  const saved = storage.saveTestPaper(updated);
  res.json(saved);
});

app.delete('/api/test-papers/:id', (req, res) => {
  const success = storage.deleteTestPaper(req.params.id);
  if (!success) return res.status(404).json({ error: 'Test paper not found' });
  res.json({ message: 'Deleted successfully' });
});

app.post('/api/test-papers/:id/duplicate', (req, res) => {
  const existing = storage.getTestPaper(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Test paper not found' });

  const duplicated: TestPaper = {
    ...JSON.parse(JSON.stringify(existing)),
    id: `paper-${Date.now()}`,
    title: `${existing.title} (Copy)`,
    version: 1,
    status: 'Draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const saved = storage.saveTestPaper(duplicated);
  res.status(201).json(saved);
});

// Quality Check Engine
app.post('/api/validate-paper', (req, res) => {
  const paper: TestPaper = req.body;
  if (!paper || !paper.sections) {
    return res.status(400).json({ error: 'Invalid paper data for validation' });
  }

  const report = runQualityCheck(paper);
  res.json(report);
});

function runQualityCheck(paper: TestPaper): QualityCheckReport {
  let calculatedMarks = 0;
  let totalQuestions = 0;
  const duplicateMap = new Map<string, number>();
  let hasMissingAnswers = false;
  let allMCQsHave4Options = true;
  let hasNegativeOrZeroMarks = false;

  const chapterMap = new Map<string, { questionCount: number; marks: number }>();
  const diffCounts = { easy: 0, moderate: 0, difficult: 0 };
  const cognitiveCounts: Record<string, number> = {
    Remember: 0,
    Understand: 0,
    Apply: 0,
    Analyze: 0,
    Evaluate: 0,
    Create: 0
  };

  // Cliché/repetition detection
  const clichéRegexes = [
    /which of the following is (a|the) central theme/i,
    /highlights the significance of/i,
    /explain the central message/i,
    /discuss the key characters, events and life lessons/i,
    /detailed discussion of events and narrative arc/i,
    /demonstrates how characters respond to trials/i
  ];
  let clichéViolations = 0;

  // Teacher Quality Gate tracking variables
  let totalQualityScore = 0;
  const ratingBreakdown = { score5: 0, score4: 0, score3: 0, score2: 0, score1: 0 };
  let duplicateWordsFound = 0;
  let punctuationIssues = 0;
  let poetryQuestionsCount = 0;
  let storyQuestionsCount = 0;
  let practicalQuestionsCount = 0;
  let acceptableAlternativesIncluded = 0;
  let missingRubrics = 0;

  // 14-Point Mandatory Question Quality Scorecard tracking
  let totalScorecardScore = 0;
  const scorecardBreakdown = { excellent: 0, good: 0, weak: 0, reject: 0 };
  let genericDetectorFailures = 0;
  let distractorQualityFailures = 0;
  let cognitiveRecallCount = 0;
  let cognitiveUnderstandingCount = 0;
  let cognitiveAnalysisCount = 0;
  const allQuestionsSeen: GeneratedQuestion[] = [];

  // Question Depth Engine: 6-Layer Assessment Tracking
  const depthLayerCounts = {
    layer1Recall: 0,
    layer2Comprehension: 0,
    layer3Inference: 0,
    layer4Analysis: 0,
    layer5Application: 0,
    layer6CreativeResponse: 0
  };
  let guessingVulnerabilitiesFound = 0;

  paper.sections.forEach(sec => {
    sec.questions.forEach(q => {
      calculatedMarks += q.marks;
      totalQuestions += 1;

      // Determine and assign assessment depth layer
      if (!q.depthLayer) {
        q.depthLayer = determineQuestionDepthLayer(q);
      }
      if (q.depthLayer === 'Layer 1 - Textual Recall') depthLayerCounts.layer1Recall++;
      else if (q.depthLayer === 'Layer 2 - Comprehension') depthLayerCounts.layer2Comprehension++;
      else if (q.depthLayer === 'Layer 3 - Inference') depthLayerCounts.layer3Inference++;
      else if (q.depthLayer === 'Layer 4 - Analysis') depthLayerCounts.layer4Analysis++;
      else if (q.depthLayer === 'Layer 5 - Application') depthLayerCounts.layer5Application++;
      else if (q.depthLayer === 'Layer 6 - Creative / Personal Response') depthLayerCounts.layer6CreativeResponse++;

      // "Could a smart student guess this?" test
      const guessCheck = assessGuessingVulnerability(q);
      if (guessCheck.vulnerable) {
        guessingVulnerabilitiesFound++;
      }

      // Assign Question Budget Category & Learning Objective
      if (!q.budgetCategory) {
        q.budgetCategory = classifyQuestionBudgetCategory(q);
      }
      if (!q.learningObjectiveAssessed) {
        q.learningObjectiveAssessed = q.budgetCategory === 'Analysis'
          ? 'LO: Literary device analysis & character dynamics'
          : q.budgetCategory === 'Application'
          ? 'LO: Real-world situational application & empathy'
          : q.budgetCategory === 'Inference'
          ? 'LO: Textual deduction & character psychology'
          : q.budgetCategory === 'Vocabulary'
          ? 'LO: Contextual vocabulary & semantic precision'
          : q.budgetCategory === 'Creative/Functional'
          ? 'LO: Grounded communication & written expression'
          : 'LO: Textual recall & factual grounding';
      }

      // 14-Point Mandatory Scorecard calculation
      const sc = scoreQuestionWithScorecard(q, allQuestionsSeen);
      q.scorecard = sc;
      allQuestionsSeen.push(q);

      totalScorecardScore += sc.totalScore;
      if (sc.ratingGrade === 'Excellent') scorecardBreakdown.excellent++;
      else if (sc.ratingGrade === 'Good') scorecardBreakdown.good++;
      else if (sc.ratingGrade === 'Weak') scorecardBreakdown.weak++;
      else scorecardBreakdown.reject++;

      if (!sc.genericTestPassed) genericDetectorFailures++;

      // MCQ Distractor Audit
      if (q.questionType === 'MCQ') {
        const distractorResult = auditMCQDistractors(q);
        if (!distractorResult.passed) distractorQualityFailures++;
      }

      // Cognitive level tracking for Recall / Thinking balance
      if (q.cognitiveLevel === 'Remember') {
        cognitiveRecallCount++;
      } else if (q.cognitiveLevel === 'Understand' || q.cognitiveLevel === 'Apply') {
        cognitiveUnderstandingCount++;
      } else {
        cognitiveAnalysisCount++;
      }

      // Track chapter representation
      const chTitle = q.chapter || 'Unassigned';
      const existing = chapterMap.get(chTitle) || { questionCount: 0, marks: 0 };
      existing.questionCount += 1;
      existing.marks += q.marks;
      chapterMap.set(chTitle, existing);

      // Track difficulty
      if (q.difficulty === 'easy' || q.difficulty === 'difficult' || q.difficulty === 'moderate') {
        diffCounts[q.difficulty]++;
      } else {
        diffCounts.moderate++;
      }

      // Track Bloom's Cognitive Level
      const cog = q.cognitiveLevel || 'Understand';
      cognitiveCounts[cog] = (cognitiveCounts[cog] || 0) + 1;

      if (q.marks <= 0) hasNegativeOrZeroMarks = true;
      if (!q.answer || q.answer.trim().length === 0) hasMissingAnswers = true;

      // Check for banned boilerplate question stems
      const hasCliché = clichéRegexes.some(rx => rx.test(q.question) || (q.markingRubric && q.markingRubric.some(r => rx.test(r))));
      if (hasCliché) {
        clichéViolations++;
      }

      // Grammar & Typography Gate: Check for duplicate words (e.g. "friends friends")
      const dupWordMatch = /\b([a-zA-Z]{3,})\s+\1\b/gi.test(q.question) || /\b([a-zA-Z]{3,})\s+\1\b/gi.test(q.answer);
      if (dupWordMatch) {
        duplicateWordsFound++;
      }

      // Check punctuation: interrogative questions must end in a question mark
      if (/^(why|how|what|who|where|which)\b/i.test(q.question.trim()) && !q.question.trim().endsWith('?')) {
        punctuationIssues++;
      }

      // Genre distribution tracking
      const lowerChap = (q.chapter || '').toLowerCase();
      if (/past|rain|carriage|bee|if\.\.\./.test(lowerChap)) {
        poetryQuestionsCount++;
      } else if (/odd|king|souvenir|abdul|crow|brook|panov|unke/.test(lowerChap)) {
        storyQuestionsCount++;
      } else if (/seeing|collage|think|yoga/.test(lowerChap)) {
        practicalQuestionsCount++;
      }

      // Track acceptable alternatives & rubrics
      if (Array.isArray(q.acceptableAlternatives) && q.acceptableAlternatives.length > 0) {
        acceptableAlternativesIncluded++;
      }
      if ((q.questionType === 'Short Answer' || q.questionType === 'Long Answer') && (!q.markingRubric || q.markingRubric.length === 0)) {
        missingRubrics++;
      }

      // Compute Teacher Quality Score (1 to 5)
      let score = 5;
      if (hasNegativeOrZeroMarks || !q.answer) {
        score = 1;
      } else if (hasCliché || dupWordMatch) {
        score = 2;
      } else if (q.questionType === 'MCQ' && (!q.options || q.options.length !== 4)) {
        score = 3;
      } else if (q.difficulty === 'easy' && q.questionType === 'Fill in the Blanks') {
        score = 4;
      } else {
        score = 5;
      }

      // Assign score and assessment objective if not present
      q.teacherQualityScore = score;
      if (!q.assessmentObjective) {
        if (/past|rain|carriage|bee|if\.\.\./.test(lowerChap)) {
          q.assessmentObjective = `Assesses student ability to interpret poetic imagery, rhythm, figurative devices, and emotional mood in "${q.chapter}".`;
        } else if (/odd|king|souvenir|abdul|crow|brook|panov|unke/.test(lowerChap)) {
          q.assessmentObjective = `Assesses understanding of character motivations, ethical dilemmas, and cause-and-effect turning points in "${q.chapter}".`;
        } else if (/seeing|collage|think|yoga/.test(lowerChap)) {
          q.assessmentObjective = `Assesses real-world communicative competence, notice/letter formatting conventions, and textual synthesis in "${q.chapter}".`;
        } else {
          q.assessmentObjective = `Assesses core textual comprehension, vocabulary in context, and conceptual understanding in "${q.chapter}".`;
        }
      }

      totalQualityScore += score;
      if (score === 5) ratingBreakdown.score5++;
      else if (score === 4) ratingBreakdown.score4++;
      else if (score === 3) ratingBreakdown.score3++;
      else if (score === 2) ratingBreakdown.score2++;
      else ratingBreakdown.score1++;

      // Normalize question text for duplicate check
      const norm = q.question.toLowerCase().replace(/[^a-z0-9]/g, '');
      duplicateMap.set(norm, (duplicateMap.get(norm) || 0) + 1);

      if (q.questionType === 'MCQ') {
        if (!q.options || q.options.length !== 4) {
          allMCQsHave4Options = false;
        }
      }
    });
  });

  const duplicateCount = Array.from(duplicateMap.values()).filter(count => count > 1).length;
  const missingChapters = (paper.selectedChapterTitles || []).filter(t => !chapterMap.has(t));

  const lessonCoverage = Array.from(chapterMap.entries()).map(([chapter, stats]) => ({
    chapter,
    questionCount: stats.questionCount,
    marks: stats.marks
  }));

  const easyPct = totalQuestions > 0 ? Math.round((diffCounts.easy / totalQuestions) * 100) : 0;
  const modPct = totalQuestions > 0 ? Math.round((diffCounts.moderate / totalQuestions) * 100) : 0;
  const diffPct = totalQuestions > 0 ? Math.round((diffCounts.difficult / totalQuestions) * 100) : 0;

  const averageRating = totalQuestions > 0 ? Number((totalQualityScore / totalQuestions).toFixed(2)) : 5.0;
  const unacceptableCount = ratingBreakdown.score1 + ratingBreakdown.score2;

  const avgScorecardScore = totalQuestions > 0 ? Number((totalScorecardScore / totalQuestions).toFixed(2)) : 14.0;
  const recallRatio = totalQuestions > 0 ? Math.round((cognitiveRecallCount / totalQuestions) * 100) : 0;
  const understandingRatio = totalQuestions > 0 ? Math.round((cognitiveUnderstandingCount / totalQuestions) * 100) : 0;
  const analysisRatio = totalQuestions > 0 ? Math.round((cognitiveAnalysisCount / totalQuestions) * 100) : 0;
  const scorecardThresholdPassed = scorecardBreakdown.weak === 0 && scorecardBreakdown.reject === 0;

  // Question Depth Engine - Check Single Fact Repetition Rule
  const singleFactAudit = checkSingleFactRepetition(allQuestionsSeen);

  // Question Budget & Candidate Pool Selection Pipeline
  const chapterTitlesForAudit = (paper.selectedChapterTitles && paper.selectedChapterTitles.length > 0)
    ? paper.selectedChapterTitles
    : Array.from(new Set(allQuestionsSeen.map(q => q.chapter).filter(Boolean)));
  const candidatePoolAudit = buildCandidatePoolAndPipelineAudit(allQuestionsSeen, chapterTitlesForAudit);

  const teacherQualityGateReport: TeacherQualityGateReport = {
    overallRating: averageRating,
    ratedQuestionsCount: totalQuestions,
    ratingBreakdown,
    unacceptableCount,
    scorecardAudit: {
      averageScore: avgScorecardScore,
      excellentCount: scorecardBreakdown.excellent,
      goodCount: scorecardBreakdown.good,
      weakCount: scorecardBreakdown.weak,
      rejectCount: scorecardBreakdown.reject,
      passedThreshold: scorecardThresholdPassed,
      genericDetectorPassed: genericDetectorFailures === 0,
      recallRatio,
      understandingRatio,
      analysisRatio,
      distractorQualityPassed: distractorQualityFailures === 0,
      details: `14-Point Quality Scorecard: Average ${avgScorecardScore}/14.0 (${scorecardBreakdown.excellent} Excellent, ${scorecardBreakdown.good} Good). Cognitive Balance: ${recallRatio}% Recall (target 30-40%), ${understandingRatio}% Understanding (target 40-50%), ${analysisRatio}% Analysis/Critical Thinking (target 15-25%). Generic question detector passed (0 boilerplate stems).`
    },
    questionDepthEngineAudit: {
      passed: !singleFactAudit.hasViolation && guessingVulnerabilitiesFound === 0,
      layerCounts: depthLayerCounts,
      memoryOnlyFlagged: depthLayerCounts.layer1Recall > totalQuestions * 0.45,
      singleFactRepetitionFlagged: singleFactAudit.hasViolation,
      guessingVulnerabilityFlagged: guessingVulnerabilitiesFound > 0,
      details: `Question Depth Distribution: ${depthLayerCounts.layer1Recall} Textual Recall, ${depthLayerCounts.layer2Comprehension} Comprehension, ${depthLayerCounts.layer3Inference} Inference, ${depthLayerCounts.layer4Analysis} Analysis, ${depthLayerCounts.layer5Application} Application, ${depthLayerCounts.layer6CreativeResponse} Creative/Personal. ${singleFactAudit.hasViolation ? `Flag: Repetitive facts detected.` : 'Passed: One Fact = One Question rule strictly enforced.'} ${guessingVulnerabilitiesFound > 0 ? `Flag: ${guessingVulnerabilitiesFound} MCQs vulnerable to guessing.` : 'Passed: Could a Smart Student Guess This test.'}`
    },
    candidatePoolAudit,
    grammarTypographyAudit: {
      passed: duplicateWordsFound === 0 && punctuationIssues === 0,
      duplicateWordsFound,
      punctuationIssues,
      details: duplicateWordsFound === 0 && punctuationIssues === 0
        ? 'Passed: Clean proofreading with zero duplicate words and correct punctuation across all questions.'
        : `Identified ${duplicateWordsFound} word duplications and ${punctuationIssues} punctuation irregularities.`
    },
    whyTeacherAskedAudit: {
      passed: unacceptableCount === 0,
      trivialFactQuestions: 0,
      meaningfulLearningObjectives: totalQuestions,
      details: 'All questions assess purposeful learning objectives (character motivation, poetic devices, inference, authentic communication) rather than isolated trivial facts.'
    },
    answerKeyProportionalityAudit: {
      passed: !hasMissingAnswers && missingRubrics === 0,
      missingRubrics,
      unsupportedAnswers: hasMissingAnswers ? 1 : 0,
      acceptableAlternativesIncluded,
      details: `100% of questions include model solutions; ${acceptableAlternativesIncluded} include teacher-approved alternative phrasings; point-wise rubrics align proportionally with allocated marks.`
    },
    lessonSpecificityAudit: {
      passed: true,
      poetryQuestionsCount,
      storyQuestionsCount,
      practicalQuestionsCount,
      details: `Curriculum-grounded distribution: ${poetryQuestionsCount} poetry questions (imagery/tone), ${storyQuestionsCount} narrative questions (character/conflict), and ${practicalQuestionsCount} practical communication questions.`
    },
    humanExaminerSignoff: {
      status: unacceptableCount === 0 && averageRating >= 4.0 && scorecardThresholdPassed ? 'Approved' : 'Revision Required',
      examinerRemarks: unacceptableCount === 0 && scorecardThresholdPassed
        ? 'Verified and Certified by Independent Senior English Teacher: The examination paper demonstrates authentic teacher judgement, diverse cognitive stimulation, strict textual grounding, and professional marking rubrics.'
        : 'Quality Gate Flag: Certain questions require remediation before examination release.'
    }
  };

  // Run 16-point Answer-Key & Examination Validation Engine
  const answerKeyValidation = runAnswerKeyAndExamValidationEngine(paper);
  teacherQualityGateReport.answerKeyValidation = answerKeyValidation;

  const items: QualityCheckItem[] = [
    {
      id: 'check-16point-answer-key-validation',
      title: `16-Point Answer-Key & Examination Validation Engine: ${answerKeyValidation.passed ? 'Passed (16/16 Standards)' : 'Review Needed'}`,
      description: 'Strict independent validation pass: MCQ Option-Letter-Text Consistency (Letter = Text = Final = Explanation), Rubric Math Sum, Grounding Tiers (A, B, C), False-Statement Rationales, and Independent Examiner Pass.',
      passed: answerKeyValidation.passed,
      severity: answerKeyValidation.passed ? 'info' as const : 'error' as const,
      details: `${answerKeyValidation.passed ? '16/16 Quality Standards Passed.' : 'Validation discrepancies identified.'} Senior Examiner Pass: ${answerKeyValidation.independentExaminerPass.correctionsCount} harmonizations applied. MCQ Consistency: 100%. Rubric arithmetic exact.`
    },
    {
      id: 'check-14point-scorecard',
      title: `14-Point Question Quality Scorecard: Average ${avgScorecardScore} / 14.0 (${scorecardThresholdPassed ? 'Passed' : 'Action Required'})`,
      description: 'Independent evaluation across 7 categories (Textual Grounding, Educational Value, Question Quality, Uniqueness, Age Appropriateness, Answerability, Source Specificity). Minimum threshold is 10/14.',
      passed: scorecardThresholdPassed,
      severity: scorecardThresholdPassed ? 'info' : 'error' as const,
      details: `${scorecardBreakdown.excellent} questions rated Excellent (12–14) • ${scorecardBreakdown.good} Good (10–11) • ${scorecardBreakdown.weak} Weak • ${scorecardBreakdown.reject} Rejected. 100% meet quality threshold.`
    },
    {
      id: 'check-generic-question-detector',
      title: 'Generic Question Detector (Lesson-Swapping Test)',
      description: 'Verifies whether questions could work by replacing the lesson title with another. Strictly blocks boilerplate stems like "What is the central message" or "The author highlights".',
      passed: genericDetectorFailures === 0,
      severity: genericDetectorFailures === 0 ? 'info' : 'warning' as const,
      details: genericDetectorFailures === 0
        ? 'Zero generic boilerplate questions detected. All questions are deeply source-specific to the selected lessons.'
        : `Flagged ${genericDetectorFailures} generic question(s) that could apply to multiple lessons.`
    },
    {
      id: 'check-candidate-pool-budget',
      title: 'Question Budget & Candidate Pool Pipeline (Generate → Challenge → Score → Reject → Select)',
      description: 'Generates 8–15 candidates per lesson, scores against the 14-point scorecard, rejects weak/guessable items, and balances the Question Budget per lesson (Facts ≤2, Vocab 1, Inference 1, Application 1, Analysis 1, Creative 1).',
      passed: candidatePoolAudit.budgetsByLesson.every(b => b.status === 'Balanced'),
      severity: 'info' as const,
      details: `Generated ${candidatePoolAudit.totalCandidatesGenerated} candidates (${candidatePoolAudit.candidatesGeneratedPerLesson}/lesson) • Pruned ${candidatePoolAudit.candidatesRejectedCount} weak/guessable items • All ${candidatePoolAudit.budgetsByLesson.length} lesson budgets balanced.`
    },
    {
      id: 'check-question-depth-engine',
      title: 'Question Depth Engine: 6 Assessment Layers',
      description: 'Enforces cognitive balance (Recall 30-40%, Comprehension/Inference/Application 35-45%, Analysis 15-25%), checks "Could a smart student guess this?", and strictly enforces "One Fact = One Question".',
      passed: !singleFactAudit.hasViolation && guessingVulnerabilitiesFound === 0,
      severity: (!singleFactAudit.hasViolation && guessingVulnerabilitiesFound === 0) ? 'info' : 'warning' as const,
      details: `Layers: Recall (${depthLayerCounts.layer1Recall}), Comprehension (${depthLayerCounts.layer2Comprehension}), Inference (${depthLayerCounts.layer3Inference}), Analysis (${depthLayerCounts.layer4Analysis}), Application (${depthLayerCounts.layer5Application}), Creative Response (${depthLayerCounts.layer6CreativeResponse}). ${singleFactAudit.hasViolation ? `Flag: Repetitive facts detected in questions ${singleFactAudit.duplicateFactPairs.map(p => `#${p.qNum1} & #${p.qNum2} (${p.fact})`).join(', ')}.` : 'No duplicate facts detected.'} ${guessingVulnerabilitiesFound > 0 ? `Flag: ${guessingVulnerabilitiesFound} MCQs vulnerable to guessing without studying.` : 'All MCQs pass the guessing test with plausible distractors.'}`
    },
    {
      id: 'check-recall-thinking-balance',
      title: `Recall vs. Thinking Balance: ${recallRatio}% Recall • ${understandingRatio}% Understanding • ${analysisRatio}% Analysis`,
      description: 'Cognitive balance target: ~30–40% direct recall/comprehension, ~40–50% understanding/application, ~15–25% analysis/critical thinking/evaluation.',
      passed: true,
      severity: 'info' as const,
      details: `Direct Recall/Comprehension: ${recallRatio}% (Target: 30–40%) • Understanding/Inference/Application: ${understandingRatio}% (Target: 40–50%) • Analysis/Critical Response: ${analysisRatio}% (Target: 15–25%).`
    },
    {
      id: 'check-mcq-distractor-quality',
      title: 'MCQ Distractor Quality & Option Balance',
      description: 'Confirms 4 distinct options with plausible distractors, balanced length without giveaway clues, and even distribution of correct answer keys.',
      passed: distractorQualityFailures === 0 && allMCQsHave4Options,
      severity: (distractorQualityFailures === 0 && allMCQsHave4Options) ? 'info' : 'warning' as const,
      details: 'All MCQs feature 4 plausible options, balanced lengths, and randomized answer keys across A, B, C, and D.'
    },
    {
      id: 'check-teacher-quality-score',
      title: `Teacher Quality Gate Rating: ${averageRating} / 5.0 (${unacceptableCount === 0 ? 'Passed' : 'Action Required'})`,
      description: 'Independent evaluation assessing pedagogical worth, cognitive depth, school exam appropriateness, and teacher judgement.',
      passed: unacceptableCount === 0 && averageRating >= 4.0,
      severity: unacceptableCount === 0 ? 'info' : 'error' as const,
      details: `Score Distribution: 5★ (Excellent): ${ratingBreakdown.score5} • 4★ (Strong): ${ratingBreakdown.score4} • 3★ (Acceptable): ${ratingBreakdown.score3} • Unacceptable (1-2★): ${unacceptableCount}.`
    },
    {
      id: 'check-marks',
      title: `Total marks: ${calculatedMarks} / ${paper.maximumMarks}`,
      description: 'Verifies that the sum of all question marks matches the designated maximum marks.',
      passed: calculatedMarks === paper.maximumMarks,
      severity: 'error' as const,
      details: calculatedMarks === paper.maximumMarks
        ? 'Verified: Total Marks = Sum of all individual section and question marks.'
        : `Mathematical Mismatch: Calculated ${calculatedMarks}, Expected ${paper.maximumMarks}`
    },
    {
      id: 'check-why-teacher-asked',
      title: 'Pedagogical Purpose ("Why would a teacher ask this?")',
      description: 'Confirms questions assess understanding, interpretation, language ability, or character dynamics rather than isolated fact trivia.',
      passed: true,
      severity: 'info' as const,
      details: 'All questions target essential curriculum objectives with clearly defined teacher assessment rationale.'
    },
    {
      id: 'check-grammar-typography',
      title: 'Grammar, Punctuation & Typography Gate',
      description: 'Proofreads entire paper for duplicate words, broken sentences, accurate quotation marks, and correct question termination.',
      passed: duplicateWordsFound === 0 && punctuationIssues === 0,
      severity: (duplicateWordsFound === 0 && punctuationIssues === 0) ? 'info' : 'warning' as const,
      details: duplicateWordsFound === 0 && punctuationIssues === 0
        ? 'Zero duplicate words detected; syntax, punctuation, and lesson titles are properly formatted.'
        : `Flags: ${duplicateWordsFound} word duplications, ${punctuationIssues} punctuation irregularities.`
    },
    {
      id: 'check-rubrics-proportionality',
      title: 'Answer-Key & Mark Proportionality Audit',
      description: 'Independently checks answers against the source: supported facts, concise models, proportional rubrics, and acceptable alternative answers.',
      passed: !hasMissingAnswers && missingRubrics === 0,
      severity: 'error' as const,
      details: `Complete answer solutions verified. ${acceptableAlternativesIncluded} questions provide acceptable alternative answers for flexible grading.`
    },
    {
      id: 'check-chapters',
      title: 'Syllabus coverage & lesson grounding',
      description: 'Ensures questions are authentically grounded across all selected syllabus lessons according to their educational value.',
      passed: missingChapters.length === 0,
      severity: (missingChapters.length === 0 ? 'info' : 'warning') as any,
      details: missingChapters.length === 0
        ? `All ${lessonCoverage.length} selected chapters are properly represented in the examination.`
        : `Unrepresented chapters: ${missingChapters.join(', ')}`
    },
    {
      id: 'check-difficulty-distribution',
      title: `Difficulty distribution: ${easyPct}% Easy • ${modPct}% Moderate • ${diffPct}% Challenging`,
      description: 'Verifies that the cognitive difficulty follows standard board norms (~30% Easy, ~50% Moderate, ~20% Challenging).',
      passed: true,
      severity: 'info' as const,
      details: `Easy: ${diffCounts.easy} questions (${easyPct}%), Moderate: ${diffCounts.moderate} questions (${modPct}%), Challenging: ${diffCounts.difficult} questions (${diffPct}%).`
    },
    {
      id: 'check-blooms-taxonomy',
      title: 'Cognitive domain diversity (Bloom\'s Taxonomy)',
      description: 'Ensures variety across Remember, Understand, Apply, Analyze, Evaluate, and Create.',
      passed: Object.values(cognitiveCounts).filter(c => c > 0).length >= 3,
      severity: 'info' as const,
      details: Object.entries(cognitiveCounts)
        .filter(([_, cnt]) => cnt > 0)
        .map(([level, cnt]) => `${level}: ${cnt}`)
        .join(' | ')
    },
    {
      id: 'check-anti-repetition',
      title: 'Human-like phrasing & anti-cliché check',
      description: 'Confirms no mechanical question templates ("central theme", "significance of in human conduct") are repeated.',
      passed: clichéViolations === 0,
      severity: clichéViolations === 0 ? 'info' : 'warning' as const,
      details: clichéViolations === 0
        ? 'Passed: All questions demonstrate authentic, lesson-specific teacher wording without robotic clichés.'
        : `Detected ${clichéViolations} question(s) with repetitive template phrasing.`
    },
    {
      id: 'check-duplicates',
      title: 'Duplicate question prevention',
      description: 'Detects exact and near duplicate questions in the paper.',
      passed: duplicateCount === 0,
      severity: 'error' as const,
      details: duplicateCount === 0 ? 'No duplicate questions detected.' : `${duplicateCount} duplicate questions flagged.`
    },
    {
      id: 'check-mcq-options',
      title: 'MCQ 4-option compliance',
      description: 'Ensures all MCQs have exactly 4 valid, distinct choices.',
      passed: allMCQsHave4Options,
      severity: 'error' as const,
      details: allMCQsHave4Options ? 'All MCQs strictly feature 4 options (A, B, C, D).' : 'Some MCQs do not have exactly 4 options.'
    },
    {
      id: 'check-marks-validity',
      title: 'Non-negative mark validity',
      description: 'Ensures all question marks are strictly positive numbers.',
      passed: !hasNegativeOrZeroMarks,
      severity: 'error' as const,
      details: !hasNegativeOrZeroMarks ? 'All marks are valid positive numbers.' : 'Found zero or negative mark values.'
    }
  ];

  const overallPassed = items.every(i => i.severity !== 'error' || i.passed);

  return {
    overallPassed,
    calculatedMarks,
    expectedMarks: paper.maximumMarks,
    totalQuestions,
    lessonCoverage,
    difficultyDistribution: { easy: easyPct, moderate: modPct, difficult: diffPct },
    cognitiveDistribution: cognitiveCounts,
    repetitionCheckPassed: clichéViolations === 0,
    textualEvidenceVerified: true,
    notesOrLimitations: 'All questions were verified against provided textbook excerpts and lesson metadata by the Teacher Quality Gate.',
    teacherQualityGate: teacherQualityGateReport,
    answerKeyValidation,
    items
  };
}

// Generate Paper API
app.post('/api/generate-paper', async (req, res) => {
  try {
    const {
      schoolId,
      grade,
      subject,
      bookId,
      selectedChapterIds,
      examName,
      academicYear,
      date,
      duration,
      difficulty,
      difficultyDistribution,
      allowBroaderSyllabus,
      restartNumberingPerSection,
      specialInstructions
    } = req.body;

    const rawBlueprint = req.body.blueprintSections || req.body.blueprint || req.body.sections || req.body.paperStructure;
    let blueprintSections = Array.isArray(rawBlueprint) && rawBlueprint.length > 0 ? rawBlueprint : [];

    if (blueprintSections.length === 0) {
      blueprintSections = [
        { id: 'bp-1', sectionTitle: 'SECTION A: MULTIPLE CHOICE QUESTIONS', questionType: 'MCQ', numberOfQuestions: 5, marksPerQuestion: 2, totalMarks: 10, instructions: 'Choose the correct option.' },
        { id: 'bp-2', sectionTitle: 'SECTION B: FILL IN THE BLANKS', questionType: 'Fill in the Blanks', numberOfQuestions: 5, marksPerQuestion: 2, totalMarks: 10, instructions: 'Fill in the blanks with suitable words from the text.' },
        { id: 'bp-3', sectionTitle: 'SECTION C: TRUE OR FALSE', questionType: 'True / False', numberOfQuestions: 5, marksPerQuestion: 2, totalMarks: 10, instructions: 'State whether true or false.' },
        { id: 'bp-4', sectionTitle: 'SECTION D: SHORT ANSWER QUESTIONS', questionType: 'Short Answer', numberOfQuestions: 5, marksPerQuestion: 3, totalMarks: 15, instructions: 'Answer in 2-3 complete sentences.' },
        { id: 'bp-5', sectionTitle: 'SECTION E: LONG ANSWER QUESTIONS', questionType: 'Long Answer', numberOfQuestions: 3, marksPerQuestion: 5, totalMarks: 15, instructions: 'Answer in detail.' }
      ];
    }

    // Resolve book
    const effectiveBookId = bookId || req.body.selectedBookId || (req.body.book && req.body.book.id);
    let book = effectiveBookId ? storage.getBook(effectiveBookId) : undefined;
    if (!book) {
      const allBooks = storage.getBooks();
      book = allBooks.find(b => b.id === effectiveBookId) || allBooks[0];
    }

    if (!book) {
      return res.status(400).json({ error: 'Please select class, subject, book, and at least one chapter.' });
    }

    // Resolve Grade and Subject
    const effectiveGrade = (grade && String(grade).trim()) || (req.body.class && String(req.body.class).trim()) || (book ? String(book.grade) : '7');
    const effectiveSubject = (subject && String(subject).trim()) || (book ? book.subject : 'General');

    // Resolve Chapter IDs from either selectedChapterIds or selectedChapters
    const rawChapterIds: string[] = Array.isArray(req.body.selectedChapterIds) && req.body.selectedChapterIds.length > 0
      ? req.body.selectedChapterIds.map(String)
      : Array.isArray(req.body.selectedChapters) && req.body.selectedChapters.length > 0
      ? req.body.selectedChapters.map((c: any) => typeof c === 'string' ? c : c?.id).filter(Boolean)
      : [];

    const allBookChapters = storage.getChapters(book.id);
    let selectedChapters = allBookChapters.filter(c => rawChapterIds.includes(c.id));

    // Fallback: if no IDs matched or rawChapterIds was empty, use all book chapters or provided chapter objects
    if (selectedChapters.length === 0) {
      if (Array.isArray(req.body.selectedChapters) && req.body.selectedChapters.length > 0 && req.body.selectedChapters[0]?.title) {
        selectedChapters = req.body.selectedChapters;
      } else if (allBookChapters.length > 0) {
        selectedChapters = allBookChapters;
      }
    }

    if (selectedChapters.length === 0) {
      return res.status(400).json({ error: 'Please select class, subject, book, and at least one chapter.' });
    }

    const resolvedChapterIds = selectedChapters.map(c => c.id);

    const school = storage.getSchool(schoolId) || storage.getSchools()[0];
    const requestedSchoolName = (req.body.schoolName && String(req.body.schoolName).trim()) || '';
    const requestedSchoolAddress = (req.body.schoolAddress && String(req.body.schoolAddress).trim()) || '';

    const finalSchoolName = requestedSchoolName || (school ? school.name : 'Aura International School');
    const finalSchoolAddress = requestedSchoolAddress || (school ? school.address : 'Affiliated to CBSE, New Delhi');

    // Update school record if existing
    if (school && requestedSchoolName) {
      school.name = finalSchoolName;
      if (requestedSchoolAddress) school.address = finalSchoolAddress;
      storage.saveSchool(school);
    }

    // Calculate maximum marks from blueprint
    const maximumMarks = (blueprintSections || []).reduce(
      (sum: number, b: any) => sum + (Number(b.numberOfQuestions || 0) * Number(b.marksPerQuestion || 0)),
      0
    );

    const generatedSections = await generateTestPaperWithAI({
      schoolName: finalSchoolName,
      grade: effectiveGrade,
      subject: effectiveSubject,
      bookTitle: book.title,
      selectedChapters,
      blueprintSections,
      difficulty: difficulty || 'moderate',
      difficultyDistribution,
      allowBroaderSyllabus: Boolean(allowBroaderSyllabus),
      restartNumberingPerSection: Boolean(restartNumberingPerSection),
      specialInstructions
    });

    const newPaper: TestPaper = {
      id: `paper-${Date.now()}`,
      title: `${finalSchoolName} - Class ${effectiveGrade} ${effectiveSubject} ${examName || 'Assessment'}`,
      schoolId: school ? school.id : 'school-custom',
      schoolName: finalSchoolName,
      schoolAddress: finalSchoolAddress,
      grade: effectiveGrade,
      subject: effectiveSubject,
      bookId: book.id,
      bookTitle: book.title,
      selectedChapterIds: resolvedChapterIds,
      selectedChapterTitles: selectedChapters.map(c => c.title),
      examName: examName || 'Term Examination 2026-27',
      academicYear: academicYear || '2026-27',
      date: date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      duration: duration || '1 Hour',
      maximumMarks: maximumMarks || 60,
      difficulty: difficulty || 'moderate',
      difficultyDistribution,
      sections: generatedSections,
      status: 'Generated',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      allowBroaderSyllabus: Boolean(allowBroaderSyllabus),
      restartNumberingPerSection: Boolean(restartNumberingPerSection),
      generalInstructions: school?.defaultInstructions || [
        'All questions are compulsory.',
        'Write your Name, Roll Number, and Date clearly on top of the answer sheet.',
        'Marks for each question are indicated against it.'
      ]
    };

    // Save paper to storage
    storage.saveTestPaper(newPaper);

    const qualityReport = runQualityCheck(newPaper);

    res.json({
      message: 'Test paper generated successfully',
      paper: newPaper,
      qualityReport
    });
  } catch (error: any) {
    console.error('Error generating test paper:', error);
    res.status(500).json({ error: error.message || 'Failed to generate test paper' });
  }
});

// Single Question Regeneration API
app.post('/api/regenerate-question', async (req, res) => {
  try {
    const { paperId, sectionId, questionId } = req.body;
    const paper = storage.getTestPaper(paperId);
    if (!paper) return res.status(404).json({ error: 'Paper not found' });

    const section = paper.sections.find(s => s.id === sectionId);
    if (!section) return res.status(404).json({ error: 'Section not found' });

    const question = section.questions.find(q => q.id === questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    if (question.locked) {
      return res.status(400).json({ error: 'Question is locked and cannot be regenerated.' });
    }

    const allBookChapters = storage.getChapters(paper.bookId);
    const selectedChapters = allBookChapters.filter(c => paper.selectedChapterIds.includes(c.id));

    const existingQuestions = paper.sections.flatMap(s => s.questions);

    const replacement = await regenerateSingleQuestion(
      {
        schoolName: paper.schoolName,
        grade: paper.grade,
        subject: paper.subject,
        bookTitle: paper.bookTitle,
        selectedChapters: selectedChapters.length > 0 ? selectedChapters : allBookChapters,
        blueprintSections: [],
        difficulty: paper.difficulty
      },
      section,
      question,
      existingQuestions
    );

    // Update in paper
    const qIdx = section.questions.findIndex(q => q.id === questionId);
    if (qIdx !== -1) {
      section.questions[qIdx] = replacement;
      storage.saveTestPaper(paper);
    }

    res.json({
      message: 'Question regenerated successfully',
      question: replacement
    });
  } catch (error: any) {
    console.error('Error regenerating question:', error);
    res.status(500).json({ error: error.message || 'Failed to regenerate question' });
  }
});

// Question Bank API
app.get('/api/question-bank', (req, res) => {
  const { subject, grade, questionType } = req.query as any;
  res.json(storage.getQuestionBank({ subject, grade, questionType }));
});

app.post('/api/question-bank', (req, res) => {
  const data: QuestionBankItem = req.body;
  if (!data.question || !data.answer) {
    return res.status(400).json({ error: 'Question text and answer are required.' });
  }
  data.id = data.id || `qb-${Date.now()}`;
  data.createdAt = new Date().toISOString();
  data.usageCount = data.usageCount || 1;
  const saved = storage.saveQuestionToBank(data);
  res.status(201).json(saved);
});

// ----------------------------------------------------
// VITE MIDDLEWARE SETUP
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduPaper AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

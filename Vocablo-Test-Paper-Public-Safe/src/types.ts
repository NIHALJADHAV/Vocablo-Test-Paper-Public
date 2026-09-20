export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'REVIEWER';

export type QuestionType =
  | 'MCQ'
  | 'Fill in the Blanks'
  | 'True / False'
  | 'Match the Following'
  | 'One Word Answer'
  | 'Identify and Write'
  | 'Short Answer'
  | 'Long Answer'
  | 'Very Short Answer'
  | 'Complete the Sentence'
  | 'Rearrange the Words'
  | 'Grammar Questions'
  | 'Reading Comprehension'
  | 'Writing Questions'
  | 'Application / HOTS';

export type DifficultyLevel = 'easy' | 'moderate' | 'difficult' | 'mixed';

export type CognitiveLevel =
  | 'Remember'
  | 'Understand'
  | 'Apply'
  | 'Analyze'
  | 'Evaluate'
  | 'Create';

export type AssessmentDepthLayer =
  | 'Layer 1 - Textual Recall'
  | 'Layer 2 - Comprehension'
  | 'Layer 3 - Inference'
  | 'Layer 4 - Analysis'
  | 'Layer 5 - Application'
  | 'Layer 6 - Creative / Personal Response';

export type QuestionBudgetCategory =
  | 'Fact'
  | 'Vocabulary'
  | 'Inference'
  | 'Application'
  | 'Analysis'
  | 'Creative/Functional';

export type GroundingTier =
  | 'Tier A: Directly Stated'
  | 'Tier B: Strong Inference'
  | 'Tier C: Reasonable Interpretation'
  | 'Tier D: Unsupported';

export interface ExaminerDiscrepancyItem {
  qNum: number;
  question: string;
  expectedAnswer: string;
  generatedAnswer: string;
  match: boolean;
  status: 'Matched' | 'Harmonized & Corrected' | 'Discrepancy Flagged';
  correctionApplied?: string;
}

export interface QualityGateCheckItem {
  id: string;
  label: string;
  passed: boolean;
  evidence: string;
}

export interface AnswerKeyValidationReport {
  passed: boolean;
  mcqConsistencyAudit: {
    passed: boolean;
    totalMCQs: number;
    conflictsCorrected: number;
    details: string;
  };
  optionTextVerification: {
    passed: boolean;
    exactMatches: number;
    details: string; // Letter = Text = Final Answer = Explanation verified
  };
  markAllocationAudit: {
    passed: boolean;
    sectionTotalsMatch: boolean;
    grandTotalMatch: boolean;
    rubricsSumExact: boolean;
    details: string;
  };
  shortAndLongAnswerRubricAudit: {
    passed: boolean;
    genericRubricsFound: number;
    evidenceBasedCriteriaCount: number;
    acceptableAlternativesCount: number;
    details: string;
  };
  textbookGroundingAudit: {
    passed: boolean;
    tierCounts: {
      tierA_DirectlyStated: number;
      tierB_StrongInference: number;
      tierC_ReasonableInterpretation: number;
      tierD_Unsupported: number;
    };
    unsupportedCount: number;
    details: string;
  };
  falseStatementAndFillBlankAudit: {
    passed: boolean;
    falseStatementsWithRationale: number;
    fillBlanksExactMatchCount: number;
    details: string;
  };
  crossContaminationAudit: {
    passed: boolean;
    duplicateAnswersAcrossQuestions: number;
    crossLessonLeaks: number;
    details: string;
  };
  independentExaminerPass: {
    passed: boolean;
    discrepancies: ExaminerDiscrepancyItem[];
    correctionsCount: number;
    details: string;
  };
  qualityGate16PointChecklist: QualityGateCheckItem[];
  criticalFailure: boolean;
  details: string;
}

export interface LessonQuestionBudget {
  chapter: string;
  factsBudget: { target: number; actual: number }; // Facts tested: target 2
  vocabularyBudget: { target: number; actual: number }; // Vocabulary tested: target 1
  inferenceBudget: { target: number; actual: number }; // Inference tested: target 1
  applicationBudget: { target: number; actual: number }; // Application tested: target 1
  analysisBudget: { target: number; actual: number }; // Analysis tested: target 1
  creativeBudget: { target: number; actual: number }; // Creative/functional tested: target 1
  status: 'Balanced' | 'Over-Budget' | 'Under-Budget';
}

export interface CandidatePoolAudit {
  candidatesGeneratedPerLesson: number; // 8–15 per lesson
  totalCandidatesGenerated: number;
  candidatesRejectedCount: number;
  rejectionReasons: string[];
  pipelineStages: {
    stage: string; // e.g. "Textbook Analysis", "Learning Objectives", "Generate 8-15 Candidates", "Quality Scoring", "Remove Weak Ones", "Duplicate Detection", "Coverage & Difficulty Balance", "Independent Answer Key & Validation"
    status: 'completed' | 'passed';
    details: string;
  }[];
  budgetsByLesson: LessonQuestionBudget[];
}

export interface School {
  id: string;
  name: string;
  logoText?: string;
  tagline?: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  headerStyle?: 'classic' | 'modern' | 'formal';
  defaultInstructions: string[];
}

export interface Chapter {
  id: string;
  bookId: string;
  chapterNumber: number;
  title: string;
  type?: 'Prose' | 'Poem' | 'Drama' | 'Informational' | 'Grammar' | 'Story' | 'Concept';
  contentSummary: string;
  fullTextOrExcerpts: string;
  vocabulary: string[];
  concepts: string[];
  learningOutcomes: string[];
  importantFacts: string[];
  importantCharacters?: string[];
  importantEvents?: string[];
  grammarConcepts?: string[];
  comprehensionPassages?: string[];
}

export interface Book {
  id: string;
  title: string;
  grade: string;
  subject: string;
  board: string;
  academicYear: string;
  description: string;
  chaptersCount?: number;
}

export interface BlueprintRow {
  id: string;
  questionType: QuestionType;
  numberOfQuestions: number;
  marksPerQuestion: number;
  totalMarks: number;
  sectionTitle?: string;
  instructions?: string;
}

export interface PaperPattern {
  id: string;
  name: string;
  description: string;
  grade: string;
  subject: string;
  totalMarks: number;
  defaultDuration: string;
  sections: BlueprintRow[];
  isDefault?: boolean;
}

export interface MatchPair {
  left: string;
  right: string;
}

export interface QuestionQualityScorecard {
  textualGrounding: number; // 0-2: 0=unsupported, 1=loosely related, 2=directly supported
  educationalValue: number; // 0-2: 0=trivial recall, 1=useful comprehension, 2=meaningful understanding/application/analysis
  questionQuality: number; // 0-2: 0=generic/poor, 1=acceptable, 2=natural, precise, teacher-like
  uniqueness: number; // 0-2: 0=duplicate, 1=somewhat similar, 2=clearly tests different aspect/skill
  ageAppropriateness: number; // 0-2: 0=unsuitable, 1=acceptable, 2=appropriately challenging Class 7
  answerability: number; // 0-2: 0=ambiguous, 1=mostly clear, 2=clear, objectively/appropriately answerable
  sourceSpecificity: number; // 0-2: 0=generic across any lesson, 1=somewhat specific, 2=strongly dependent on this lesson
  totalScore: number; // 0-14 (sum of above 7 categories)
  ratingGrade: 'Excellent' | 'Good' | 'Weak' | 'Reject'; // 12-14: Excellent, 10-11: Good, 8-9: Weak, 0-7: Reject
  genericTestPassed: boolean; // Could lesson title be replaced with another and still work? Must be false to pass.
  distractorAuditPassed?: boolean; // For MCQs: plausible, balanced length, no absurd options
  notes?: string;
}

export interface GeneratedQuestion {
  id: string;
  number: number;
  sectionId: string;
  sectionTitle: string;
  questionType: QuestionType;
  question: string;
  options?: string[]; // for MCQ (4 options)
  matchPairs?: MatchPair[]; // for Match the following
  answer: string;
  acceptableAlternatives?: string[]; // alternative valid phrasing or acceptable answers
  markingRubric?: string[]; // for Short/Long answers
  marks: number;
  chapter: string;
  difficulty: 'easy' | 'moderate' | 'difficult';
  cognitiveLevel?: CognitiveLevel;
  depthLayer?: AssessmentDepthLayer; // 6-layer question depth engine
  budgetCategory?: QuestionBudgetCategory; // Question Budget per lesson
  learningObjectiveAssessed?: string; // e.g. "LO2: Character analysis and ethical perspective"
  teacherQualityScore?: number; // 1-5 Independent Examiner Score
  scorecard?: QuestionQualityScorecard; // 14-Point Mandatory Quality Scorecard
  assessmentObjective?: string; // "A teacher is asking this because it assesses..."
  explanation?: string; // teacher justification / solution rationale
  groundingTier?: GroundingTier; // Tier A, B, C or D
  optionLetterConsistent?: boolean;
  locked?: boolean;
  verified?: boolean;
}

export interface PaperSection {
  id: string;
  title: string;
  sectionLetter: string;
  questionType: QuestionType;
  instructions: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
  totalMarks: number;
  questions: GeneratedQuestion[];
}

export interface TestPaper {
  id: string;
  title: string;
  schoolId: string;
  schoolName: string;
  schoolAddress?: string;
  grade: string;
  subject: string;
  bookId: string;
  bookTitle: string;
  selectedChapterIds: string[];
  selectedChapterTitles: string[];
  examName: string;
  academicYear: string;
  date: string;
  duration: string;
  maximumMarks: number;
  difficulty: DifficultyLevel;
  difficultyDistribution?: {
    easy: number;
    moderate: number;
    difficult: number;
  };
  sections: PaperSection[];
  status: 'Draft' | 'Generated' | 'Reviewed' | 'Approved' | 'Final';
  version: number;
  createdAt: string;
  updatedAt: string;
  allowBroaderSyllabus: boolean;
  restartNumberingPerSection: boolean;
  generalInstructions: string[];
}

export interface QualityCheckItem {
  id: string;
  title: string;
  description: string;
  passed: boolean;
  severity: 'error' | 'warning' | 'info';
  details?: string;
}

export interface TeacherQualityGateReport {
  overallRating: number;
  ratedQuestionsCount: number;
  ratingBreakdown: { score5: number; score4: number; score3: number; score2: number; score1: number };
  unacceptableCount: number;
  scorecardAudit: {
    averageScore: number; // out of 14
    excellentCount: number; // 12-14
    goodCount: number; // 10-11
    weakCount: number; // 8-9
    rejectCount: number; // 0-7
    passedThreshold: boolean; // all questions >= 10
    genericDetectorPassed: boolean;
    recallRatio: number; // percentage (target 30-40%)
    understandingRatio: number; // percentage (target 40-50%)
    analysisRatio: number; // percentage (target 15-25%)
    distractorQualityPassed: boolean;
    details: string;
  };
  questionDepthEngineAudit?: {
    passed: boolean;
    layerCounts: {
      layer1Recall: number;
      layer2Comprehension: number;
      layer3Inference: number;
      layer4Analysis: number;
      layer5Application: number;
      layer6CreativeResponse: number;
    };
    memoryOnlyFlagged: boolean;
    singleFactRepetitionFlagged: boolean;
    guessingVulnerabilityFlagged: boolean;
    details: string;
  };
  candidatePoolAudit?: CandidatePoolAudit; // Generate → challenge → score → reject → select → validate → answer
  grammarTypographyAudit: {
    passed: boolean;
    duplicateWordsFound: number;
    punctuationIssues: number;
    details: string;
  };
  whyTeacherAskedAudit: {
    passed: boolean;
    trivialFactQuestions: number;
    meaningfulLearningObjectives: number;
    details: string;
  };
  answerKeyProportionalityAudit: {
    passed: boolean;
    missingRubrics: number;
    unsupportedAnswers: number;
    acceptableAlternativesIncluded: number;
    details: string;
  };
  lessonSpecificityAudit: {
    passed: boolean;
    poetryQuestionsCount: number;
    storyQuestionsCount: number;
    practicalQuestionsCount: number;
    details: string;
  };
  humanExaminerSignoff: {
    status: 'Approved' | 'Revision Required';
    examinerRemarks: string;
  };
  answerKeyValidation?: AnswerKeyValidationReport;
}

export interface QualityCheckReport {
  overallPassed: boolean;
  calculatedMarks: number;
  expectedMarks: number;
  totalQuestions: number;
  lessonCoverage?: { chapter: string; questionCount: number; marks: number }[];
  difficultyDistribution?: { easy: number; moderate: number; difficult: number };
  cognitiveDistribution?: Record<string, number>;
  repetitionCheckPassed?: boolean;
  textualEvidenceVerified?: boolean;
  notesOrLimitations?: string;
  teacherQualityGate?: TeacherQualityGateReport;
  answerKeyValidation?: AnswerKeyValidationReport;
  items: QualityCheckItem[];
}

export interface QuestionBankItem extends GeneratedQuestion {
  subject: string;
  grade: string;
  bookTitle: string;
  source: 'AI Generated' | 'Teacher Created' | 'Verified';
  createdAt: string;
  usageCount: number;
}

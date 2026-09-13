// Rabbit NEET Preparation - Data Models & Types

export type SubjectId = 'physics' | 'chemistry' | 'botany' | 'zoology';
export type ClassLevel = '11' | '12';
export type ChapterStatus = 
  | 'not_started' 
  | 'learning' 
  | 'needs_practice' 
  | 'needs_revision' 
  | 'exam_ready' 
  | 'in_progress' 
  | 'completed';
export type StrengthLevel = 'weak' | 'average' | 'strong';
export type PlannerStatus = 'planned' | 'in_progress' | 'done' | 'skipped' | 'rescheduled';
export type DoubtStatus = 'open' | 'resolved';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type QuestionSourceType =
  | 'VERIFIED_PYQ'
  | 'VERIFIED_CONTENT'
  | 'RABBIT_PRACTICE'
  | 'USER_CREATED';

export type VerificationStatus = 'VERIFIED' | 'UNVERIFIED' | 'COMMUNITY_FLAGGED';

export type MistakeCategory =
  | 'Concept mistake'
  | 'Formula mistake'
  | 'Calculation mistake'
  | 'Silly mistake'
  | 'Memory mistake'
  | 'Guess'
  | 'Time pressure';

export type TestType =
  | 'Topic Test'
  | 'Chapter Test'
  | 'Subject Test'
  | 'Part Syllabus'
  | 'Full Syllabus'
  | 'PYQ Test'
  | 'Weak Area Test'
  | 'Mistake Notebook Test'
  | 'Grand Mock'
  | 'NEET Style Mock';

export type QuickStudyModeId =
  | '15_MIN_QUICK_REVISION'
  | '30_MIN_FOCUSED_SESSION'
  | 'LOW_ENERGY_MODE'
  | 'MISTAKE_REVIEW'
  | 'PYQ_SPRINT'
  | 'MCQ_SPRINT';

export interface VideoSolution {
  videoUrl: string;
  provider: 'YouTube' | 'Vimeo' | 'Hosted' | 'Other';
  title: string;
  verificationStatus: VerificationStatus;
}

export interface Question {
  id: string;
  sourceType: QuestionSourceType;
  year?: number; // Authentic NEET exam year (e.g., 2023, 2022)
  subject: SubjectId;
  classLevel: ClassLevel;
  chapterId: string;
  chapterName: string;
  topicId?: string;
  topicName: string;
  questionText: string;
  options: string[]; // 4 options
  correctAnswer: number; // 0, 1, 2, 3
  explanation?: string;
  conceptTested?: string;
  whyCorrect?: string;
  whyOptionsIncorrect?: string[];
  formulaUsed?: string;
  difficulty: DifficultyLevel;
  isImportant: boolean;
  isTricky: boolean;
  tags: string[];
  estimatedTimeSeconds: number;
  negativeMarking: number; // default -1
  solutionAvailable: boolean;
  videoSolutionAvailable: boolean;
  videoSolution?: VideoSolution;
  verificationStatus: VerificationStatus;
}

export interface QuestionAttempt {
  id: string;
  questionId: string;
  selectedOption: number; // -1 if skipped, 0-3
  isCorrect: boolean;
  isSkipped: boolean;
  timeSpentSeconds: number;
  attemptedAt: string; // ISO string
  mistakeCategory?: MistakeCategory;
  notes?: string;
}

export interface MistakeEntry {
  id: string;
  questionId: string;
  question: Question;
  subject: SubjectId;
  chapterId: string;
  chapterName: string;
  topicName: string;
  firstFailedDate: string; // ISO
  lastFailedDate: string; // ISO
  failCount: number;
  successCount: number;
  mistakeCategory: MistakeCategory;
  notes: string;
  revisionHistory: Array<{
    date: string;
    result: 'correct' | 'wrong' | 'still_confused';
    notes?: string;
  }>;
  nextRevisionDate: string; // YYYY-MM-DD
  intervalDays: number; // 1, 3, 7, 14, 30...
  masteryState: 'critical' | 'needs_practice' | 'revising' | 'mastered';
}

export interface TestSeriesDefinition {
  id: string;
  title: string;
  type: TestType;
  questionCount: 50 | 100 | 125 | 150 | 200;
  durationMinutes: number; // e.g. 180 or 200 for 200 Qs
  subject?: SubjectId;
  chapterIds?: string[];
  isLocked?: boolean;
  sourceFilter?: QuestionSourceType;
  description: string;
}

export interface ActiveTestState {
  testId: string;
  testTitle: string;
  testType: TestType;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, number>; // questionId -> selectedOption (0-3)
  markedForReview: Record<string, boolean>; // questionId -> boolean
  timeRemainingSeconds: number;
  startedAt: string; // ISO
  timePerQuestionSeconds: Record<string, number>;
  isPaused: boolean;
  isCompleted: boolean;
}

export interface TestResult {
  id: string;
  testId: string;
  testTitle: string;
  testType: TestType;
  completedAt: string; // ISO
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  markedForReviewCount: number;
  score: number; // +4, -1, 0
  maxScore: number;
  percentage: number;
  accuracy: number;
  totalTimeSeconds: number;
  averageTimePerQuestionSeconds: number;
  subjectBreakdown: Record<SubjectId, {
    total: number;
    attempted: number;
    correct: number;
    wrong: number;
    score: number;
    accuracy: number;
    timeSeconds: number;
  }>;
  mistakeCategories: Record<MistakeCategory, number>;
  questionAttempts: QuestionAttempt[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string; // ISO
  progress: number; // 0 - 100
  threshold: number;
  currentValue: number;
}

export interface TopicPyqIntelligence {
  topicName: string;
  chapterName: string;
  subject: SubjectId;
  pyqCount: number;
  studentAttempts: number;
  accuracy: number;
  wrongCount: number;
  lastAttemptedDate?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface RecommendationAction {
  id: string;
  actionTitle: string;
  actionSubtitle: string;
  reason: string;
  estimatedMinutes: number;
  category: 'REVISION' | 'PRACTICE' | 'MISTAKE' | 'MOCK';
  targetSubject?: SubjectId;
  targetChapterId?: string;
  targetChapterName?: string;
  buttonLabel: string;
  navTarget: 'home' | 'study' | 'mcqs' | 'tests' | 'mistakes' | 'pyqs' | 'progress' | 'profile';
}

export interface StudentProfile {
  id: string;
  name: string;
  targetYear: number;
  gradeStatus: 'class12' | 'dropper';
  examDate: string; // YYYY-MM-DD
  targetScore: number; // e.g. 680 (out of 720)
  strengths: {
    physics: StrengthLevel;
    chemistry: StrengthLevel;
    botany: StrengthLevel;
    zoology: StrengthLevel;
  };
  dailyTargetHours: number;
  dailyMcqTarget: number;
  onboarded: boolean;
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  name: string;
  isCompleted: boolean;
  notes?: string;
  pyqCount?: number;
}

export interface Chapter {
  id: string;
  subjectId: SubjectId;
  classLevel: ClassLevel;
  order: number;
  name: string;
  status: ChapterStatus;
  priority: 'high' | 'medium' | 'low';
  topics: Topic[];
  notes?: string;
  lastStudied?: string; // ISO string
  revisionDue?: string; // ISO date string (YYYY-MM-DD)
  mcqCount: number;
  correctMcqs: number;
  pyqCount: number;
  masteryPercentage: number; // 0 to 100
  isVerifiedNmcSyllabus: boolean; // Flag to indicate official NEET syllabus status
}

export interface StudyPlanItem {
  id: string;
  date: string; // YYYY-MM-DD
  subjectId: SubjectId;
  chapterId: string;
  topicId?: string;
  topicName?: string;
  chapterName: string;
  plannedMinutes: number;
  actualMinutes: number;
  status: PlannerStatus;
  notes?: string;
  createdAt: string;
}

export interface StudySessionLog {
  id: string;
  subjectId: SubjectId;
  chapterId: string;
  chapterName: string;
  topicId?: string;
  topicName?: string;
  minutes: number;
  notes: string;
  doubtsIdentified?: string;
  timestamp: string; // ISO string
  date: string; // YYYY-MM-DD
}

export interface DoubtItem {
  id: string;
  doubtText: string;
  subjectId: SubjectId;
  chapterId: string;
  chapterName: string;
  topicName?: string;
  createdDate: string; // ISO string
  status: DoubtStatus;
  resolutionNote?: string;
  resolvedAt?: string;
}

export interface McqSessionRecord {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string;
  subjectId: SubjectId;
  chapterId: string;
  chapterName: string;
  topicName?: string;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  isPyq: boolean;
  notes?: string;
}

export interface DailyMcqGoal {
  date: string; // YYYY-MM-DD
  target: number; // default 100
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  totalTimeSeconds: number;
  isCompleted: boolean;
  subjectBreakdown?: Record<SubjectId, { attempted: number; correct: number }>;
}

export interface MockTestRecord {
  id: string;
  title: string;
  date: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  score: number;
  totalScore: number;
  physicsScore: number;
  chemistryScore: number;
  botanyScore: number;
  zoologyScore: number;
  notes?: string;
}

export interface UserBackupData {
  version: string;
  exportDate: string;
  profile: StudentProfile | null;
  chapters: Chapter[];
  studyPlans: StudyPlanItem[];
  studyLogs: StudySessionLog[];
  doubts: DoubtItem[];
  mcqRecords: McqSessionRecord[];
  dailyGoals: Record<string, DailyMcqGoal>;
  mockTests: MockTestRecord[];
  questions?: Question[];
  mistakes?: MistakeEntry[];
  testResults?: TestResult[];
  achievements?: Achievement[];
}

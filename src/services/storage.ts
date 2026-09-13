import {
  StudentProfile,
  Chapter,
  StudyPlanItem,
  StudySessionLog,
  DoubtItem,
  McqSessionRecord,
  DailyMcqGoal,
  MockTestRecord,
  Question,
  MistakeEntry,
  TestResult,
  Achievement,
  UserBackupData,
  ActiveTestState
} from '../types';
import { INITIAL_NEET_SYLLABUS } from '../data/syllabus';
import { SEED_QUESTION_BANK } from '../data/questions';
import { DEFAULT_ACHIEVEMENTS } from '../data/achievements';

const STORAGE_KEYS = {
  PROFILE: 'rabbit_profile_v1',
  CHAPTERS: 'rabbit_chapters_v1',
  STUDY_PLANS: 'rabbit_study_plans_v1',
  STUDY_LOGS: 'rabbit_study_logs_v1',
  DOUBTS: 'rabbit_doubts_v1',
  MCQ_RECORDS: 'rabbit_mcq_records_v1',
  DAILY_MCQ_GOALS: 'rabbit_daily_mcq_goals_v1',
  MOCK_TESTS: 'rabbit_mock_tests_v1',
  SESSION_TIMER: 'rabbit_active_timer_v1',
  QUESTIONS: 'rabbit_questions_v1',
  MISTAKES: 'rabbit_mistakes_v1',
  TEST_RESULTS: 'rabbit_test_results_v1',
  ACTIVE_TEST: 'rabbit_active_test_v1',
  ACHIEVEMENTS: 'rabbit_achievements_v1'
};

// Date utilities
export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const calculateDaysRemaining = (targetDateStr: string): number => {
  if (!targetDateStr) return 0;
  const target = new Date(targetDateStr);
  const now = new Date();
  const targetUtc = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  const nowUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.ceil((targetUtc - nowUtc) / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export const addDaysToDate = (dateStr: string, days: number): string => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ================= Storage Service =================

export const StorageService = {
  // Profile
  getProfile(): StudentProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveProfile(profile: StudentProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  // Chapters & Syllabus
  getChapters(): Chapter[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAPTERS);
      if (!data) {
        this.saveChapters(INITIAL_NEET_SYLLABUS);
        return INITIAL_NEET_SYLLABUS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_NEET_SYLLABUS;
    }
  },

  saveChapters(chapters: Chapter[]): void {
    localStorage.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(chapters));
  },

  updateChapter(updatedChapter: Chapter): Chapter[] {
    const chapters = this.getChapters();
    const index = chapters.findIndex(c => c.id === updatedChapter.id);
    if (index !== -1) {
      chapters[index] = updatedChapter;
      this.saveChapters(chapters);
    }
    return chapters;
  },

  // Questions Bank Engine
  getQuestions(): Question[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (!data) {
        this.saveQuestions(SEED_QUESTION_BANK);
        return SEED_QUESTION_BANK;
      }
      return JSON.parse(data);
    } catch {
      return SEED_QUESTION_BANK;
    }
  },

  saveQuestions(questions: Question[]): void {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  },

  addQuestion(question: Question): Question[] {
    const questions = this.getQuestions();
    if (!questions.some(q => q.id === question.id)) {
      questions.unshift(question);
      this.saveQuestions(questions);
    }
    return questions;
  },

  // Mistake Notebook & Spaced Repetition (Intervals: 1, 3, 7, 14, 30 days)
  getMistakes(): MistakeEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MISTAKES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveMistakes(mistakes: MistakeEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(mistakes));
  },

  recordQuestionMistake(
    question: Question,
    category: MistakeEntry['mistakeCategory'],
    notes = ''
  ): MistakeEntry[] {
    const mistakes = this.getMistakes();
    const existingIndex = mistakes.findIndex(m => m.questionId === question.id);
    const today = getTodayDateString();

    if (existingIndex !== -1) {
      const existing = mistakes[existingIndex];
      existing.lastFailedDate = new Date().toISOString();
      existing.failCount += 1;
      existing.mistakeCategory = category || existing.mistakeCategory;
      if (notes) existing.notes = notes;
      // Repeatedly wrong: reset or shorten interval to 1 day
      existing.intervalDays = 1;
      existing.nextRevisionDate = addDaysToDate(today, 1);
      existing.masteryState = existing.failCount >= 3 ? 'critical' : 'needs_practice';
      mistakes[existingIndex] = existing;
    } else {
      const newEntry: MistakeEntry = {
        id: 'mistake_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        questionId: question.id,
        question,
        subject: question.subject,
        chapterId: question.chapterId,
        chapterName: question.chapterName,
        topicName: question.topicName,
        firstFailedDate: new Date().toISOString(),
        lastFailedDate: new Date().toISOString(),
        failCount: 1,
        successCount: 0,
        mistakeCategory: category || 'Concept mistake',
        notes,
        revisionHistory: [],
        nextRevisionDate: addDaysToDate(today, 1),
        intervalDays: 1,
        masteryState: 'needs_practice'
      };
      mistakes.unshift(newEntry);
    }

    this.saveMistakes(mistakes);
    return mistakes;
  },

  updateMistakeReview(
    mistakeId: string,
    result: 'correct' | 'wrong' | 'still_confused',
    notes = ''
  ): MistakeEntry[] {
    const mistakes = this.getMistakes();
    const index = mistakes.findIndex(m => m.id === mistakeId);
    if (index === -1) return mistakes;

    const entry = mistakes[index];
    const today = getTodayDateString();

    entry.revisionHistory.push({
      date: new Date().toISOString(),
      result,
      notes
    });

    if (result === 'correct') {
      entry.successCount += 1;
      // Spaced intervals: 1 -> 3 -> 7 -> 14 -> 30 -> 60
      if (entry.intervalDays <= 1) entry.intervalDays = 3;
      else if (entry.intervalDays === 3) entry.intervalDays = 7;
      else if (entry.intervalDays === 7) entry.intervalDays = 14;
      else if (entry.intervalDays === 14) entry.intervalDays = 30;
      else entry.intervalDays = 60;

      entry.nextRevisionDate = addDaysToDate(today, entry.intervalDays);
      entry.masteryState = entry.successCount >= 3 ? 'mastered' : 'revising';
    } else if (result === 'wrong') {
      entry.failCount += 1;
      entry.intervalDays = 1; // Sched sooner
      entry.nextRevisionDate = addDaysToDate(today, 1);
      entry.masteryState = 'critical';
    } else {
      // still_confused
      entry.intervalDays = 1;
      entry.nextRevisionDate = addDaysToDate(today, 1);
      entry.masteryState = 'needs_practice';
    }

    mistakes[index] = entry;
    this.saveMistakes(mistakes);
    return mistakes;
  },

  deleteMistake(mistakeId: string): MistakeEntry[] {
    const mistakes = this.getMistakes().filter(m => m.id !== mistakeId);
    this.saveMistakes(mistakes);
    return mistakes;
  },

  // Test Results & Persistence
  getTestResults(): TestResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEST_RESULTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveTestResults(results: TestResult[]): void {
    localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(results));
  },

  addTestResult(result: TestResult): TestResult[] {
    const results = this.getTestResults();
    results.unshift(result);
    this.saveTestResults(results);

    // Also link with standard mock test record list for backwards compatibility
    const mockTests = this.getMockTests();
    mockTests.unshift({
      id: result.id,
      title: result.testTitle,
      date: result.completedAt.split('T')[0],
      totalQuestions: result.totalQuestions,
      attempted: result.attempted,
      correct: result.correct,
      wrong: result.wrong,
      score: result.score,
      totalScore: result.maxScore,
      physicsScore: result.subjectBreakdown.physics?.score || 0,
      chemistryScore: result.subjectBreakdown.chemistry?.score || 0,
      botanyScore: result.subjectBreakdown.botany?.score || 0,
      zoologyScore: result.subjectBreakdown.zoology?.score || 0,
      notes: `${result.testType} - Accuracy: ${result.accuracy}%`
    });
    this.saveMockTests(mockTests);

    // Also update chapter stats and mistake entries from question attempts
    result.questionAttempts.forEach(att => {
      const q = this.getQuestions().find(question => question.id === att.questionId);
      if (q && !att.isSkipped) {
        if (!att.isCorrect) {
          this.recordQuestionMistake(q, att.mistakeCategory || 'Concept mistake');
        }
      }
    });

    return results;
  },

  getActiveTestState(): ActiveTestState | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_TEST);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveActiveTestState(state: ActiveTestState | null): void {
    if (state === null) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_TEST);
    } else {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TEST, JSON.stringify(state));
    }
  },

  // Achievements
  getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (!data) {
        this.saveAchievements(DEFAULT_ACHIEVEMENTS);
        return DEFAULT_ACHIEVEMENTS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_ACHIEVEMENTS;
    }
  },

  saveAchievements(achievements: Achievement[]): void {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  },

  evaluateAchievements(): Achievement[] {
    const list = this.getAchievements();
    const streak = this.calculateStudyStreak();
    const mcqs = this.getMcqRecords();
    const totalMcqs = mcqs.reduce((acc, r) => acc + r.attempted, 0);
    const totalCorrect = mcqs.reduce((acc, r) => acc + r.correct, 0);
    const totalPyqs = mcqs.filter(r => r.isPyq).reduce((acc, r) => acc + r.attempted, 0);
    const logs = this.getStudyLogs();
    const totalStudyHours = Math.round(logs.reduce((acc, l) => acc + l.minutes, 0) / 60);
    const accuracy = totalMcqs >= 200 ? Math.round((totalCorrect / totalMcqs) * 100) : 0;

    const updated = list.map(ach => {
      let current = 0;
      if (ach.id === 'ach-streak-7' || ach.id === 'ach-streak-30') current = streak;
      else if (ach.id === 'ach-mcq-100' || ach.id === 'ach-mcq-1000' || ach.id === 'ach-mcq-10000') current = totalMcqs;
      else if (ach.id === 'ach-pyq-100') current = totalPyqs;
      else if (ach.id === 'ach-study-100h') current = totalStudyHours;
      else if (ach.id === 'ach-accuracy-90') current = accuracy;

      const progress = Math.min(100, Math.round((current / ach.threshold) * 100));
      const isUnlocked = current >= ach.threshold;

      return {
        ...ach,
        currentValue: current,
        progress,
        unlockedAt: isUnlocked && !ach.unlockedAt ? new Date().toISOString() : ach.unlockedAt
      };
    });

    this.saveAchievements(updated);
    return updated;
  },

  // Study Plans
  getStudyPlans(): StudyPlanItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_PLANS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveStudyPlans(plans: StudyPlanItem[]): void {
    localStorage.setItem(STORAGE_KEYS.STUDY_PLANS, JSON.stringify(plans));
  },

  addStudyPlan(plan: StudyPlanItem): StudyPlanItem[] {
    const plans = this.getStudyPlans();
    plans.unshift(plan);
    this.saveStudyPlans(plans);
    return plans;
  },

  updateStudyPlan(plan: StudyPlanItem): StudyPlanItem[] {
    const plans = this.getStudyPlans();
    const index = plans.findIndex(p => p.id === plan.id);
    if (index !== -1) {
      plans[index] = plan;
      this.saveStudyPlans(plans);
    }
    return plans;
  },

  deleteStudyPlan(id: string): StudyPlanItem[] {
    const plans = this.getStudyPlans().filter(p => p.id !== id);
    this.saveStudyPlans(plans);
    return plans;
  },

  // Study Logs
  getStudyLogs(): StudySessionLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveStudyLogs(logs: StudySessionLog[]): void {
    localStorage.setItem(STORAGE_KEYS.STUDY_LOGS, JSON.stringify(logs));
  },

  addStudyLog(log: StudySessionLog): StudySessionLog[] {
    const logs = this.getStudyLogs();
    logs.unshift(log);
    this.saveStudyLogs(logs);

    // Update chapter lastStudied date and revisionDue (default +3 days)
    const chapters = this.getChapters();
    const chapter = chapters.find(c => c.id === log.chapterId);
    if (chapter) {
      chapter.lastStudied = log.timestamp;
      chapter.revisionDue = addDaysToDate(getTodayDateString(), 3);
      this.updateChapter(chapter);
    }

    return logs;
  },

  updateStudyLog(log: StudySessionLog): StudySessionLog[] {
    const logs = this.getStudyLogs();
    const index = logs.findIndex(l => l.id === log.id);
    if (index !== -1) {
      logs[index] = log;
      this.saveStudyLogs(logs);
    }
    return logs;
  },

  deleteStudyLog(id: string): StudySessionLog[] {
    const logs = this.getStudyLogs().filter(l => l.id !== id);
    this.saveStudyLogs(logs);
    return logs;
  },

  // Doubts
  getDoubts(): DoubtItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOUBTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveDoubts(doubts: DoubtItem[]): void {
    localStorage.setItem(STORAGE_KEYS.DOUBTS, JSON.stringify(doubts));
  },

  addDoubt(doubt: DoubtItem): DoubtItem[] {
    const doubts = this.getDoubts();
    doubts.unshift(doubt);
    this.saveDoubts(doubts);
    return doubts;
  },

  updateDoubt(doubt: DoubtItem): DoubtItem[] {
    const doubts = this.getDoubts();
    const index = doubts.findIndex(d => d.id === doubt.id);
    if (index !== -1) {
      doubts[index] = doubt;
      this.saveDoubts(doubts);
    }
    return doubts;
  },

  deleteDoubt(id: string): DoubtItem[] {
    const doubts = this.getDoubts().filter(d => d.id !== id);
    this.saveDoubts(doubts);
    return doubts;
  },

  // MCQ Records & Daily Mission
  getMcqRecords(): McqSessionRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MCQ_RECORDS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveMcqRecords(records: McqSessionRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.MCQ_RECORDS, JSON.stringify(records));
  },

  getDailyMcqGoals(): Record<string, DailyMcqGoal> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_MCQ_GOALS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  saveDailyMcqGoals(goals: Record<string, DailyMcqGoal>): void {
    localStorage.setItem(STORAGE_KEYS.DAILY_MCQ_GOALS, JSON.stringify(goals));
  },

  addMcqSession(record: McqSessionRecord, dailyTarget = 100): { records: McqSessionRecord[]; todayGoal: DailyMcqGoal } {
    // Prevent negative counts
    const cleanAttempted = Math.max(0, record.attempted);
    const cleanCorrect = Math.max(0, Math.min(record.correct, cleanAttempted));
    const cleanSkipped = Math.max(0, Math.min(record.skipped, cleanAttempted - cleanCorrect));
    const cleanWrong = Math.max(0, cleanAttempted - cleanCorrect - cleanSkipped);

    const safeRecord: McqSessionRecord = {
      ...record,
      attempted: cleanAttempted,
      correct: cleanCorrect,
      wrong: cleanWrong,
      skipped: cleanSkipped
    };

    const records = this.getMcqRecords();
    records.unshift(safeRecord);
    this.saveMcqRecords(records);

    // Update chapter statistics
    const chapters = this.getChapters();
    const chapter = chapters.find(c => c.id === safeRecord.chapterId);
    if (chapter) {
      chapter.mcqCount = (chapter.mcqCount || 0) + safeRecord.attempted;
      chapter.correctMcqs = (chapter.correctMcqs || 0) + safeRecord.correct;
      if (safeRecord.isPyq) {
        chapter.pyqCount = (chapter.pyqCount || 0) + safeRecord.attempted;
      }
      const completedTopics = chapter.topics.filter(t => t.isCompleted).length;
      const topicRatio = chapter.topics.length > 0 ? (completedTopics / chapter.topics.length) : 0;
      const accuracyRatio = chapter.mcqCount > 0 ? (chapter.correctMcqs / chapter.mcqCount) : 0;
      chapter.masteryPercentage = Math.round((topicRatio * 60) + (accuracyRatio * 40));
      this.updateChapter(chapter);
    }

    // Update Daily MCQ Goal
    const goals = this.getDailyMcqGoals();
    const dateKey = safeRecord.date;
    const existing = goals[dateKey] || {
      date: dateKey,
      target: dailyTarget,
      attempted: 0,
      correct: 0,
      wrong: 0,
      skipped: 0,
      totalTimeSeconds: 0,
      isCompleted: false,
      subjectBreakdown: {
        physics: { attempted: 0, correct: 0 },
        chemistry: { attempted: 0, correct: 0 },
        botany: { attempted: 0, correct: 0 },
        zoology: { attempted: 0, correct: 0 }
      }
    };

    existing.attempted += safeRecord.attempted;
    existing.correct += safeRecord.correct;
    existing.wrong += safeRecord.wrong;
    existing.skipped += safeRecord.skipped;
    existing.totalTimeSeconds += (safeRecord.durationMinutes * 60);
    existing.isCompleted = existing.attempted >= existing.target;

    if (!existing.subjectBreakdown) {
      existing.subjectBreakdown = {
        physics: { attempted: 0, correct: 0 },
        chemistry: { attempted: 0, correct: 0 },
        botany: { attempted: 0, correct: 0 },
        zoology: { attempted: 0, correct: 0 }
      };
    }
    if (existing.subjectBreakdown[safeRecord.subjectId]) {
      existing.subjectBreakdown[safeRecord.subjectId].attempted += safeRecord.attempted;
      existing.subjectBreakdown[safeRecord.subjectId].correct += safeRecord.correct;
    }

    goals[dateKey] = existing;
    this.saveDailyMcqGoals(goals);

    this.evaluateAchievements();

    return { records, todayGoal: existing };
  },

  getTodayMcqGoal(dailyTarget = 100): DailyMcqGoal {
    const today = getTodayDateString();
    const goals = this.getDailyMcqGoals();
    if (!goals[today]) {
      const newGoal: DailyMcqGoal = {
        date: today,
        target: dailyTarget,
        attempted: 0,
        correct: 0,
        wrong: 0,
        skipped: 0,
        totalTimeSeconds: 0,
        isCompleted: false,
        subjectBreakdown: {
          physics: { attempted: 0, correct: 0 },
          chemistry: { attempted: 0, correct: 0 },
          botany: { attempted: 0, correct: 0 },
          zoology: { attempted: 0, correct: 0 }
        }
      };
      goals[today] = newGoal;
      this.saveDailyMcqGoals(goals);
      return newGoal;
    }
    return goals[today];
  },

  // Mock Tests
  getMockTests(): MockTestRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MOCK_TESTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveMockTests(tests: MockTestRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.MOCK_TESTS, JSON.stringify(tests));
  },

  addMockTest(test: MockTestRecord): MockTestRecord[] {
    const tests = this.getMockTests();
    tests.unshift(test);
    this.saveMockTests(tests);
    return tests;
  },

  deleteMockTest(id: string): MockTestRecord[] {
    const tests = this.getMockTests().filter(t => t.id !== id);
    this.saveMockTests(tests);
    return tests;
  },

  // Streak Calculation based on genuine activity
  calculateStudyStreak(): number {
    const logs = this.getStudyLogs();
    const mcqs = this.getMcqRecords();
    const testResults = this.getTestResults();

    const activeDates = new Set<string>();
    logs.forEach(l => activeDates.add(l.date));
    mcqs.forEach(m => activeDates.add(m.date));
    testResults.forEach(t => activeDates.add(t.completedAt.split('T')[0]));

    if (activeDates.size === 0) return 0;

    let streak = 0;
    const current = new Date();
    const todayStr = getTodayDateString();

    let checkDate = new Date(current);
    if (!activeDates.has(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      if (!activeDates.has(yesterdayStr)) {
        return 0;
      }
    }

    while (true) {
      const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      if (activeDates.has(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  },

  // Active Timer Persistence
  getActiveTimer(): { isRunning: boolean; elapsedSeconds: number; startTime: number | null; subjectId?: string; chapterId?: string; topicName?: string } | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SESSION_TIMER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  saveActiveTimer(timerState: { isRunning: boolean; elapsedSeconds: number; startTime: number | null; subjectId?: string; chapterId?: string; topicName?: string }): void {
    localStorage.setItem(STORAGE_KEYS.SESSION_TIMER, JSON.stringify(timerState));
  },

  clearActiveTimer(): void {
    localStorage.removeItem(STORAGE_KEYS.SESSION_TIMER);
  },

  // Backup: Export / Import with Strict Validation
  exportAllData(): UserBackupData {
    return {
      version: '2.0.0',
      exportDate: new Date().toISOString(),
      profile: this.getProfile(),
      chapters: this.getChapters(),
      studyPlans: this.getStudyPlans(),
      studyLogs: this.getStudyLogs(),
      doubts: this.getDoubts(),
      mcqRecords: this.getMcqRecords(),
      dailyGoals: this.getDailyMcqGoals(),
      mockTests: this.getMockTests(),
      questions: this.getQuestions(),
      mistakes: this.getMistakes(),
      testResults: this.getTestResults(),
      achievements: this.getAchievements()
    };
  },

  importAllData(data: UserBackupData): boolean {
    try {
      if (!data || typeof data !== 'object') return false;
      // Data validation to prevent corruption
      if (data.profile && typeof data.profile === 'object') {
        this.saveProfile(data.profile);
      }
      if (Array.isArray(data.chapters) && data.chapters.length > 0) {
        this.saveChapters(data.chapters);
      }
      if (Array.isArray(data.studyPlans)) this.saveStudyPlans(data.studyPlans);
      if (Array.isArray(data.studyLogs)) this.saveStudyLogs(data.studyLogs);
      if (Array.isArray(data.doubts)) this.saveDoubts(data.doubts);
      if (Array.isArray(data.mcqRecords)) this.saveMcqRecords(data.mcqRecords);
      if (data.dailyGoals && typeof data.dailyGoals === 'object') {
        this.saveDailyMcqGoals(data.dailyGoals);
      }
      if (Array.isArray(data.mockTests)) this.saveMockTests(data.mockTests);
      if (Array.isArray(data.questions)) this.saveQuestions(data.questions);
      if (Array.isArray(data.mistakes)) this.saveMistakes(data.mistakes);
      if (Array.isArray(data.testResults)) this.saveTestResults(data.testResults);
      if (Array.isArray(data.achievements)) this.saveAchievements(data.achievements);
      return true;
    } catch {
      return false;
    }
  },

  resetAllData(): void {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    this.saveChapters(INITIAL_NEET_SYLLABUS);
    this.saveQuestions(SEED_QUESTION_BANK);
    this.saveAchievements(DEFAULT_ACHIEVEMENTS);
  }
};

import React, { createContext, useContext, useState, useEffect } from 'react';
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
  ActiveTestState,
  UserBackupData,
  MistakeCategory
} from '../types';
import { StorageService, getTodayDateString } from '../services/storage';

interface AppContextType {
  profile: StudentProfile | null;
  chapters: Chapter[];
  studyPlans: StudyPlanItem[];
  studyLogs: StudySessionLog[];
  doubts: DoubtItem[];
  mcqRecords: McqSessionRecord[];
  todayMcqGoal: DailyMcqGoal;
  mockTests: MockTestRecord[];
  questions: Question[];
  mistakes: MistakeEntry[];
  testResults: TestResult[];
  achievements: Achievement[];
  activeTest: ActiveTestState | null;
  streak: number;

  // Actions
  updateProfile: (profile: StudentProfile) => void;
  updateChapter: (chapter: Chapter) => void;
  toggleTopicCompletion: (chapterId: string, topicId: string) => void;
  addStudyPlan: (plan: Omit<StudyPlanItem, 'id' | 'createdAt'>) => void;
  updateStudyPlanStatus: (planId: string, status: StudyPlanItem['status']) => void;
  deleteStudyPlan: (id: string) => void;
  addStudyLog: (log: Omit<StudySessionLog, 'id' | 'timestamp' | 'date'>) => void;
  deleteStudyLog: (id: string) => void;
  addDoubt: (doubt: Omit<DoubtItem, 'id' | 'createdDate' | 'status'>) => void;
  resolveDoubt: (id: string, resolutionNote: string) => void;
  deleteDoubt: (id: string) => void;
  addMcqSession: (session: Omit<McqSessionRecord, 'id' | 'timestamp' | 'date'>) => void;
  addMockTest: (test: Omit<MockTestRecord, 'id'>) => void;
  deleteMockTest: (id: string) => void;

  // Question Engine & Mistakes
  recordMistake: (question: Question, category: MistakeCategory, notes?: string) => void;
  reviewMistake: (mistakeId: string, result: 'correct' | 'wrong' | 'still_confused', notes?: string) => void;
  deleteMistake: (mistakeId: string) => void;
  addCustomQuestion: (question: Question) => void;

  // Test Series Engine
  startTest: (testState: ActiveTestState) => void;
  updateTestAnswer: (questionId: string, optionIndex: number) => void;
  toggleMarkForReview: (questionId: string) => void;
  submitTest: (timeUsedSeconds: number) => TestResult | null;
  cancelTest: () => void;

  // Achievements & Backup
  exportData: () => UserBackupData;
  importData: (data: UserBackupData) => boolean;
  resetAll: () => void;
  reloadAll: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile | null>(() => StorageService.getProfile());
  const [chapters, setChapters] = useState<Chapter[]>(() => StorageService.getChapters());
  const [studyPlans, setStudyPlans] = useState<StudyPlanItem[]>(() => StorageService.getStudyPlans());
  const [studyLogs, setStudyLogs] = useState<StudySessionLog[]>(() => StorageService.getStudyLogs());
  const [doubts, setDoubts] = useState<DoubtItem[]>(() => StorageService.getDoubts());
  const [mcqRecords, setMcqRecords] = useState<McqSessionRecord[]>(() => StorageService.getMcqRecords());
  const [todayMcqGoal, setTodayMcqGoal] = useState<DailyMcqGoal>(() =>
    StorageService.getTodayMcqGoal(profile?.dailyMcqTarget || 100)
  );
  const [mockTests, setMockTests] = useState<MockTestRecord[]>(() => StorageService.getMockTests());
  const [questions, setQuestions] = useState<Question[]>(() => StorageService.getQuestions());
  const [mistakes, setMistakes] = useState<MistakeEntry[]>(() => StorageService.getMistakes());
  const [testResults, setTestResults] = useState<TestResult[]>(() => StorageService.getTestResults());
  const [achievements, setAchievements] = useState<Achievement[]>(() => StorageService.evaluateAchievements());
  const [activeTest, setActiveTest] = useState<ActiveTestState | null>(() => StorageService.getActiveTestState());
  const [streak, setStreak] = useState<number>(() => StorageService.calculateStudyStreak());

  const reloadAll = () => {
    const prof = StorageService.getProfile();
    setProfile(prof);
    setChapters(StorageService.getChapters());
    setStudyPlans(StorageService.getStudyPlans());
    setStudyLogs(StorageService.getStudyLogs());
    setDoubts(StorageService.getDoubts());
    setMcqRecords(StorageService.getMcqRecords());
    setTodayMcqGoal(StorageService.getTodayMcqGoal(prof?.dailyMcqTarget || 100));
    setMockTests(StorageService.getMockTests());
    setQuestions(StorageService.getQuestions());
    setMistakes(StorageService.getMistakes());
    setTestResults(StorageService.getTestResults());
    setAchievements(StorageService.evaluateAchievements());
    setActiveTest(StorageService.getActiveTestState());
    setStreak(StorageService.calculateStudyStreak());
  };

  const updateProfile = (updatedProfile: StudentProfile) => {
    StorageService.saveProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  const updateChapter = (updatedChapter: Chapter) => {
    const newChapters = StorageService.updateChapter(updatedChapter);
    setChapters([...newChapters]);
  };

  const toggleTopicCompletion = (chapterId: string, topicId: string) => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    const updatedTopics = chapter.topics.map(t =>
      t.id === topicId ? { ...t, isCompleted: !t.isCompleted } : t
    );

    const completedCount = updatedTopics.filter(t => t.isCompleted).length;
    let newStatus = chapter.status;
    if (completedCount === 0) {
      newStatus = 'not_started';
    } else if (completedCount === updatedTopics.length) {
      newStatus = 'completed';
    } else {
      newStatus = 'in_progress';
    }

    const topicRatio = updatedTopics.length > 0 ? (completedCount / updatedTopics.length) : 0;
    const accuracyRatio = chapter.mcqCount > 0 ? (chapter.correctMcqs / chapter.mcqCount) : 0;
    const masteryPercentage = Math.round((topicRatio * 60) + (accuracyRatio * 40));

    const updatedChapter: Chapter = {
      ...chapter,
      topics: updatedTopics,
      status: newStatus,
      masteryPercentage
    };

    updateChapter(updatedChapter);
  };

  const addStudyPlan = (plan: Omit<StudyPlanItem, 'id' | 'createdAt'>) => {
    const newPlan: StudyPlanItem = {
      ...plan,
      id: 'plan_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString()
    };
    const updated = StorageService.addStudyPlan(newPlan);
    setStudyPlans([...updated]);
  };

  const updateStudyPlanStatus = (planId: string, status: StudyPlanItem['status']) => {
    const plan = studyPlans.find(p => p.id === planId);
    if (!plan) return;
    const updatedPlan = { ...plan, status };
    const updated = StorageService.updateStudyPlan(updatedPlan);
    setStudyPlans([...updated]);
  };

  const deleteStudyPlan = (id: string) => {
    const updated = StorageService.deleteStudyPlan(id);
    setStudyPlans([...updated]);
  };

  const addStudyLog = (logData: Omit<StudySessionLog, 'id' | 'timestamp' | 'date'>) => {
    const now = new Date();
    const newLog: StudySessionLog = {
      ...logData,
      id: 'log_' + Date.now(),
      timestamp: now.toISOString(),
      date: getTodayDateString()
    };
    const updated = StorageService.addStudyLog(newLog);
    setStudyLogs([...updated]);
    setChapters(StorageService.getChapters());
    setStreak(StorageService.calculateStudyStreak());
    setAchievements(StorageService.evaluateAchievements());
  };

  const deleteStudyLog = (id: string) => {
    const updated = StorageService.deleteStudyLog(id);
    setStudyLogs([...updated]);
    setStreak(StorageService.calculateStudyStreak());
  };

  const addDoubt = (doubtData: Omit<DoubtItem, 'id' | 'createdDate' | 'status'>) => {
    const newDoubt: DoubtItem = {
      ...doubtData,
      id: 'doubt_' + Date.now(),
      createdDate: new Date().toISOString(),
      status: 'open'
    };
    const updated = StorageService.addDoubt(newDoubt);
    setDoubts([...updated]);
  };

  const resolveDoubt = (id: string, resolutionNote: string) => {
    const doubt = doubts.find(d => d.id === id);
    if (!doubt) return;
    const updatedDoubt: DoubtItem = {
      ...doubt,
      status: 'resolved',
      resolutionNote,
      resolvedAt: new Date().toISOString()
    };
    const updated = StorageService.updateDoubt(updatedDoubt);
    setDoubts([...updated]);
  };

  const deleteDoubt = (id: string) => {
    const updated = StorageService.deleteDoubt(id);
    setDoubts([...updated]);
  };

  const addMcqSession = (sessionData: Omit<McqSessionRecord, 'id' | 'timestamp' | 'date'>) => {
    const now = new Date();
    const record: McqSessionRecord = {
      ...sessionData,
      id: 'mcq_' + Date.now(),
      timestamp: now.toISOString(),
      date: getTodayDateString()
    };
    const result = StorageService.addMcqSession(record, profile?.dailyMcqTarget || 100);
    setMcqRecords([...result.records]);
    setTodayMcqGoal({ ...result.todayGoal });
    setChapters(StorageService.getChapters());
    setStreak(StorageService.calculateStudyStreak());
    setAchievements(StorageService.evaluateAchievements());
  };

  const addMockTest = (testData: Omit<MockTestRecord, 'id'>) => {
    const newTest: MockTestRecord = {
      ...testData,
      id: 'test_' + Date.now()
    };
    const updated = StorageService.addMockTest(newTest);
    setMockTests([...updated]);
    setStreak(StorageService.calculateStudyStreak());
  };

  const deleteMockTest = (id: string) => {
    const updated = StorageService.deleteMockTest(id);
    setMockTests([...updated]);
  };

  // Mistake Notebook & Spaced Repetition Actions
  const recordMistake = (question: Question, category: MistakeCategory, notes = '') => {
    const updated = StorageService.recordQuestionMistake(question, category, notes);
    setMistakes([...updated]);
  };

  const reviewMistake = (mistakeId: string, result: 'correct' | 'wrong' | 'still_confused', notes = '') => {
    const updated = StorageService.updateMistakeReview(mistakeId, result, notes);
    setMistakes([...updated]);
  };

  const deleteMistake = (mistakeId: string) => {
    const updated = StorageService.deleteMistake(mistakeId);
    setMistakes([...updated]);
  };

  const addCustomQuestion = (question: Question) => {
    const updated = StorageService.addQuestion(question);
    setQuestions([...updated]);
  };

  // Test Series Engine Actions
  const startTest = (testState: ActiveTestState) => {
    StorageService.saveActiveTestState(testState);
    setActiveTest(testState);
  };

  const updateTestAnswer = (questionId: string, optionIndex: number) => {
    if (!activeTest) return;
    const newAnswers = { ...activeTest.answers, [questionId]: optionIndex };
    const updatedState: ActiveTestState = {
      ...activeTest,
      answers: newAnswers
    };
    StorageService.saveActiveTestState(updatedState);
    setActiveTest(updatedState);
  };

  const toggleMarkForReview = (questionId: string) => {
    if (!activeTest) return;
    const current = !!activeTest.markedForReview[questionId];
    const newReviews = { ...activeTest.markedForReview, [questionId]: !current };
    const updatedState: ActiveTestState = {
      ...activeTest,
      markedForReview: newReviews
    };
    StorageService.saveActiveTestState(updatedState);
    setActiveTest(updatedState);
  };

  const cancelTest = () => {
    StorageService.saveActiveTestState(null);
    setActiveTest(null);
  };

  const submitTest = (timeUsedSeconds: number): TestResult | null => {
    if (!activeTest) return null;

    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    let score = 0;

    const subjectBreakdown: TestResult['subjectBreakdown'] = {
      physics: { total: 0, attempted: 0, correct: 0, wrong: 0, score: 0, accuracy: 0, timeSeconds: 0 },
      chemistry: { total: 0, attempted: 0, correct: 0, wrong: 0, score: 0, accuracy: 0, timeSeconds: 0 },
      botany: { total: 0, attempted: 0, correct: 0, wrong: 0, score: 0, accuracy: 0, timeSeconds: 0 },
      zoology: { total: 0, attempted: 0, correct: 0, wrong: 0, score: 0, accuracy: 0, timeSeconds: 0 }
    };

    const mistakeCategories: Record<MistakeCategory, number> = {
      'Concept mistake': 0,
      'Formula mistake': 0,
      'Calculation mistake': 0,
      'Silly mistake': 0,
      'Memory mistake': 0,
      'Guess': 0,
      'Time pressure': 0
    };

    const questionAttempts = activeTest.questions.map(q => {
      const selected = activeTest.answers[q.id];
      const isSkipped = selected === undefined || selected === -1;
      const isCorrect = !isSkipped && selected === q.correctAnswer;
      const isWrong = !isSkipped && !isCorrect;

      const subj = q.subject;
      if (subjectBreakdown[subj]) {
        subjectBreakdown[subj].total += 1;
        if (!isSkipped) {
          subjectBreakdown[subj].attempted += 1;
          if (isCorrect) {
            subjectBreakdown[subj].correct += 1;
            subjectBreakdown[subj].score += 4;
          } else {
            subjectBreakdown[subj].wrong += 1;
            subjectBreakdown[subj].score -= 1;
          }
        }
      }

      let cat: MistakeCategory | undefined = undefined;
      if (isWrong) {
        cat = 'Concept mistake';
        mistakeCategories[cat] += 1;
      }

      if (isSkipped) skipped += 1;
      else if (isCorrect) {
        correct += 1;
        score += 4;
      } else {
        wrong += 1;
        score -= 1;
      }

      return {
        id: 'att_' + Date.now() + '_' + q.id,
        questionId: q.id,
        selectedOption: isSkipped ? -1 : selected,
        isCorrect,
        isSkipped,
        timeSpentSeconds: Math.round(timeUsedSeconds / activeTest.questions.length),
        attemptedAt: new Date().toISOString(),
        mistakeCategory: cat
      };
    });

    const attempted = correct + wrong;
    const totalQ = activeTest.questions.length;
    const maxScore = totalQ * 4;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const percentage = Math.round((Math.max(0, score) / maxScore) * 100);

    // Compute subject accuracies
    (Object.keys(subjectBreakdown) as (keyof typeof subjectBreakdown)[]).forEach(s => {
      const b = subjectBreakdown[s];
      b.accuracy = b.attempted > 0 ? Math.round((b.correct / b.attempted) * 100) : 0;
    });

    const result: TestResult = {
      id: 'result_' + Date.now(),
      testId: activeTest.testId,
      testTitle: activeTest.testTitle,
      testType: activeTest.testType,
      completedAt: new Date().toISOString(),
      totalQuestions: totalQ,
      attempted,
      correct,
      wrong,
      skipped,
      markedForReviewCount: Object.values(activeTest.markedForReview).filter(Boolean).length,
      score,
      maxScore,
      percentage,
      accuracy,
      totalTimeSeconds: timeUsedSeconds,
      averageTimePerQuestionSeconds: attempted > 0 ? Math.round(timeUsedSeconds / attempted) : 0,
      subjectBreakdown,
      mistakeCategories,
      questionAttempts
    };

    StorageService.addTestResult(result);
    StorageService.saveActiveTestState(null);

    setTestResults(StorageService.getTestResults());
    setMockTests(StorageService.getMockTests());
    setMistakes(StorageService.getMistakes());
    setActiveTest(null);
    setStreak(StorageService.calculateStudyStreak());
    setAchievements(StorageService.evaluateAchievements());

    return result;
  };

  const exportData = () => StorageService.exportAllData();

  const importData = (data: UserBackupData): boolean => {
    const success = StorageService.importAllData(data);
    if (success) {
      reloadAll();
    }
    return success;
  };

  const resetAll = () => {
    StorageService.resetAllData();
    reloadAll();
  };

  // Sync theme
  useEffect(() => {
    if (profile?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile?.theme]);

  return (
    <AppContext.Provider
      value={{
        profile,
        chapters,
        studyPlans,
        studyLogs,
        doubts,
        mcqRecords,
        todayMcqGoal,
        mockTests,
        questions,
        mistakes,
        testResults,
        achievements,
        activeTest,
        streak,
        updateProfile,
        updateChapter,
        toggleTopicCompletion,
        addStudyPlan,
        updateStudyPlanStatus,
        deleteStudyPlan,
        addStudyLog,
        deleteStudyLog,
        addDoubt,
        resolveDoubt,
        deleteDoubt,
        addMcqSession,
        addMockTest,
        deleteMockTest,
        recordMistake,
        reviewMistake,
        deleteMistake,
        addCustomQuestion,
        startTest,
        updateTestAnswer,
        toggleMarkForReview,
        submitTest,
        cancelTest,
        exportData,
        importData,
        resetAll,
        reloadAll
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

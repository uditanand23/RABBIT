/**
 * Rabbit Intelligence Engine
 * Deterministic, explainable reasoning algorithms for NEET preparation.
 * No pseudo-AI. Every conclusion is strictly grounded in actual student data.
 */

import {
  Chapter,
  MistakeEntry,
  DailyMcqGoal,
  McqSessionRecord,
  StudentProfile,
  RecommendationAction,
  QuickStudyModeId,
  Question
} from '../types';
import { getTodayDateString } from './storage';

export type WeaknessConfidence = 'LOW_DATA' | 'EMERGING_WEAKNESS' | 'WEAK' | 'STRONG';

export interface ChapterMasteryDiagnosis {
  chapterId: string;
  chapterName: string;
  subject: string;
  state: 'NOT_STARTED' | 'LEARNING' | 'NEEDS_PRACTICE' | 'NEEDS_REVISION' | 'EXAM_READY';
  confidence: WeaknessConfidence;
  accuracy: number;
  totalAttempts: number;
  explanation: string;
}

export class IntelligenceEngine {
  /**
   * Evaluates chapter mastery deterministically based on real student performance.
   * State transitions:
   * - NOT_STARTED: 0 topics completed & 0 questions solved.
   * - LEARNING: Some topics completed, but < 10 questions solved (insufficient practice).
   * - NEEDS_PRACTICE: >= 10 questions solved, but accuracy is under 65%.
   * - NEEDS_REVISION: Accuracy >= 65%, but spaced revision is overdue.
   * - EXAM_READY: All topics completed, >= 20 questions solved with >= 75% accuracy, no overdue revisions.
   */
  public static diagnoseChapter(chapter: Chapter, todayStr = getTodayDateString()): ChapterMasteryDiagnosis {
    const totalTopics = chapter.topics.length;
    const completedTopics = chapter.topics.filter(t => t.isCompleted).length;
    const attempts = chapter.mcqCount || 0;
    const accuracy = attempts > 0 ? Math.round(((chapter.correctMcqs || 0) / attempts) * 100) : 0;
    const isRevisionOverdue = !!(chapter.revisionDue && chapter.revisionDue <= todayStr);

    let confidence: WeaknessConfidence = 'LOW_DATA';
    if (attempts >= 30) confidence = 'STRONG';
    else if (attempts >= 15) confidence = 'WEAK';
    else if (attempts >= 5) confidence = 'EMERGING_WEAKNESS';

    if (attempts === 0 && completedTopics === 0) {
      return {
        chapterId: chapter.id,
        chapterName: chapter.name,
        subject: chapter.subjectId,
        state: 'NOT_STARTED',
        confidence: 'LOW_DATA',
        accuracy: 0,
        totalAttempts: 0,
        explanation: 'No study logs or questions attempted yet.'
      };
    }

    if (completedTopics > 0 && attempts < 10) {
      return {
        chapterId: chapter.id,
        chapterName: chapter.name,
        subject: chapter.subjectId,
        state: 'LEARNING',
        confidence: 'LOW_DATA',
        accuracy,
        totalAttempts: attempts,
        explanation: `${completedTopics}/${totalTopics} topics studied, but only ${attempts} MCQs solved (minimum 10 needed).`
      };
    }

    if (attempts >= 10 && accuracy < 65) {
      return {
        chapterId: chapter.id,
        chapterName: chapter.name,
        subject: chapter.subjectId,
        state: 'NEEDS_PRACTICE',
        confidence,
        accuracy,
        totalAttempts: attempts,
        explanation: `${attempts} MCQs attempted with ${accuracy}% accuracy (below the 65% threshold).`
      };
    }

    if (isRevisionOverdue) {
      return {
        chapterId: chapter.id,
        chapterName: chapter.name,
        subject: chapter.subjectId,
        state: 'NEEDS_REVISION',
        confidence,
        accuracy,
        totalAttempts: attempts,
        explanation: `Spaced revision interval reached on ${chapter.revisionDue}. Needs formula & NCERT review.`
      };
    }

    if (completedTopics === totalTopics && attempts >= 20 && accuracy >= 75) {
      return {
        chapterId: chapter.id,
        chapterName: chapter.name,
        subject: chapter.subjectId,
        state: 'EXAM_READY',
        confidence: 'STRONG',
        accuracy,
        totalAttempts: attempts,
        explanation: `All ${totalTopics} topics completed, ${attempts} MCQs solved with ${accuracy}% accuracy.`
      };
    }

    return {
      chapterId: chapter.id,
      chapterName: chapter.name,
      subject: chapter.subjectId,
      state: 'LEARNING',
      confidence,
      accuracy,
      totalAttempts: attempts,
      explanation: `${completedTopics}/${totalTopics} topics completed, ${attempts} MCQs solved (${accuracy}% accuracy).`
    };
  }

  /**
   * Deterministic Decision Maker: "WHAT SHOULD I DO NOW?"
   * Strict Priority Order:
   * 1. Revisions Due Today (Mistake notebook spaced intervals or Chapter reviews)
   * 2. Repeated Mistakes / Conceptual remediation
   * 3. Confirmed Weak Areas (accuracy < 65% across sufficient attempts)
   * 4. High-Priority Pending Backlog
   * 5. Daily 100 MCQ Mission progress
   * 6. Diagnostic test benchmark
   */
  public static getNextAction(
    chapters: Chapter[],
    mistakes: MistakeEntry[],
    todayGoal: DailyMcqGoal,
    profile: StudentProfile | null
  ): RecommendationAction {
    const todayStr = getTodayDateString();

    // 1. Mistake Notebook Revisions Due
    const urgentMistakes = mistakes.filter(m => m.nextRevisionDate <= todayStr && m.masteryState !== 'mastered');
    if (urgentMistakes.length > 0) {
      return {
        id: 'rec-mistake-due',
        actionTitle: `Re-Test ${urgentMistakes.length} Mistake Questions`,
        actionSubtitle: `${urgentMistakes[0].chapterName} (${urgentMistakes[0].subject.toUpperCase()})`,
        reason: `${urgentMistakes.length} mistake revisions are due today on spaced repetition.`,
        estimatedMinutes: 20,
        category: 'MISTAKE',
        buttonLabel: 'START MISTAKE REVIEW',
        navTarget: 'mistakes'
      };
    }

    // 2. Scheduled Chapter Revisions Due
    const chapterRev = chapters.find(c => c.revisionDue && c.revisionDue <= todayStr);
    if (chapterRev) {
      return {
        id: 'rec-chapter-rev',
        actionTitle: `Spaced Revision: ${chapterRev.name}`,
        actionSubtitle: `Class ${chapterRev.classLevel} ${chapterRev.subjectId.toUpperCase()}`,
        reason: `Scheduled review cycle due today to reinforce memory retention.`,
        estimatedMinutes: 30,
        category: 'REVISION',
        buttonLabel: 'START REVISION',
        navTarget: 'study'
      };
    }

    // 3. Genuine Weak Area Focus
    const diagnosedChapters = chapters.map(c => this.diagnoseChapter(c, todayStr));
    const weakDiagnosis = diagnosedChapters.find(d => d.state === 'NEEDS_PRACTICE' && d.confidence !== 'LOW_DATA');
    if (weakDiagnosis) {
      return {
        id: 'rec-weak-remedy',
        actionTitle: `Strengthen ${weakDiagnosis.subject.toUpperCase()}: ${weakDiagnosis.chapterName}`,
        actionSubtitle: `Diagnostic accuracy: ${weakDiagnosis.accuracy}% across ${weakDiagnosis.totalAttempts} attempts`,
        reason: weakDiagnosis.explanation,
        estimatedMinutes: 45,
        category: 'PRACTICE',
        buttonLabel: 'STUDY WEAK CHAPTER',
        navTarget: 'study'
      };
    }

    // 4. High-Priority Pending Backlog
    const backlog = chapters.find(c => c.priority === 'high' && c.status === 'not_started');
    if (backlog) {
      return {
        id: 'rec-backlog',
        actionTitle: `Start Backlog Chapter: ${backlog.name}`,
        actionSubtitle: `Class ${backlog.classLevel} ${backlog.subjectId.toUpperCase()}`,
        reason: 'High foundational weightage chapter waiting to be initiated.',
        estimatedMinutes: 45,
        category: 'PRACTICE',
        buttonLabel: 'VIEW CHAPTER SYLLABUS',
        navTarget: 'study'
      };
    }

    // 5. Daily 100 MCQ Goal Progress
    const remainingMcqs = Math.max(0, todayGoal.target - todayGoal.attempted);
    if (remainingMcqs > 0) {
      return {
        id: 'rec-mcq-sprint',
        actionTitle: `Solve Next 25 MCQs (${todayGoal.attempted}/${todayGoal.target} Done)`,
        actionSubtitle: `${remainingMcqs} MCQs left to achieve today's mission.`,
        reason: 'Daily question solving builds test stamina and speed.',
        estimatedMinutes: 30,
        category: 'PRACTICE',
        buttonLabel: 'CONTINUE 100 MCQS',
        navTarget: 'mcqs'
      };
    }

    // 6. Diagnostic Benchmark Test
    return {
      id: 'rec-mock',
      actionTitle: 'Take a 50-Question Diagnostic Test',
      actionSubtitle: 'Benchmark accuracy under NEET +4/-1 scoring conditions.',
      reason: 'Regular timed diagnostics track your progress toward your target score.',
      estimatedMinutes: 45,
      category: 'MOCK',
      buttonLabel: 'OPEN TEST SERIES',
      navTarget: 'tests'
    };
  }

  /**
   * Intelligently balances the Daily 100 MCQ distribution based on genuine weak areas.
   * Default balanced: Physics 25, Chemistry 25, Botany 25, Zoology 25.
   * If a subject has accuracy < 60%, its quota increases to 35 while strong subjects adjust.
   */
  public static calculateAdaptiveDailyDistribution(
    mcqRecords: McqSessionRecord[],
    target: number = 100
  ): {
    distribution: Record<'physics' | 'chemistry' | 'botany' | 'zoology', number>;
    isBalanced: boolean;
    weakSubject?: string;
    reason: string;
  } {
    const subjects = ['physics', 'chemistry', 'botany', 'zoology'] as const;
    const accuracies: Record<string, { attempts: number; accuracy: number }> = {};

    subjects.forEach(s => {
      const records = mcqRecords.filter(r => r.subjectId === s);
      const att = records.reduce((acc, r) => acc + r.attempted, 0);
      const corr = records.reduce((acc, r) => acc + r.correct, 0);
      const acc = att > 0 ? Math.round((corr / att) * 100) : -1;
      accuracies[s] = { attempts: att, accuracy: acc };
    });

    // Identify weak subjects with at least 15 attempts and < 60% accuracy
    const weakSubject = subjects.find(s => accuracies[s].attempts >= 15 && accuracies[s].accuracy < 60);

    if (weakSubject) {
      const distribution = { physics: 22, chemistry: 22, botany: 22, zoology: 22 };
      distribution[weakSubject] = 34; // 34 + 22 + 22 + 22 = 100
      const subName = weakSubject.toUpperCase();
      const curAcc = accuracies[weakSubject].accuracy;
      const curAtt = accuracies[weakSubject].attempts;
      return {
        distribution,
        isBalanced: false,
        weakSubject,
        reason: `${subName} accuracy is ${curAcc}% over ${curAtt} solved MCQs (Adaptive booster: 34 questions assigned).`
      };
    }

    // Default balanced split
    return {
      distribution: {
        physics: Math.round(target * 0.25),
        chemistry: Math.round(target * 0.25),
        botany: Math.round(target * 0.25),
        zoology: Math.round(target * 0.25)
      },
      isBalanced: true,
      reason: 'Standard 4-subject NEET balance (25 questions each).'
    };
  }

  /**
   * Deterministic Question Selection Engine
   * Priority:
   * 1. Unresolved Mistakes in Mistake Notebook
   * 2. Overdue Spaced Repetition questions
   * 3. Weak chapter questions (<65% accuracy)
   * 4. Balanced syllabus exploration
   */
  public static selectAdaptiveBatch(
    allQuestions: Question[],
    mistakes: MistakeEntry[],
    requestedCount: number,
    filterSubject?: string,
    filterChapterId?: string,
    onlyVerifiedPyqs = false
  ): { questions: Question[]; composition: { mistakes: number; practice: number; pyq: number; shortReason?: string } } {
    let eligible = [...allQuestions];

    if (onlyVerifiedPyqs) {
      eligible = eligible.filter(q => q.sourceType === 'VERIFIED_PYQ');
    }

    if (filterSubject && filterSubject !== 'all') {
      eligible = eligible.filter(q => q.subject === filterSubject);
    }

    if (filterChapterId && filterChapterId !== 'all') {
      eligible = eligible.filter(q => q.chapterId === filterChapterId);
    }

    const mistakeQIds = new Set(mistakes.map(m => m.questionId));
    const mistakePool = eligible.filter(q => mistakeQIds.has(q.id));
    const standardPool = eligible.filter(q => !mistakeQIds.has(q.id));

    const selected: Question[] = [];
    let mistakeCount = 0;
    let practiceCount = 0;
    let pyqCount = 0;

    // Pick mistakes first (up to 40% of requested batch)
    const maxMistakes = Math.min(mistakePool.length, Math.floor(requestedCount * 0.4));
    for (let i = 0; i < maxMistakes; i++) {
      selected.push(mistakePool[i]);
      mistakeCount++;
      if (mistakePool[i].sourceType === 'VERIFIED_PYQ') pyqCount++;
      else practiceCount++;
    }

    // Fill remainder from standard pool
    for (const q of standardPool) {
      if (selected.length >= requestedCount) break;
      selected.push(q);
      if (q.sourceType === 'VERIFIED_PYQ') pyqCount++;
      else practiceCount++;
    }

    // If still short, cycle eligible without faking count
    let shortReason: string | undefined;
    if (selected.length < requestedCount && eligible.length > 0) {
      const available = selected.length;
      shortReason = `Only ${available} unique questions currently available for this filter.`;
      // Cycle to reach target size for exam pacing
      let i = 0;
      while (selected.length < requestedCount && eligible.length > 0) {
        const item = eligible[i % eligible.length];
        selected.push({
          ...item,
          id: `cycled_${item.id}_${selected.length}`
        });
        i++;
      }
    } else if (eligible.length === 0) {
      shortReason = 'No questions available matching this exact filter.';
    }

    return {
      questions: selected,
      composition: {
        mistakes: mistakeCount,
        practice: practiceCount,
        pyq: pyqCount,
        shortReason
      }
    };
  }
}

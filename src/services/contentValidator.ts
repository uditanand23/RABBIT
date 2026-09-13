/**
 * Content Validation Engine for Rabbit NEET Companion
 * Scans question bank, syllabus, and user data to enforce strict educational integrity.
 * Enforces:
 * 1. Zero fake PYQs without authentic source reference
 * 2. Strict correctAnswer index (0 <= correctAnswer <= 3)
 * 3. Exactly 4 options per question
 * 4. Valid subjectId and chapterId mapping
 * 5. Unique question IDs
 * 6. Video availability accuracy
 */

import { Question, SubjectId } from '../types';

export interface ValidationIssue {
  type: 'ERROR' | 'WARNING';
  questionId: string;
  field: string;
  message: string;
}

export interface ContentAuditReport {
  totalQuestions: number;
  verifiedPyqs: number;
  verifiedContent: number;
  rabbitPractice: number;
  userCreated: number;
  unverifiedQuestions: number;
  pendingReviewQuestions: number;
  bySubject: Record<SubjectId, number>;
  isValid: boolean;
  errorsCount: number;
  warningsCount: number;
  issues: ValidationIssue[];
}

export class ContentValidator {
  public static validateQuestions(
    questions: Question[],
    validChapterIds?: Set<string>
  ): ContentAuditReport {
    const issues: ValidationIssue[] = [];
    const seenIds = new Set<string>();
    const seenQuestionTexts = new Set<string>();

    let verifiedPyqs = 0;
    let verifiedContent = 0;
    let rabbitPractice = 0;
    let userCreated = 0;
    let unverifiedQuestions = 0;
    let pendingReviewQuestions = 0;

    const bySubject: Record<SubjectId, number> = {
      physics: 0,
      chemistry: 0,
      botany: 0,
      zoology: 0
    };

    for (const q of questions) {
      // 1. ID uniqueness check
      if (!q.id || seenIds.has(q.id)) {
        issues.push({
          type: 'ERROR',
          questionId: q.id || 'UNKNOWN',
          field: 'id',
          message: seenIds.has(q.id) ? `Duplicate question ID detected: ${q.id}` : 'Missing question ID'
        });
      } else {
        seenIds.add(q.id);
      }

      // 2. Duplicate question text check
      const normalizedText = q.questionText.trim().toLowerCase();
      if (seenQuestionTexts.has(normalizedText)) {
        issues.push({
          type: 'WARNING',
          questionId: q.id,
          field: 'questionText',
          message: `Potential duplicate question prompt text.`
        });
      } else {
        seenQuestionTexts.add(normalizedText);
      }

      // 3. Subject validation & tally
      if (['physics', 'chemistry', 'botany', 'zoology'].includes(q.subject)) {
        bySubject[q.subject]++;
      } else {
        issues.push({
          type: 'ERROR',
          questionId: q.id,
          field: 'subject',
          message: `Invalid subject: ${q.subject}`
        });
      }

      // 4. Source type & Verification status tallies
      switch (q.sourceType) {
        case 'VERIFIED_PYQ':
          verifiedPyqs++;
          // Rule: If sourceType is VERIFIED_PYQ, must have verifiable evidence
          if (!q.sourceReference && !q.sourceName) {
            issues.push({
              type: 'ERROR',
              questionId: q.id,
              field: 'sourceReference',
              message: 'VERIFIED_PYQ questions must have an authentic sourceReference (e.g. NEET 2023 Code E3).'
            });
          }
          if (q.verificationStatus !== 'VERIFIED') {
            issues.push({
              type: 'WARNING',
              questionId: q.id,
              field: 'verificationStatus',
              message: `VERIFIED_PYQ has status '${q.verificationStatus}'. Should be 'VERIFIED'.`
            });
          }
          break;

        case 'VERIFIED_CONTENT':
          verifiedContent++;
          break;

        case 'RABBIT_PRACTICE':
          rabbitPractice++;
          // Rule: Rabbit practice questions must have sourceName declaring Rabbit Academic Team
          if (!q.sourceName) {
            issues.push({
              type: 'WARNING',
              questionId: q.id,
              field: 'sourceName',
              message: 'Rabbit practice question missing explicit sourceName attribute.'
            });
          }
          break;

        case 'USER_CREATED':
          userCreated++;
          break;

        default:
          issues.push({
            type: 'ERROR',
            questionId: q.id,
            field: 'sourceType',
            message: `Unknown sourceType: ${q.sourceType}`
          });
      }

      if (q.verificationStatus === 'UNVERIFIED') {
        unverifiedQuestions++;
      } else if (q.verificationStatus === 'PENDING_REVIEW') {
        pendingReviewQuestions++;
      }

      // 5. Options integrity check
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        issues.push({
          type: 'ERROR',
          questionId: q.id,
          field: 'options',
          message: `Expected exactly 4 options, found ${q.options ? q.options.length : 0}`
        });
      } else {
        for (let i = 0; i < q.options.length; i++) {
          if (!q.options[i] || !q.options[i].trim()) {
            issues.push({
              type: 'ERROR',
              questionId: q.id,
              field: `options[${i}]`,
              message: `Option ${i} is empty or whitespace.`
            });
          }
        }
      }

      // 6. Correct Answer check (must be 0, 1, 2, or 3)
      if (q.correctAnswer < 0 || q.correctAnswer > 3 || !Number.isInteger(q.correctAnswer)) {
        issues.push({
          type: 'ERROR',
          questionId: q.id,
          field: 'correctAnswer',
          message: `correctAnswer (${q.correctAnswer}) is out of bounds [0..3]`
        });
      }

      // 7. Chapter validation if chapter set provided
      if (validChapterIds && !validChapterIds.has(q.chapterId)) {
        issues.push({
          type: 'ERROR',
          questionId: q.id,
          field: 'chapterId',
          message: `chapterId '${q.chapterId}' not found in official NEET syllabus.`
        });
      }

      // 8. Explanation presence
      if (!q.explanation || !q.explanation.trim()) {
        issues.push({
          type: 'WARNING',
          questionId: q.id,
          field: 'explanation',
          message: 'Question lacks explanation.'
        });
      }

      // 9. Video availability truthfulness
      if (q.videoSolutionAvailable && !q.videoSolution?.videoUrl) {
        issues.push({
          type: 'ERROR',
          questionId: q.id,
          field: 'videoSolutionAvailable',
          message: 'videoSolutionAvailable is true but no videoUrl was provided.'
        });
      }
    }

    const errorsCount = issues.filter(i => i.type === 'ERROR').length;
    const warningsCount = issues.filter(i => i.type === 'WARNING').length;

    return {
      totalQuestions: questions.length,
      verifiedPyqs,
      verifiedContent,
      rabbitPractice,
      userCreated,
      unverifiedQuestions,
      pendingReviewQuestions,
      bySubject,
      isValid: errorsCount === 0,
      errorsCount,
      warningsCount,
      issues
    };
  }
}

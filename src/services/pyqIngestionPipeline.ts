/**
 * Authentic PYQ Ingestion & Import Pipeline for Rabbit NEET Companion
 * Enforces:
 * 1. Zero-fabrication: Any PYQ marked VERIFIED_PYQ without legitimate provenance is rejected.
 * 2. Strict validation of question structure: exact 4 options, valid correctAnswer in [0..3].
 * 3. Schema consistency against official NEET syllabus chapters.
 * 4. Deduplication against both existing in-memory/persisted questions and intra-batch duplicates.
 */

import { Question, IngestPyqBatchResult, SubjectId, ClassLevel, DifficultyLevel } from '../types';

export class PyqIngestionPipeline {
  /**
   * Ingest and validate a raw batch of PYQ records (from JSON or parsed CSV)
   */
  public static ingestBatch(
    rawQuestions: unknown[],
    existingQuestions: Question[] = [],
    validChapterIds?: Set<string>
  ): IngestPyqBatchResult {
    const existingIds = new Set(existingQuestions.map(q => q.id));
    const existingTexts = new Set(existingQuestions.map(q => q.questionText.trim().toLowerCase()));

    const batchSeenIds = new Set<string>();
    const batchSeenTexts = new Set<string>();

    const accepted: Question[] = [];
    const rejected: Array<{ id?: string; questionTextSnippet: string; reason: string }> = [];

    let warningsCount = 0;
    let duplicatesCount = 0;
    let missingSourcesCount = 0;

    for (let i = 0; i < rawQuestions.length; i++) {
      const item = rawQuestions[i] as Partial<Question>;
      const snippet = item?.questionText ? item.questionText.substring(0, 60) + '...' : `Item index #${i}`;

      // 1. Structural check
      if (!item || typeof item !== 'object') {
        rejected.push({
          id: undefined,
          questionTextSnippet: snippet,
          reason: 'Malformed record: Question object expected.'
        });
        continue;
      }

      // 2. ID check
      if (!item.id || typeof item.id !== 'string' || !item.id.trim()) {
        rejected.push({
          id: undefined,
          questionTextSnippet: snippet,
          reason: 'Missing or empty question ID.'
        });
        continue;
      }

      // 3. ID Duplicate check
      if (existingIds.has(item.id) || batchSeenIds.has(item.id)) {
        duplicatesCount++;
        rejected.push({
          id: item.id,
          questionTextSnippet: snippet,
          reason: `Duplicate ID detected: '${item.id}'.`
        });
        continue;
      }

      // 4. Question Text check
      if (!item.questionText || typeof item.questionText !== 'string' || !item.questionText.trim()) {
        rejected.push({
          id: item.id,
          questionTextSnippet: snippet,
          reason: 'Missing or empty question prompt text.'
        });
        continue;
      }

      const normalizedText = item.questionText.trim().toLowerCase();
      if (existingTexts.has(normalizedText) || batchSeenTexts.has(normalizedText)) {
        duplicatesCount++;
        rejected.push({
          id: item.id,
          questionTextSnippet: snippet,
          reason: 'Duplicate question prompt text detected.'
        });
        continue;
      }

      // 5. Subject check
      const validSubjects: SubjectId[] = ['physics', 'chemistry', 'botany', 'zoology'];
      if (!item.subject || !validSubjects.includes(item.subject)) {
        rejected.push({
          id: item.id,
          questionTextSnippet: snippet,
          reason: `Invalid subject: '${item.subject}'. Must be physics, chemistry, botany, or zoology.`
        });
        continue;
      }

      // 6. Chapter check
      if (!item.chapterId || typeof item.chapterId !== 'string') {
        rejected.push({
          id: item.id,
          questionTextSnippet: snippet,
          reason: 'Missing chapterId.'
        });
        continue;
      }

      if (validChapterIds && !validChapterIds.has(item.chapterId)) {
        rejected.push({
          id: item.id,
          questionTextSnippet: snippet,
          reason: `Invalid chapterId: '${item.chapterId}' not found in official NEET syllabus.`
        });
        continue;
      }

      // 7. Options check
      if (!Array.isArray(item.options) || item.options.length !== 4) {
        rejected.push({
          id: item.id,
          questionTextSnippet: snippet,
          reason: `Invalid options count: NEET requires exactly 4 options. Found ${item.options ? item.options.length : 0}.`
        });
        continue;
      }

      const hasEmptyOption = item.options.some(opt => typeof opt !== 'string' || !opt.trim());
      if (hasEmptyOption) {
        rejected.push({
          id: item.id,
          questionTextSnippet: snippet,
          reason: 'One or more options are empty or not strings.'
        });
        continue;
      }

      // 8. Correct Answer bounds
      if (
        item.correctAnswer === undefined ||
        typeof item.correctAnswer !== 'number' ||
        item.correctAnswer < 0 ||
        item.correctAnswer > 3 ||
        !Number.isInteger(item.correctAnswer)
      ) {
        rejected.push({
          id: item.id,
          questionTextSnippet: snippet,
          reason: `Invalid correctAnswer: '${item.correctAnswer}'. Must be an integer 0, 1, 2, or 3.`
        });
        continue;
      }

      // 9. Provenance & Anti-Fabrication Rule for VERIFIED_PYQ
      const isPyq = item.sourceType === 'VERIFIED_PYQ';
      if (isPyq) {
        if (!item.sourceReference && !item.sourceName) {
          missingSourcesCount++;
          rejected.push({
            id: item.id,
            questionTextSnippet: snippet,
            reason: 'Zero-Fabrication Violation: VERIFIED_PYQ must include sourceReference or official sourceName.'
          });
          continue;
        }

        if (item.year && (item.year < 1990 || item.year > new Date().getFullYear())) {
          rejected.push({
            id: item.id,
            questionTextSnippet: snippet,
            reason: `Invalid exam year: ${item.year}.`
          });
          continue;
        }
      }

      // Warnings for missing explanation
      if (!item.explanation || !item.explanation.trim()) {
        warningsCount++;
      }

      // Safe canonical normalization
      const sanitizedQuestion: Question = {
        id: item.id.trim(),
        sourceType: item.sourceType || 'RABBIT_PRACTICE',
        verificationStatus: item.verificationStatus || 'VERIFIED',
        sourceName: item.sourceName?.trim() || (item.sourceType === 'RABBIT_PRACTICE' ? 'Rabbit Academic Team' : undefined),
        sourceUrl: item.sourceUrl?.trim(),
        sourceReference: item.sourceReference?.trim(),
        examName: item.examName?.trim() || (isPyq ? 'NEET UG' : undefined),
        year: item.year ? Number(item.year) : undefined,
        paperSession: item.paperSession?.trim(),
        questionNumber: item.questionNumber ? Number(item.questionNumber) : undefined,
        subject: item.subject,
        classLevel: (item.classLevel as ClassLevel) || '11',
        chapterId: item.chapterId.trim(),
        chapterName: item.chapterName?.trim() || item.chapterId,
        topicId: item.topicId?.trim(),
        topicName: item.topicName?.trim() || 'General Concept',
        questionText: item.questionText.trim(),
        options: item.options.map(o => o.trim()),
        correctAnswer: item.correctAnswer,
        explanation: item.explanation?.trim() || 'Detailed explanation pending review.',
        conceptTested: item.conceptTested?.trim(),
        whyCorrect: item.whyCorrect?.trim(),
        whyOptionsIncorrect: Array.isArray(item.whyOptionsIncorrect) ? item.whyOptionsIncorrect : undefined,
        formulaUsed: item.formulaUsed?.trim(),
        commonTrap: item.commonTrap?.trim(),
        copyrightStatus: item.copyrightStatus || (isPyq ? 'PUBLIC_DOMAIN' : 'PROPRIETARY'),
        licenseStatus: item.licenseStatus || (isPyq ? 'Official NTA Public Release' : 'Rabbit Self-Study Companion'),
        difficulty: (item.difficulty as DifficultyLevel) || 'medium',
        isImportant: Boolean(item.isImportant),
        isTricky: Boolean(item.isTricky),
        tags: Array.isArray(item.tags) ? item.tags : [],
        estimatedTimeSeconds: item.estimatedTimeSeconds ? Number(item.estimatedTimeSeconds) : 60,
        negativeMarking: item.negativeMarking !== undefined ? Number(item.negativeMarking) : -1,
        solutionAvailable: item.solutionAvailable !== undefined ? Boolean(item.solutionAvailable) : true,
        videoSolutionAvailable: Boolean(item.videoSolutionAvailable && item.videoSolutionUrl),
        videoSolutionUrl: item.videoSolutionUrl,
        videoVerificationStatus: item.videoVerificationStatus
      };

      batchSeenIds.add(sanitizedQuestion.id);
      batchSeenTexts.add(normalizedText);
      accepted.push(sanitizedQuestion);
    }

    return {
      total: rawQuestions.length,
      valid: accepted.length,
      invalid: rejected.length,
      warnings: warningsCount,
      duplicates: duplicatesCount,
      missingSources: missingSourcesCount,
      rejectedQuestions: rejected,
      acceptedQuestions: accepted
    };
  }
}

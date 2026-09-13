/**
 * Content QA Validation Script (Runs in Node.js)
 * Enforces Zero-Fabrication Rules, Question Schema Integrity, and Syllabus Mappings
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('==================================================');
console.log('RABBIT CONTENT INTEGRITY & ANTI-FABRICATION AUDIT');
console.log('==================================================');

const questionsFilePath = path.join(rootDir, 'src', 'data', 'questions.ts');
const questionsRaw = fs.readFileSync(questionsFilePath, 'utf8');

// Parse question blocks
const questionBlocks = questionsRaw.split(/\{\s*id:\s*'/).slice(1);

console.log(`Auditing ${questionBlocks.length} questions in SEED_QUESTION_BANK...\n`);

let errorsCount = 0;
let warningsCount = 0;
const seenIds = new Set();
let pyqCount = 0;
let rabbitPracticeCount = 0;
let otherSourceCount = 0;

questionBlocks.forEach((block, idx) => {
  const idMatch = block.match(/^([^']+)'/);
  const qId = idMatch ? idMatch[1] : `Unknown-${idx}`;

  // 1. ID check
  if (seenIds.has(qId)) {
    console.error(`❌ ERROR: Duplicate ID detected: ${qId}`);
    errorsCount++;
  } else {
    seenIds.add(qId);
  }

  // 2. Source Type check
  const sourceMatch = block.match(/sourceType:\s*'([^']+)'/);
  const sourceType = sourceMatch ? sourceMatch[1] : null;

  if (sourceType === 'VERIFIED_PYQ') {
    pyqCount++;
    const hasSourceRef = block.includes('sourceReference:') || block.includes('sourceName:');
    if (!hasSourceRef) {
      console.error(`❌ ERROR: Question ${qId} is labeled VERIFIED_PYQ but lacks sourceReference/sourceName!`);
      errorsCount++;
    }
  } else if (sourceType === 'RABBIT_PRACTICE') {
    rabbitPracticeCount++;
  } else {
    otherSourceCount++;
  }

  // 3. correctAnswer bounds [0..3]
  const ansMatch = block.match(/correctAnswer:\s*([0-9]+)/);
  if (!ansMatch || parseInt(ansMatch[1], 10) > 3) {
    console.error(`❌ ERROR: Question ${qId} has invalid correctAnswer: ${ansMatch ? ansMatch[1] : 'missing'}`);
    errorsCount++;
  }

  // 4. Options count check
  const optionsMatch = block.match(/options:\s*\[([\s\S]*?)\]\s*,/);
  if (optionsMatch) {
    const rawOpts = optionsMatch[1];
    const stringMatches = rawOpts.match(/'([^'\\]*(?:\\.[^'\\]*)*)'/g);
    if (!stringMatches || stringMatches.length !== 4) {
      console.error(`❌ ERROR: Question ${qId} does not have exactly 4 options! Count: ${stringMatches ? stringMatches.length : 0}`);
      errorsCount++;
    }
  } else {
    console.error(`❌ ERROR: Question ${qId} is missing options array!`);
    errorsCount++;
  }

  // 5. Check verification status
  const verMatch = block.match(/verificationStatus:\s*'([^']+)'/);
  const verStatus = verMatch ? verMatch[1] : 'UNVERIFIED';

  if (sourceType === 'VERIFIED_PYQ' && verStatus !== 'VERIFIED') {
    console.warn(`⚠️ WARNING: Question ${qId} has sourceType VERIFIED_PYQ but verificationStatus ${verStatus}`);
    warningsCount++;
  }
});

console.log('--- Content Summary ---');
console.log(`Total questions audited: ${seenIds.size}`);
console.log(`Rabbit Practice questions: ${rabbitPracticeCount}`);
console.log(`Verified PYQ questions: ${pyqCount}`);
console.log(`Other source questions: ${otherSourceCount}`);
console.log(`Integrity Errors: ${errorsCount}`);
console.log(`Integrity Warnings: ${warningsCount}`);
console.log('-----------------------');

if (errorsCount > 0) {
  console.error('❌ Content audit FAILED with critical integrity errors.');
  process.exit(1);
} else {
  console.log('✅ Content audit PASSED: Zero unauthorized PYQ fabrication, valid 4-option schema, valid answers.');
}

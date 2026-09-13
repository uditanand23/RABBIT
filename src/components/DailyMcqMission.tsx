import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTodayDateString } from '../services/storage';
import { Target, CheckCircle, Flame, Plus, History, Award, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SubjectId, DifficultyLevel } from '../types';

export const DailyMcqMission: React.FC = () => {
  const { todayMcqGoal, mcqRecords, chapters, addMcqSession, streak, profile } = useApp();

  const [showLogModal, setShowLogModal] = useState(false);
  const [subjectId, setSubjectId] = useState<SubjectId>('physics');
  const [chapterId, setChapterId] = useState('');
  const [topicName, setTopicName] = useState('');
  const [attempted, setAttempted] = useState<number>(25);
  const [correct, setCorrect] = useState<number>(20);
  const [skipped, setSkipped] = useState<number>(0);
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [isPyq, setIsPyq] = useState(false);
  const [notes, setNotes] = useState('');

  const target = todayMcqGoal.target || profile?.dailyMcqTarget || 100;
  const attemptedToday = todayMcqGoal.attempted;
  const correctToday = todayMcqGoal.correct;
  const progressPercent = Math.min(100, Math.round((attemptedToday / target) * 100));
  const accuracy = attemptedToday > 0 ? Math.round((correctToday / attemptedToday) * 100) : 0;

  // Chapters of current subject
  const subjectChapters = chapters.filter(c => c.subjectId === subjectId);

  // Set default chapter if unselected
  if (!chapterId && subjectChapters.length > 0) {
    setChapterId(subjectChapters[0].id);
  }

  const handleSubjectChange = (subj: SubjectId) => {
    setSubjectId(subj);
    const newChapList = chapters.filter(c => c.subjectId === subj);
    if (newChapList.length > 0) {
      setChapterId(newChapList[0].id);
    }
  };

  const handleRecordMcq = (e: React.FormEvent) => {
    e.preventDefault();
    if (attempted <= 0) return;
    if (correct > attempted) {
      alert('Correct questions cannot exceed attempted questions.');
      return;
    }
    if (correct + skipped > attempted) {
      alert('Correct + Skipped questions cannot exceed total attempted questions.');
      return;
    }

    const wrong = attempted - correct - skipped;
    const selectedChap = chapters.find(c => c.id === chapterId);

    addMcqSession({
      subjectId,
      chapterId,
      chapterName: selectedChap ? selectedChap.name : 'General MCQ Practice',
      topicName: topicName.trim() || undefined,
      attempted,
      correct,
      wrong,
      skipped,
      difficulty,
      durationMinutes,
      isPyq,
      notes: notes.trim() || undefined
    });

    // Check if goal reached with this submission
    if (attemptedToday + attempted >= target && !todayMcqGoal.isCompleted) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }
    }

    setShowLogModal(false);
    // Reset values for next batch
    setAttempted(25);
    setCorrect(20);
    setSkipped(0);
    setNotes('');
  };

  // Filter today's MCQ records for honest transparency
  const todayDate = getTodayDateString();
  const todaySessions = mcqRecords.filter(r => r.date === todayDate);

  return (
    <div className="card" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={22} color="var(--primary-600)" />
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Daily 100 MCQ Mission
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Target resets every 24 hours. No fake completion.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => setShowLogModal(true)}
        >
          <Plus size={15} /> Record MCQs
        </button>
      </div>

      {/* Numerical Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}
      >
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-700)' }}>
            {attemptedToday}
          </span>
          <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            {' '}/ {target}
          </span>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginLeft: '8px' }}>
            MCQs solved today
          </span>
        </div>

        {todayMcqGoal.isCompleted ? (
          <span className="badge badge-green" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
            <Check size={14} /> Mission Completed
          </span>
        ) : (
          <span className="badge badge-gray">
            {target - attemptedToday > 0 ? `${target - attemptedToday} remaining` : 'Target reached'}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-bg" style={{ height: '10px', marginBottom: '16px' }}>
        <div
          className="progress-bar-fill"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: todayMcqGoal.isCompleted ? 'var(--primary-600)' : 'var(--primary-500)'
          }}
        />
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          padding: '12px 16px',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACCURACY</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: accuracy >= 80 ? 'var(--primary-600)' : accuracy >= 60 ? 'var(--warning)' : 'var(--text-primary)' }}>
            {attemptedToday > 0 ? `${accuracy}%` : '—'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CORRECT</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-600)' }}>
            {correctToday}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>WRONG</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: todayMcqGoal.wrong > 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
            {todayMcqGoal.wrong}
          </div>
        </div>
      </div>

      {/* Today's Logged Batches */}
      {todaySessions.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            TODAY’S SOLVED SESSIONS ({todaySessions.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {todaySessions.map(sess => (
              <div
                key={sess.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.825rem'
                }}
              >
                <div>
                  <strong style={{ textTransform: 'capitalize', color: 'var(--text-primary)' }}>
                    {sess.subjectId}
                  </strong>
                  : {sess.chapterName}
                  {sess.isPyq && <span className="badge badge-yellow" style={{ marginLeft: '6px', fontSize: '0.65rem' }}>PYQ</span>}
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span>
                    <strong style={{ color: 'var(--primary-600)' }}>{sess.correct}</strong> / {sess.attempted}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {sess.durationMinutes}m
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Log MCQ Modal */}
      {showLogModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>
              Record MCQ Practice Session
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Log real questions solved from your modules, test papers, or question bank.
            </p>

            <form onSubmit={handleRecordMcq}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select
                    className="form-select"
                    value={subjectId}
                    onChange={e => handleSubjectChange(e.target.value as SubjectId)}
                  >
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="botany">Botany</option>
                    <option value="zoology">Zoology</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Chapter</label>
                  <select
                    className="form-select"
                    value={chapterId}
                    onChange={e => setChapterId(e.target.value)}
                  >
                    {subjectChapters.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Topic / Sub-topic (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Electrophilic addition or Calvin cycle"
                  value={topicName}
                  onChange={e => setTopicName(e.target.value)}
                />
              </div>

              {/* Counts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Total Attempted</label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    className="form-input"
                    value={attempted}
                    onChange={e => setAttempted(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Correct</label>
                  <input
                    type="number"
                    min={0}
                    max={attempted}
                    className="form-input"
                    value={correct}
                    onChange={e => setCorrect(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Skipped</label>
                  <input
                    type="number"
                    min={0}
                    max={attempted}
                    className="form-input"
                    value={skipped}
                    onChange={e => setSkipped(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Time Spent (Minutes)</label>
                  <input
                    type="number"
                    min={1}
                    max={300}
                    className="form-input"
                    value={durationMinutes}
                    onChange={e => setDurationMinutes(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select
                    className="form-select"
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value as DifficultyLevel)}
                  >
                    <option value="easy">Easy (Direct NCERT)</option>
                    <option value="medium">Medium (Standard NEET)</option>
                    <option value="hard">Hard (Multi-concept / Tricky)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="checkbox"
                  id="pyqCheck"
                  checked={isPyq}
                  onChange={e => setIsPyq(e.target.checked)}
                />
                <label htmlFor="pyqCheck" style={{ fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500 }}>
                  These were authentic Previous Year Questions (PYQs)
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Mistake Analysis & Notes (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="e.g. Calculation error in formula, forgot negative sign in work formula"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowLogModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  Save & Update Daily Progress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

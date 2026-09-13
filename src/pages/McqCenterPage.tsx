import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DailyMcqMission } from '../components/DailyMcqMission';
import { Target, Filter, Award, History, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { SubjectId, DifficultyLevel } from '../types';

export const McqCenterPage: React.FC = () => {
  const { mcqRecords, todayMcqGoal, chapters } = useApp();
  const [filterSubject, setFilterSubject] = useState<SubjectId | 'all'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [onlyPyqs, setOnlyPyqs] = useState(false);

  // Filtered session records
  const filteredRecords = mcqRecords.filter(r => {
    if (filterSubject !== 'all' && r.subjectId !== filterSubject) return false;
    if (filterDifficulty !== 'all' && r.difficulty !== filterDifficulty) return false;
    if (onlyPyqs && !r.isPyq) return false;
    return true;
  });

  // Calculate cumulative real statistics
  const totalAttempted = mcqRecords.reduce((acc, r) => acc + r.attempted, 0);
  const totalCorrect = mcqRecords.reduce((acc, r) => acc + r.correct, 0);
  const totalWrong = mcqRecords.reduce((acc, r) => acc + r.wrong, 0);
  const totalPyqs = mcqRecords.filter(r => r.isPyq).reduce((acc, r) => acc + r.attempted, 0);
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  // Subject breakdown
  const subjects: SubjectId[] = ['physics', 'chemistry', 'botany', 'zoology'];
  const subjectStats = subjects.map(s => {
    const sRecords = mcqRecords.filter(r => r.subjectId === s);
    const att = sRecords.reduce((acc, r) => acc + r.attempted, 0);
    const corr = sRecords.reduce((acc, r) => acc + r.correct, 0);
    const acc = att > 0 ? Math.round((corr / att) * 100) : 0;
    return { subject: s, attempted: att, correct: corr, accuracy: acc };
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">MCQ Practice & Speed Center</h1>
        <p className="page-subtitle">
          Daily 100 question discipline, historical accuracy analytics, and authentic PYQ tracking.
        </p>
      </div>

      {/* Hero Daily Mission Component */}
      <div style={{ marginBottom: '24px' }}>
        <DailyMcqMission />
      </div>

      {/* Aggregate Cumulative Analytics (Non-fabricated) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div className="card">
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            TOTAL MCQS SOLVED
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
            {totalAttempted}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Across all practice sessions
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            LIFETIME ACCURACY
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 800, color: overallAccuracy >= 75 ? 'var(--primary-600)' : 'var(--text-primary)', marginTop: '6px' }}>
            {totalAttempted > 0 ? `${overallAccuracy}%` : '—'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {totalCorrect} correct / {totalWrong} wrong
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            PREVIOUS YEAR (PYQS)
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-700)', marginTop: '6px' }}>
            {totalPyqs}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Real exam questions solved
          </div>
        </div>
      </div>

      {/* Subject-Wise Accuracy Cards */}
      <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
          Subject Accuracy Breakdown
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {subjectStats.map(st => (
            <div
              key={st.subject}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, textTransform: 'capitalize', fontSize: '0.9rem' }}>
                  {st.subject}
                </span>
                <span
                  className={`badge ${st.accuracy >= 75 ? 'badge-green' : st.accuracy >= 55 ? 'badge-yellow' : 'badge-gray'}`}
                >
                  {st.attempted > 0 ? `${st.accuracy}% Acc.` : '0 Solved'}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {st.attempted} questions attempted ({st.correct} correct)
              </div>
              <div className="progress-bar-bg" style={{ height: '6px', marginTop: '10px' }}>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${st.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Practice Session History Table & Filters */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>MCQ Session History</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              All self-reported question practice logs.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {/* Subject Select */}
            <select
              className="form-select"
              value={filterSubject}
              onChange={e => setFilterSubject(e.target.value as any)}
              style={{ fontSize: '0.8rem', padding: '6px 10px', width: 'auto' }}
            >
              <option value="all">All Subjects</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="botany">Botany</option>
              <option value="zoology">Zoology</option>
            </select>

            {/* Difficulty Select */}
            <select
              className="form-select"
              value={filterDifficulty}
              onChange={e => setFilterDifficulty(e.target.value as any)}
              style={{ fontSize: '0.8rem', padding: '6px 10px', width: 'auto' }}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* PYQ Toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={onlyPyqs}
                onChange={e => setOnlyPyqs(e.target.checked)}
              />
              PYQs only
            </label>
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No MCQ records match the selected filters.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredRecords.map(rec => {
              const acc = rec.attempted > 0 ? Math.round((rec.correct / rec.attempted) * 100) : 0;
              return (
                <div
                  key={rec.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                        {rec.date}
                      </span>
                      <strong style={{ fontSize: '0.875rem', textTransform: 'capitalize' }}>
                        {rec.subjectId}
                      </strong>
                      <span style={{ fontSize: '0.85rem' }}>— {rec.chapterName}</span>
                      {rec.isPyq && (
                        <span className="badge badge-yellow" style={{ fontSize: '0.65rem' }}>
                          PYQ
                        </span>
                      )}
                      <span className="badge badge-gray" style={{ fontSize: '0.65rem', textTransform: 'capitalize' }}>
                        {rec.difficulty}
                      </span>
                    </div>

                    {rec.notes && (
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                        Notes: {rec.notes}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: acc >= 75 ? 'var(--primary-600)' : 'var(--text-primary)' }}>
                      {rec.correct} / {rec.attempted} ({acc}%)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {rec.durationMinutes} mins • {rec.wrong} wrong
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

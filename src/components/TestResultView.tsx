import React from 'react';
import { TestResult, SubjectId, MistakeCategory } from '../types';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  BarChart2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  RotateCcw
} from 'lucide-react';

interface TestResultViewProps {
  result: TestResult;
  onClose: () => void;
  onGoToMistakes: () => void;
}

export const TestResultView: React.FC<TestResultViewProps> = ({
  result,
  onClose,
  onGoToMistakes
}) => {
  const subjects: SubjectId[] = ['physics', 'chemistry', 'botany', 'zoology'];

  const formatMinutes = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  return (
    <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '24px',
          borderBottom: '1px solid var(--border-subtle)',
          gap: '16px'
        }}
      >
        <div>
          <span className="badge badge-green" style={{ marginBottom: '6px' }}>
            {result.testType}
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            {result.testTitle}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Completed on {new Date(result.completedAt).toLocaleDateString()} • Authentic Scoring (+4 / -1)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {result.wrong > 0 && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onGoToMistakes}
            >
              Review {result.wrong} Mistakes
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>

      {/* Primary Score Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          margin: '24px 0'
        }}
      >
        {/* Score */}
        <div
          style={{
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            FINAL SCORE
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '2.2rem',
              fontWeight: 800,
              color: result.score >= (result.maxScore * 0.75) ? 'var(--primary-600)' : 'var(--text-primary)',
              marginTop: '4px'
            }}
          >
            {result.score}
            <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
              {' '}/ {result.maxScore}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {result.percentage}% Marks
          </div>
        </div>

        {/* Accuracy */}
        <div
          style={{
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            ACCURACY
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '2.2rem',
              fontWeight: 800,
              color: result.accuracy >= 80 ? 'var(--primary-600)' : result.accuracy >= 60 ? 'var(--warning)' : 'var(--danger)',
              marginTop: '4px'
            }}
          >
            {result.accuracy}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {result.correct} correct / {result.wrong} wrong
          </div>
        </div>

        {/* Attempt Rate */}
        <div
          style={{
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            QUESTIONS ATTEMPTED
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '2.2rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginTop: '4px'
            }}
          >
            {result.attempted}
            <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
              {' '}/ {result.totalQuestions}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {result.skipped} skipped
          </div>
        </div>

        {/* Time Efficiency */}
        <div
          style={{
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            SPEED EFFICIENCY
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '2.2rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginTop: '4px'
            }}
          >
            {result.averageTimePerQuestionSeconds}s
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Total: {formatMinutes(result.totalTimeSeconds)}
          </div>
        </div>
      </div>

      {/* Subject-Wise Performance Breakdown */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>
          Subject Breakdown
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {subjects.map(s => {
            const data = result.subjectBreakdown[s];
            if (!data || data.total === 0) return null;

            return (
              <div
                key={s}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, textTransform: 'capitalize', fontSize: '0.95rem' }}>
                    {s}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: data.score > 0 ? 'var(--primary-700)' : 'var(--danger)' }}>
                    {data.score} Marks
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {data.correct} Correct • {data.wrong} Wrong • {data.accuracy}% Acc.
                </div>

                <div className="progress-bar-bg" style={{ height: '6px' }}>
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${data.accuracy}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mistake Classifications in this Test */}
      {result.wrong > 0 && (
        <div
          style={{
            padding: '18px',
            backgroundColor: 'var(--danger-bg)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <AlertCircle size={18} color="var(--danger)" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--danger)', margin: 0 }}>
              Automatic Mistake Notebook Ingestion
            </h4>
          </div>
          <p style={{ fontSize: '0.825rem', color: '#991B1B', margin: '0 0 12px 0' }}>
            All {result.wrong} incorrect questions from this test have been queued into your Mistake Notebook with Spaced Repetition (Day 1 revision schedule).
          </p>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={onGoToMistakes}
          >
            Review and Classify Mistakes <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

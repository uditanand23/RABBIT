import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OFFICIAL_TEST_SERIES } from '../data/tests';
import { TestSeriesDefinition, TestResult, ActiveTestState, Question } from '../types';
import { ActiveTestModal } from '../components/ActiveTestModal';
import { TestResultView } from '../components/TestResultView';
import { IntelligenceEngine } from '../services/intelligenceEngine';
import {
  Award,
  Play,
  Clock,
  CheckCircle2,
  FileText,
  AlertTriangle,
  History,
  TrendingUp,
  BarChart2,
  HelpCircle
} from 'lucide-react';

interface TestSeriesPageProps {
  onNavigate: (tab: any) => void;
}

export const TestSeriesPage: React.FC<TestSeriesPageProps> = ({ onNavigate }) => {
  const { questions, testResults, startTest, mistakes } = useApp();

  const [activeTestModalOpen, setActiveTestModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);

  const handleLaunchTest = (def: TestSeriesDefinition) => {
    const isPyqTest = def.type === 'PYQ Test';
    const batchResult = IntelligenceEngine.selectAdaptiveBatch(
      questions,
      mistakes,
      def.questionCount,
      def.subject,
      undefined,
      isPyqTest
    );

    if (batchResult.questions.length === 0) {
      alert('No verified questions currently available for this specific test filter.');
      return;
    }

    const testQuestions = batchResult.questions;

    const newTestState: ActiveTestState = {
      testId: def.id,
      testTitle: def.title,
      testType: def.type,
      questions: testQuestions,
      currentQuestionIndex: 0,
      answers: {},
      markedForReview: {},
      timeRemainingSeconds: def.durationMinutes * 60,
      startedAt: new Date().toISOString(),
      timePerQuestionSeconds: {},
      isPaused: false,
      isCompleted: false
    };

    startTest(newTestState);
    setActiveTestModalOpen(true);
  };

  return (
    <div className="page-container">
      {/* Test Active Modal */}
      {activeTestModalOpen && (
        <ActiveTestModal
          onComplete={result => {
            setActiveTestModalOpen(false);
            setSelectedResult(result);
          }}
          onCancel={() => setActiveTestModalOpen(false)}
        />
      )}

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">NEET Test Series Engine</h1>
        <p className="page-subtitle">
          Authentic timed test simulations (50, 100, 150, 200 questions). Strict NTA marking: +4 correct, -1 wrong, 0 skipped.
        </p>
      </div>

      {/* Selected Test Result View */}
      {selectedResult && (
        <TestResultView
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
          onGoToMistakes={() => onNavigate('mistakes')}
        />
      )}

      {/* Tests Catalog Grid */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
          Available NEET Test Series
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {OFFICIAL_TEST_SERIES.map(testDef => (
            <div
              key={testDef.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span className="badge badge-gray">{testDef.type}</span>
                    <span className={`badge ${testDef.type === 'PYQ Test' ? 'badge-yellow' : 'badge-green'}`} style={{ fontSize: '0.68rem' }}>
                      {testDef.type === 'PYQ Test' ? 'LEVEL 3: VERIFIED PYQ' : 'LEVEL 1: RABBIT PRACTICE'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Clock size={14} />
                    <span>{testDef.durationMinutes} mins</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {testDef.title}
                </h3>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {testDef.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--primary-700)' }}>
                  {testDef.questionCount} Questions ({testDef.questionCount * 4} Marks)
                </span>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleLaunchTest(testDef)}
                >
                  <Play size={14} /> Start Test
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Test History Table */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
          Completed Test Attempt History ({testResults.length})
        </h3>

        {testResults.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No test attempts completed yet. Launch any official test above to simulate real NEET timing and receive in-depth diagnostic analytics.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {testResults.map(res => (
              <div
                key={res.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-gray">{res.completedAt.split('T')[0]}</span>
                    <strong style={{ fontSize: '0.95rem' }}>{res.testTitle}</strong>
                    <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>{res.testType}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Attempted: {res.attempted}/{res.totalQuestions} • {res.correct} Correct • {res.wrong} Wrong • {res.accuracy}% Accuracy
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                      {res.score} / {res.maxScore}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {res.percentage}% Score
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-subtle btn-sm"
                    onClick={() => setSelectedResult(res)}
                  >
                    View Analysis
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

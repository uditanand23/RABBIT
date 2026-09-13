import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TestResult, ActiveTestState } from '../types';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle2,
  AlertTriangle,
  Send,
  HelpCircle,
  X
} from 'lucide-react';

interface ActiveTestModalProps {
  onComplete: (result: TestResult) => void;
  onCancel: () => void;
}

export const ActiveTestModal: React.FC<ActiveTestModalProps> = ({ onComplete, onCancel }) => {
  const { activeTest, updateTestAnswer, toggleMarkForReview, submitTest, cancelTest } = useApp();

  if (!activeTest) return null;

  const [currentIndex, setCurrentIndex] = useState(activeTest.currentQuestionIndex || 0);
  const [secondsRemaining, setSecondsRemaining] = useState(activeTest.timeRemainingSeconds);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const currentQ = activeTest.questions[currentIndex];
  const totalQ = activeTest.questions.length;
  const currentAnswer = activeTest.answers[currentQ?.id];
  const isMarked = !!activeTest.markedForReview[currentQ?.id];

  // Timer loop
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSelectOption = (idx: number) => {
    if (!currentQ) return;
    updateTestAnswer(currentQ.id, idx);
  };

  const handleClearResponse = () => {
    if (!currentQ) return;
    updateTestAnswer(currentQ.id, -1);
  };

  const handleFinalSubmit = () => {
    const totalTimeAllocated = activeTest.questions.length * 60; // rough nominal or based on test duration
    const timeUsedSeconds = Math.max(1, (activeTest.timeRemainingSeconds || totalTimeAllocated) - secondsRemaining);
    const result = submitTest(timeUsedSeconds);
    if (result) {
      onComplete(result);
    }
  };

  // Counting metrics
  const answeredCount = Object.values(activeTest.answers).filter(v => v !== undefined && v !== -1).length;
  const markedCount = Object.values(activeTest.markedForReview).filter(Boolean).length;
  const unansweredCount = totalQ - answeredCount;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--bg-primary)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Top Test Header Bar */}
      <header
        style={{
          height: '64px',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span className="badge badge-green" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
            {activeTest.testType}
          </span>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {activeTest.testTitle}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Countdown Clock */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              backgroundColor: secondsRemaining < 300 ? 'var(--danger-bg)' : 'var(--bg-subtle)',
              color: secondsRemaining < 300 ? 'var(--danger)' : 'var(--text-primary)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '1.1rem'
            }}
          >
            <Clock size={18} />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowSubmitConfirm(true)}
          >
            <Send size={16} /> Submit Test
          </button>

          <button
            type="button"
            className="btn btn-subtle btn-sm"
            onClick={() => setShowExitConfirm(true)}
            title="Cancel test"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Main Body Split: Question Center & Palette Sidebar */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Left: Question Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            {/* Question Meta Details */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                  Question {currentIndex + 1} of {totalQ}
                </span>
                <span className="badge badge-gray" style={{ textTransform: 'capitalize' }}>
                  {currentQ?.subject}
                </span>
                <span className="badge badge-gray">
                  {currentQ?.chapterName}
                </span>
                <span className={`badge ${currentQ?.sourceType === 'VERIFIED_PYQ' ? 'badge-yellow' : 'badge-blue'}`}>
                  {currentQ?.sourceType === 'VERIFIED_PYQ' ? `Authentic PYQ ${currentQ.year || ''}` : 'Rabbit Practice'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Marking: <strong style={{ color: 'var(--primary-600)' }}>+4</strong> / <strong style={{ color: 'var(--danger)' }}>-1</strong>
                </span>
              </div>
            </div>

            {/* Question Prompt */}
            <div
              style={{
                fontSize: '1.15rem',
                fontWeight: 600,
                lineHeight: 1.6,
                color: 'var(--text-primary)',
                padding: '20px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '24px'
              }}
            >
              {currentQ?.questionText}
            </div>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {currentQ?.options.map((optText, oIdx) => {
                const isSelected = currentAnswer === oIdx;
                return (
                  <div
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--primary-50)' : 'var(--bg-surface)',
                      border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--border-medium)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        backgroundColor: isSelected ? 'var(--primary-600)' : 'var(--bg-subtle)',
                        color: isSelected ? '#fff' : 'var(--text-secondary)'
                      }}
                    >
                      {String.fromCharCode(65 + oIdx)}
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {optText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Question Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className={`btn btn-sm ${isMarked ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => toggleMarkForReview(currentQ.id)}
              >
                <Flag size={14} /> {isMarked ? 'Marked for Review' : 'Mark for Review'}
              </button>

              {currentAnswer !== undefined && currentAnswer !== -1 && (
                <button
                  type="button"
                  className="btn btn-subtle btn-sm"
                  onClick={handleClearResponse}
                >
                  Clear Response
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <button
                type="button"
                className="btn btn-primary"
                disabled={currentIndex === totalQ - 1}
                onClick={() => setCurrentIndex(prev => Math.min(totalQ - 1, prev + 1))}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Palette Sidebar */}
        <aside
          style={{
            width: '320px',
            backgroundColor: 'var(--bg-surface)',
            borderLeft: '1px solid var(--border-subtle)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflowY: 'auto'
          }}
        >
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}>
              Question Palette
            </h3>

            {/* Summary Legend */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--primary-600)' }} />
                <span>Answered ({answeredCount})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-medium)' }} />
                <span>Unanswered ({unansweredCount})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--warning)' }} />
                <span>Marked ({markedCount})</span>
              </div>
            </div>

            {/* Question Buttons Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
              {activeTest.questions.map((q, idx) => {
                const ans = activeTest.answers[q.id];
                const isAns = ans !== undefined && ans !== -1;
                const isRev = !!activeTest.markedForReview[q.id];
                const isCurrent = idx === currentIndex;

                let bg = 'var(--bg-subtle)';
                let color = 'var(--text-secondary)';
                if (isAns) {
                  bg = 'var(--primary-600)';
                  color = '#fff';
                } else if (isRev) {
                  bg = 'var(--warning)';
                  color = '#fff';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: bg,
                      color,
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      border: isCurrent ? '2px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer'
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowSubmitConfirm(true)}
              style={{ width: '100%', padding: '12px' }}
            >
              Finish & Submit Test
            </button>
          </div>
        </aside>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '460px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
              Submit Test Series?
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Once submitted, your answers cannot be changed. Scoring follows authentic NEET rules (+4 for correct, -1 for incorrect, 0 for skipped).
            </p>

            <div style={{ padding: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Answered Questions:</span>
                <strong>{answeredCount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Unanswered / Skipped:</span>
                <strong>{unansweredCount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Marked for Review:</span>
                <strong>{markedCount}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowSubmitConfirm(false)}
                style={{ flex: 1 }}
              >
                Back to Test
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleFinalSubmit}
                style={{ flex: 1 }}
              >
                Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Modal */}
      {showExitConfirm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '8px' }}>
              Cancel Test Session?
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Are you sure you want to exit? Your in-progress responses for this test will be cleared.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowExitConfirm(false)}
                style={{ flex: 1 }}
              >
                Continue Test
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  cancelTest();
                  onCancel();
                }}
                style={{ flex: 1 }}
              >
                Exit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { StudentProfile, StrengthLevel } from '../types';
import { Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: StudentProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [targetYear, setTargetYear] = useState<number>(2027);
  const [gradeStatus, setGradeStatus] = useState<'class12' | 'dropper'>('class12');
  const [examDate, setExamDate] = useState('2027-05-02'); // Tentative first Sunday of May
  const [targetScore, setTargetScore] = useState<number>(680);
  const [dailyTargetHours, setDailyTargetHours] = useState<number>(6);
  const [dailyMcqTarget, setDailyMcqTarget] = useState<number>(100);

  const [strengths, setStrengths] = useState<{
    physics: StrengthLevel;
    chemistry: StrengthLevel;
    botany: StrengthLevel;
    zoology: StrengthLevel;
  }>({
    physics: 'average',
    chemistry: 'average',
    botany: 'strong',
    zoology: 'strong'
  });

  const [error, setError] = useState('');

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name or preferred study pseudonym.');
      return;
    }
    if (!examDate) {
      setError('Please provide your estimated NEET exam date.');
      return;
    }
    if (targetScore < 300 || targetScore > 720) {
      setError('Target score must be between 300 and 720.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleFinalSubmit = () => {
    const newProfile: StudentProfile = {
      id: 'student_' + Date.now(),
      name: name.trim(),
      targetYear,
      gradeStatus,
      examDate,
      targetScore,
      strengths,
      dailyTargetHours,
      dailyMcqTarget,
      onboarded: true,
      theme: 'light',
      notificationsEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onComplete(newProfile);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 100, backdropFilter: 'blur(4px)' }}>
      <div className="modal-content" style={{ maxWidth: '580px', padding: '32px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary-100)',
              color: 'var(--primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto'
            }}
          >
            <Sparkles size={26} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Welcome to Rabbit
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Your honest, distraction-free NEET self-study companion.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.825rem',
              marginBottom: '16px',
              fontWeight: 500
            }}
          >
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleStep1Submit}>
            <div className="form-group">
              <label className="form-label">Student Name / Study Alias</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Aryan Sharma"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Target Year</label>
                <select
                  className="form-select"
                  value={targetYear}
                  onChange={e => setTargetYear(Number(e.target.value))}
                >
                  <option value={2026}>NEET 2026</option>
                  <option value={2027}>NEET 2027</option>
                  <option value={2028}>NEET 2028</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Academic Status</label>
                <select
                  className="form-select"
                  value={gradeStatus}
                  onChange={e => setGradeStatus(e.target.value as 'class12' | 'dropper')}
                >
                  <option value="class12">Class 12th Regular</option>
                  <option value="dropper">Dropper / Repeater</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Target Exam Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={examDate}
                  onChange={e => setExamDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Score (out of 720)</label>
                <input
                  type="number"
                  min={300}
                  max={720}
                  className="form-input"
                  value={targetScore}
                  onChange={e => setTargetScore(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Daily Planned Study (Hours)</label>
                <input
                  type="number"
                  min={1}
                  max={16}
                  className="form-input"
                  value={dailyTargetHours}
                  onChange={e => setDailyTargetHours(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Daily MCQ Mission</label>
                <input
                  type="number"
                  min={20}
                  max={300}
                  className="form-input"
                  value={dailyMcqTarget}
                  onChange={e => setDailyMcqTarget(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              <ShieldCheck size={14} color="var(--primary-600)" />
              <span>Privacy First: All data is stored strictly on your local device. No tracking.</span>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Continue to Subject Self-Assessment <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Step 2: Subject Strength Assessment
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                This helps the planner prioritize chapters and detect genuine weak areas.
              </p>
            </div>

            {(['physics', 'chemistry', 'botany', 'zoology'] as const).map(subject => (
              <div
                key={subject}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '10px'
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.875rem', textTransform: 'capitalize' }}>
                  {subject}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {(['weak', 'average', 'strong'] as StrengthLevel[]).map(lvl => {
                    const isSelected = strengths[subject] === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setStrengths({ ...strengths, [subject]: lvl })}
                        style={{
                          padding: '5px 12px',
                          fontSize: '0.775rem',
                          fontWeight: 600,
                          borderRadius: 'var(--radius-sm)',
                          border: isSelected ? '1px solid var(--primary-600)' : '1px solid var(--border-medium)',
                          backgroundColor: isSelected ? 'var(--primary-600)' : 'var(--bg-surface)',
                          color: isSelected ? '#fff' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          textTransform: 'capitalize'
                        }}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep(1)}
                style={{ flex: 1 }}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleFinalSubmit}
                style={{ flex: 2 }}
              >
                <Check size={16} /> Finish Setup & Launch
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

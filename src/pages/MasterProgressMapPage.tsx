import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateDaysRemaining, getTodayDateString } from '../services/storage';
import { IntelligenceEngine, ChapterMasteryDiagnosis } from '../services/intelligenceEngine';
import {
  BarChart2,
  CheckCircle2,
  Clock,
  Target,
  Award,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Plus,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { SubjectId } from '../types';

export const MasterProgressMapPage: React.FC = () => {
  const {
    profile,
    chapters,
    mcqRecords,
    studyLogs,
    mockTests,
    achievements,
    addMockTest,
    deleteMockTest
  } = useApp();

  const [showTestModal, setShowTestModal] = useState(false);
  const [testTitle, setTestTitle] = useState('');
  const [testDate, setTestDate] = useState(getTodayDateString());
  const [totalQuestions, setTotalQuestions] = useState(180);
  const [attempted, setAttempted] = useState(170);
  const [correct, setCorrect] = useState(140);
  const [wrong, setWrong] = useState(30);
  const [physicsScore, setPhysicsScore] = useState(140);
  const [chemistryScore, setChemistryScore] = useState(150);
  const [botanyScore, setBotanyScore] = useState(160);
  const [zoologyScore, setZoologyScore] = useState(160);

  const daysLeft = profile ? calculateDaysRemaining(profile.examDate) : 0;
  const todayStr = getTodayDateString();

  // Deterministic Intelligence Diagnoses across all chapters
  const diagnoses: ChapterMasteryDiagnosis[] = chapters.map(c => IntelligenceEngine.diagnoseChapter(c, todayStr));
  const examReadyCount = diagnoses.filter(d => d.state === 'EXAM_READY').length;
  const learningCount = diagnoses.filter(d => d.state === 'LEARNING').length;
  const needsPracticeCount = diagnoses.filter(d => d.state === 'NEEDS_PRACTICE').length;
  const needsRevisionCount = diagnoses.filter(d => d.state === 'NEEDS_REVISION').length;
  const notStartedCount = diagnoses.filter(d => d.state === 'NOT_STARTED').length;

  // Aggregate Calculations strictly from data
  const totalChapters = chapters.length;
  const completedChapters = chapters.filter(c => c.status === 'completed' || c.status === 'exam_ready').length;
  const syllabusPercentage = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  // Topics completed
  const allTopics = chapters.flatMap(c => c.topics);
  const totalTopics = allTopics.length;
  const completedTopics = allTopics.filter(t => t.isCompleted).length;
  const topicPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // MCQs & PYQs
  const totalMcqs = mcqRecords.reduce((acc, r) => acc + r.attempted, 0);
  const totalCorrectMcqs = mcqRecords.reduce((acc, r) => acc + r.correct, 0);
  const overallAccuracy = totalMcqs > 0 ? Math.round((totalCorrectMcqs / totalMcqs) * 100) : 0;
  const totalPyqs = mcqRecords.filter(r => r.isPyq).reduce((acc, r) => acc + r.attempted, 0);

  // Revisions due
  const revisionsDueCount = chapters.filter(c => c.revisionDue && c.revisionDue <= todayStr).length;

  // Backlog (High priority chapters still not started)
  const backlogChapters = chapters.filter(c => c.priority === 'high' && c.status === 'not_started');

  // Mock tests aggregate
  const testsCompleted = mockTests.length;
  const avgTestScore = testsCompleted > 0
    ? Math.round(mockTests.reduce((acc, t) => acc + t.score, 0) / testsCompleted)
    : 0;

  // Subject completion breakdown
  const subjects: SubjectId[] = ['physics', 'chemistry', 'botany', 'zoology'];
  const subjectBreakdown = subjects.map(s => {
    const chs = chapters.filter(c => c.subjectId === s);
    const completed = chs.filter(c => c.status === 'completed').length;
    const percent = chs.length > 0 ? Math.round((completed / chs.length) * 100) : 0;
    const mcqs = chs.reduce((acc, c) => acc + c.mcqCount, 0);
    return {
      subject: s,
      total: chs.length,
      completed,
      percentage: percent,
      mcqs
    };
  });

  const handleSaveTest = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedScore = (correct * 4) - wrong;

    addMockTest({
      title: testTitle.trim() || `Full Syllabus Mock #${mockTests.length + 1}`,
      date: testDate,
      totalQuestions,
      attempted,
      correct,
      wrong,
      score: calculatedScore,
      totalScore: 720,
      physicsScore,
      chemistryScore,
      botanyScore,
      zoologyScore
    });

    setShowTestModal(false);
    setTestTitle('');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">NEET Master Progress Map</h1>
        <p className="page-subtitle">
          Holistic command center. Every figure reflects verified user actions without fabrication.
        </p>
      </div>

      {/* Overview Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div className="card">
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            DAYS REMAINING
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {daysLeft}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Target: {profile?.examDate || 'May 2027'}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            SYLLABUS COMPLETION
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: 'var(--primary-600)', marginTop: '4px' }}>
            {syllabusPercentage}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {completedChapters} / {totalChapters} chapters done
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            TOPIC MASTERY
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: 'var(--primary-700)', marginTop: '4px' }}>
            {topicPercentage}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {completedTopics} / {totalTopics} topics ticked
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            AVERAGE MOCK SCORE
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: avgTestScore >= 600 ? 'var(--primary-600)' : 'var(--text-primary)', marginTop: '4px' }}>
            {testsCompleted > 0 ? `${avgTestScore} / 720` : '—'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Target: {profile?.targetScore || 680} ({testsCompleted} mocks logged)
          </div>
        </div>
      </div>

      {/* Deterministic 5-State Chapter Mastery Strip */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
              Deterministic Chapter Mastery States
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
              Transitions strictly evaluated from topic completion, MCQ accuracy, and spaced intervals. No arbitrary estimates.
            </p>
          </div>
          <span className="badge badge-gray">{totalChapters} Total Chapters</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-500)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-800)' }}>EXAM READY</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-700)' }}>
              {examReadyCount}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--primary-600)' }}>All topics & acc ≥75%</div>
          </div>

          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-medium)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>LEARNING</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {learningCount}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>In study progression</div>
          </div>

          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--danger-bg)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--danger)' }}>NEEDS PRACTICE</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--danger)' }}>
              {needsPracticeCount}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#991B1B' }}>Accuracy &lt; 65%</div>
          </div>

          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--warning-bg)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#92400E' }}>NEEDS REVISION</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: '#B45309' }}>
              {needsRevisionCount}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#92400E' }}>Interval overdue</div>
          </div>

          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>NOT STARTED</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
              {notStartedCount}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Pending backlog</div>
          </div>
        </div>
      </div>

      {/* Subject-by-Subject Progression */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
          Subject Completion Breakdown
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {subjectBreakdown.map(b => (
            <div
              key={b.subject}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, textTransform: 'capitalize', fontSize: '0.95rem' }}>
                  {b.subject}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-700)' }}>
                  {b.percentage}%
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {b.completed} of {b.total} chapters completed • {b.mcqs} MCQs
              </div>
              <div className="progress-bar-bg" style={{ height: '8px' }}>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${b.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backlog & Spaced Revision Command Split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Backlog Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="var(--danger)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>High-Priority Backlog</h3>
            </div>
            <span className="badge badge-red">{backlogChapters.length} Chapters</span>
          </div>

          {backlogChapters.length === 0 ? (
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              No critical backlog detected. All high priority chapters are in progress or completed.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {backlogChapters.slice(0, 5).map(c => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-subtle)',
                    fontSize: '0.825rem'
                  }}
                >
                  <div>
                    <strong style={{ textTransform: 'capitalize' }}>{c.subjectId}</strong>: {c.name}
                  </div>
                  <span className="badge badge-gray">Not Started</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Revision Due */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RotateCcw size={18} color="var(--primary-600)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Pending Revisions</h3>
            </div>
            <span className="badge badge-yellow">{revisionsDueCount} Due</span>
          </div>

          {revisionsDueCount === 0 ? (
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              All completed chapters are up to date on your spaced repetition schedule.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {chapters
                .filter(c => c.revisionDue && c.revisionDue <= todayStr)
                .slice(0, 5)
                .map(c => (
                  <div
                    key={c.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-subtle)',
                      fontSize: '0.825rem'
                    }}
                  >
                    <div>
                      <strong style={{ textTransform: 'capitalize' }}>{c.subjectId}</strong>: {c.name}
                    </div>
                    <span className="badge badge-yellow">Due {c.revisionDue}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Target Score Gap & Planning Metric */}
      {profile?.targetScore && (
        <div
          className="card"
          style={{
            padding: '24px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-medium)',
            marginBottom: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Target Score Gap & Reality Check (Planning Metric)
            </h3>
            <span className="badge badge-gray">Non-Predictive Self-Benchmark</span>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Rabbit does not fabricate speculative rank predictions. This is an objective planning comparison between your actual logged mock average and your self-declared target.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', textAlign: 'center' }}>
            <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>CURRENT MOCK AVERAGE</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {testsCompleted > 0 ? `${avgTestScore}` : '0'}
              </div>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>DECLARED TARGET SCORE</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-700)', marginTop: '4px' }}>
                {profile.targetScore}
              </div>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>CURRENT SCORE GAP</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 800, color: (profile.targetScore - avgTestScore) > 0 ? 'var(--danger)' : 'var(--primary-600)', marginTop: '4px' }}>
                {testsCompleted > 0 ? `${Math.max(0, profile.targetScore - avgTestScore)} Marks` : `${profile.targetScore} Marks`}
              </div>
            </div>
          </div>

          {/* Actionable recommendations to bridge gap */}
          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Actionable Gap Closure Strategy:
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              • <strong>Practice Volume:</strong> To eliminate a {Math.max(0, profile.targetScore - avgTestScore)} mark deficit, sustain at least 50–100 MCQs daily across your weakest chapters.
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              • <strong>Negative Marks:</strong> Focus on skipping doubtful questions during tests to prevent -1 deductions.
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              • <strong>Spaced Revision:</strong> Complete all due revisions in your Mistake Notebook before starting fresh topics.
            </div>
          </div>
        </div>
      )}

      {/* Mature Achievements Showcase */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
          Preparation Milestones & Achievements
        </h3>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Genuine milestones earned strictly through verified questions solved, streak discipline, and study hours.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px' }}>
          {achievements.map(ach => (
            <div
              key={ach.id}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: ach.progress >= 100 ? 'var(--primary-50)' : 'var(--bg-subtle)',
                border: ach.progress >= 100 ? '1px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.3rem' }}>{ach.icon}</span>
                  <span className={`badge ${ach.progress >= 100 ? 'badge-green' : 'badge-gray'}`} style={{ fontSize: '0.68rem' }}>
                    {ach.progress >= 100 ? 'Unlocked' : `${ach.currentValue} / ${ach.threshold}`}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '3px' }}>
                  {ach.title}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  {ach.description}
                </p>
              </div>

              <div className="progress-bar-bg" style={{ height: '5px', marginTop: '10px' }}>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${ach.progress}%`, backgroundColor: ach.progress >= 100 ? 'var(--primary-600)' : 'var(--primary-500)' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mock Tests Section */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Authentic Mock Test Log</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Record official NTA pattern full-length or part syllabus mock tests.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowTestModal(true)}
          >
            <Plus size={15} /> Record Mock Test
          </button>
        </div>

        {mockTests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No mock tests logged yet. Record your test scores to track your progress toward your target score.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mockTests.map(test => (
              <div
                key={test.id}
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
                    <span className="badge badge-gray">{test.date}</span>
                    <strong style={{ fontSize: '0.95rem' }}>{test.title}</strong>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Physics: {test.physicsScore} | Chemistry: {test.chemistryScore} | Botany: {test.botanyScore} | Zoology: {test.zoologyScore}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: test.score >= 600 ? 'var(--primary-600)' : 'var(--text-primary)' }}>
                      {test.score} / 720
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {test.correct} Correct • {test.wrong} Wrong
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-subtle btn-sm"
                    onClick={() => deleteMockTest(test.id)}
                  >
                    <Trash2 size={14} color="var(--danger)" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Record Mock Test */}
      {showTestModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
              Record NEET Mock Test Score
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Standard marking: +4 for correct, -1 for incorrect.
            </p>

            <form onSubmit={handleSaveTest}>
              <div className="form-group">
                <label className="form-label">Test Title / Source</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Allen Major Test 04 / Aakash AIATS 02"
                  value={testTitle}
                  onChange={e => setTestTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Test Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={testDate}
                  onChange={e => setTestDate(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Attempted (Q)</label>
                  <input
                    type="number"
                    min={1}
                    max={180}
                    className="form-input"
                    value={attempted}
                    onChange={e => setAttempted(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Correct (Q)</label>
                  <input
                    type="number"
                    min={0}
                    max={attempted}
                    className="form-input"
                    value={correct}
                    onChange={e => setCorrect(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Wrong (Q)</label>
                  <input
                    type="number"
                    min={0}
                    max={attempted}
                    className="form-input"
                    value={wrong}
                    onChange={e => setWrong(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-secondary)', margin: '8px 0 10px 0' }}>
                Subject Score Breakdown (out of 180 each)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Physics Score</label>
                  <input
                    type="number"
                    min={-45}
                    max={180}
                    className="form-input"
                    value={physicsScore}
                    onChange={e => setPhysicsScore(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Chemistry Score</label>
                  <input
                    type="number"
                    min={-45}
                    max={180}
                    className="form-input"
                    value={chemistryScore}
                    onChange={e => setChemistryScore(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Botany Score</label>
                  <input
                    type="number"
                    min={-45}
                    max={180}
                    className="form-input"
                    value={botanyScore}
                    onChange={e => setBotanyScore(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Zoology Score</label>
                  <input
                    type="number"
                    min={-45}
                    max={180}
                    className="form-input"
                    value={zoologyScore}
                    onChange={e => setZoologyScore(Number(e.target.value))}
                  />
                </div>
              </div>

              <div
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  margin: '10px 0 16px 0',
                  fontWeight: 700
                }}
              >
                Calculated Total Score:{' '}
                <span style={{ color: 'var(--primary-700)', fontFamily: 'var(--font-mono)' }}>
                  {(correct * 4) - wrong} / 720
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowTestModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  Save Test Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

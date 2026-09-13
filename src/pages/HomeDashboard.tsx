import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateDaysRemaining, getTodayDateString } from '../services/storage';
import { StudyTimer } from '../components/StudyTimer';
import { DailyMcqMission } from '../components/DailyMcqMission';
import {
  Clock,
  Calendar,
  BookOpen,
  Award,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Flame,
  ArrowRight,
  Plus
} from 'lucide-react';
import { SubjectId, PlannerStatus } from '../types';
import { SmartRecommendations } from '../components/SmartRecommendations';

interface HomeDashboardProps {
  onNavigate: (tab: any) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate }) => {
  const {
    profile,
    chapters,
    studyPlans,
    studyLogs,
    todayMcqGoal,
    streak,
    updateStudyPlanStatus,
    addStudyPlan
  } = useApp();

  const [showQuickPlanModal, setShowQuickPlanModal] = useState(false);
  const [quickSubject, setQuickSubject] = useState<SubjectId>('physics');
  const [quickChapterId, setQuickChapterId] = useState('');
  const [quickMinutes, setQuickMinutes] = useState(60);

  const todayStr = getTodayDateString();

  // Days remaining calculation
  const daysLeft = profile ? calculateDaysRemaining(profile.examDate) : 0;

  // Real today study time calculation (sum of minutes logged today)
  const todayLogs = studyLogs.filter(l => l.date === todayStr);
  const todayStudyMinutes = todayLogs.reduce((acc, curr) => acc + curr.minutes, 0);
  const todayStudyHours = (todayStudyMinutes / 60).toFixed(1);

  // Today planned study time
  const todayPlans = studyPlans.filter(p => p.date === todayStr);
  const todayPlannedMinutes = todayPlans.reduce((acc, curr) => acc + curr.plannedMinutes, 0);
  const todayPlannedHours = (todayPlannedMinutes / 60).toFixed(1);

  // Overall Syllabus Progress (based on real chapter status)
  const totalChapters = chapters.length;
  const completedChapters = chapters.filter(c => c.status === 'completed').length;
  const inProgressChapters = chapters.filter(c => c.status === 'in_progress').length;
  const syllabusPercent = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  // Real MCQ accuracy
  const totalAttempted = todayMcqGoal.attempted;
  const mcqAccuracy = totalAttempted > 0 ? Math.round((todayMcqGoal.correct / totalAttempted) * 100) : 0;

  // Real Revisions Due (Chapters where revisionDue <= today date)
  const revisionsDue = chapters.filter(c => c.revisionDue && c.revisionDue <= todayStr);

  // Real Weak Areas: Subjects flagged weak in profile OR chapters with accuracy < 60% with at least 15 MCQs solved
  const weakChapters = chapters.filter(c => {
    if (c.mcqCount >= 15) {
      const acc = (c.correctMcqs / c.mcqCount) * 100;
      return acc < 60;
    }
    // Also include high priority chapters in subjects marked 'weak' by student
    if (profile?.strengths[c.subjectId] === 'weak' && c.priority === 'high' && c.status !== 'completed') {
      return true;
    }
    return false;
  }).slice(0, 4);

  const quickSubjectChapters = chapters.filter(c => c.subjectId === quickSubject);
  if (!quickChapterId && quickSubjectChapters.length > 0) {
    setQuickChapterId(quickSubjectChapters[0].id);
  }

  const handleAddQuickPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const chap = chapters.find(c => c.id === quickChapterId);
    if (!chap) return;

    addStudyPlan({
      date: todayStr,
      subjectId: quickSubject,
      chapterId: quickChapterId,
      chapterName: chap.name,
      plannedMinutes: quickMinutes,
      actualMinutes: 0,
      status: 'planned'
    });

    setShowQuickPlanModal(false);
  };

  // Real revision count due today
  const revisionsDueCount = revisionsDue.length;

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Calm, Serious App Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '16px',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary-700)' }}>
              RABBIT NEET
            </span>
            <span style={{ fontSize: '0.75rem', padding: '1px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
              {profile?.targetYear ? `NEET ${profile.targetYear}` : 'NEET 2027'}
            </span>
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0 0', letterSpacing: '-0.02em' }}>
            Good day, {profile?.name || 'Aspirant'}
          </h1>
        </div>

        <div
          style={{
            textAlign: 'right',
            padding: '8px 14px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            DAYS REMAINING
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {daysLeft}
          </div>
        </div>
      </div>

      {/* TODAY'S PROGRESS — Clean 4-Metric Grid */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: '8px' }}>
          TODAY'S PROGRESS
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px'
          }}
        >
          {/* Study */}
          <div className="card" style={{ padding: '12px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>STUDY</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {todayStudyHours}h
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              / {profile?.dailyTargetHours || 6}h
            </div>
          </div>

          {/* MCQs */}
          <div className="card" style={{ padding: '12px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>MCQS</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 800, color: todayMcqGoal.isCompleted ? 'var(--primary-600)' : 'var(--text-primary)', marginTop: '2px' }}>
              {todayMcqGoal.attempted}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              / {todayMcqGoal.target}
            </div>
          </div>

          {/* Accuracy */}
          <div className="card" style={{ padding: '12px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>ACCURACY</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 800, color: mcqAccuracy >= 75 ? 'var(--primary-600)' : 'var(--text-primary)', marginTop: '2px' }}>
              {totalAttempted > 0 ? `${mcqAccuracy}%` : '—'}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {todayMcqGoal.correct} correct
            </div>
          </div>

          {/* Revision Due */}
          <div className="card" style={{ padding: '12px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>REVISION</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 800, color: revisionsDueCount > 0 ? 'var(--danger)' : 'var(--primary-600)', marginTop: '2px' }}>
              {revisionsDueCount}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              due today
            </div>
          </div>
        </div>
      </div>

      {/* WHAT SHOULD I DO NOW? Command Center */}
      <SmartRecommendations onNavigate={onNavigate} />

      {/* QUICK ACTIONS BAR */}
      <div className="card" style={{ padding: '14px 18px', marginBottom: '22px' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: '10px' }}>
          QUICK ACTIONS
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-sm btn-subtle"
            onClick={() => onNavigate('study')}
          >
            <Clock size={14} /> Start Study Timer
          </button>
          <button
            type="button"
            className="btn btn-sm btn-subtle"
            onClick={() => onNavigate('mcqs')}
          >
            <Award size={14} /> Daily 100 MCQs
          </button>
          <button
            type="button"
            className="btn btn-sm btn-subtle"
            onClick={() => onNavigate('tests')}
          >
            <CheckCircle2 size={14} /> Test Series (50-200)
          </button>
          <button
            type="button"
            className="btn btn-sm btn-subtle"
            onClick={() => onNavigate('mistakes')}
          >
            <AlertTriangle size={14} /> Mistake Notebook
          </button>
          <button
            type="button"
            className="btn btn-sm btn-subtle"
            onClick={() => onNavigate('study')}
          >
            <RotateCcw size={14} /> Revision Due ({revisionsDueCount})
          </button>
        </div>
      </div>

      {/* Main Split: Timer & Mission | Today's Plan & Review */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Left Column: Focused Timer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <StudyTimer />
          <DailyMcqMission />
        </div>

        {/* Right Column: Today's Study Plan & Urgent Revisions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Today's Study Plan Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={20} color="var(--primary-600)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Today’s Study Plan
                </h3>
              </div>
              <button
                type="button"
                className="btn btn-subtle btn-sm"
                onClick={() => setShowQuickPlanModal(true)}
              >
                <Plus size={14} /> Add Block
              </button>
            </div>

            {todayPlans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  No study blocks planned for today yet.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowQuickPlanModal(true)}
                >
                  <Plus size={14} /> Plan First Subject Block
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {todayPlans.map(plan => (
                  <div
                    key={plan.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-700)' }}>
                          {plan.subjectId}
                        </span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {plan.chapterName}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Duration: {plan.plannedMinutes} mins
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <select
                        className="form-select"
                        value={plan.status}
                        onChange={e => updateStudyPlanStatus(plan.id, e.target.value as PlannerStatus)}
                        style={{ fontSize: '0.75rem', padding: '4px 8px', width: 'auto' }}
                      >
                        <option value="planned">Planned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                        <option value="skipped">Skipped</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Revision Due Box */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RotateCcw size={18} color="var(--primary-600)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Revisions Due
                </h3>
              </div>
              <span className="badge badge-yellow">
                {revisionsDue.length} Chapters
              </span>
            </div>

            {revisionsDue.length === 0 ? (
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
                No spaced-repetition revisions due today. Keep studying and Rabbit will schedule intervals automatically.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {revisionsDue.slice(0, 3).map(chap => (
                  <div
                    key={chap.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-subtle)',
                      fontSize: '0.825rem'
                    }}
                  >
                    <div>
                      <strong style={{ textTransform: 'capitalize' }}>{chap.subjectId}</strong>: {chap.name}
                    </div>
                    <button
                      type="button"
                      className="btn btn-subtle btn-sm"
                      onClick={() => onNavigate('study')}
                    >
                      Revise
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Weak Areas */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="var(--warning)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Current Weak Areas
                </h3>
              </div>
              <button
                type="button"
                className="btn btn-subtle btn-sm"
                onClick={() => onNavigate('progress')}
              >
                Inspect Map <ArrowRight size={13} />
              </button>
            </div>

            {weakChapters.length === 0 ? (
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
                No severe weak areas identified yet. As you log MCQ accuracy and complete chapter topics, Rabbit detects genuine conceptual gaps.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {weakChapters.map(ch => (
                  <div
                    key={ch.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.825rem'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, textTransform: 'capitalize', color: 'var(--text-primary)' }}>
                        {ch.subjectId}: {ch.name}
                      </span>
                    </div>
                    {ch.mcqCount > 0 ? (
                      <span className="badge badge-red">
                        {Math.round((ch.correctMcqs / ch.mcqCount) * 100)}% Accuracy
                      </span>
                    ) : (
                      <span className="badge badge-yellow">
                        Needs Focus
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Plan Modal */}
      {showQuickPlanModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
              Add Study Block for Today
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Schedule realistic blocks of time for focused chapter mastery.
            </p>

            <form onSubmit={handleAddQuickPlan}>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select
                  className="form-select"
                  value={quickSubject}
                  onChange={e => {
                    const subj = e.target.value as SubjectId;
                    setQuickSubject(subj);
                    const chs = chapters.filter(c => c.subjectId === subj);
                    if (chs.length > 0) setQuickChapterId(chs[0].id);
                  }}
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
                  value={quickChapterId}
                  onChange={e => setQuickChapterId(e.target.value)}
                >
                  {quickSubjectChapters.map(c => (
                    <option key={c.id} value={c.id}>
                      Class {c.classLevel}: {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Planned Duration (Minutes)</label>
                <input
                  type="number"
                  min={15}
                  max={240}
                  step={15}
                  className="form-input"
                  value={quickMinutes}
                  onChange={e => setQuickMinutes(Number(e.target.value))}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowQuickPlanModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  Save to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

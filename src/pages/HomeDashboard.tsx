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

  return (
    <div className="page-container">
      {/* Top Banner: Greeting & Exam Countdown */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)',
          color: '#FFFFFF',
          padding: '24px 28px',
          marginBottom: '24px',
          border: 'none',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>
                {profile?.gradeStatus === 'class12' ? 'Class 12th Aspirant' : 'Repeater / Dropper'}
              </span>
              <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>
                Target: {profile?.targetScore || 680} / 720
              </span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              Focus on today, {profile?.name || 'Doctor'}.
            </h1>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '4px' }}>
              Consistent daily blocks and honest question solving build high scores.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              padding: '16px 22px',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              minWidth: '150px'
            }}
          >
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.08em', fontWeight: 700, textTransform: 'uppercase', opacity: 0.85 }}>
              NEET COUNTDOWN
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.1, margin: '4px 0' }}>
              {daysLeft}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>
              Days Remaining
            </div>
          </div>
        </div>
      </div>

      {/* Smart Recommendations: WHAT SHOULD I DO NOW? & Quick Study Modes */}
      <SmartRecommendations onNavigate={onNavigate} />

      {/* Primary KPI Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        {/* Today's Study Time */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>TODAY’S STUDY TIME</span>
            <Clock size={16} color="var(--primary-600)" />
          </div>
          <div style={{ marginTop: '10px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {todayStudyHours}h
            </span>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
              / {profile?.dailyTargetHours || 6}h planned
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: todayStudyMinutes >= (profile?.dailyTargetHours || 6) * 60 ? 'var(--primary-600)' : 'var(--text-muted)', marginTop: '4px' }}>
            {todayStudyMinutes > 0 ? `${todayStudyMinutes} mins actual logged` : 'No study logged yet today'}
          </div>
        </div>

        {/* Daily MCQ Progress */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>DAILY MCQ MISSION</span>
            <Award size={16} color="var(--primary-600)" />
          </div>
          <div style={{ marginTop: '10px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {todayMcqGoal.attempted}
            </span>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
              / {todayMcqGoal.target} MCQs
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Accuracy: <strong>{totalAttempted > 0 ? `${mcqAccuracy}%` : '—'}</strong>
          </div>
        </div>

        {/* Syllabus Progress */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>SYLLABUS PROGRESS</span>
            <BookOpen size={16} color="var(--primary-600)" />
          </div>
          <div style={{ marginTop: '10px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {syllabusPercent}%
            </span>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
              ({completedChapters}/{totalChapters} Ch.)
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {inProgressChapters} chapters in progress
          </div>
        </div>

        {/* Study Streak */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>STUDY STREAK</span>
            <Flame size={16} color="var(--warning)" />
          </div>
          <div style={{ marginTop: '10px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: streak > 0 ? 'var(--primary-600)' : 'var(--text-primary)' }}>
              {streak} {streak === 1 ? 'Day' : 'Days'}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {streak > 0 ? 'Real daily activity verified' : 'Log activity today to start streak'}
          </div>
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

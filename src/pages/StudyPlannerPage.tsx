import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubjectId, ClassLevel, Chapter, ChapterStatus } from '../types';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Search,
  Filter,
  Plus,
  Trash2,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { getTodayDateString } from '../services/storage';

export const StudyPlannerPage: React.FC = () => {
  const {
    chapters,
    studyPlans,
    studyLogs,
    doubts,
    toggleTopicCompletion,
    updateChapter,
    addStudyPlan,
    updateStudyPlanStatus,
    deleteStudyPlan,
    deleteStudyLog,
    addDoubt,
    resolveDoubt,
    deleteDoubt
  } = useApp();

  const [activeTab, setActiveTab] = useState<'syllabus' | 'planner' | 'logs' | 'doubts'>('syllabus');
  const [subjectFilter, setSubjectFilter] = useState<SubjectId | 'all'>('all');
  const [classFilter, setClassFilter] = useState<ClassLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);

  // New Study Plan modal states
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planDate, setPlanDate] = useState(getTodayDateString());
  const [planSubject, setPlanSubject] = useState<SubjectId>('physics');
  const [planChapterId, setPlanChapterId] = useState('');
  const [planMinutes, setPlanMinutes] = useState(60);

  // Doubt modal
  const [showDoubtModal, setShowDoubtModal] = useState(false);
  const [doubtText, setDoubtText] = useState('');
  const [doubtSubject, setDoubtSubject] = useState<SubjectId>('physics');
  const [doubtChapterId, setDoubtChapterId] = useState('');
  const [doubtTopic, setDoubtTopic] = useState('');

  // Resolution modal
  const [resolvingDoubtId, setResolvingDoubtId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  // Filtering chapters
  const filteredChapters = chapters.filter(c => {
    if (subjectFilter !== 'all' && c.subjectId !== subjectFilter) return false;
    if (classFilter !== 'all' && c.classLevel !== classFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchTopics = c.topics.some(t => t.name.toLowerCase().includes(q));
      if (!matchName && !matchTopics) return false;
    }
    return true;
  });

  const availablePlanChapters = chapters.filter(c => c.subjectId === planSubject);
  if (!planChapterId && availablePlanChapters.length > 0) {
    setPlanChapterId(availablePlanChapters[0].id);
  }

  const availableDoubtChapters = chapters.filter(c => c.subjectId === doubtSubject);
  if (!doubtChapterId && availableDoubtChapters.length > 0) {
    setDoubtChapterId(availableDoubtChapters[0].id);
  }

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const ch = chapters.find(c => c.id === planChapterId);
    if (!ch) return;

    addStudyPlan({
      date: planDate,
      subjectId: planSubject,
      chapterId: planChapterId,
      chapterName: ch.name,
      plannedMinutes: planMinutes,
      actualMinutes: 0,
      status: 'planned'
    });

    setShowPlanModal(false);
  };

  const handleCreateDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;
    const ch = chapters.find(c => c.id === doubtChapterId);

    addDoubt({
      doubtText: doubtText.trim(),
      subjectId: doubtSubject,
      chapterId: doubtChapterId,
      chapterName: ch ? ch.name : 'General',
      topicName: doubtTopic.trim() || undefined
    });

    setDoubtText('');
    setDoubtTopic('');
    setShowDoubtModal(false);
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingDoubtId || !resolutionText.trim()) return;
    resolveDoubt(resolvingDoubtId, resolutionText.trim());
    setResolvingDoubtId(null);
    setResolutionText('');
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Syllabus & Study Management</h1>
        <p className="page-subtitle">
          Verified NEET NCERT & NMC structure, daily time blocks, verified study logs, and doubt tracking.
        </p>
      </div>

      {/* Tabs */}
      <div className="tab-list">
        <button
          className={`tab-btn ${activeTab === 'syllabus' ? 'active' : ''}`}
          onClick={() => setActiveTab('syllabus')}
        >
          Complete Syllabus ({chapters.length} Ch.)
        </button>
        <button
          className={`tab-btn ${activeTab === 'planner' ? 'active' : ''}`}
          onClick={() => setActiveTab('planner')}
        >
          Daily Planner ({studyPlans.length} Blocks)
        </button>
        <button
          className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          Study Log History ({studyLogs.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'doubts' ? 'active' : ''}`}
          onClick={() => setActiveTab('doubts')}
        >
          Doubt Tracker ({doubts.filter(d => d.status === 'open').length} Open)
        </button>
      </div>

      {/* TAB 1: SYLLABUS */}
      {activeTab === 'syllabus' && (
        <div>
          {/* Controls / Filter Bar */}
          <div
            className="card"
            style={{
              padding: '16px',
              marginBottom: '20px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 240px' }}>
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                className="form-input"
                placeholder="Search chapter or topic name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ padding: '8px 12px' }}
              />
            </div>

            {/* Subject Filter */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['all', 'physics', 'chemistry', 'botany', 'zoology'] as const).map(subj => (
                <button
                  key={subj}
                  className={`btn btn-sm ${subjectFilter === subj ? 'btn-primary' : 'btn-subtle'}`}
                  onClick={() => setSubjectFilter(subj)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {subj}
                </button>
              ))}
            </div>

            {/* Class Filter */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['all', '11', '12'] as const).map(cls => (
                <button
                  key={cls}
                  className={`btn btn-sm ${classFilter === cls ? 'btn-primary' : 'btn-subtle'}`}
                  onClick={() => setClassFilter(cls)}
                >
                  {cls === 'all' ? 'All Classes' : `Class ${cls}`}
                </button>
              ))}
            </div>
          </div>

          {/* Chapters Accordion List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredChapters.map(chap => {
              const isExpanded = expandedChapterId === chap.id;
              const completedCount = chap.topics.filter(t => t.isCompleted).length;
              const totalCount = chap.topics.length;
              const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

              return (
                <div key={chap.id} className="card" style={{ padding: '16px 20px' }}>
                  {/* Chapter Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                    onClick={() => setExpandedChapterId(isExpanded ? null : chap.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </button>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: 'var(--bg-subtle)',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            Class {chap.classLevel} • {chap.subjectId}
                          </span>

                          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                            {chap.order}. {chap.name}
                          </h3>

                          {chap.isVerifiedNmcSyllabus && (
                            <span
                              style={{
                                fontSize: '0.65rem',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                backgroundColor: 'var(--primary-100)',
                                color: 'var(--primary-800)',
                                fontWeight: 700
                              }}
                              title="Verified as per NMC / NTA NEET syllabus"
                            >
                              NMC Verified
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          <span>{completedCount} / {totalCount} topics mastered ({percent}%)</span>
                          <span>{chap.mcqCount} MCQs solved ({chap.correctMcqs} correct)</span>
                          {chap.revisionDue && (
                            <span style={{ color: chap.revisionDue <= getTodayDateString() ? 'var(--danger)' : 'var(--text-muted)' }}>
                              Revision: {chap.revisionDue}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Select */}
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                      onClick={e => e.stopPropagation()}
                    >
                      <select
                        className="form-select"
                        value={chap.status}
                        onChange={e => updateChapter({ ...chap, status: e.target.value as ChapterStatus })}
                        style={{ fontSize: '0.78rem', padding: '6px 10px', width: 'auto' }}
                      >
                        <option value="not_started">Not Started</option>
                        <option value="learning">Learning</option>
                        <option value="needs_practice">Needs Practice</option>
                        <option value="needs_revision">Needs Revision</option>
                        <option value="exam_ready">Exam Ready</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  {/* Expanded: Granular Topics & Progress */}
                  {isExpanded && (
                    <div
                      style={{
                        marginTop: '16px',
                        paddingTop: '16px',
                        borderTop: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                        TOPIC CHECKLIST & MASTERY
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {chap.topics.map(topic => (
                          <div
                            key={topic.id}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '10px',
                              padding: '8px 12px',
                              backgroundColor: topic.isCompleted ? 'var(--primary-50)' : 'var(--bg-subtle)',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-subtle)',
                              cursor: 'pointer'
                            }}
                            onClick={() => toggleTopicCompletion(chap.id, topic.id)}
                          >
                            <input
                              type="checkbox"
                              checked={topic.isCompleted}
                              onChange={() => toggleTopicCompletion(chap.id, topic.id)}
                              style={{ marginTop: '3px', cursor: 'pointer' }}
                              onClick={e => e.stopPropagation()}
                            />
                            <div style={{ flex: 1 }}>
                              <span
                                style={{
                                  fontSize: '0.85rem',
                                  fontWeight: 500,
                                  color: topic.isCompleted ? 'var(--primary-800)' : 'var(--text-primary)',
                                  textDecoration: topic.isCompleted ? 'line-through' : 'none'
                                }}
                              >
                                {topic.name}
                              </span>
                            </div>
                            {topic.isCompleted && (
                              <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>
                                Mastered
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Chapter Notes */}
                      <div style={{ marginTop: '14px' }}>
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Chapter Self-Notes / Key Formulae</label>
                        <textarea
                          className="form-textarea"
                          rows={2}
                          placeholder="Add revision reminders, tough questions, or reference material for this chapter..."
                          defaultValue={chap.notes || ''}
                          onBlur={e => updateChapter({ ...chap, notes: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: DAILY PLANNER */}
      {activeTab === 'planner' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Study Schedule & Blocks</h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                Set realistic study blocks tailored to your weak areas and exam schedule.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-subtle"
                onClick={() => {
                  const today = getTodayDateString();
                  // 1. Check revisions due today
                  const revDue = chapters.find(c => c.revisionDue && c.revisionDue <= today);
                  // 2. Check weak subject pending chapters
                  const weakPending = chapters.find(c => c.priority === 'high' && (c.status === 'not_started' || c.status === 'learning'));
                  // 3. Regular pending chapter
                  const anyPending = chapters.find(c => c.status === 'not_started');

                  let generatedCount = 0;
                  if (revDue) {
                    addStudyPlan({
                      date: today,
                      subjectId: revDue.subjectId,
                      chapterId: revDue.id,
                      chapterName: `[Revision Due] ${revDue.name}`,
                      plannedMinutes: 45,
                      actualMinutes: 0,
                      status: 'planned'
                    });
                    generatedCount++;
                  }
                  if (weakPending && weakPending.id !== revDue?.id) {
                    addStudyPlan({
                      date: today,
                      subjectId: weakPending.subjectId,
                      chapterId: weakPending.id,
                      chapterName: `[Priority Focus] ${weakPending.name}`,
                      plannedMinutes: 90,
                      actualMinutes: 0,
                      status: 'planned'
                    });
                    generatedCount++;
                  }
                  if (anyPending && anyPending.id !== revDue?.id && anyPending.id !== weakPending?.id) {
                    addStudyPlan({
                      date: today,
                      subjectId: anyPending.subjectId,
                      chapterId: anyPending.id,
                      chapterName: `[New Study] ${anyPending.name}`,
                      plannedMinutes: 60,
                      actualMinutes: 0,
                      status: 'planned'
                    });
                    generatedCount++;
                  }

                  // Also add Daily 100 MCQ Practice block
                  addStudyPlan({
                    date: today,
                    subjectId: 'physics',
                    chapterId: 'mcq-mission-daily',
                    chapterName: 'Daily 100 MCQ Mission (PCB split)',
                    plannedMinutes: 60,
                    actualMinutes: 0,
                    status: 'planned'
                  });
                  generatedCount++;

                  alert(`Intelligently scheduled ${generatedCount} study blocks for today based on your real revision due and pending syllabus!`);
                }}
                title="Intelligently auto-generates timetable blocks following: Revisions Due > Weak Areas > Priority Backlog > 100 MCQs"
              >
                ⚡ Auto-Generate Today's Plan
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowPlanModal(true)}
              >
                <Plus size={16} /> Plan New Block
              </button>
            </div>
          </div>

          {studyPlans.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Calendar size={36} color="var(--primary-600)" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Study Blocks Scheduled</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '6px auto 16px auto' }}>
                Plan your daily timetable chapter by chapter to prevent backlog and study with purpose.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowPlanModal(true)}
              >
                Create First Block
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {studyPlans.map(plan => (
                <div
                  key={plan.id}
                  className="card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge badge-gray">{plan.date}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-700)' }}>
                        {plan.subjectId}
                      </span>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {plan.chapterName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Planned: {plan.plannedMinutes} mins
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <select
                      className="form-select"
                      value={plan.status}
                      onChange={e => updateStudyPlanStatus(plan.id, e.target.value as any)}
                      style={{ fontSize: '0.8rem', padding: '6px 12px', width: 'auto' }}
                    >
                      <option value="planned">Planned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Completed</option>
                      <option value="skipped">Skipped</option>
                      <option value="rescheduled">Rescheduled</option>
                    </select>

                    <button
                      type="button"
                      className="btn btn-subtle btn-sm"
                      onClick={() => deleteStudyPlan(plan.id)}
                      title="Delete plan"
                    >
                      <Trash2 size={14} color="var(--danger)" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: STUDY LOGS */}
      {activeTab === 'logs' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Verified Study Sessions</h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Actual logged minutes recorded through the study timer or manual check-ins.
            </p>
          </div>

          {studyLogs.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Clock size={36} color="var(--primary-600)" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Study Sessions Recorded</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '6px auto 0 auto' }}>
                Use the Study Timer on the Home dashboard to log real focused study sessions.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {studyLogs.map(log => (
                <div key={log.id} className="card" style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge badge-gray">{log.date}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize', color: 'var(--primary-700)' }}>
                          {log.subjectId}
                        </span>
                        <strong style={{ fontSize: '0.9rem' }}>{log.chapterName}</strong>
                        {log.topicName && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            • {log.topicName}
                          </span>
                        )}
                      </div>
                      {log.notes && (
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                          📝 {log.notes}
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="badge badge-green" style={{ fontSize: '0.8rem' }}>
                        {log.minutes} mins
                      </span>
                      <button
                        type="button"
                        className="btn btn-subtle btn-sm"
                        onClick={() => deleteStudyLog(log.id)}
                      >
                        <Trash2 size={14} color="var(--danger)" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DOUBTS TRACKER */}
      {activeTab === 'doubts' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Doubt & Mistake Tracker</h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                Track every confusion so no misconception repeats in the exam hall.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowDoubtModal(true)}
            >
              <Plus size={16} /> Log New Doubt
            </button>
          </div>

          {doubts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <HelpCircle size={36} color="var(--primary-600)" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Open Doubts</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '6px auto 16px auto' }}>
                Whenever you encounter a tricky formula or puzzling question during study, save it here.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowDoubtModal(true)}
              >
                Log A Doubt
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {doubts.map(doubt => (
                <div
                  key={doubt.id}
                  className="card"
                  style={{
                    padding: '16px 20px',
                    borderLeft: doubt.status === 'open' ? '4px solid var(--warning)' : '4px solid var(--primary-600)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span className={`badge ${doubt.status === 'open' ? 'badge-yellow' : 'badge-green'}`}>
                          {doubt.status === 'open' ? 'Open' : 'Resolved'}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize', color: 'var(--text-muted)' }}>
                          {doubt.subjectId} • {doubt.chapterName}
                        </span>
                        {doubt.topicName && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            • {doubt.topicName}
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                        {doubt.doubtText}
                      </div>

                      {doubt.resolutionNote && (
                        <div
                          style={{
                            padding: '8px 12px',
                            backgroundColor: 'var(--primary-50)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.825rem',
                            color: 'var(--primary-800)',
                            marginTop: '8px'
                          }}
                        >
                          <strong>Resolution:</strong> {doubt.resolutionNote}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {doubt.status === 'open' && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => setResolvingDoubtId(doubt.id)}
                        >
                          Mark Resolved
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-subtle btn-sm"
                        onClick={() => deleteDoubt(doubt.id)}
                      >
                        <Trash2 size={14} color="var(--danger)" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: PLAN BLOCK */}
      {showPlanModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
              Schedule Study Block
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Commit to dedicated time on a specific chapter.
            </p>

            <form onSubmit={handleCreatePlan}>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={planDate}
                  onChange={e => setPlanDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <select
                  className="form-select"
                  value={planSubject}
                  onChange={e => {
                    const s = e.target.value as SubjectId;
                    setPlanSubject(s);
                    const chs = chapters.filter(c => c.subjectId === s);
                    if (chs.length > 0) setPlanChapterId(chs[0].id);
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
                  value={planChapterId}
                  onChange={e => setPlanChapterId(e.target.value)}
                >
                  {availablePlanChapters.map(c => (
                    <option key={c.id} value={c.id}>
                      Class {c.classLevel}: {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Planned Minutes</label>
                <input
                  type="number"
                  min={15}
                  max={300}
                  step={15}
                  className="form-input"
                  value={planMinutes}
                  onChange={e => setPlanMinutes(Number(e.target.value))}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPlanModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  Save Schedule Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG DOUBT */}
      {showDoubtModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
              Log A Doubt / Confusion
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Record conceptual blockers to resolve during self-study or teacher discussion.
            </p>

            <form onSubmit={handleCreateDoubt}>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select
                  className="form-select"
                  value={doubtSubject}
                  onChange={e => {
                    const s = e.target.value as SubjectId;
                    setDoubtSubject(s);
                    const chs = chapters.filter(c => c.subjectId === s);
                    if (chs.length > 0) setDoubtChapterId(chs[0].id);
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
                  value={doubtChapterId}
                  onChange={e => setDoubtChapterId(e.target.value)}
                >
                  {availableDoubtChapters.map(c => (
                    <option key={c.id} value={c.id}>
                      Class {c.classLevel}: {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Topic (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Lenz Law sign confusion"
                  value={doubtTopic}
                  onChange={e => setDoubtTopic(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">What is unclear? Describe your doubt</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Explain exactly where you got stuck or which step did not make sense..."
                  value={doubtText}
                  onChange={e => setDoubtText(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDoubtModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  Log Doubt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESOLVE DOUBT */}
      {resolvingDoubtId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
              Resolve Doubt
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Explain the correct concept or solution so you remember it permanently.
            </p>

            <form onSubmit={handleResolveSubmit}>
              <div className="form-group">
                <label className="form-label">Resolution Note & Key Clarity</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="e.g. Lenz law obeys energy conservation; the induced current always opposes the rate of change of magnetic flux..."
                  value={resolutionText}
                  onChange={e => setResolutionText(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setResolvingDoubtId(null)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  Save Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MistakeEntry, MistakeCategory, SubjectId } from '../types';
import { getTodayDateString } from '../services/storage';
import {
  BookOpen,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trash2,
  Tag,
  AlertTriangle,
  Calendar,
  Filter
} from 'lucide-react';

export const MistakeNotebookPage: React.FC = () => {
  const { mistakes, reviewMistake, deleteMistake } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<MistakeCategory | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'due' | 'all' | 'mastered'>('due');
  const [expandedMistakeId, setExpandedMistakeId] = useState<string | null>(null);

  const todayStr = getTodayDateString();

  // Categories
  const categories: MistakeCategory[] = [
    'Concept mistake',
    'Formula mistake',
    'Calculation mistake',
    'Silly mistake',
    'Memory mistake',
    'Guess',
    'Time pressure'
  ];

  // Filtering
  const filtered = mistakes.filter(m => {
    if (selectedSubject !== 'all' && m.subject !== selectedSubject) return false;
    if (selectedCategory !== 'all' && m.mistakeCategory !== selectedCategory) return false;

    if (activeTab === 'due') {
      return m.nextRevisionDate <= todayStr && m.masteryState !== 'mastered';
    } else if (activeTab === 'mastered') {
      return m.masteryState === 'mastered';
    }
    return true;
  });

  const dueCount = mistakes.filter(m => m.nextRevisionDate <= todayStr && m.masteryState !== 'mastered').length;
  const masteredCount = mistakes.filter(m => m.masteryState === 'mastered').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Mistake Notebook & Spaced Repetition</h1>
        <p className="page-subtitle">
          Every incorrect question automatically tracked. Re-solve on schedule until true conceptual mastery is proven.
        </p>
      </div>

      {/* Overview Metric Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div className="card">
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            REVISIONS DUE TODAY
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: dueCount > 0 ? 'var(--danger)' : 'var(--primary-600)', marginTop: '4px' }}>
            {dueCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Scheduled by spaced interval
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            TOTAL MISTAKES LOGGED
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {mistakes.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Across all tests and question sessions
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            RE-TESTED & MASTERED
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: 'var(--primary-700)', marginTop: '4px' }}>
            {masteredCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            3+ consecutive correct recalls
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-list">
        <button
          className={`tab-btn ${activeTab === 'due' ? 'active' : ''}`}
          onClick={() => setActiveTab('due')}
        >
          Due For Review ({dueCount})
        </button>
        <button
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Mistakes ({mistakes.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'mastered' ? 'active' : ''}`}
          onClick={() => setActiveTab('mastered')}
        >
          Mastered ({masteredCount})
        </button>
      </div>

      {/* Filter Bar */}
      <div
        className="card"
        style={{
          padding: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Subject:</span>
          {(['all', 'physics', 'chemistry', 'botany', 'zoology'] as const).map(subj => (
            <button
              key={subj}
              className={`btn btn-sm ${selectedSubject === subj ? 'btn-primary' : 'btn-subtle'}`}
              onClick={() => setSelectedSubject(subj)}
              style={{ textTransform: 'capitalize' }}
            >
              {subj}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Type:</span>
          <select
            className="form-select"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as any)}
            style={{ fontSize: '0.8rem', padding: '6px 10px', width: 'auto' }}
          >
            <option value="all">All Mistake Types</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mistakes List */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <CheckCircle2 size={40} color="var(--primary-600)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
            {activeTab === 'due' ? 'No Revisions Due Today!' : 'No Mistakes Found Under This Filter'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '6px auto 0 auto' }}>
            {activeTab === 'due'
              ? 'Great work. All identified mistakes have either been revised or are scheduled for future spaced intervals.'
              : 'As you attempt questions and full tests, any wrong questions will automatically appear here for spaced repetition.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(m => {
            const isExpanded = expandedMistakeId === m.id;
            return (
              <div
                key={m.id}
                className="card"
                style={{
                  padding: '20px',
                  borderLeft: m.nextRevisionDate <= todayStr ? '4px solid var(--danger)' : '4px solid var(--primary-600)'
                }}
              >
                {/* Meta Header */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="badge badge-gray" style={{ textTransform: 'capitalize' }}>
                      {m.subject}
                    </span>
                    <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {m.chapterName}
                    </span>
                    <span className="badge badge-yellow">
                      <Tag size={12} /> {m.mistakeCategory}
                    </span>
                    <span className="badge badge-gray">
                      Interval: {m.intervalDays}d
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.78rem', color: m.nextRevisionDate <= todayStr ? 'var(--danger)' : 'var(--text-muted)', fontWeight: 600 }}>
                      <Calendar size={13} style={{ display: 'inline', verticalAlign: 'middle' }} /> Due: {m.nextRevisionDate}
                    </span>
                    <button
                      type="button"
                      className="btn btn-subtle btn-sm"
                      onClick={() => deleteMistake(m.id)}
                      title="Remove from notebook"
                    >
                      <Trash2 size={13} color="var(--danger)" />
                    </button>
                  </div>
                </div>

                {/* Question Prompt */}
                <div style={{ fontSize: '0.975rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px', lineHeight: 1.5 }}>
                  {m.question.questionText}
                </div>

                {/* Options Review */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px', marginBottom: '16px' }}>
                  {m.question.options.map((opt, oIdx) => {
                    const isCorrect = oIdx === m.question.correctAnswer;
                    return (
                      <div
                        key={oIdx}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isCorrect ? 'var(--primary-50)' : 'var(--bg-subtle)',
                          border: isCorrect ? '1px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <strong style={{ color: isCorrect ? 'var(--primary-700)' : 'var(--text-muted)' }}>
                          {String.fromCharCode(65 + oIdx)}.
                        </strong>
                        <span style={{ color: isCorrect ? 'var(--primary-800)' : 'var(--text-secondary)', fontWeight: isCorrect ? 600 : 400 }}>
                          {opt}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Verified Solution & Concept */}
                <div
                  style={{
                    padding: '12px 14px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.825rem',
                    marginBottom: '16px',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--primary-700)', marginBottom: '4px' }}>
                    Concept Tested: {m.question.conceptTested || 'Conceptual application'}
                  </div>
                  <div style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {m.question.explanation || 'Detailed verification explanation available in question bank.'}
                  </div>
                </div>

                {/* Recall Test Actions (Self Spaced Repetition) */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                    gap: '12px'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Recalled during today's study?
                  </span>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => reviewMistake(m.id, 'correct')}
                    >
                      <CheckCircle2 size={14} /> Correct (Extend Interval)
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => reviewMistake(m.id, 'wrong')}
                    >
                      <XCircle size={14} /> Wrong (Reset to Day 1)
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-subtle"
                      onClick={() => reviewMistake(m.id, 'still_confused')}
                    >
                      <HelpCircle size={14} /> Still Confused
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

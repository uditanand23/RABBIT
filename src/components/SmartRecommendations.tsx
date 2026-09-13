import React from 'react';
import { useApp } from '../context/AppContext';
import { RecommendationAction, QuickStudyModeId } from '../types';
import { getTodayDateString } from '../services/storage';
import { IntelligenceEngine } from '../services/intelligenceEngine';
import {
  Compass,
  Zap,
  Play,
  RotateCcw,
  AlertTriangle,
  BookOpen,
  Target,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

interface SmartRecommendationsProps {
  onNavigate: (tab: any) => void;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ onNavigate }) => {
  const { chapters, mistakes, todayMcqGoal, profile } = useApp();

  // Deterministic Recommendation Engine (No fake AI)
  const action: RecommendationAction = IntelligenceEngine.getNextAction(
    chapters,
    mistakes,
    todayMcqGoal,
    profile
  );
  // Quick Study Modes definitions
  const quickModes: Array<{
    id: QuickStudyModeId;
    title: string;
    duration: string;
    desc: string;
    targetTab: string;
  }> = [
    {
      id: '15_MIN_QUICK_REVISION',
      title: '15 Min Quick Revision',
      duration: '15m',
      desc: 'Rapidly review pending revision topics or flash concepts.',
      targetTab: 'study'
    },
    {
      id: '30_MIN_FOCUSED_SESSION',
      title: '30 Min Focused Block',
      duration: '30m',
      desc: 'Deep study block using the persistent timer.',
      targetTab: 'home'
    },
    {
      id: 'LOW_ENERGY_MODE',
      title: 'Low Energy Mode',
      duration: '20m',
      desc: 'NCERT biology line-by-line reading or casual flash recall.',
      targetTab: 'study'
    },
    {
      id: 'MISTAKE_REVIEW',
      title: 'Mistake Review',
      duration: '20m',
      desc: 'Clear out overdue errors from your Mistake Notebook.',
      targetTab: 'mistakes'
    },
    {
      id: 'PYQ_SPRINT',
      title: 'PYQ Sprint',
      duration: '25m',
      desc: 'Solve authentic previous years questions.',
      targetTab: 'pyqs'
    },
    {
      id: 'MCQ_SPRINT',
      title: 'MCQ 25 Sprint',
      duration: '30m',
      desc: 'Fast 25-question practice block toward your daily 100.',
      targetTab: 'mcqs'
    }
  ];

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* WHAT SHOULD I DO NOW? Card */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF',
          border: '1px solid #334155',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Compass size={18} color="#10B981" />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', color: '#10B981', textTransform: 'uppercase' }}>
                WHAT SHOULD I DO NOW?
              </span>
              <span className="badge badge-gray" style={{ fontSize: '0.65rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#CBD5E1' }}>
                {action.estimatedMinutes} Mins
              </span>
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              {action.actionTitle}
            </h2>

            <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
              {action.actionSubtitle} — <span style={{ color: '#E2E8F0' }}>{action.reason}</span>
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate(action.navTarget)}
            style={{
              backgroundColor: '#10B981',
              color: '#064E3B',
              fontWeight: 800,
              padding: '12px 24px',
              border: 'none',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
            }}
          >
            {action.buttonLabel} <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Quick Study Modes Bar */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Zap size={18} color="var(--primary-600)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
            Quick Study Modes
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
          {quickModes.map(mode => (
            <button
              key={mode.id}
              type="button"
              onClick={() => onNavigate(mode.targetTab)}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              className="card-clickable"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  {mode.title}
                </span>
                <span className="badge badge-gray" style={{ fontSize: '0.65rem' }}>
                  {mode.duration}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                {mode.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

import { Achievement } from '../types';

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-streak-7',
    title: '7-Day Study Streak',
    description: 'Studied or solved MCQs for 7 consecutive days without breaking discipline.',
    icon: '🔥',
    threshold: 7,
    progress: 0,
    currentValue: 0
  },
  {
    id: 'ach-streak-30',
    title: '30-Day Relentless Habit',
    description: 'Maintained 30 continuous days of genuine self-study.',
    icon: '⚡',
    threshold: 30,
    progress: 0,
    currentValue: 0
  },
  {
    id: 'ach-mcq-100',
    title: 'Centurion: 100 MCQs',
    description: 'Solved your first 100 questions with authentic answer validation.',
    icon: '🎯',
    threshold: 100,
    progress: 0,
    currentValue: 0
  },
  {
    id: 'ach-mcq-1000',
    title: '1,000 MCQs Milestone',
    description: 'Crossed 1,000 solved NEET questions across physics, chemistry, and biology.',
    icon: '🛡️',
    threshold: 1000,
    progress: 0,
    currentValue: 0
  },
  {
    id: 'ach-mcq-10000',
    title: '10,000 Questions Master',
    description: 'Completed 10,000 practice questions. Serious preparation depth achieved.',
    icon: '👑',
    threshold: 10000,
    progress: 0,
    currentValue: 0
  },
  {
    id: 'ach-pyq-100',
    title: '100 Authentic PYQs',
    description: 'Conquered 100 official previous years questions.',
    icon: '📜',
    threshold: 100,
    progress: 0,
    currentValue: 0
  },
  {
    id: 'ach-study-100h',
    title: '100 Hours of Pure Focus',
    description: 'Logged 100 hours of focused study time through the study timer.',
    icon: '⏳',
    threshold: 100,
    progress: 0,
    currentValue: 0
  },
  {
    id: 'ach-accuracy-90',
    title: 'Precision Marksman (90% Accuracy)',
    description: 'Maintained ≥90% accuracy across a minimum of 200 answered questions.',
    icon: '💎',
    threshold: 90,
    progress: 0,
    currentValue: 0
  }
];

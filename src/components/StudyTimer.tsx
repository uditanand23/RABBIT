import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Clock, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/storage';
import { SubjectId } from '../types';

export const StudyTimer: React.FC = () => {
  const { chapters, addStudyLog } = useApp();

  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('physics');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [topicName, setTopicName] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [doubts, setDoubts] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);

  const timerRef = useRef<number | null>(null);

  // Restore saved timer on mount
  useEffect(() => {
    const saved = StorageService.getActiveTimer();
    if (saved) {
      if (saved.isRunning && saved.startTime) {
        const diffSeconds = Math.floor((Date.now() - saved.startTime) / 1000);
        setElapsedSeconds(saved.elapsedSeconds + diffSeconds);
        setIsRunning(true);
      } else {
        setElapsedSeconds(saved.elapsedSeconds);
        setIsRunning(false);
      }
      if (saved.subjectId) setSelectedSubject(saved.subjectId as SubjectId);
      if (saved.chapterId) setSelectedChapterId(saved.chapterId);
      if (saved.topicName) setTopicName(saved.topicName);
    }
  }, []);

  // Filter chapters by selected subject
  const subjectChapters = chapters.filter(c => c.subjectId === selectedSubject);

  // Set default chapter when subject changes if not already matching
  useEffect(() => {
    if (subjectChapters.length > 0 && !subjectChapters.some(c => c.id === selectedChapterId)) {
      setSelectedChapterId(subjectChapters[0].id);
    }
  }, [selectedSubject, chapters]);

  // Interval handler
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds(prev => {
          const next = prev + 1;
          StorageService.saveActiveTimer({
            isRunning: true,
            elapsedSeconds: next,
            startTime: Date.now(),
            subjectId: selectedSubject,
            chapterId: selectedChapterId,
            topicName
          });
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, selectedSubject, selectedChapterId, topicName]);

  const handleStart = () => {
    setIsRunning(true);
    StorageService.saveActiveTimer({
      isRunning: true,
      elapsedSeconds,
      startTime: Date.now(),
      subjectId: selectedSubject,
      chapterId: selectedChapterId,
      topicName
    });
  };

  const handlePause = () => {
    setIsRunning(false);
    StorageService.saveActiveTimer({
      isRunning: false,
      elapsedSeconds,
      startTime: null,
      subjectId: selectedSubject,
      chapterId: selectedChapterId,
      topicName
    });
  };

  const handleStop = () => {
    setIsRunning(false);
    if (elapsedSeconds >= 60) {
      // Prompt user to save log
      setShowLogModal(true);
    } else {
      // Less than 1 minute, confirm discard or log anyway
      if (confirm('Session is less than 1 minute. Discard this session?')) {
        handleReset();
      } else {
        setShowLogModal(true);
      }
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    StorageService.clearActiveTimer();
  };

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const chapterObj = chapters.find(c => c.id === selectedChapterId);
    const completedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

    addStudyLog({
      subjectId: selectedSubject,
      chapterId: selectedChapterId,
      chapterName: chapterObj ? chapterObj.name : 'General Study',
      topicName: topicName.trim() || undefined,
      minutes: completedMinutes,
      notes: sessionNotes.trim(),
      doubtsIdentified: doubts.trim() || undefined
    });

    // Reset
    setShowLogModal(false);
    handleReset();
    setSessionNotes('');
    setDoubts('');
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={20} color="var(--primary-600)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Focused Study Timer
          </h3>
        </div>
        {isRunning && (
          <span className="badge badge-green">
            ● Active Session
          </span>
        )}
      </div>

      {/* Digits Display */}
      <div
        style={{
          textAlign: 'center',
          padding: '24px 16px',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '20px',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '2.8rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '0.04em'
          }}
        >
          {formatTime(elapsedSeconds)}
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          {isRunning ? 'Stay focused on your concept. No multitasking.' : elapsedSeconds > 0 ? 'Session paused' : 'Ready to record actual study time'}
        </p>
      </div>

      {/* Target Subject / Chapter Selection */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        <div>
          <label className="form-label" style={{ fontSize: '0.78rem' }}>Subject</label>
          <select
            className="form-select"
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value as SubjectId)}
            disabled={isRunning}
            style={{ fontSize: '0.825rem', padding: '8px 10px' }}
          >
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="botany">Botany</option>
            <option value="zoology">Zoology</option>
          </select>
        </div>

        <div>
          <label className="form-label" style={{ fontSize: '0.78rem' }}>Chapter</label>
          <select
            className="form-select"
            value={selectedChapterId}
            onChange={e => setSelectedChapterId(e.target.value)}
            disabled={isRunning}
            style={{ fontSize: '0.825rem', padding: '8px 10px' }}
          >
            {subjectChapters.map(c => (
              <option key={c.id} value={c.id}>
                Class {c.classLevel}: {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {!isRunning ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleStart}
            style={{ flex: 1, padding: '12px' }}
          >
            <Play size={18} /> {elapsedSeconds > 0 ? 'Resume Study' : 'Start Study Session'}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePause}
            style={{ flex: 1, padding: '12px' }}
          >
            <Pause size={18} /> Pause
          </button>
        )}

        {elapsedSeconds > 0 && (
          <button
            type="button"
            className="btn btn-subtle"
            onClick={handleStop}
            style={{ padding: '12px 18px' }}
            title="Finish and log session"
          >
            <Square size={18} /> Finish Session
          </button>
        )}
      </div>

      {/* Modal: Save Study Session Log */}
      {showLogModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
              Log Study Session
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Completed <strong>{Math.max(1, Math.round(elapsedSeconds / 60))} minutes</strong> of study.
            </p>

            <form onSubmit={handleSaveLog}>
              <div className="form-group">
                <label className="form-label">Specific Topic (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Friction and Banking of roads"
                  value={topicName}
                  onChange={e => setTopicName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Key Takeaways & Formulas (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Summarize key concepts learned, problem types solved..."
                  value={sessionNotes}
                  onChange={e => setSessionNotes(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Doubts / Unclear Concepts (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Note down points needing mentor review or textbook re-read..."
                  value={doubts}
                  onChange={e => setDoubts(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowLogModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  <CheckCircle2 size={16} /> Save to Study Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

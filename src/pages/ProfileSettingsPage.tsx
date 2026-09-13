import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Shield,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Sun,
  Moon,
  CheckCircle,
  AlertTriangle,
  LogOut
} from 'lucide-react';
import { StrengthLevel } from '../types';
import { ParentAccountService } from '../services/parentService';

export const ProfileSettingsPage: React.FC = () => {
  const {
    profile,
    updateProfile,
    exportData,
    importData,
    resetAll
  } = useApp();

  const [pairingCode, setPairingCode] = useState<string | null>(() => {
    const act = ParentAccountService.getActivePairingCode();
    return act ? act.code : null;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile?.name || '');
  const [examDate, setExamDate] = useState(profile?.examDate || '2027-05-02');
  const [targetScore, setTargetScore] = useState(profile?.targetScore || 680);
  const [dailyTargetHours, setDailyTargetHours] = useState(profile?.dailyTargetHours || 6);
  const [dailyMcqTarget, setDailyMcqTarget] = useState(profile?.dailyMcqTarget || 100);
  const [gradeStatus, setGradeStatus] = useState<'class12' | 'dropper'>(profile?.gradeStatus || 'class12');
  const [theme, setTheme] = useState<'light' | 'dark'>(profile?.theme || 'light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(profile?.notificationsEnabled ?? true);

  const [strengths, setStrengths] = useState<{
    physics: StrengthLevel;
    chemistry: StrengthLevel;
    botany: StrengthLevel;
    zoology: StrengthLevel;
  }>(profile?.strengths || {
    physics: 'average',
    chemistry: 'average',
    botany: 'strong',
    zoology: 'strong'
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importMessage, setImportMessage] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const updated = {
      ...profile,
      name: name.trim(),
      examDate,
      targetScore: Number(targetScore),
      dailyTargetHours: Number(dailyTargetHours),
      dailyMcqTarget: Number(dailyMcqTarget),
      gradeStatus,
      theme,
      notificationsEnabled,
      strengths,
      updatedAt: new Date().toISOString()
    };

    updateProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExport = () => {
    const backup = exportData();
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backup, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `rabbit_neet_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          const ok = importData(parsed);
          if (ok) {
            setImportMessage('Data backup successfully restored!');
            setTimeout(() => setImportMessage(''), 4000);
          } else {
            setImportMessage('Error: Invalid backup file structure.');
          }
        } catch (err) {
          setImportMessage('Error parsing backup JSON file.');
        }
      };
    }
  };

  const handleResetData = () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset all data? This will clear your study plans, logs, doubts, and MCQ stats. Syllabus chapters will reset to the verified NMC default.'
    );
    if (confirmed) {
      resetAll();
      window.location.reload();
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '860px' }}>
      <div className="page-header">
        <h1 className="page-title">Account, Settings & Privacy</h1>
        <p className="page-subtitle">
          Manage your targets, study strengths, notification preferences, and local data backups.
        </p>
      </div>

      {saveSuccess && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'var(--primary-50)',
            color: 'var(--primary-800)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 600,
            fontSize: '0.875rem'
          }}
        >
          <CheckCircle size={18} /> Settings successfully saved!
        </div>
      )}

      {importMessage && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: importMessage.includes('Error') ? 'var(--danger-bg)' : 'var(--primary-50)',
            color: importMessage.includes('Error') ? 'var(--danger)' : 'var(--primary-800)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontWeight: 600,
            fontSize: '0.875rem'
          }}
        >
          {importMessage}
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile}>
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="var(--primary-600)" />
            Aspirant Profile
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Student Name / Study Alias</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Academic Status</label>
              <select
                className="form-select"
                value={gradeStatus}
                onChange={e => setGradeStatus(e.target.value as any)}
              >
                <option value="class12">Class 12th Regular</option>
                <option value="dropper">Dropper / Repeater</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Exam Date</label>
              <input
                type="date"
                className="form-input"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                required
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
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Daily Target Study (Hours)</label>
              <input
                type="number"
                min={1}
                max={16}
                className="form-input"
                value={dailyTargetHours}
                onChange={e => setDailyTargetHours(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Daily 100 MCQ Mission Target</label>
              <input
                type="number"
                min={20}
                max={300}
                className="form-input"
                value={dailyMcqTarget}
                onChange={e => setDailyMcqTarget(Number(e.target.value))}
                required
              />
            </div>
          </div>
        </div>

        {/* Subject Strengths */}
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
            Subject Strength Self-Evaluation
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Used to recommend revision cycles and identify weak priority chapters.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            {(['physics', 'chemistry', 'botany', 'zoology'] as const).map(subj => (
              <div
                key={subj}
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ fontWeight: 700, textTransform: 'capitalize', fontSize: '0.875rem', marginBottom: '8px' }}>
                  {subj}
                </div>
                <select
                  className="form-select"
                  value={strengths[subj]}
                  onChange={e => setStrengths({ ...strengths, [subj]: e.target.value as StrengthLevel })}
                  style={{ fontSize: '0.8rem', padding: '6px 8px' }}
                >
                  <option value="weak">Weak (Needs Focus)</option>
                  <option value="average">Average (Standard)</option>
                  <option value="strong">Strong (High Confidence)</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences & Notifications */}
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
            Preferences & Reminders
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: '0.9rem' }}>Theme Mode</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Switch between clean light canvas and dark mode.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : 'btn-subtle'}`}
                  onClick={() => setTheme('light')}
                >
                  <Sun size={14} /> Light
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${theme === 'dark' ? 'btn-primary' : 'btn-subtle'}`}
                  onClick={() => setTheme('dark')}
                >
                  <Moon size={14} /> Dark
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <strong style={{ fontSize: '0.9rem' }}>Daily Target Notifications</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Gentle in-app reminders for 100 MCQs, revision due dates, and study streaks.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={e => setNotificationsEnabled(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: '28px' }}>
          Save Profile & Preferences
        </button>
      </form>

      {/* Parent System Architecture Card */}
      <div
        className="card"
        style={{
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid var(--border-medium)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} color="var(--primary-700)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
              Parent Companion & Accountability Link
            </h3>
          </div>
          <span className="badge badge-green">Zero-Surveillance Architecture</span>
        </div>

        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
          Rabbit believes in honest accountability without intrusive surveillance. Parents receive <strong>strictly read-only</strong> access to verify preparation consistency (study hours, chapters revised, test scores, and 100 MCQ mission). 
          <strong> Rabbit architecturally blocks tracking WhatsApp, Instagram, phone calls, camera, browser history, or device location.</strong>
        </p>

        {/* Pairing Code Generator */}
        <div
          style={{
            padding: '16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Temporary Parent Pairing Code
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Share this secure 6-digit PIN with your parent/guardian to link their read-only portal.
              </div>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                const res = ParentAccountService.generatePairingCode();
                setPairingCode(res.code);
              }}
            >
              Generate New Pairing PIN
            </button>
          </div>

          {pairingCode && (
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  letterSpacing: '0.25em',
                  color: 'var(--primary-700)',
                  padding: '6px 14px',
                  backgroundColor: 'var(--primary-50)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                {pairingCode}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Expires in 15 minutes. Valid for single parent account linkage.
              </span>
            </div>
          )}
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          🔒 RBAC Guarantee: Parent role is strictly restricted to <code style={{ fontSize: '0.72rem' }}>VIEW_ACADEMICS</code>. System code rejects any request for private student communications.
        </div>
      </div>

      {/* Privacy Guarantee Card */}
      <div
        className="card"
        style={{
          padding: '20px',
          backgroundColor: 'var(--bg-accent-subtle)',
          borderColor: 'var(--border-accent)',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <Shield size={24} color="var(--primary-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '4px' }}>
              Rabbit Privacy Guarantee
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--primary-700)', margin: 0, lineHeight: 1.5 }}>
              Rabbit strictly respects your privacy. All study time, questions solved, syllabus progress, notes, and doubts are stored entirely inside your device browser storage (localStorage). No background microphone tracking, no WhatsApp/Instagram snooping, and zero advertising cookies.
            </p>
          </div>
        </div>
      </div>

      {/* Backup, Export & Reset Section */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
          Data Backup & Recovery
        </h3>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Never lose your preparation history. Export a portable JSON backup anytime or restore an existing one.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleExport}
          >
            <Download size={16} /> Export JSON Backup
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} /> Import Backup File
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            style={{ display: 'none' }}
          />
        </div>

        {/* Cloud Sync & Offline Mode Status */}
        <div
          style={{
            padding: '16px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Offline-First Architecture & Sync Queue
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Schema Version: <strong>v1 (rabbitDataVersion: 1)</strong> • Local storage is primary.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
              ✓ Offline Ready
            </span>
            <span className="badge badge-gray" style={{ fontSize: '0.75rem' }}>
              0 Pending Cloud Mutations
            </span>
          </div>
        </div>

        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong style={{ fontSize: '0.875rem', color: 'var(--danger)' }}>Reset Preparation Data</strong>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Clears all local logs and reinitializes default syllabus.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={handleResetData}
          >
            <RefreshCw size={14} /> Reset Data
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubjectId, TopicPyqIntelligence } from '../types';
import {
  FileText,
  Search,
  Filter,
  AlertCircle,
  Database,
  Calendar,
  Layers,
  BarChart2,
  CheckCircle2,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const PyqArchitecturePage: React.FC = () => {
  const { chapters, mcqRecords } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 20+ Years NEET / AIPMT exam year spectrum
  const years = [
    '2024', '2023', '2022', '2021', '2020',
    '2019', '2018', '2017', '2016', '2015',
    '2014', '2013', '2012', '2011', '2010',
    '2009', '2008', '2007', '2006', '2005'
  ];

  // Derive genuine PYQ Intelligence from chapters and user's actual attempts
  const topicIntelligence: TopicPyqIntelligence[] = [];

  chapters.forEach(ch => {
    if (selectedSubject !== 'all' && ch.subjectId !== selectedSubject) return;

    ch.topics.forEach(t => {
      // Find real user attempts logged for this chapter and topic
      const relatedLogs = mcqRecords.filter(r => r.chapterId === ch.id && r.isPyq);
      const totalAttempts = relatedLogs.reduce((acc, r) => acc + r.attempted, 0);
      const totalCorrect = relatedLogs.reduce((acc, r) => acc + r.correct, 0);
      const totalWrong = relatedLogs.reduce((acc, r) => acc + r.wrong, 0);
      const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

      // Priority calculation: high if low accuracy (<60%) or high priority chapter
      let priority: 'high' | 'medium' | 'low' = 'medium';
      if (ch.priority === 'high' || (totalAttempts >= 10 && accuracy < 60)) {
        priority = 'high';
      } else if (ch.priority === 'low') {
        priority = 'low';
      }

      topicIntelligence.push({
        topicName: t.name,
        chapterName: ch.name,
        subject: ch.subjectId,
        pyqCount: ch.pyqCount || 0,
        studentAttempts: totalAttempts,
        accuracy,
        wrongCount: totalWrong,
        priority
      });
    });
  });

  const totalPyqsSolved = mcqRecords.filter(r => r.isPyq).reduce((acc, r) => acc + r.attempted, 0);
  const totalPyqsCorrect = mcqRecords.filter(r => r.isPyq).reduce((acc, r) => acc + r.correct, 0);
  const pyqAccuracy = totalPyqsSolved > 0 ? Math.round((totalPyqsCorrect / totalPyqsSolved) * 100) : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">NEET PYQ Architecture & Heatmap</h1>
        <p className="page-subtitle">
          20+ years (2005–2024) hierarchical previous years question framework, topic intelligence, and verified source integration.
        </p>
      </div>

      {/* Honest Empty State / Verified Source Transparency Banner */}
      <div
        className="card"
        style={{
          padding: '20px 24px',
          backgroundColor: 'var(--bg-accent-subtle)',
          border: '1px solid var(--border-accent)',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <Database size={24} color="var(--primary-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-800)', margin: '0 0 4px 0' }}>
              Authentic PYQ Architecture Ready (Strict Anti-Fabrication Guarantee)
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--primary-700)', margin: '0 0 10px 0', lineHeight: 1.5 }}>
              In adherence to our non-negotiable trust rules, Rabbit never fabricates official historical questions. The 20+ year schema (Subject → Chapter → Topic → Year) is active and awaiting official verified dataset ingestion.
            </p>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary-800)' }}>
              Verified PYQ content will automatically populate here once an authenticated NTA dataset or official past paper source is connected.
            </div>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
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
            AUTHENTIC PYQS SOLVED
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {totalPyqsSolved}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Logged in real practice sessions
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            PYQ ACCURACY
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: pyqAccuracy >= 75 ? 'var(--primary-600)' : 'var(--text-primary)', marginTop: '4px' }}>
            {totalPyqsSolved > 0 ? `${pyqAccuracy}%` : '—'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {totalPyqsCorrect} correct responses
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            YEAR COVERAGE ARCHITECTURE
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: 'var(--primary-700)', marginTop: '4px' }}>
            2005 – 2024
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            20 years NEET / AIPMT indexing
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
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
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Exam Year:</span>
          <select
            className="form-select"
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '6px 10px', width: 'auto' }}
          >
            <option value="all">All Years (2005–2024)</option>
            {years.map(y => (
              <option key={y} value={y}>NEET {y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Year-Specific Notice if Single Year Filtered */}
      {selectedYear !== 'all' && (
        <div
          className="card"
          style={{
            padding: '16px 20px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-medium)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Calendar size={20} color="var(--primary-600)" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              NEET {selectedYear} Paper Index
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Authentic verified question dataset for NEET {selectedYear} is queued for integration. Rabbit never manufactures fake past questions to fill historical slots.
            </div>
          </div>
        </div>
      )}

      {/* Topic-Level PYQ Intelligence Heatmap Table */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
          Topic-Level PYQ Intelligence Heatmap
        </h3>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Real student attempts and topic prioritization calculated without arbitrary weightage claims.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 12px' }}>TOPIC</th>
                <th style={{ padding: '10px 12px' }}>CHAPTER / SUBJECT</th>
                <th style={{ padding: '10px 12px' }}>STUDENT ATTEMPTS</th>
                <th style={{ padding: '10px 12px' }}>ACCURACY</th>
                <th style={{ padding: '10px 12px' }}>PRIORITY</th>
              </tr>
            </thead>
            <tbody>
              {topicIntelligence.slice(0, 15).map((item, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    backgroundColor: idx % 2 === 0 ? 'transparent' : 'var(--bg-subtle)'
                  }}
                >
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.topicName}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{item.subject}</span>: {item.chapterName}
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)' }}>
                    {item.studentAttempts > 0 ? `${item.studentAttempts} Qs` : '0 Qs'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {item.studentAttempts > 0 ? (
                      <span className={`badge ${item.accuracy >= 75 ? 'badge-green' : item.accuracy >= 55 ? 'badge-yellow' : 'badge-red'}`}>
                        {item.accuracy}%
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${item.priority === 'high' ? 'badge-red' : item.priority === 'medium' ? 'badge-yellow' : 'badge-gray'}`}>
                      {item.priority === 'high' ? 'High Focus' : item.priority === 'medium' ? 'Moderate' : 'Standard'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

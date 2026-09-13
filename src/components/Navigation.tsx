import { Home, BookOpen, Target, BarChart2, User, Clock, CheckCircle2, Award, AlertOctagon, Database } from 'lucide-react';

export type NavTab = 'home' | 'study' | 'mcqs' | 'tests' | 'mistakes' | 'pyqs' | 'progress' | 'profile';

interface NavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  streak: number;
}

export const Sidebar: React.FC<NavigationProps> = ({ currentTab, onTabChange, streak }) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home size={19} /> },
    { id: 'study', label: 'Study & Planner', icon: <BookOpen size={19} /> },
    { id: 'mcqs', label: 'Daily MCQs', icon: <Target size={19} /> },
    { id: 'tests', label: 'Test Series', icon: <Award size={19} /> },
    { id: 'mistakes', label: 'Mistake Notebook', icon: <AlertOctagon size={19} /> },
    { id: 'pyqs', label: 'PYQs & Heatmap', icon: <Database size={19} /> },
    { id: 'progress', label: 'Master Map', icon: <BarChart2 size={19} /> },
    { id: 'profile', label: 'Profile & Data', icon: <User size={19} /> }
  ];

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '260px',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 30,
        padding: '24px 16px'
      }}
      className="hidden-mobile"
    >
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px 24px 8px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.2rem',
            letterSpacing: '-0.03em'
          }}
        >
          R
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            RABBIT
            <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', fontWeight: 700 }}>
              NEET V1
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Self-Study Companion</div>
        </div>
      </div>

      {/* Nav List */}
      <nav style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {navItems.map(item => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
                color: isActive ? 'var(--primary-700)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ color: isActive ? 'var(--primary-600)' : 'var(--text-muted)' }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Real Streak Indicator */}
      <div
        style={{
          padding: '14px',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Active Streak</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: streak > 0 ? 'var(--primary-600)' : 'var(--text-muted)' }}>
            🔥 {streak} {streak === 1 ? 'Day' : 'Days'}
          </span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
          {streak > 0 ? 'Consistent effort brings mastery.' : 'Complete today’s log or MCQs to ignite streak.'}
        </p>
      </div>
    </aside>
  );
};

export const MobileBottomNav: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home size={18} /> },
    { id: 'study', label: 'Study', icon: <BookOpen size={18} /> },
    { id: 'mcqs', label: 'MCQs', icon: <Target size={18} /> },
    { id: 'progress', label: 'Progress', icon: <BarChart2 size={18} /> },
    { id: 'profile', label: 'Profile', icon: <User size={18} /> }
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 40,
        padding: '0 8px'
      }}
      className="mobile-only-nav"
    >
      {navItems.map(item => {
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              padding: '6px 8px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? 'var(--primary-600)' : 'var(--text-muted)'
            }}
          >
            {item.icon}
            <span style={{ fontSize: '0.68rem', fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar, MobileBottomNav, NavTab } from './components/Navigation';
import { OnboardingModal } from './components/OnboardingModal';
import { HomeDashboard } from './pages/HomeDashboard';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { McqCenterPage } from './pages/McqCenterPage';
import { TestSeriesPage } from './pages/TestSeriesPage';
import { MistakeNotebookPage } from './pages/MistakeNotebookPage';
import { PyqArchitecturePage } from './pages/PyqArchitecturePage';
import { MasterProgressMapPage } from './pages/MasterProgressMapPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';

export const App: React.FC = () => {
  const { profile, updateProfile, streak } = useApp();
  const [currentTab, setCurrentTab] = useState<NavTab>('home');

  return (
    <div className="app-container">
      {/* Onboarding trigger if first visit or no profile */}
      {(!profile || !profile.onboarded) && (
        <OnboardingModal onComplete={updateProfile} />
      )}

      {/* Desktop Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        streak={streak}
      />

      {/* Main Routed Content Area */}
      <main className="main-content">
        {currentTab === 'home' && <HomeDashboard onNavigate={setCurrentTab} />}
        {currentTab === 'study' && <StudyPlannerPage />}
        {currentTab === 'mcqs' && <McqCenterPage onNavigate={setCurrentTab} />}
        {currentTab === 'tests' && <TestSeriesPage onNavigate={setCurrentTab} />}
        {currentTab === 'mistakes' && <MistakeNotebookPage />}
        {currentTab === 'pyqs' && <PyqArchitecturePage />}
        {currentTab === 'progress' && <MasterProgressMapPage />}
        {currentTab === 'profile' && <ProfileSettingsPage />}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        streak={streak}
      />
    </div>
  );
};

export default App;

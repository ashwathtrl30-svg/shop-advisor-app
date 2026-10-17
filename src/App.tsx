import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useTranslation } from './hooks/useTranslation';

// Onboarding screens
import LanguageScreen from './components/onboarding/LanguageScreen';
import WelcomeScreen from './components/onboarding/WelcomeScreen';
import PhoneScreen from './components/onboarding/PhoneScreen';
import OTPScreen from './components/onboarding/OTPScreen';
import InterviewScreen from './components/onboarding/InterviewScreen';
import ProfileSummaryScreen from './components/onboarding/ProfileSummaryScreen';
import TourScreen from './components/onboarding/TourScreen';

// Main app screens
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import HomeScreen from './components/HomeScreen';
import InsightsScreen from './components/InsightsScreen';
import AskScreen from './components/AskScreen';
import ToolsScreen from './components/tools/ToolsScreen';
import LearnScreen from './components/learn/LearnScreen';
import AlertsScreen from './components/AlertsScreen';
import UndoBar from './components/UndoBar';

function AppContent() {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize dark mode from system preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark && !state.language) {
      dispatch({ type: 'TOGGLE_DARK_MODE' });
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else if (!state.language) {
      document.documentElement.classList.add('light');
    }
  }, []);

  // Apply dark mode when state changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode);
    document.documentElement.classList.toggle('light', !state.darkMode);
  }, [state.darkMode]);

  // Render onboarding screens
  const renderOnboarding = () => {
    switch (state.onboardingStep) {
      case 'language':
        return <LanguageScreen />;
      case 'welcome':
        return <WelcomeScreen />;
      case 'phone':
        return <PhoneScreen />;
      case 'otp':
        return <OTPScreen />;
      case 'interview':
        return <InterviewScreen questionNumber={state.currentQuestion} />;
      case 'profile-summary':
        return <ProfileSummaryScreen />;
      case 'tour':
        return <TourScreen />;
      default:
        return null;
    }
  };

  // If onboarding is not complete, show onboarding flow
  if (state.onboardingStep !== 'complete') {
    return (
      <div style={{
        minHeight: '100vh',
        maxWidth: '480px',
        margin: '0 auto',
        backgroundColor: 'var(--color-bg)',
      }}>
        {renderOnboarding()}
      </div>
    );
  }

  // Main app (after onboarding)
  const renderMainScreen = () => {
    // Check if we're showing alerts screen
    if (state.showScreen === 'alerts') {
      return <AlertsScreen />;
    }

    switch (state.activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'insights':
        return <InsightsScreen />;
      case 'ask':
        return <AskScreen />;
      case 'tools':
        return <ToolsScreen />;
      case 'learn':
        return <LearnScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      maxWidth: '480px',
      margin: '0 auto',
      position: 'relative',
      backgroundColor: 'var(--color-bg)',
    }}>
      {/* Top Bar */}
      <TopBar isOffline={isOffline} />

      {/* Main Content */}
      <main className="content-with-nav">
        {renderMainScreen()}
      </main>

      {/* Undo Bar */}
      <UndoBar />

      {/* Bottom Navigation */}
      <BottomNav 
        activeTab={state.activeTab} 
        onTabChange={(tab) => dispatch({ type: 'SET_TAB', payload: tab })} 
      />
    </div>
  );
}

function PlaceholderScreen({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
  return (
    <div style={{
      padding: 'var(--space-2xl) var(--space-lg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      minHeight: '60vh',
      gap: 'var(--space-md)',
    }}>
      <span style={{ fontSize: '64px' }}>{emoji}</span>
      <h2 className="text-heading-1" style={{ margin: 0 }}>{title}</h2>
      <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', margin: 0, maxWidth: '300px' }}>
        {subtitle}
      </p>
      <p className="text-body-sm" style={{ color: 'var(--color-text-muted)', margin: 0, marginTop: 'var(--space-lg)' }}>
        Coming in Phase 4
      </p>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

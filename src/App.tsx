import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import HomeScreen from './components/HomeScreen';
import DesignSystemShowcase from './components/DesignSystemShowcase';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showDesignSystem, setShowDesignSystem] = useState(false);

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

  // Dark mode toggle
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    document.documentElement.classList.toggle('light', !newMode);
  };

  // Initialize dark mode from system preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, []);

  const renderScreen = () => {
    if (showDesignSystem) {
      return <DesignSystemShowcase />;
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'ask':
        return <PlaceholderScreen emoji="💬" title="Ask Anything" subtitle="Type or speak your question. I'll give you a simple answer based on your shop's data." />;
      case 'tools':
        return <PlaceholderScreen emoji="🧰" title="Tools" subtitle="Simple tools for your shop — stock check, udhaar reminder, daily report." />;
      case 'learn':
        return <PlaceholderScreen emoji="📚" title="Learn" subtitle="Short lessons to grow your shop. 2 minutes each. No jargon." />;
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
      <TopBar darkMode={darkMode} onToggleDark={toggleDarkMode} isOffline={isOffline} />

      {/* Design System Toggle (for demo purposes) */}
      <div style={{ padding: '0 var(--space-lg)', marginBottom: 'var(--space-sm)' }}>
        <button
          onClick={() => setShowDesignSystem(!showDesignSystem)}
          style={{
            background: showDesignSystem ? 'var(--color-accent)' : 'var(--color-primary-light)',
            color: showDesignSystem ? 'white' : 'var(--color-primary)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'var(--font-family)',
            cursor: 'pointer',
          }}
        >
          {showDesignSystem ? '← Back to App' : '🎨 View Design System'}
        </button>
      </div>

      {/* Main Content */}
      <main className="content-with-nav">
        {renderScreen()}
      </main>

      {/* Bottom Navigation */}
      {!showDesignSystem && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}
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
        Coming in Phase 2
      </p>
    </div>
  );
}

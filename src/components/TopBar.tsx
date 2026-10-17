import React from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

interface TopBarProps {
  isOffline: boolean;
}

export default function TopBar({ isOffline }: TopBarProps) {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
    const isDark = !state.darkMode;
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  };

  const openAlerts = () => {
    dispatch({ type: 'SET_SCREEN', payload: 'alerts' });
  };

  // Get shopkeeper name from profile or use default
  const shopName = state.shopProfile.shopName || 'Dost';

  return (
    <>
      {isOffline && (
        <div className="offline-banner" role="alert">
          📡 {t('offline')}
        </div>
      )}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-md) var(--space-lg)',
        paddingTop: 'var(--space-lg)',
      }}>
        {/* Left: Greeting */}
        <div>
          <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            {t('homeGreeting')} 🙏
          </p>
          <h1 className="text-heading-2" style={{ margin: 0 }}>
            {shopName}
          </h1>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          {/* Alerts bell */}
          <button
            onClick={openAlerts}
            aria-label="Alerts"
            style={{
              width: 'var(--touch-target)',
              height: 'var(--touch-target)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              fontSize: '20px',
              position: 'relative',
            }}
          >
            🔔
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label={state.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              width: 'var(--touch-target)',
              height: 'var(--touch-target)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              fontSize: '20px',
            }}
          >
            {state.darkMode ? '☀️' : '🌙'}
          </button>

          {/* Profile */}
          <button
            aria-label="Profile"
            style={{
              width: 'var(--touch-target)',
              height: 'var(--touch-target)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--color-primary)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              color: 'white',
              fontWeight: 700,
              fontSize: '18px',
              fontFamily: 'var(--font-family)',
            }}
          >
            {shopName.charAt(0).toUpperCase()}
          </button>
        </div>
      </header>
    </>
  );
}

import React from 'react';

interface TopBarProps {
  darkMode: boolean;
  onToggleDark: () => void;
  isOffline: boolean;
}

export default function TopBar({ darkMode, onToggleDark, isOffline }: TopBarProps) {
  return (
    <>
      {isOffline && (
        <div className="offline-banner" role="alert">
          📡 No internet — you can still use the app offline
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
            Namaste 🙏
          </p>
          <h1 className="text-heading-2" style={{ margin: 0 }}>
            Ramesh ji
          </h1>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
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
            {darkMode ? '☀️' : '🌙'}
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
            R
          </button>
        </div>
      </header>
    </>
  );
}

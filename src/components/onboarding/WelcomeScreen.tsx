import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';

export default function WelcomeScreen() {
  const { dispatch } = useApp();
  const { t } = useTranslation();

  const handleStart = () => {
    dispatch({ type: 'SET_STEP', payload: 'phone' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-xl)',
      gap: 'var(--space-2xl)',
    }}>
      {/* Illustration */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '80px', marginBottom: 'var(--space-lg)' }}>🏪</div>
        <h1 className="text-heading-1" style={{ margin: '0 0 var(--space-lg) 0', color: 'var(--color-primary)' }}>
          {t('welcomeTitle')}
        </h1>
        <p className="text-body-lg" style={{ color: 'var(--color-text-secondary)', margin: 0, maxWidth: '320px' }}>
          {t('welcomeSubtitle')}
        </p>
      </div>

      {/* Start Button */}
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <button onClick={handleStart} className="btn-primary" style={{ fontSize: '20px' }}>
          {t('startButton')}
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../i18n/translations';

export default function LanguageScreen() {
  const { dispatch } = useApp();

  const handleSelect = (lang: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
    dispatch({ type: 'SET_STEP', payload: 'welcome' });
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
      {/* Logo/Brand */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: 'var(--space-md)' }}>🏪</div>
        <h1 className="text-heading-1" style={{ margin: 0, color: 'var(--color-primary)' }}>
          DukaanDost
        </h1>
      </div>

      {/* Language Selection */}
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        <p className="text-body-lg" style={{ textAlign: 'center', margin: '0 0 var(--space-md) 0' }}>
          Choose Your Language
        </p>
        
        <button
          onClick={() => handleSelect('en')}
          className="btn-primary"
          style={{ fontSize: '24px', height: '80px' }}
        >
          English
        </button>

        <button
          onClick={() => handleSelect('hi')}
          className="btn-primary"
          style={{ fontSize: '24px', height: '80px' }}
        >
          हिंदी
        </button>
      </div>
    </div>
  );
}

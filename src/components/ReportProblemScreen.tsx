import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

export default function ReportProblemScreen() {
  const { dispatch } = useApp();
  const { lang } = useTranslation();
  const [errorLog, setErrorLog] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load last error from localStorage
    try {
      const saved = localStorage.getItem('dukaandost-last-error');
      if (saved) {
        const errorData = JSON.parse(saved);
        const formatted = `Error: ${errorData.message}\n\nTime: ${errorData.timestamp}\n\nStack: ${errorData.stack || 'No stack trace'}\n\nComponent: ${errorData.componentStack || 'Unknown'}`;
        setErrorLog(formatted);
      } else {
        setErrorLog(lang === 'hi' ? 'कोई त्रुटि नहीं मिली' : 'No errors found');
      }
    } catch (e) {
      setErrorLog(lang === 'hi' ? 'त्रुटि लोड नहीं हो सकी' : 'Could not load error log');
    }
  }, [lang]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(errorLog);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Could not copy:', e);
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_SCREEN', payload: 'profile' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-bg)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--space-md) var(--space-lg)',
        gap: 'var(--space-md)',
      }}>
        <button onClick={handleBack} className="btn-ghost" style={{ minWidth: 'auto', padding: '8px' }}>
          ←
        </button>
        <h1 className="text-heading-1" style={{ margin: 0 }}>
          {lang === 'hi' ? 'समस्या रिपोर्ट करें' : 'Report a problem'}
        </h1>
      </div>

      {/* Content */}
      <div style={{ padding: 'var(--space-lg)', flex: 1 }}>
        <p className="text-body-md" style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-text-secondary)' }}>
          {lang === 'hi' 
            ? 'यदि आपको कोई त्रुटि मिली है, तो कृपया नीचे दी गई जानकारी कॉपी करें और हमें भेजें।'
            : 'If you encountered an error, please copy the information below and send it to us.'}
        </p>

        {/* Error log display */}
        <div className="card" style={{
          padding: 'var(--space-md)',
          marginBottom: 'var(--space-lg)',
          backgroundColor: 'var(--color-bg-card)',
          maxHeight: '400px',
          overflow: 'auto',
        }}>
          <pre style={{
            margin: 0,
            fontSize: '12px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: 'var(--color-text)',
          }}>
            {errorLog}
          </pre>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <button onClick={handleCopy} className="btn-primary">
            {copied 
              ? (lang === 'hi' ? '✓ कॉपी हो गया' : '✓ Copied')
              : (lang === 'hi' ? 'कॉपी करें' : 'Copy')}
          </button>
          <a
            href="mailto:support@dukaandost.com?subject=Error Report&body=Please describe the problem:%0A%0A%0AError details:%0A${encodeURIComponent(errorLog)}"
            className="btn-secondary"
            style={{ textDecoration: 'none', textAlign: 'center' }}
          >
            {lang === 'hi' ? 'ईमेल भेजें' : 'Send email'}
          </a>
          <button onClick={handleBack} className="btn-ghost" style={{ width: '100%' }}>
            {lang === 'hi' ? 'वापस जाएं' : 'Go back'}
          </button>
        </div>
      </div>
    </div>
  );
}

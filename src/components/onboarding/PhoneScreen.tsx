import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';

export default function PhoneScreen() {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();
  const [phone, setPhone] = useState(state.phoneNumber);
  const [error, setError] = useState('');

  const handleSendOTP = () => {
    // Validate phone number (10 digits)
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setError('Please enter a valid 10-digit number');
      return;
    }
    setError('');
    dispatch({ type: 'SET_PHONE', payload: cleaned });
    dispatch({ type: 'SET_STEP', payload: 'otp' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-xl)',
      paddingTop: 'var(--space-2xl)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-2xl)' }}>
        <h1 className="text-heading-1" style={{ margin: '0 0 var(--space-md) 0' }}>
          {t('phoneTitle')}
        </h1>
        <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
          {t('phoneSubtitle')}
        </p>
      </div>

      {/* Phone Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <span style={{
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
          }}>
            +91
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
              setError('');
            }}
            placeholder={t('phonePlaceholder')}
            style={{
              flex: 1,
              height: 'var(--button-height)',
              fontSize: '24px',
              fontWeight: 600,
              padding: '0 var(--space-md)',
              border: `2px solid ${error ? 'var(--color-problem)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-bg-card)',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-family)',
              outline: 'none',
              letterSpacing: '2px',
            }}
            autoFocus
            inputMode="numeric"
          />
        </div>

        {error && (
          <p style={{ color: 'var(--color-problem)', fontSize: '14px', margin: 0 }}>
            {error}
          </p>
        )}

        <div style={{ marginTop: 'auto' }}>
          <button
            onClick={handleSendOTP}
            className="btn-primary"
            style={{ fontSize: '20px' }}
            disabled={phone.length < 10}
          >
            {t('sendOTP')}
          </button>
        </div>
      </div>
    </div>
  );
}

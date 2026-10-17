import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';

export default function OTPScreen() {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length === 6) {
      // For demo, accept any 6-digit code
      dispatch({ type: 'SET_STEP', payload: 'interview' });
      dispatch({ type: 'SET_QUESTION', payload: 0 });
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleChangeNumber = () => {
    dispatch({ type: 'SET_STEP', payload: 'phone' });
  };

  const maskedPhone = state.phoneNumber.replace(/(\d{2})(\d{4})(\d{4})/, '$1****$3');

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
          {t('otpTitle')}
        </h1>
        <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-sm) 0' }}>
          {t('otpSubtitle')}
        </p>
        <p style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
          +91 {maskedPhone}
        </p>
      </div>

      {/* OTP Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-sm)' }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="tel"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength={1}
              style={{
                width: '48px',
                height: '56px',
                fontSize: '24px',
                fontWeight: 700,
                textAlign: 'center',
                border: `2px solid var(--color-border)`,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-card)',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-family)',
                outline: 'none',
              }}
              inputMode="numeric"
            />
          ))}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <button
            onClick={handleVerify}
            className="btn-primary"
            style={{ fontSize: '20px' }}
            disabled={otp.join('').length !== 6}
          >
            {t('verifyOTP')}
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-lg)' }}>
            <button onClick={handleResend} className="btn-ghost">
              {t('resendOTP')}
            </button>
            <button onClick={handleChangeNumber} className="btn-ghost">
              {t('changeNumber')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

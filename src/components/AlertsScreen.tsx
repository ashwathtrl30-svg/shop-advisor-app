import React from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { getPendingUdhaar } from '../models/data';

export default function AlertsScreen() {
  const { state, dispatch } = useApp();
  const { lang } = useTranslation();

  const pendingUdhaar = getPendingUdhaar(state.shopData);
  const hasUdhaarAlerts = pendingUdhaar.length > 0;

  const handleToggle = (key: keyof typeof state.alertsEnabled) => {
    dispatch({ type: 'TOGGLE_ALERT', payload: key });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_SCREEN', payload: 'main' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg)',
      paddingBottom: 'var(--space-xl)',
    }}>
      {/* Header */}
      <div style={{
        padding: 'var(--space-md) var(--space-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        borderBottom: '1px solid var(--color-border)',
        minHeight: 'var(--top-bar-height)',
      }}>
        <button 
          onClick={handleBack} 
          style={{ 
            minWidth: '48px',
            minHeight: '48px',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text)',
            fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-family)',
          }}
        >
          <span style={{ fontSize: '20px' }}>←</span>
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>
        <h1 className="text-heading-1" style={{ margin: 0, flex: 1 }}>
          🔔 {lang === 'hi' ? 'अलर्ट' : 'Alerts'}
        </h1>
      </div>

      <div style={{ padding: 'var(--space-lg)' }}>
        <p className="text-body-md" style={{ 
          color: 'var(--color-text-secondary)', 
          margin: '0 0 var(--space-lg) 0' 
        }}>
          {lang === 'hi' 
            ? 'कौन से अलर्ट देखना चाहते हैं? (ज़्यादा से ज़्यादा 2 रोज़)'
            : 'Which alerts do you want? (max 2 per day)'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {/* Insights Alert */}
          <div className="card" style={{
            padding: 'var(--space-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <span style={{ fontSize: '28px' }}>💡</span>
              <div>
                <p className="text-body-lg" style={{ margin: 0, fontWeight: 600 }}>
                  {lang === 'hi' ? 'आज की सलाह' : 'Daily insights'}
                </p>
                <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                  {lang === 'hi' 
                    ? 'रोज़ 3 नई सलाह'
                    : '3 new insights daily'}
                </p>
              </div>
            </div>
            <ToggleSwitch
              enabled={state.alertsEnabled.insights}
              onToggle={() => handleToggle('insights')}
            />
          </div>

          {/* Udhaar Alert */}
          <div className="card" style={{
            padding: 'var(--space-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: hasUdhaarAlerts ? 1 : 0.5,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <span style={{ fontSize: '28px' }}>📒</span>
              <div>
                <p className="text-body-lg" style={{ margin: 0, fontWeight: 600 }}>
                  {lang === 'hi' ? 'उधार रिमाइंडर' : 'Udhaar reminders'}
                </p>
                <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                  {hasUdhaarAlerts
                    ? `${pendingUdhaar.length} ${lang === 'hi' ? 'बाकी' : 'pending'}`
                    : (lang === 'hi' ? 'कोई उधार नहीं' : 'No pending udhaar')}
                </p>
              </div>
            </div>
            <ToggleSwitch
              enabled={state.alertsEnabled.udhaar}
              onToggle={() => handleToggle('udhaar')}
            />
          </div>

          {/* Festival Alert */}
          <div className="card" style={{
            padding: 'var(--space-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <span style={{ fontSize: '28px' }}>🎉</span>
              <div>
                <p className="text-body-lg" style={{ margin: 0, fontWeight: 600 }}>
                  {lang === 'hi' ? 'त्योहार रिमाइंडर' : 'Festival reminders'}
                </p>
                <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                  {lang === 'hi' 
                    ? 'आने वाले त्योहारों की तैयारी'
                    : 'Upcoming festival prep'}
                </p>
              </div>
            </div>
            <ToggleSwitch
              enabled={state.alertsEnabled.festivals}
              onToggle={() => handleToggle('festivals')}
            />
          </div>

          {/* Daily Reminder */}
          <div className="card" style={{
            padding: 'var(--space-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <span style={{ fontSize: '28px' }}>⏰</span>
              <div>
                <p className="text-body-lg" style={{ margin: 0, fontWeight: 600 }}>
                  {lang === 'hi' ? 'रोज़ाना याद' : 'Daily reminder'}
                </p>
                <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                  {lang === 'hi' 
                    ? 'शाम को बिक्री डालने की याद'
                    : 'Evening reminder to add sales'}
                </p>
              </div>
            </div>
            <ToggleSwitch
              enabled={state.alertsEnabled.dailyReminder}
              onToggle={() => handleToggle('dailyReminder')}
            />
          </div>
        </div>

        {/* Info */}
        <div style={{
          marginTop: 'var(--space-xl)',
          padding: 'var(--space-md)',
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-md)',
        }}>
          <p className="text-body-sm" style={{ color: 'var(--color-text-muted)', margin: 0, textAlign: 'center' }}>
            {lang === 'hi'
              ? '🔕 ज़्यादा से ज़्यादा 2 नोटिफिकेशन रोज़। कभी परेशान नहीं करेंगे।'
              : '🔕 Max 2 notifications per day. We\'ll never spam you.'}
          </p>
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: '52px',
        height: '32px',
        borderRadius: '16px',
        border: 'none',
        backgroundColor: enabled ? 'var(--color-primary)' : 'var(--color-border)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background-color 0.2s ease',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: 'white',
        position: 'absolute',
        top: '4px',
        left: enabled ? '24px' : '4px',
        transition: 'left 0.2s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

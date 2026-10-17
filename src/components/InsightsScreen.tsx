import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { generateInsights, Insight } from '../models/insights';
import InsightCard from './InsightCard';

export default function InsightsScreen() {
  const { state, dispatch } = useApp();
  const { lang } = useTranslation();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Generate insights
    const newInsights = generateInsights(
      state.shopData,
      state.shopProfile,
      state.insightHistory,
      state.alertPreferences
    );

    // Add to history
    newInsights.forEach(insight => {
      dispatch({ type: 'ADD_INSIGHT', payload: insight.id });
    });

    setInsights(newInsights);
  }, [state.shopData, state.shopProfile, state.insightHistory, state.alertPreferences]);

  const togglePreference = (key: keyof typeof state.alertPreferences) => {
    dispatch({
      type: 'UPDATE_ALERT_PREFERENCES',
      payload: { [key]: !state.alertPreferences[key] },
    });
  };

  if (showSettings) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
          <h2 className="text-heading-1" style={{ margin: 0 }}>
            {lang === 'hi' ? 'अलर्ट सेटिंग्स' : 'Alert Settings'}
          </h2>
          <button onClick={() => setShowSettings(false)} className="btn-ghost">
            ✕
          </button>
        </div>

        <p className="text-body-md" style={{ 
          color: 'var(--color-text-secondary)', 
          margin: '0 0 var(--space-lg) 0' 
        }}>
          {lang === 'hi' 
            ? 'कौन से अलर्ट देखना चाहते हैं?'
            : 'Which alerts do you want to see?'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {[
            { key: 'profit' as const, emoji: '💰', label: lang === 'hi' ? 'मुनाफ़ा' : 'Profit' },
            { key: 'costs' as const, emoji: '💸', label: lang === 'hi' ? 'खर्चे' : 'Costs' },
            { key: 'udhaar' as const, emoji: '📒', label: lang === 'hi' ? 'उधार' : 'Udhaar' },
            { key: 'stock' as const, emoji: '📦', label: lang === 'hi' ? 'स्टॉक' : 'Stock' },
            { key: 'season' as const, emoji: '🎉', label: lang === 'hi' ? 'त्योहार/मौसम' : 'Festivals/Season' },
            { key: 'pricing' as const, emoji: '🏷️', label: lang === 'hi' ? 'कीमत' : 'Pricing' },
            { key: 'cashSafety' as const, emoji: '⚠️', label: lang === 'hi' ? 'पैसे की सुरक्षा' : 'Cash Safety' },
            { key: 'wins' as const, emoji: '🎉', label: lang === 'hi' ? 'जीत' : 'Wins' },
          ].map((item) => (
            <div key={item.key} className="card" style={{
              padding: 'var(--space-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <span style={{ fontSize: '24px' }}>{item.emoji}</span>
                <span className="text-body-lg" style={{ fontWeight: 500 }}>
                  {item.label}
                </span>
              </div>
              <button
                onClick={() => togglePreference(item.key)}
                style={{
                  width: '52px',
                  height: '32px',
                  borderRadius: '16px',
                  border: 'none',
                  backgroundColor: state.alertPreferences[item.key] 
                    ? 'var(--color-primary)' 
                    : 'var(--color-border)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  position: 'absolute',
                  top: '4px',
                  left: state.alertPreferences[item.key] ? '24px' : '4px',
                  transition: 'left 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
        <h2 className="text-heading-1" style={{ margin: 0 }}>
          {lang === 'hi' ? 'आज की सलाह' : 'Today\'s Insights'}
        </h2>
        <button onClick={() => setShowSettings(true)} className="btn-ghost">
          ⚙️
        </button>
      </div>

      {/* Insights */}
      {insights.length === 0 ? (
        <div className="card" style={{
          padding: 'var(--space-2xl)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '64px', marginBottom: 'var(--space-lg)' }}>💡</div>
          <h3 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
            {lang === 'hi' ? 'कोई नई सलाह नहीं' : 'No new insights'}
          </h3>
          <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            {lang === 'hi'
              ? 'आज की सारी सलाह देख ली। कल फिर देखें।'
              : 'You\'ve seen all insights for today. Check back tomorrow.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}

      {/* Info */}
      <div style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-md)', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
        <p className="text-body-sm" style={{ color: 'var(--color-text-muted)', margin: 0, textAlign: 'center' }}>
          {lang === 'hi'
            ? 'रोज़ 3 नई सलाह मिलती है। पसंद ना आने पर "Not useful" दबाएं।'
            : 'You get 3 new insights daily. Tap "Not useful" to see fewer like this.'}
        </p>
      </div>
    </div>
  );
}

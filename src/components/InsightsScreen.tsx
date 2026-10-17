import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { generateDailyInsights, DailyInsight, saveDailyInsights } from '../services/dailyInsights';
import DailyInsightCard from './DailyInsightCard';

export default function InsightsScreen() {
  const { state, dispatch } = useApp();
  const { lang } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Generate daily insights on mount or when data changes
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we already have insights for today
    const todayInsights = state.dailyInsights.find(d => d.date === today);
    
    if (!todayInsights) {
      // Generate new insights for today
      const newInsights = generateDailyInsights(
        state.shopData,
        state.shopProfile,
        lang as 'en' | 'hi'
      );
      
      // Save to state
      const updatedHistory = saveDailyInsights(newInsights, state.dailyInsights);
      dispatch({ type: 'SET_DAILY_INSIGHTS', payload: updatedHistory });
    }
  }, [state.shopData, state.shopProfile, lang]);

  // Get insights to display
  const displayDate = selectedDate || new Date().toISOString().split('T')[0];
  const dayInsights = state.dailyInsights.find(d => d.date === displayDate);
  const insights = dayInsights?.insights || [];
  const feedback = dayInsights?.feedback || {};
  
  // Show top 3 or all
  const displayedInsights = showAll ? insights : insights.slice(0, 3);

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
    <div style={{ padding: 'var(--space-lg)', paddingBottom: 'calc(var(--nav-height) + var(--space-lg))' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
        <h2 className="text-heading-1" style={{ margin: 0 }}>
          {lang === 'hi' ? 'आज की सलाह' : 'Today\'s Insights'}
        </h2>
        <button onClick={() => setShowSettings(true)} className="btn-ghost">
          ⚙️
        </button>
      </div>

      {/* Date selector (if viewing past days) */}
      {selectedDate && (
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <button
            onClick={() => setSelectedDate(null)}
            className="btn-ghost"
            style={{ fontSize: '14px' }}
          >
            ← {lang === 'hi' ? 'आज पर वापस जाएं' : 'Back to today'}
          </button>
          <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-xs) 0 0 0' }}>
            {lang === 'hi' ? 'दिनांक:' : 'Date:'} {new Date(selectedDate).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN')}
          </p>
        </div>
      )}

      {/* Insights */}
      {insights.length === 0 ? (
        <div className="card" style={{
          padding: 'var(--space-2xl)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '64px', marginBottom: 'var(--space-lg)' }}>💡</div>
          <h3 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
            {lang === 'hi' ? 'कोई सलाह नहीं' : 'No insights yet'}
          </h3>
          <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            {lang === 'hi'
              ? 'और डेटा डालें ताकि सलाह मिल सके।'
              : 'Add more data to get insights.'}
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {displayedInsights.map((insight) => (
              <DailyInsightCard 
                key={insight.id} 
                insight={insight} 
                feedback={feedback[insight.id]}
              />
            ))}
          </div>

          {/* See all button */}
          {!showAll && insights.length > 3 && (
            <button
              onClick={() => setShowAll(true)}
              className="btn-secondary"
              style={{ marginTop: 'var(--space-md)' }}
            >
              {lang === 'hi' ? `सभी ${insights.length} सलाह देखें` : `See all ${insights.length} insights`}
            </button>
          )}

          {/* Show less button */}
          {showAll && insights.length > 3 && (
            <button
              onClick={() => setShowAll(false)}
              className="btn-ghost"
              style={{ marginTop: 'var(--space-md)', width: '100%', justifyContent: 'center' }}
            >
              {lang === 'hi' ? 'कम दिखाएं' : 'Show less'}
            </button>
          )}
        </>
      )}

      {/* Past days selector */}
      {!selectedDate && state.dailyInsights.length > 1 && (
        <div style={{ marginTop: 'var(--space-xl)' }}>
          <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-sm) 0' }}>
            {lang === 'hi' ? 'पिछले दिन:' : 'Past days:'}
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
            {state.dailyInsights
              .filter(d => d.date !== new Date().toISOString().split('T')[0])
              .slice(-5)
              .reverse()
              .map(day => (
                <button
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  className="btn-ghost"
                  style={{ 
                    padding: 'var(--space-xs) var(--space-sm)',
                    fontSize: '12px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {new Date(day.date).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short' })}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-md)', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
        <p className="text-body-sm" style={{ color: 'var(--color-text-muted)', margin: 0, textAlign: 'center' }}>
          {lang === 'hi'
            ? 'रोज़ 8-10 नई सलाह मिलती है। पसंद ना आने पर "बेकार" दबाएं।'
            : 'You get 8-10 new insights daily. Tap "Not useful" to see fewer like this.'}
        </p>
      </div>
    </div>
  );
}

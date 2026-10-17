import React from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { DailyInsight } from '../services/dailyInsights';

interface DailyInsightCardProps {
  insight: DailyInsight;
  feedback?: 'yes' | 'no';
}

export default function DailyInsightCard({ insight, feedback }: DailyInsightCardProps) {
  const { dispatch } = useApp();
  const { lang } = useTranslation();

  const handleFeedback = (value: 'yes' | 'no') => {
    dispatch({
      type: 'RECORD_INSIGHT_FEEDBACK',
      payload: { insightId: insight.id, feedback: value },
    });
  };

  const getIcon = () => {
    const icons: Record<string, string> = {
      'profit': '💰',
      'sales-trend': '📈',
      'biggest-cost': '💸',
      'cost-increased': '⬆️',
      'udhaar-collect': '📒',
      'best-selling': '⭐',
      'slow-item': '🐌',
      'cash-safety': '💵',
      'target-progress': '🎯',
      'win': '🏆',
      'weekday-pattern': '📅',
      'festival': '🎉',
      'break-even': '⚖️',
    };
    return icons[insight.type] || '💡';
  };

  return (
    <div className="card" style={{
      padding: 'var(--space-md)',
      borderLeft: `4px solid ${insight.isPositive ? 'var(--color-positive)' : insight.isGeneralTip ? 'var(--color-border)' : 'var(--color-warning)'}`,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
        <span style={{ fontSize: '24px' }}>{getIcon()}</span>
        <div style={{ flex: 1 }}>
          <p className="text-body-lg" style={{ margin: 0, fontWeight: 600 }}>
            {insight.headline}
          </p>
          {insight.isGeneralTip && (
            <p className="text-body-sm" style={{ 
              margin: '4px 0 0 0',
              color: 'var(--color-text-secondary)',
              fontStyle: 'italic',
            }}>
              {lang === 'hi' ? 'सामान्य सलाह' : 'General tip'}
            </p>
          )}
        </div>
      </div>

      {/* Figure */}
      {insight.figure && (
        <p className="text-heading-2" style={{ 
          margin: '0 0 var(--space-sm) 0',
          color: insight.isPositive ? 'var(--color-positive)' : 'var(--color-text)',
        }}>
          {insight.figure}
        </p>
      )}

      {/* Action */}
      <p className="text-body-md" style={{ 
        margin: '0 0 var(--space-sm) 0',
        color: 'var(--color-text-secondary)',
      }}>
        → {insight.action}
      </p>

      {/* Period */}
      <p className="text-body-sm" style={{ 
        margin: '0 0 var(--space-md) 0',
        color: 'var(--color-text-muted)',
      }}>
        {insight.period}
      </p>

      {/* Requires more data warning */}
      {insight.requiresMoreData && (
        <div style={{
          padding: 'var(--space-sm)',
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--space-md)',
        }}>
          <p className="text-body-sm" style={{ margin: 0, color: 'var(--color-warning)' }}>
            ℹ️ {insight.requiresMoreData}
          </p>
        </div>
      )}

      {/* Feedback buttons */}
      {!feedback ? (
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button
            onClick={() => handleFeedback('yes')}
            style={{
              flex: 1,
              padding: 'var(--space-sm)',
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            👍 {lang === 'hi' ? 'मददगार' : 'Useful'}
          </button>
          <button
            onClick={() => handleFeedback('no')}
            style={{
              flex: 1,
              padding: 'var(--space-sm)',
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            👎 {lang === 'hi' ? 'बेकार' : 'Not useful'}
          </button>
        </div>
      ) : (
        <p className="text-body-sm" style={{ 
          margin: 0,
          color: 'var(--color-text-muted)',
          textAlign: 'center',
        }}>
          {feedback === 'yes' 
            ? (lang === 'hi' ? '✅ धन्यवाद!' : '✅ Thanks!')
            : (lang === 'hi' ? '📝 सुधार करेंगे' : '📝 We\'ll improve')}
        </p>
      )}
    </div>
  );
}

import React from 'react';
import { useApp } from '../context/AppContext';
import { Insight } from '../models/insights';

interface InsightCardProps {
  insight: Insight;
}

export default function InsightCard({ insight }: InsightCardProps) {
  const { dispatch } = useApp();

  const handleFeedback = (feedback: 'yes' | 'no') => {
    dispatch({
      type: 'SET_INSIGHT_FEEDBACK',
      payload: { id: insight.id, feedback },
    });
  };

  const getIcon = () => {
    switch (insight.type) {
      case 'profit':
        return '💰';
      case 'costs':
        return '💸';
      case 'udhaar':
        return '📒';
      case 'stock':
        return '📦';
      case 'season':
        return '🎉';
      case 'pricing':
        return '🏷️';
      case 'cash-safety':
        return '⚠️';
      case 'win':
        return '🎉';
      default:
        return '💡';
    }
  };

  const getAccentColor = () => {
    switch (insight.type) {
      case 'win':
        return 'var(--color-accent)';
      case 'cash-safety':
        return 'var(--color-warning)';
      case 'udhaar':
        return 'var(--color-problem)';
      default:
        return 'var(--color-primary)';
    }
  };

  return (
    <div className="card" style={{
      borderLeft: `4px solid ${getAccentColor()}`,
      padding: 'var(--space-lg)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
        <span style={{ fontSize: '32px' }}>{getIcon()}</span>
        <div style={{ flex: 1 }}>
          <h3 className="text-heading-3" style={{ margin: 0, color: 'var(--color-text)' }}>
            {insight.headline}
          </h3>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-body-md" style={{ 
        margin: '0 0 var(--space-md) 0', 
        color: 'var(--color-text-secondary)',
        lineHeight: 1.6,
      }}>
        {insight.explanation}
      </p>

      {/* Action */}
      <div style={{
        backgroundColor: 'var(--color-bg)',
        padding: 'var(--space-md)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--space-md)',
      }}>
        <p className="text-body-sm" style={{ 
          margin: '0 0 var(--space-xs) 0', 
          color: 'var(--color-text-secondary)',
          fontWeight: 600,
        }}>
          What to do:
        </p>
        <p className="text-body-md" style={{ margin: 0, color: 'var(--color-text)' }}>
          {insight.action}
        </p>
      </div>

      {/* Data source */}
      <p className="text-body-sm" style={{ 
        margin: '0 0 var(--space-md) 0', 
        color: 'var(--color-text-muted)',
        fontStyle: 'italic',
      }}>
        {insight.isEstimate ? '📊 ' : '📈 '}
        {insight.dataSource}
        {insight.isEstimate && ' (industry estimate)'}
      </p>

      {/* Feedback */}
      {!insight.feedback && (
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button
            onClick={() => handleFeedback('yes')}
            className="btn-secondary"
            style={{ flex: 1, height: '44px', fontSize: '14px' }}
          >
            👍 Useful
          </button>
          <button
            onClick={() => handleFeedback('no')}
            className="btn-ghost"
            style={{ flex: 1, height: '44px', fontSize: '14px' }}
          >
            👎 Not useful
          </button>
        </div>
      )}

      {insight.feedback && (
        <p className="text-body-sm" style={{ 
          margin: 0, 
          color: 'var(--color-text-muted)',
          textAlign: 'center',
        }}>
          {insight.feedback === 'yes' ? '✅ Thanks for your feedback!' : '📝 We\'ll show fewer insights like this.'}
        </p>
      )}
    </div>
  );
}

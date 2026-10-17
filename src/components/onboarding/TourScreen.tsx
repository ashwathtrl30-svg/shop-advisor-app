import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';

const tourCards = [
  { emoji: '📝', titleKey: 'tour1Title' as const, descKey: 'tour1Desc' as const },
  { emoji: '💬', titleKey: 'tour2Title' as const, descKey: 'tour2Desc' as const },
  { emoji: '📚', titleKey: 'tour3Title' as const, descKey: 'tour3Desc' as const },
];

export default function TourScreen() {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();
  const currentStep = state.tourStep;
  const isLast = currentStep === tourCards.length - 1;

  const handleNext = () => {
    if (isLast) {
      dispatch({ type: 'SET_STEP', payload: 'complete' });
    } else {
      dispatch({ type: 'SET_TOUR_STEP', payload: currentStep + 1 });
    }
  };

  const handleSkip = () => {
    dispatch({ type: 'SET_STEP', payload: 'complete' });
  };

  const card = tourCards[currentStep];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-xl)',
    }}>
      {/* Skip Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-lg)' }}>
        <button onClick={handleSkip} className="btn-ghost">
          {t('tourSkip')}
        </button>
      </div>

      {/* Tour Card */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card animate-fade-in" style={{
          width: '100%',
          maxWidth: '400px',
          padding: 'var(--space-2xl)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '80px', marginBottom: 'var(--space-lg)' }}>
            {card.emoji}
          </div>
          <h2 className="text-heading-1" style={{ margin: '0 0 var(--space-md) 0', color: 'var(--color-primary)' }}>
            {t(card.titleKey)}
          </h2>
          <p className="text-body-lg" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            {t(card.descKey)}
          </p>
        </div>

        {/* Dots indicator */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-xl)' }}>
          {tourCards.map((_, index) => (
            <div
              key={index}
              style={{
                width: index === currentStep ? '24px' : '8px',
                height: '8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: index === currentStep ? 'var(--color-primary)' : 'var(--color-border)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div style={{ marginTop: 'var(--space-xl)' }}>
        <button onClick={handleNext} className="btn-primary" style={{ fontSize: '20px' }}>
          {isLast ? t('tourFinish') : t('tourNext')}
        </button>
      </div>
    </div>
  );
}

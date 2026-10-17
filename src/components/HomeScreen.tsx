import React from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { TranslationKey } from '../i18n/translations';

export default function HomeScreen() {
  const { state } = useApp();
  const { t } = useTranslation();
  const profile = state.shopProfile;

  // Personalized greeting based on shop type
  const getGreeting = () => {
    const shopType = profile.shopType;
    if (shopType === 'bakery') return '🍰';
    if (shopType === 'medical') return '💊';
    if (shopType === 'kirana') return '🏪';
    if (shopType === 'vegetable') return '🥬';
    if (shopType === 'tea') return '☕';
    return '🏪';
  };

  // Personalized smart tip based on profile
  const getSmartTip = () => {
    const tips: Record<string, { emoji: string; text: string }> = {
      bakery: {
        emoji: '💡',
        text: state.language === 'hi' 
          ? 'आटे की कीमत बढ़ रही है। इस हफ्ते ज़्यादा स्टॉक मत रखिए।'
          : 'Flour prices are rising. Don\'t keep too much stock this week.',
      },
      medical: {
        emoji: '💡',
        text: state.language === 'hi'
          ? '3 दवाइयाँ अगले महीने एक्सपायर हो रही हैं। जल्दी बेच दीजिए।'
          : '3 medicines expire next month. Try to sell them quickly.',
      },
      kirana: {
        emoji: '💡',
        text: state.language === 'hi'
          ? 'मैगी का स्टॉक कम हो रहा है। रोज़ 20 पैकेट बिकते हैं। 100 और मंगा लीजिए।'
          : 'Your Maggi stock is running low. You sell about 20 packets daily. Order 100 more today.',
      },
      vegetable: {
        emoji: '💡',
        text: state.language === 'hi'
          ? 'कल टमाटर 2 किलो खराब हो गए। आज कम मंगाइए।'
          : '2 kg of tomatoes went bad yesterday. Order less today.',
      },
    };

    const shopType = profile.shopType || 'kirana';
    return tips[shopType] || {
      emoji: '💡',
      text: state.language === 'hi'
        ? 'आज का दिन अच्छा रहा। कल से 12% ज़्यादा बिक्री हुई।'
        : 'Good day today. 12% more sales than yesterday.',
    };
  };

  const smartTip = getSmartTip();

  // Personalized suggested questions for Ask tab
  const getSuggestedQuestions = () => {
    if (state.language === 'hi') {
      return [
        'आज कितना मुनाफ़ा हुआ?',
        'कौन सा सामान ज़्यादा बिका?',
        'इस महीने कितना खर्चा हुआ?',
        'उधार कितना बाकी है?',
      ];
    }
    return [
      'How much profit did I make today?',
      'Which item sold the most?',
      'How much did I spend this month?',
      'How much credit is pending?',
    ];
  };

  return (
    <div style={{ padding: '0 var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      
      {/* Today's Summary Card */}
      <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-sm) 0' }}>
          {t('homeTodaySales')}
        </p>
        <p className="text-number" style={{ color: 'var(--color-primary)', margin: '0 0 var(--space-sm) 0' }}>
          ₹8,450
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
          <span style={{ color: 'var(--color-positive)', fontSize: '14px', fontWeight: 600 }}>
            ↑ 12% {t('homeMoreThanYesterday')}
          </span>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
        <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>
            {t('homeExpenses')}
          </p>
          <p style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
            ₹3,200
          </p>
        </div>
        <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>
            {t('homeProfit')}
          </p>
          <p style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: 'var(--color-positive)' }}>
            ₹5,250
          </p>
        </div>
      </div>

      {/* Smart Tip (Accent) - Personalized */}
      <div className="card animate-fade-in" style={{
        animationDelay: '0.2s',
        borderLeft: '4px solid var(--color-accent)',
        backgroundColor: 'var(--color-accent-light)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
          <span style={{ fontSize: '28px' }}>{smartTip.emoji}</span>
          <div>
            <p className="text-heading-3" style={{ margin: '0 0 var(--space-xs) 0', color: 'var(--color-text)' }}>
              {t('homeSmartTip')}
            </p>
            <p className="text-body-md" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              {smartTip.text}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div style={{ marginTop: 'auto', paddingTop: 'var(--space-md)' }}>
        <button className="btn-primary" style={{ fontSize: '20px' }}>
          <span style={{ fontSize: '24px' }}>✏️</span>
          {t('homeAddNumbers')}
        </button>
      </div>

      {/* Secondary action */}
      <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
        <span>🎤</span>
        <span>{t('homeVoice')}</span>
      </button>
    </div>
  );
}

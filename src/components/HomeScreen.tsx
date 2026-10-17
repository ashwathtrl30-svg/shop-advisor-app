import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { getTodaySummary, formatCurrency, getPendingUdhaar, getOverdueUdhaar } from '../models/data';
import WeeklyChart from './WeeklyChart';
import SaleEntryScreen from './data/SaleEntryScreen';
import ExpenseEntryScreen from './data/ExpenseEntryScreen';
import UdhaarEntryScreen from './data/UdhaarEntryScreen';

export default function HomeScreen() {
  const { state } = useApp();
  const { t, lang } = useTranslation();
  const [showEntry, setShowEntry] = useState<'sale' | 'expense' | 'udhaar' | null>(null);
  
  const profile = state.shopProfile;
  const shopData = state.shopData;
  const todaySummary = getTodaySummary(shopData);
  const pendingUdhaar = getPendingUdhaar(shopData);
  const overdueUdhaar = getOverdueUdhaar(shopData);

  // Get today's date
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  // Personalized greeting
  const shopName = profile.shopName || (lang === 'hi' ? 'दोस्त' : 'Friend');
  const greeting = lang === 'hi' ? `नमस्ते ${shopName} जी` : `Namaste ${shopName} ji`;

  // Personalized advice based on shop type and data
  const getAdvice = () => {
    const shopType = profile.shopType;
    
    // If there's overdue udhaar, prioritize that
    if (overdueUdhaar.length > 0) {
      return {
        emoji: '⏰',
        title: lang === 'hi' ? 'उधार याद दिलाएं' : 'Remind about udhaar',
        text: lang === 'hi'
          ? `${overdueUdhaar.length} ग्राहकों का उधार समय बीत गया। आज याद दिलाएं।`
          : `${overdueUdhaar.length} customers' udhaar is overdue. Remind them today.`,
        action: () => setShowEntry('udhaar'),
      };
    }

    // Shop-type specific advice
    if (shopType === 'bakery') {
      return {
        emoji: '💡',
        title: lang === 'hi' ? 'स्मार्ट टिप' : 'Smart Tip',
        text: lang === 'hi'
          ? 'आटे की कीमत बढ़ रही है। इस हफ्ते ज़्यादा स्टॉक मत रखिए।'
          : 'Flour prices are rising. Don\'t keep too much stock this week.',
        action: () => {},
      };
    }
    if (shopType === 'medical') {
      return {
        emoji: '💡',
        title: lang === 'hi' ? 'स्मार्ट टिप' : 'Smart Tip',
        text: lang === 'hi'
          ? '3 दवाइयाँ अगले महीने एक्सपायर हो रही हैं। जल्दी बेच दीजिए।'
          : '3 medicines expire next month. Try to sell them quickly.',
        action: () => {},
      };
    }
    if (shopType === 'kirana') {
      return {
        emoji: '💡',
        title: lang === 'hi' ? 'स्मार्ट टिप' : 'Smart Tip',
        text: lang === 'hi'
          ? 'मैगी का स्टॉक कम हो रहा है। रोज़ 20 पैकेट बिकते हैं। 100 और मंगा लीजिए।'
          : 'Your Maggi stock is running low. You sell about 20 packets daily. Order 100 more today.',
        action: () => {},
      };
    }
    if (shopType === 'vegetable') {
      return {
        emoji: '💡',
        title: lang === 'hi' ? 'स्मार्ट टिप' : 'Smart Tip',
        text: lang === 'hi'
          ? 'कल टमाटर 2 किलो खराब हो गए। आज कम मंगाइए।'
          : '2 kg of tomatoes went bad yesterday. Order less today.',
        action: () => {},
      };
    }

    // Default advice
    return {
      emoji: '💡',
      title: lang === 'hi' ? 'आज की सलाह' : 'Today\'s Advice',
      text: lang === 'hi'
        ? 'आज की बिक्री और खर्चे डालें। मैं बताऊंगा आपकी दुकान कैसी चल रही है।'
        : 'Add today\'s sales and expenses. I\'ll show you how your shop is doing.',
      action: () => setShowEntry('sale'),
    };
  };

  const advice = getAdvice();

  // Show entry screen
  if (showEntry) {
    const EntryScreen = showEntry === 'sale' ? SaleEntryScreen 
      : showEntry === 'expense' ? ExpenseEntryScreen 
      : UdhaarEntryScreen;
    
    return <EntryScreen onClose={() => setShowEntry(null)} />;
  }

  // Empty state - no data yet
  const hasData = todaySummary.sales > 0 || todaySummary.expenses > 0;

  return (
    <div style={{ padding: '0 var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      
      {/* Greeting */}
      <div>
        <h2 className="text-heading-1" style={{ margin: '0 0 var(--space-xs) 0' }}>
          {greeting}
        </h2>
        <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
          {dateStr}
        </p>
      </div>

      {/* Today Card */}
      {!hasData ? (
        <div className="card" style={{
          padding: 'var(--space-xl)',
          textAlign: 'center',
          backgroundColor: 'var(--color-primary-light)',
        }}>
          <div style={{ fontSize: '48px', marginBottom: 'var(--space-md)' }}>📝</div>
          <p className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
            {lang === 'hi' ? 'आज की बिक्री डालें' : 'Add today\'s sales'}
          </p>
          <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-lg) 0' }}>
            {lang === 'hi'
              ? '10 सेकंड में डालें। मैं बताऊंगा आपकी दुकान कैसी चल रही है।'
              : 'Takes 10 seconds. I\'ll show you how your shop is doing.'}
          </p>
          <button
            onClick={() => setShowEntry('sale')}
            className="btn-primary"
            style={{ fontSize: '18px' }}
          >
            <span>✏️</span>
            {lang === 'hi' ? 'बिक्री डालें' : 'Add Sale'}
          </button>
        </div>
      ) : (
        <div className="card">
          <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-sm) 0' }}>
            {lang === 'hi' ? 'आज की बिक्री' : 'Today\'s Sales'}
          </p>
          <p className="text-number" style={{ color: 'var(--color-primary)', margin: '0 0 var(--space-md) 0' }}>
            {formatCurrency(todaySummary.sales)}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>
                {lang === 'hi' ? 'खर्चे' : 'Expenses'}
              </p>
              <p style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>
                {formatCurrency(todaySummary.expenses)}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>
                {lang === 'hi' ? 'मुनाफ़ा' : 'Profit'}
              </p>
              <p style={{
                fontSize: '20px',
                fontWeight: 700,
                margin: 0,
                color: todaySummary.profit >= 0 ? 'var(--color-positive)' : 'var(--color-problem)',
              }}>
                {formatCurrency(todaySummary.profit)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Advice Card */}
      <div className="card" style={{
        borderLeft: '4px solid var(--color-accent)',
        backgroundColor: 'var(--color-accent-light)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
          <span style={{ fontSize: '28px' }}>{advice.emoji}</span>
          <div style={{ flex: 1 }}>
            <p className="text-heading-3" style={{ margin: '0 0 var(--space-xs) 0' }}>
              {advice.title}
            </p>
            <p className="text-body-md" style={{ margin: '0 0 var(--space-md) 0', color: 'var(--color-text-secondary)' }}>
              {advice.text}
            </p>
            <button
              onClick={advice.action}
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-sm) var(--space-md)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
              }}
            >
              {lang === 'hi' ? 'और जानें' : 'Learn more'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Add Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)' }}>
        <button
          onClick={() => setShowEntry('sale')}
          className="card"
          style={{
            padding: 'var(--space-lg)',
            textAlign: 'center',
            cursor: 'pointer',
            border: '1px solid var(--color-border)',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: 'var(--space-xs)' }}>💰</div>
          <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>
            {lang === 'hi' ? 'बिक्री' : 'Sale'}
          </p>
        </button>
        <button
          onClick={() => setShowEntry('expense')}
          className="card"
          style={{
            padding: 'var(--space-lg)',
            textAlign: 'center',
            cursor: 'pointer',
            border: '1px solid var(--color-border)',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: 'var(--space-xs)' }}>💸</div>
          <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>
            {lang === 'hi' ? 'खर्चा' : 'Expense'}
          </p>
        </button>
        <button
          onClick={() => setShowEntry('udhaar')}
          className="card"
          style={{
            padding: 'var(--space-lg)',
            textAlign: 'center',
            cursor: 'pointer',
            border: '1px solid var(--color-border)',
            position: 'relative',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: 'var(--space-xs)' }}>📒</div>
          <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>
            {lang === 'hi' ? 'उधार' : 'Udhaar'}
          </p>
          {pendingUdhaar.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: 'var(--color-problem)',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
            }}>
              {pendingUdhaar.length}
            </div>
          )}
        </button>
      </div>

      {/* Weekly Chart */}
      <WeeklyChart data={shopData} />

      {/* Udhaar Alert */}
      {overdueUdhaar.length > 0 && (
        <div className="card" style={{
          borderLeft: '4px solid var(--color-warning)',
          padding: 'var(--space-md)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span style={{ fontSize: '24px' }}>⏰</span>
            <div style={{ flex: 1 }}>
              <p className="text-body-md" style={{ margin: 0, fontWeight: 600 }}>
                {lang === 'hi' 
                  ? `${overdueUdhaar.length} उधार समय बीत गया`
                  : `${overdueUdhaar.length} udhaar overdue`}
              </p>
              <p className="text-body-sm" style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)' }}>
                {lang === 'hi' ? 'आज याद दिलाएं' : 'Remind them today'}
              </p>
            </div>
            <button
              onClick={() => setShowEntry('udhaar')}
              style={{
                backgroundColor: 'var(--color-warning)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-sm) var(--space-md)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
              }}
            >
              {lang === 'hi' ? 'देखें' : 'View'}
            </button>
          </div>
        </div>
      )}

      {/* Streak Badge */}
      {shopData.streak >= 7 && (
        <div className="card" style={{
          backgroundColor: 'var(--color-accent-light)',
          borderLeft: '4px solid var(--color-accent)',
          padding: 'var(--space-md)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span style={{ fontSize: '32px' }}>🔥</span>
            <div>
              <p className="text-body-md" style={{ margin: 0, fontWeight: 600 }}>
                {lang === 'hi' ? `${shopData.streak} दिन लगातार!` : `${shopData.streak} days in a row!`}
              </p>
              <p className="text-body-sm" style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)' }}>
                {lang === 'hi' ? 'बहुत बढ़िया!' : 'Amazing consistency!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

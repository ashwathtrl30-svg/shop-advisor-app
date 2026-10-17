import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { getTodaySummary, formatCurrency, getPendingUdhaar, getOverdueUdhaar } from '../models/data';
import { generateInsights, Insight } from '../models/insights';
import WeeklyChart from './WeeklyChart';
import InsightCard from './InsightCard';
import SaleEntryScreen from './data/SaleEntryScreen';
import ExpenseEntryScreen from './data/ExpenseEntryScreen';
import UdhaarEntryScreen from './data/UdhaarEntryScreen';

export default function HomeScreen() {
  const { state, dispatch } = useApp();
  const { t, lang } = useTranslation();
  const [showEntry, setShowEntry] = useState<'sale' | 'expense' | 'udhaar' | null>(null);
  const [topInsight, setTopInsight] = useState<Insight | null>(null);
  
  const profile = state.shopProfile;
  const shopData = state.shopData;
  const todaySummary = getTodaySummary(shopData);
  const pendingUdhaar = getPendingUdhaar(shopData);
  const overdueUdhaar = getOverdueUdhaar(shopData);

  // Generate top insight
  useEffect(() => {
    const insights = generateInsights(
      shopData,
      profile,
      state.insightHistory,
      state.alertPreferences
    );

    if (insights.length > 0) {
      setTopInsight(insights[0]);
      dispatch({ type: 'ADD_INSIGHT', payload: insights[0].id });
    }
  }, [shopData, profile, state.insightHistory, state.alertPreferences]);

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
    <div className="screen-container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      
      {/* Date (greeting is now in TopBar) */}
      <div>
        <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
          {dateStr}
        </p>
      </div>

      {/* Today Card */}
      {!hasData ? (
        <div className="card" style={{
          padding: 'var(--space-6)',
          textAlign: 'center',
          backgroundColor: 'var(--color-primary-light)',
        }}>
          <div style={{ fontSize: '48px', marginBottom: 'var(--space-4)' }}>📝</div>
          <p className="text-heading-2" style={{ margin: '0 0 var(--space-3) 0' }}>
            {lang === 'hi' ? 'आज की बिक्री डालें' : 'Add today\'s sales'}
          </p>
          <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-6) 0' }}>
            {lang === 'hi'
              ? '10 सेकंड में डालें। मैं बताऊंगा आपकी दुकान कैसी चल रही है।'
              : 'Takes 10 seconds. I\'ll show you how your shop is doing.'}
          </p>
          <button
            onClick={() => setShowEntry('sale')}
            className="btn-primary"
          >
            <span>✏️</span>
            {lang === 'hi' ? 'बिक्री डालें' : 'Add Sale'}
          </button>
        </div>
      ) : (
        <div className="card">
          <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-2) 0' }}>
            {lang === 'hi' ? 'आज की बिक्री' : 'Today\'s Sales'}
          </p>
          <p className="text-number" style={{ color: 'var(--color-primary)', margin: '0 0 var(--space-4) 0' }}>
            {formatCurrency(todaySummary.sales)}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-1) 0' }}>
                {lang === 'hi' ? 'खर्चे' : 'Expenses'}
              </p>
              <p className="text-heading-3" style={{ margin: 0 }}>
                {formatCurrency(todaySummary.expenses)}
              </p>
            </div>
            <div>
              <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-1) 0' }}>
                {lang === 'hi' ? 'मुनाफ़ा' : 'Profit'}
              </p>
              <p className="text-heading-3" style={{
                margin: 0,
                color: todaySummary.profit >= 0 ? 'var(--color-positive)' : 'var(--color-problem)',
              }}>
                {formatCurrency(todaySummary.profit)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Insight */}
      {topInsight && <InsightCard insight={topInsight} />}

      {/* Quick Add Row */}
      <div className="quick-add-row">
        <button
          onClick={() => setShowEntry('sale')}
          className="quick-add-button"
        >
          <span className="icon">💰</span>
          <span className="label">{lang === 'hi' ? 'बिक्री' : 'Sale'}</span>
        </button>
        <button
          onClick={() => setShowEntry('expense')}
          className="quick-add-button"
        >
          <span className="icon">💸</span>
          <span className="label">{lang === 'hi' ? 'खर्चा' : 'Expense'}</span>
        </button>
        <button
          onClick={() => setShowEntry('udhaar')}
          className="quick-add-button"
          style={{ position: 'relative' }}
        >
          <span className="icon">📒</span>
          <span className="label">{lang === 'hi' ? 'उधार' : 'Udhaar'}</span>
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

import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { getBenchmarksForShop, canShowBenchmarks } from '../../models/community';
import { calculateDailyTotals } from '../../models/data';

export default function CommunityBenchmarks() {
  const { state } = useApp();
  const { lang } = useTranslation();

  // Check if we have enough data to show benchmarks
  const dailyTotals = calculateDailyTotals(state.shopData);
  const hasEnoughData = canShowBenchmarks(dailyTotals.length);

  if (!hasEnoughData) {
    return null;
  }

  const relevantBenchmarks = getBenchmarksForShop(state.shopProfile.shopType);

  if (relevantBenchmarks.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: 'var(--space-xl)' }}>
      <h2 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
        {lang === 'hi' ? 'आपके जैसे दुकानदार' : 'Shops like yours'}
      </h2>
      <p className="text-body-sm" style={{ 
        color: 'var(--color-text-secondary)', 
        margin: '0 0 var(--space-md) 0',
        fontStyle: 'italic',
      }}>
        {lang === 'hi' 
          ? '📊 ये अनुमानित आंकड़े हैं, असली डेटा नहीं'
          : '📊 These are estimates, not actual data'}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {relevantBenchmarks.slice(0, 3).map((benchmark) => (
          <div key={benchmark.id} className="card" style={{
            padding: 'var(--space-md)',
            backgroundColor: 'var(--color-bg)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <span style={{ fontSize: '32px' }}>{benchmark.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-xs)' }}>
                  <p className="text-body-md" style={{ margin: 0, fontWeight: 600 }}>
                    {benchmark.title[lang]}
                  </p>
                  <p className="text-heading-3" style={{ margin: 0, color: 'var(--color-primary)' }}>
                    {benchmark.value}
                  </p>
                </div>
                <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                  {benchmark.description[lang]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

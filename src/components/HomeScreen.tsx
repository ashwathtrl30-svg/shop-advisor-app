import React from 'react';

export default function HomeScreen() {
  return (
    <div style={{ padding: '0 var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      
      {/* Today's Summary Card */}
      <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-sm) 0' }}>
          Today's Sales
        </p>
        <p className="text-number" style={{ color: 'var(--color-primary)', margin: '0 0 var(--space-sm) 0' }}>
          ₹8,450
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
          <span style={{ color: 'var(--color-positive)', fontSize: '14px', fontWeight: 600 }}>
            ↑ 12% more than yesterday
          </span>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
        <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>
            Expenses
          </p>
          <p style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
            ₹3,200
          </p>
        </div>
        <div className="card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>
            Profit
          </p>
          <p style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: 'var(--color-positive)' }}>
            ₹5,250
          </p>
        </div>
      </div>

      {/* Smart Tip (Accent) */}
      <div className="card animate-fade-in" style={{
        animationDelay: '0.2s',
        borderLeft: '4px solid var(--color-accent)',
        backgroundColor: 'var(--color-accent-light)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
          <span style={{ fontSize: '28px' }}>💡</span>
          <div>
            <p className="text-heading-3" style={{ margin: '0 0 var(--space-xs) 0', color: 'var(--color-text)' }}>
              Smart Tip
            </p>
            <p className="text-body-md" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              Your Maggi stock is running low. You sell about 20 packets daily. Order 100 more today to avoid missing sales this week.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div style={{ marginTop: 'auto', paddingTop: 'var(--space-md)' }}>
        <button className="btn-primary" style={{ fontSize: '20px' }}>
          <span style={{ fontSize: '24px' }}>✏️</span>
          Add Today's Numbers
        </button>
      </div>

      {/* Secondary action */}
      <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
        <span>🎤</span>
        <span>Or tell me by voice</span>
      </button>
    </div>
  );
}

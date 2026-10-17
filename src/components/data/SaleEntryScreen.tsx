import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import NumberPad from '../NumberPad';
import { SaleEntry, generateId, getToday, formatCurrency } from '../../models/data';

interface SaleEntryScreenProps {
  onClose: () => void;
}

export default function SaleEntryScreen({ onClose }: SaleEntryScreenProps) {
  const { dispatch } = useApp();
  const { t, lang } = useTranslation();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string | undefined>();
  const [paymentType, setPaymentType] = useState<'cash' | 'upi' | 'udhaar'>('cash');

  const categories = [
    { key: 'grocery', emoji: '🛒', label: lang === 'hi' ? 'किराना' : 'Grocery' },
    { key: 'snacks', emoji: '🍿', label: lang === 'hi' ? 'नाश्ता' : 'Snacks' },
    { key: 'dairy', emoji: '🥛', label: lang === 'hi' ? 'दूध-दही' : 'Dairy' },
    { key: 'beverages', emoji: '🥤', label: lang === 'hi' ? 'पेय' : 'Beverages' },
    { key: 'personal', emoji: '🧴', label: lang === 'hi' ? 'निजी' : 'Personal Care' },
    { key: 'other', emoji: '📦', label: lang === 'hi' ? 'अन्य' : 'Other' },
  ];

  const handleSave = () => {
    if (!amount) return;

    const entry: SaleEntry = {
      id: generateId(),
      date: getToday(),
      amount: parseInt(amount, 10),
      category,
      paymentType,
      timestamp: Date.now(),
    };

    dispatch({ type: 'ADD_SALE', payload: entry });
    dispatch({
      type: 'SET_LAST_ACTION',
      payload: { type: 'sale', id: entry.id, timestamp: Date.now() },
    });

    onClose();
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-bg)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        padding: 'var(--space-md) var(--space-lg)',
        borderBottom: '1px solid var(--color-border)',
        minHeight: 'var(--top-bar-height)',
      }}>
        <button 
          onClick={onClose} 
          style={{ 
            minWidth: '48px',
            minHeight: '48px',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text)',
            fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-family)',
          }}
        >
          <span style={{ fontSize: '20px' }}>←</span>
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>
        <h2 className="text-heading-2" style={{ margin: 0, flex: 1 }}>
          {lang === 'hi' ? 'बिक्री डालें' : 'Add Sale'}
        </h2>
      </div>

      {/* Number Pad */}
      <div style={{ flex: 1 }}>
        <NumberPad
          value={amount}
          onChange={setAmount}
          onSubmit={handleSave}
        />
      </div>

      {/* Payment Type */}
      <div style={{ padding: 'var(--space-md) var(--space-lg)' }}>
        <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-sm) 0' }}>
          {lang === 'hi' ? 'पेमेंट कैसे मिला?' : 'How was payment?'}
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          {[
            { key: 'cash', emoji: '💵', label: lang === 'hi' ? 'नकद' : 'Cash' },
            { key: 'upi', emoji: '📱', label: 'UPI' },
            { key: 'udhaar', emoji: '📒', label: lang === 'hi' ? 'उधार' : 'Udhaar' },
          ].map((p) => (
            <button
              key={p.key}
              onClick={() => setPaymentType(p.key as any)}
              style={{
                flex: 1,
                padding: 'var(--space-md)',
                border: paymentType === p.key ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: paymentType === p.key ? 'var(--color-primary-light)' : 'var(--color-bg-card)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'var(--font-family)',
              }}
            >
              <span style={{ fontSize: '24px' }}>{p.emoji}</span>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Chips */}
      <div style={{ padding: '0 var(--space-lg) var(--space-md)' }}>
        <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-sm) 0' }}>
          {lang === 'hi' ? 'क्या बिका? (वैकल्पिक)' : 'What was sold? (optional)'}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(category === cat.key ? undefined : cat.key)}
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                border: category === cat.key ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
                backgroundColor: category === cat.key ? 'var(--color-primary-light)' : 'var(--color-bg-card)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                fontFamily: 'var(--font-family)',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ padding: 'var(--space-md) var(--space-lg)' }}>
        <button
          onClick={handleSave}
          className="btn-primary"
          style={{ fontSize: '20px' }}
          disabled={!amount}
        >
          {lang === 'hi' ? '✓ सेव करें' : '✓ Save'}
        </button>
      </div>
    </div>
  );
}

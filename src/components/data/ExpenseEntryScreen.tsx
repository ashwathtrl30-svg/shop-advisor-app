import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import NumberPad from '../NumberPad';
import { ExpenseEntry, generateId, getToday } from '../../models/data';

interface ExpenseEntryScreenProps {
  onClose: () => void;
}

export default function ExpenseEntryScreen({ onClose }: ExpenseEntryScreenProps) {
  const { dispatch } = useApp();
  const { lang } = useTranslation();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseEntry['category']>('stock');
  const [description, setDescription] = useState('');

  const categories = [
    { key: 'stock', emoji: '📦', label: lang === 'hi' ? 'सामान खरीदा' : 'Stock Purchase' },
    { key: 'rent', emoji: '🏠', label: lang === 'hi' ? 'किराया' : 'Rent' },
    { key: 'electricity', emoji: '💡', label: lang === 'hi' ? 'बिजली' : 'Electricity' },
    { key: 'salary', emoji: '💰', label: lang === 'hi' ? 'तनख़्वाह' : 'Salary' },
    { key: 'transport', emoji: '🚚', label: lang === 'hi' ? 'ट्रांसपोर्ट' : 'Transport' },
    { key: 'other', emoji: '📝', label: lang === 'hi' ? 'अन्य' : 'Other' },
  ];

  const handleSave = () => {
    if (!amount) return;

    const entry: ExpenseEntry = {
      id: generateId(),
      date: getToday(),
      amount: parseInt(amount, 10),
      category,
      description: description || undefined,
      timestamp: Date.now(),
    };

    dispatch({ type: 'ADD_EXPENSE', payload: entry });
    dispatch({
      type: 'SET_LAST_ACTION',
      payload: { type: 'expense', id: entry.id, timestamp: Date.now() },
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
        justifyContent: 'space-between',
        padding: 'var(--space-md) var(--space-lg)',
      }}>
        <button onClick={onClose} className="btn-ghost">
          ← {lang === 'hi' ? 'वापस' : 'Back'}
        </button>
        <h2 className="text-heading-2" style={{ margin: 0 }}>
          {lang === 'hi' ? 'खर्चा डालें' : 'Add Expense'}
        </h2>
        <div style={{ width: '60px' }} />
      </div>

      {/* Category Selection */}
      <div style={{ padding: 'var(--space-md) var(--space-lg)' }}>
        <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-sm) 0' }}>
          {lang === 'hi' ? 'किस पर खर्चा?' : 'What was it for?'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key as ExpenseEntry['category'])}
              style={{
                padding: 'var(--space-md)',
                border: category === cat.key ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: category === cat.key ? 'var(--color-primary-light)' : 'var(--color-bg-card)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                fontFamily: 'var(--font-family)',
              }}
            >
              <span style={{ fontSize: '28px' }}>{cat.emoji}</span>
              <span style={{ fontSize: '14px', fontWeight: 500, textAlign: 'left' }}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Number Pad */}
      <div style={{ flex: 1 }}>
        <NumberPad
          value={amount}
          onChange={setAmount}
          onSubmit={handleSave}
        />
      </div>

      {/* Description (optional) */}
      <div style={{ padding: 'var(--space-md) var(--space-lg)' }}>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={lang === 'hi' ? 'विवरण (वैकल्पिक)' : 'Description (optional)'}
          style={{
            width: '100%',
            height: 'var(--button-height)',
            fontSize: '16px',
            padding: '0 var(--space-md)',
            border: '2px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-bg-card)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-family)',
            outline: 'none',
          }}
        />
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

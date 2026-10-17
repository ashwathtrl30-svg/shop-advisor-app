import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useVoiceInput, parseVoiceEntry } from '../../hooks/useVoiceInput';
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
  const [showVoice, setShowVoice] = useState(false);

  const { isListening, transcript, startListening, stopListening, isSupported } = useVoiceInput();

  const categories = [
    { key: 'stock', emoji: '📦', label: lang === 'hi' ? 'सामान खरीदा' : 'Stock Purchase' },
    { key: 'rent', emoji: '🏠', label: lang === 'hi' ? 'किराया' : 'Rent' },
    { key: 'electricity', emoji: '💡', label: lang === 'hi' ? 'बिजली' : 'Electricity' },
    { key: 'salary', emoji: '💰', label: lang === 'hi' ? 'तनख़्वाह' : 'Salary' },
    { key: 'transport', emoji: '🚚', label: lang === 'hi' ? 'ट्रांसपोर्ट' : 'Transport' },
    { key: 'other', emoji: '📝', label: lang === 'hi' ? 'अन्य' : 'Other' },
  ];

  const handleVoiceResult = () => {
    const parsed = parseVoiceEntry(transcript, 'expense');
    if (parsed) {
      setAmount(parsed.amount.toString());
      if (parsed.description) {
        setDescription(parsed.description);
        // Try to match category from description
        const desc = parsed.description.toLowerCase();
        if (desc.includes('stock') || desc.includes('सामान') || desc.includes('mal')) {
          setCategory('stock');
        } else if (desc.includes('rent') || desc.includes('किराया')) {
          setCategory('rent');
        } else if (desc.includes('electricity') || desc.includes('बिजली') || desc.includes('bijli')) {
          setCategory('electricity');
        }
      }
    }
    setShowVoice(false);
  };

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

  if (showVoice) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--space-xl)',
        backgroundColor: 'var(--color-bg)',
      }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-xl)' }}>
          <h2 className="text-heading-1" style={{ textAlign: 'center', margin: 0 }}>
            {lang === 'hi' ? 'खर्चा बताएं' : 'Tell me expense'}
          </h2>
          
          <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', textAlign: 'center', margin: 0 }}>
            {lang === 'hi' 
              ? 'बोलें: "चाय के लिए 300 खर्चा" या "stock 5000"'
              : 'Say: "chai ke liye 300 kharcha" or "stock 5000"'}
          </p>

          <button
            onClick={isListening ? stopListening : startListening}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: isListening ? 'var(--color-problem)' : 'var(--color-primary)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              boxShadow: isListening ? '0 0 0 20px rgba(220, 38, 38, 0.2)' : 'var(--shadow-button)',
              transition: 'all 0.3s ease',
            }}
          >
            {isListening ? '⏹️' : '🎤'}
          </button>

          {isListening && (
            <p className="text-body-md" style={{ color: 'var(--color-problem)', textAlign: 'center' }}>
              {lang === 'hi' ? 'सुन रहा हूँ...' : 'Listening...'}
            </p>
          )}

          {transcript && (
            <div className="card" style={{ width: '100%', padding: 'var(--space-lg)' }}>
              <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-xs) 0' }}>
                {lang === 'hi' ? 'मैंने सुना:' : 'I heard:'}
              </p>
              <p className="text-body-lg" style={{ margin: 0, fontStyle: 'italic' }}>
                "{transcript}"
              </p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {transcript && (
            <button onClick={handleVoiceResult} className="btn-primary" style={{ fontSize: '20px' }}>
              {lang === 'hi' ? '✓ यह सही है' : '✓ This is correct'}
            </button>
          )}
          <button onClick={() => setShowVoice(false)} className="btn-secondary">
            {lang === 'hi' ? 'टाइप करके डालें' : 'Type instead'}
          </button>
        </div>
      </div>
    );
  }

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
      <div style={{ padding: 'var(--space-md) var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <button
          onClick={handleSave}
          className="btn-primary"
          style={{ fontSize: '20px' }}
          disabled={!amount}
        >
          {lang === 'hi' ? '✓ सेव करें' : '✓ Save'}
        </button>
        
        {isSupported && (
          <button onClick={() => setShowVoice(true)} className="btn-secondary">
            <span>🎤</span>
            <span>{lang === 'hi' ? 'आवाज़ से डालें' : 'Enter by voice'}</span>
          </button>
        )}
      </div>
    </div>
  );
}

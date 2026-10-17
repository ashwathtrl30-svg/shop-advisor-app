import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useVoiceInput, parseVoiceEntry } from '../../hooks/useVoiceInput';
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
  const [showVoice, setShowVoice] = useState(false);
  const [voicePreview, setVoicePreview] = useState<{ amount: number; description?: string } | null>(null);

  const { isListening, transcript, startListening, stopListening, isSupported } = useVoiceInput();

  const categories = [
    { key: 'grocery', emoji: '🛒', label: lang === 'hi' ? 'किराना' : 'Grocery' },
    { key: 'snacks', emoji: '🍿', label: lang === 'hi' ? 'नाश्ता' : 'Snacks' },
    { key: 'dairy', emoji: '🥛', label: lang === 'hi' ? 'दूध-दही' : 'Dairy' },
    { key: 'beverages', emoji: '🥤', label: lang === 'hi' ? 'पेय' : 'Beverages' },
    { key: 'personal', emoji: '🧴', label: lang === 'hi' ? 'निजी' : 'Personal Care' },
    { key: 'other', emoji: '📦', label: lang === 'hi' ? 'अन्य' : 'Other' },
  ];

  const handleVoiceResult = () => {
    const parsed = parseVoiceEntry(transcript, 'sale');
    if (parsed) {
      setVoicePreview(parsed);
      setAmount(parsed.amount.toString());
      if (parsed.description) {
        setCategory(parsed.description.toLowerCase());
      }
    }
    setShowVoice(false);
  };

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

  if (showVoice) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--space-xl)',
        backgroundColor: 'var(--color-bg)',
      }}>
        {/* Voice Input Screen */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-xl)' }}>
          <h2 className="text-heading-1" style={{ textAlign: 'center', margin: 0 }}>
            {lang === 'hi' ? 'बोलकर बताएं' : 'Tell me by voice'}
          </h2>
          
          <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', textAlign: 'center', margin: 0 }}>
            {lang === 'hi' 
              ? 'बोलें: "आज 4500 का माल बिका" या "5000 की बिक्री"'
              : 'Say: "aaj 4500 ka maal bika" or "5000 ki bikri"'}
          </p>

          {/* Microphone Button */}
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

        {/* Actions */}
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
          {lang === 'hi' ? 'बिक्री डालें' : 'Add Sale'}
        </h2>
        <div style={{ width: '60px' }} />
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

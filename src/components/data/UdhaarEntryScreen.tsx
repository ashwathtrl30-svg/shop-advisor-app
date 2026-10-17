import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import NumberPad from '../NumberPad';
import { UdhaarEntry, generateId, getToday } from '../../models/data';

interface UdhaarEntryScreenProps {
  onClose: () => void;
}

export default function UdhaarEntryScreen({ onClose }: UdhaarEntryScreenProps) {
  const { dispatch } = useApp();
  const { lang } = useTranslation();
  const [step, setStep] = useState<'name' | 'amount' | 'date'>('name');
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [promisedDate, setPromisedDate] = useState('');

  const handleSave = () => {
    if (!customerName || !amount) return;

    const entry: UdhaarEntry = {
      id: generateId(),
      customerName,
      amount: parseInt(amount, 10),
      date: getToday(),
      promisedDate: promisedDate || undefined,
      status: 'pending',
      timestamp: Date.now(),
    };

    dispatch({ type: 'ADD_UDHAAR', payload: entry });
    dispatch({
      type: 'SET_LAST_ACTION',
      payload: { type: 'udhaar', id: entry.id, timestamp: Date.now() },
    });

    onClose();
  };

  const renderNameStep = () => (
    <div style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <h2 className="text-heading-1" style={{ margin: 0 }}>
        {lang === 'hi' ? 'किसका उधार?' : 'Who took udhaar?'}
      </h2>
      <input
        type="text"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        placeholder={lang === 'hi' ? 'ग्राहक का नाम' : 'Customer name'}
        style={{
          width: '100%',
          height: 'var(--button-height)',
          fontSize: '20px',
          padding: '0 var(--space-md)',
          border: '2px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-bg-card)',
          color: 'var(--color-text)',
          fontFamily: 'var(--font-family)',
          outline: 'none',
        }}
        autoFocus
      />
      <button
        onClick={() => setStep('amount')}
        className="btn-primary"
        style={{ fontSize: '20px' }}
        disabled={!customerName.trim()}
      >
        {lang === 'hi' ? 'आगे' : 'Next'}
      </button>
    </div>
  );

  const renderAmountStep = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <NumberPad
        value={amount}
        onChange={setAmount}
        onSubmit={() => setStep('date')}
      />
      <div style={{ padding: 'var(--space-lg)' }}>
        <button
          onClick={() => setStep('date')}
          className="btn-primary"
          style={{ fontSize: '20px' }}
          disabled={!amount}
        >
          {lang === 'hi' ? 'आगे' : 'Next'}
        </button>
      </div>
    </div>
  );

  const renderDateStep = () => (
    <div style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <h2 className="text-heading-1" style={{ margin: 0 }}>
        {lang === 'hi' ? 'कब तक वापस मिलेगा?' : 'When will they pay?'}
      </h2>
      <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
        {lang === 'hi' ? 'वैकल्पिक — आप बाद में भी बता सकते हैं' : 'Optional — you can add this later'}
      </p>
      <input
        type="date"
        value={promisedDate}
        onChange={(e) => setPromisedDate(e.target.value)}
        min={getToday()}
        style={{
          width: '100%',
          height: 'var(--button-height)',
          fontSize: '18px',
          padding: '0 var(--space-md)',
          border: '2px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-bg-card)',
          color: 'var(--color-text)',
          fontFamily: 'var(--font-family)',
          outline: 'none',
        }}
      />
      <button
        onClick={handleSave}
        className="btn-primary"
        style={{ fontSize: '20px' }}
      >
        {lang === 'hi' ? '✓ सेव करें' : '✓ Save'}
      </button>
    </div>
  );

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
        <button
          onClick={() => {
            if (step === 'name') onClose();
            else if (step === 'amount') setStep('name');
            else if (step === 'date') setStep('amount');
          }}
          className="btn-ghost"
        >
          ← {lang === 'hi' ? 'वापस' : 'Back'}
        </button>
        <h2 className="text-heading-2" style={{ margin: 0 }}>
          {lang === 'hi' ? 'उधार डालें' : 'Add Udhaar'}
        </h2>
        <div style={{ width: '60px' }} />
      </div>

      {/* Progress */}
      <div style={{ padding: '0 var(--space-lg)', marginBottom: 'var(--space-md)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: i <= (step === 'name' ? 1 : step === 'amount' ? 2 : 3)
                  ? 'var(--color-primary)'
                  : 'var(--color-border)',
                transition: 'background-color 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {step === 'name' && renderNameStep()}
        {step === 'amount' && renderAmountStep()}
        {step === 'date' && renderDateStep()}
      </div>
    </div>
  );
}

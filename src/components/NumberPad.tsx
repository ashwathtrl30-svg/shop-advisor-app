import React from 'react';

interface NumberPadProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  maxDigits?: number;
}

export default function NumberPad({ value, onChange, onSubmit, maxDigits = 7 }: NumberPadProps) {
  const handleKey = (key: string) => {
    if (key === 'backspace') {
      onChange(value.slice(0, -1));
    } else if (key === 'done') {
      onSubmit();
    } else {
      if (value.length < maxDigits) {
        onChange(value + key);
      }
    }
  };

  const formatDisplay = (num: string) => {
    if (!num) return '0';
    const n = parseInt(num, 10);
    return '₹' + n.toLocaleString('en-IN');
  };

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['backspace', '0', 'done'],
  ];

  return (
    <div>
      {/* Display */}
      <div style={{
        textAlign: 'center',
        padding: 'var(--space-lg)',
        marginBottom: 'var(--space-md)',
      }}>
        <p style={{
          fontSize: '14px',
          color: 'var(--color-text-secondary)',
          margin: '0 0 var(--space-xs) 0',
        }}>
          Amount
        </p>
        <p style={{
          fontSize: '48px',
          fontWeight: 800,
          color: 'var(--color-text)',
          margin: 0,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.02em',
        }}>
          {formatDisplay(value)}
        </p>
      </div>

      {/* Keypad */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 'var(--space-sm)',
        padding: '0 var(--space-md)',
      }}>
        {keys.map((row, rowIndex) =>
          row.map((key) => (
            <button
              key={`${rowIndex}-${key}`}
              onClick={() => handleKey(key)}
              style={{
                height: '64px',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: key === 'done' ? 'var(--color-primary)' : 'var(--color-bg-card)',
                color: key === 'done' ? 'white' : 'var(--color-text)',
                fontSize: key === 'backspace' ? '20px' : '28px',
                fontWeight: 600,
                fontFamily: 'var(--font-family)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.1s ease',
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
              onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {key === 'backspace' ? '⌫' : key === 'done' ? '✓' : key}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

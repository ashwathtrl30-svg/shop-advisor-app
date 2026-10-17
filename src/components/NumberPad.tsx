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
        padding: 'var(--space-6)',
        marginBottom: 'var(--space-4)',
      }}>
        <p className="text-body-sm" style={{
          color: 'var(--color-text-secondary)',
          margin: '0 0 var(--space-2) 0',
        }}>
          Amount
        </p>
        <p className="text-number" style={{
          color: 'var(--color-text)',
          margin: 0,
        }}>
          {formatDisplay(value)}
        </p>
      </div>

      {/* Keypad */}
      <div className="number-pad">
        {keys.map((row, rowIndex) =>
          row.map((key) => (
            <button
              key={`${rowIndex}-${key}`}
              onClick={() => handleKey(key)}
              className="number-pad-key"
              style={{
                backgroundColor: key === 'done' ? 'var(--color-primary)' : undefined,
                color: key === 'done' ? 'white' : undefined,
              }}
            >
              {key === 'backspace' ? '⌫' : key === 'done' ? '✓' : key}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

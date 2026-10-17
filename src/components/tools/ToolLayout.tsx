import React, { ReactNode } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface ToolLayoutProps {
  title: string;
  emoji: string;
  description: string;
  children: ReactNode;
  result?: ReactNode;
  onBack: () => void;
  onSave?: () => void;
  onShare?: () => void;
  showSave?: boolean;
  showShare?: boolean;
}

export default function ToolLayout({
  title,
  emoji,
  description,
  children,
  result,
  onBack,
  onSave,
  onShare,
  showSave = true,
  showShare = true,
}: ToolLayoutProps) {
  const { lang } = useTranslation();

  const handleShareWhatsApp = () => {
    if (onShare) {
      onShare();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-bg)',
      paddingBottom: 'var(--space-xl)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--space-md) var(--space-lg)',
        gap: 'var(--space-md)',
        borderBottom: '1px solid var(--color-border)',
        minHeight: 'var(--top-bar-height)',
      }}>
        <button 
          onClick={onBack} 
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
        <div style={{ flex: 1 }}>
          <h2 className="text-heading-2" style={{ margin: 0 }}>
            {emoji} {title}
          </h2>
        </div>
      </div>

      {/* Description */}
      <p className="text-body-md" style={{
        color: 'var(--color-text-secondary)',
        margin: '0 var(--space-lg) var(--space-lg)',
      }}>
        {description}
      </p>

      {/* Inputs */}
      <div style={{ padding: '0 var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {children}
      </div>

      {/* Result */}
      {result && (
        <div style={{ padding: 'var(--space-lg)' }}>
          <div className="card" style={{
            backgroundColor: 'var(--color-primary-light)',
            borderLeft: '4px solid var(--color-primary)',
          }}>
            {result}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {(showSave || showShare) && (
        <div style={{
          padding: 'var(--space-md) var(--space-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
          marginTop: 'auto',
        }}>
          {showSave && onSave && (
            <button onClick={onSave} className="btn-primary">
              💾 {lang === 'hi' ? 'सेव करें' : 'Save'}
            </button>
          )}
          {showShare && (
            <button onClick={handleShareWhatsApp} className="btn-secondary">
              📱 {lang === 'hi' ? 'WhatsApp पर भेजें' : 'Share on WhatsApp'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Shared input component
export function ToolInput({
  label,
  value,
  onChange,
  type = 'number',
  placeholder,
  prefix,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  prefix?: string;
}) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '14px',
        fontWeight: 500,
        color: 'var(--color-text-secondary)',
        marginBottom: 'var(--space-xs)',
      }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        {prefix && (
          <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text)' }}>
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={type === 'number' ? 'numeric' : undefined}
          style={{
            width: '100%',
            height: '56px',
            fontSize: '20px',
            fontWeight: 600,
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
    </div>
  );
}

// WhatsApp share helper
export function shareOnWhatsApp(text: string): void {
  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/?text=${encoded}`, '_blank');
}

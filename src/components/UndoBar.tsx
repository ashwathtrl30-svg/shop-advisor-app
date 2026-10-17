import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

export default function UndoBar() {
  const { state, dispatch } = useApp();
  const { lang } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (state.lastAction) {
      setVisible(true);
      setTimeLeft(5);
      
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setVisible(false);
            dispatch({ type: 'SET_LAST_ACTION', payload: null });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [state.lastAction]);

  const handleUndo = () => {
    if (state.lastAction) {
      dispatch({
        type: 'UNDO_DELETE',
        payload: { type: state.lastAction.type as any, id: state.lastAction.id },
      });
      dispatch({ type: 'SET_LAST_ACTION', payload: null });
      setVisible(false);
    }
  };

  if (!visible || !state.lastAction) return null;

  const getMessage = () => {
    if (lang === 'hi') {
      return 'सेव हो गया';
    }
    return 'Saved';
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'calc(var(--nav-height) + var(--space-md))',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'var(--color-text)',
        color: 'white',
        padding: 'var(--space-md) var(--space-lg)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-lg)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        maxWidth: '90%',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <span style={{ fontSize: '16px', fontWeight: 500 }}>
        {getMessage()} ({timeLeft}s)
      </span>
      <button
        onClick={handleUndo}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: 'var(--color-accent)',
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'var(--font-family)',
          padding: '4px 8px',
        }}
      >
        {lang === 'hi' ? 'Undo' : 'Undo'}
      </button>
    </div>
  );
}

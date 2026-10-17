import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { exportData, importData, clearState } from '../services/storage';

export default function ProfileScreen() {
  const { state, dispatch } = useApp();
  const { lang } = useTranslation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [pin, setPin] = useState('');
  const [editingShopName, setEditingShopName] = useState(false);
  const [shopNameInput, setShopNameInput] = useState(state.shopProfile.shopName || '');

  const handleBack = () => {
    dispatch({ type: 'SET_SCREEN', payload: 'main' });
  };

  const handleExportData = () => {
    const json = exportData(state);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dukaandost-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const json = e.target?.result as string;
      const { state: importedState, error } = importData(json);
      
      if (error) {
        alert(error);
        return;
      }

      if (importedState) {
        dispatch({ type: 'LOAD_STATE', payload: importedState });
        alert(lang === 'hi' ? 'डेटा सफलतापूर्वक इम्पोर्ट हो गया' : 'Data imported successfully');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  const handleDeleteData = () => {
    if (showDeleteConfirm) {
      const error = clearState();
      if (error) {
        alert(error.message);
        return;
      }
      dispatch({ type: 'CLEAR_ALL_DATA' });
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleSetPin = () => {
    if (pin.length === 4) {
      // Store PIN in localStorage (in real app, would use secure storage)
      localStorage.setItem('dukaandost-pin', pin);
      setShowPinSetup(false);
      setPin('');
      alert(lang === 'hi' ? 'PIN सेट हो गया' : 'PIN set successfully');
    }
  };

  const handleRemovePin = () => {
    localStorage.removeItem('dukaandost-pin');
    alert(lang === 'hi' ? 'PIN हटा दिया' : 'PIN removed');
  };

  const handleLanguageChange = (newLang: 'en' | 'hi') => {
    dispatch({ type: 'SET_LANGUAGE', payload: newLang });
  };

  const handleSaveShopName = () => {
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: { shopName: shopNameInput }
    });
    setEditingShopName(false);
  };

  const handleShareApp = () => {
    const message = lang === 'hi'
      ? 'मैंने DukaanDost ऐप यूज़ किया और बहुत अच्छा लगा। ये दुकानदारों के लिए बना है - बिक्री, खर्चा, उधार सब ट्रैक करो। फ्री है और हिंदी में काम करता है। तुम भी ट्राई करो: https://dukaandost.com'
      : 'I used DukaanDost app and it\'s really good. It\'s made for shopkeepers - track sales, expenses, udhaar. It\'s free and works in Hindi. You should try it too: https://dukaandost.com';
    
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleReminderTimeChange = (time: string) => {
    dispatch({
      type: 'SET_REMINDER_TIME',
      payload: time
    });
  };

  const handleTextSizeChange = (size: 'small' | 'medium' | 'large') => {
    localStorage.setItem('dukaandost-text-size', size);
    const root = document.documentElement;
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    root.style.setProperty('--base-font-size', sizes[size]);
  };

  const currentTextSize = localStorage.getItem('dukaandost-text-size') || 'medium';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg)',
      paddingBottom: 'var(--space-xl)',
    }}>
      {/* Header */}
      <div style={{
        padding: 'var(--space-md) var(--space-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        borderBottom: '1px solid var(--color-border)',
        minHeight: 'var(--top-bar-height)',
      }}>
        <button 
          onClick={handleBack} 
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
        <h1 className="text-heading-1" style={{ margin: 0, flex: 1 }}>
          👤 {lang === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}
        </h1>
      </div>

      <div style={{ padding: 'var(--space-lg)' }}>
        {/* Shop Info */}
        <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
            }}>
              🏪
            </div>
            <div>
              <p className="text-heading-2" style={{ margin: 0 }}>
                {state.shopProfile.shopName || (lang === 'hi' ? 'मेरी दुकान' : 'My Shop')}
              </p>
              <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                {state.phoneNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
          <h2 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
            {lang === 'hi' ? 'सेटिंग्स' : 'Settings'}
          </h2>

          {/* Language */}
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <p className="text-body-md" style={{ margin: '0 0 var(--space-sm) 0', fontWeight: 600 }}>
              {lang === 'hi' ? 'भाषा' : 'Language'}
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button
                onClick={() => handleLanguageChange('en')}
                className={lang === 'en' ? 'btn-primary' : 'btn-secondary'}
                style={{ flex: 1, padding: 'var(--space-sm)' }}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange('hi')}
                className={lang === 'hi' ? 'btn-primary' : 'btn-secondary'}
                style={{ flex: 1, padding: 'var(--space-sm)' }}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* Dark Mode */}
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p className="text-body-md" style={{ margin: 0, fontWeight: 600 }}>
                {lang === 'hi' ? 'डार्क मोड' : 'Dark Mode'}
              </p>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
                style={{
                  width: '60px',
                  height: '32px',
                  borderRadius: '16px',
                  backgroundColor: state.darkMode ? 'var(--color-primary)' : 'var(--color-border)',
                  position: 'relative',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  position: 'absolute',
                  top: '4px',
                  left: state.darkMode ? '32px' : '4px',
                  transition: 'left 0.2s',
                }} />
              </button>
            </div>
          </div>

          {/* PIN Lock */}
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <p className="text-body-md" style={{ margin: '0 0 var(--space-sm) 0', fontWeight: 600 }}>
              {lang === 'hi' ? 'PIN लॉक' : 'PIN Lock'}
            </p>
            {localStorage.getItem('dukaandost-pin') ? (
              <button
                onClick={handleRemovePin}
                className="btn-secondary"
                style={{ width: '100%', padding: 'var(--space-sm)' }}
              >
                {lang === 'hi' ? 'PIN हटाएं' : 'Remove PIN'}
              </button>
            ) : (
              <button
                onClick={() => setShowPinSetup(true)}
                className="btn-secondary"
                style={{ width: '100%', padding: 'var(--space-sm)' }}
              >
                {lang === 'hi' ? 'PIN सेट करें' : 'Set PIN'}
              </button>
            )}
          </div>
        </div>

        {/* Data Management */}
        <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
          <h2 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
            {lang === 'hi' ? 'डेटा' : 'Data'}
          </h2>

          <button
            onClick={handleExportData}
            className="btn-secondary"
            style={{ width: '100%', marginBottom: 'var(--space-sm)', padding: 'var(--space-sm)' }}
          >
            📥 {lang === 'hi' ? 'डेटा एक्सपोर्ट करें' : 'Export Data'}
          </button>

          <label
            className="btn-secondary"
            style={{ 
              width: '100%', 
              marginBottom: 'var(--space-sm)', 
              padding: 'var(--space-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            📤 {lang === 'hi' ? 'डेटा इम्पोर्ट करें' : 'Import Data'}
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              style={{ display: 'none' }}
            />
          </label>

          <button
            onClick={handleDeleteData}
            className={showDeleteConfirm ? 'btn-problem' : 'btn-secondary'}
            style={{ width: '100%', padding: 'var(--space-sm)' }}
          >
            🗑️ {showDeleteConfirm 
              ? (lang === 'hi' ? 'पक्का डिलीट करें?' : 'Confirm Delete?')
              : (lang === 'hi' ? 'सारा डेटा डिलीट करें' : 'Delete All Data')}
          </button>
        </div>

        {/* Privacy & Help */}
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <button
            onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'privacy' })}
            className="btn-ghost"
            style={{ width: '100%', marginBottom: 'var(--space-sm)', justifyContent: 'flex-start' }}
          >
            🔒 {lang === 'hi' ? 'प्राइवेसी पॉलिसी' : 'Privacy Policy'}
          </button>

          <button
            onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'help' })}
            className="btn-ghost"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            ❓ {lang === 'hi' ? 'मदद' : 'Help'}
          </button>
        </div>
      </div>

      {/* PIN Setup Modal */}
      {showPinSetup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="card" style={{ padding: 'var(--space-lg)', maxWidth: '400px', width: '90%' }}>
            <h2 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
              {lang === 'hi' ? '4 अंकों का PIN डालें' : 'Enter 4-digit PIN'}
            </h2>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              style={{
                width: '100%',
                padding: 'var(--space-md)',
                fontSize: '24px',
                textAlign: 'center',
                letterSpacing: '8px',
                marginBottom: 'var(--space-md)',
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button
                onClick={() => { setShowPinSetup(false); setPin(''); }}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                onClick={handleSetPin}
                className="btn-primary"
                style={{ flex: 1 }}
                disabled={pin.length !== 4}
              >
                {lang === 'hi' ? 'सेट करें' : 'Set'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

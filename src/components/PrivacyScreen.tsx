import React from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

export default function PrivacyScreen() {
  const { state } = useApp();
  const { lang } = useTranslation();

  const handleBack = () => {
    // Navigate back to profile
    window.history.back();
  };

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
      }}>
        <button onClick={handleBack} className="btn-ghost" style={{ minWidth: 'auto', padding: '8px' }}>
          ←
        </button>
        <h1 className="text-heading-1" style={{ margin: 0 }}>
          🔒 {lang === 'hi' ? 'प्राइवेसी' : 'Privacy'}
        </h1>
      </div>

      <div style={{ padding: 'var(--space-lg)' }}>
        {/* What We Collect */}
        <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
          <h2 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
            {lang === 'hi' ? 'हम क्या लेते हैं?' : 'What we collect'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-md)' }}>
              <span style={{ fontSize: '24px' }}>📱</span>
              <div>
                <p className="text-body-md" style={{ margin: '0 0 4px 0', fontWeight: 600 }}>
                  {lang === 'hi' ? 'फ़ोन नंबर' : 'Phone number'}
                </p>
                <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                  {lang === 'hi' 
                    ? 'सिर्फ लॉगिन के लिए। स्पैम नहीं भेजते।'
                    : 'Only for login. We never send spam.'}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-md)' }}>
              <span style={{ fontSize: '24px' }}>🏪</span>
              <div>
                <p className="text-body-md" style={{ margin: '0 0 4px 0', fontWeight: 600 }}>
                  {lang === 'hi' ? 'दुकान की जानकारी' : 'Shop information'}
                </p>
                <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                  {lang === 'hi' 
                    ? 'दुकान का प्रकार, नाम, शहर। बेहतर सलाह के लिए।'
                    : 'Shop type, name, city. For better advice.'}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-md)' }}>
              <span style={{ fontSize: '24px' }}>💰</span>
              <div>
                <p className="text-body-md" style={{ margin: '0 0 4px 0', fontWeight: 600 }}>
                  {lang === 'hi' ? 'बिक्री और खर्चे' : 'Sales & expenses'}
                </p>
                <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                  {lang === 'hi' 
                    ? 'आपके द्वारा डाले गए नंबर। सिर्फ आपके फ़ोन में।'
                    : 'Numbers you enter. Only on your phone.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What We Never Do */}
        <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
          <h2 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
            {lang === 'hi' ? 'हम कभी क्या नहीं करते' : 'What we never do'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <span style={{ fontSize: '20px', color: 'var(--color-positive)' }}>✓</span>
              <p className="text-body-md" style={{ margin: 0 }}>
                {lang === 'hi' 
                  ? 'आपका डेटा कभी नहीं बेचते'
                  : 'Never sell your data'}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <span style={{ fontSize: '20px', color: 'var(--color-positive)' }}>✓</span>
              <p className="text-body-md" style={{ margin: 0 }}>
                {lang === 'hi' 
                  ? 'विज्ञापन नहीं दिखाते'
                  : 'No ads shown'}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <span style={{ fontSize: '20px', color: 'var(--color-positive)' }}>✓</span>
              <p className="text-body-md" style={{ margin: 0 }}>
                {lang === 'hi' 
                  ? 'ग्राहकों को अपने आप मैसेज नहीं भेजते'
                  : 'Never auto-send messages to customers'}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <span style={{ fontSize: '20px', color: 'var(--color-positive)' }}>✓</span>
              <p className="text-body-md" style={{ margin: 0 }}>
                {lang === 'hi' 
                  ? 'बैंक पासवर्ड या OTP नहीं मांगते'
                  : 'Never ask for bank passwords or OTPs'}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <span style={{ fontSize: '20px', color: 'var(--color-positive)' }}>✓</span>
              <p className="text-body-md" style={{ margin: 0 }}>
                {lang === 'hi' 
                  ? 'डेटा के बिना जवाब नहीं देते'
                  : 'Never give answers without data'}
              </p>
            </div>
          </div>
        </div>

        {/* Where Data Lives */}
        <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
          <h2 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
            {lang === 'hi' ? 'डेटा कहाँ रहता है?' : 'Where is your data?'}
          </h2>
          <p className="text-body-md" style={{ margin: '0 0 var(--space-md) 0' }}>
            {lang === 'hi' 
              ? 'आपका सारा डेटा आपके फ़ोन में रहता है। हमारे सर्वर पर कुछ नहीं जाता।'
              : 'All your data stays on your phone. Nothing goes to our servers.'}
          </p>
          <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            {lang === 'hi' 
              ? 'अगर फ़ोन खो जाए या ऐप डिलीट हो जाए, तो डेटा भी चला जाएगा। इसलिए ज़रूरी जानकारी नोट करके रखें।'
              : 'If you lose your phone or delete the app, data will be lost. Keep important info noted down.'}
          </p>
        </div>

        {/* Your Control */}
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <h2 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
            {lang === 'hi' ? 'आपका नियंत्रण' : 'Your control'}
          </h2>
          <p className="text-body-md" style={{ margin: '0 0 var(--space-md) 0' }}>
            {lang === 'hi' 
              ? 'आप कभी भी अपना सारा डेटा एक्सपोर्ट या डिलीट कर सकते हैं। Profile में जाएं।'
              : 'You can export or delete all your data anytime. Go to Profile.'}
          </p>
        </div>
      </div>
    </div>
  );
}

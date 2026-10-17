import React from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

export default function HelpScreen() {
  const { dispatch } = useApp();
  const { lang } = useTranslation();

  const handleBack = () => {
    dispatch({ type: 'SET_SCREEN', payload: 'main' });
  };

  const handleCallSupport = () => {
    window.location.href = 'tel:+911800123456';
  };

  const handleWhatsAppSupport = () => {
    const message = lang === 'hi' 
      ? 'मुझे DukaanDost ऐप के बारे में मदद चाहिए'
      : 'I need help with DukaanDost app';
    window.open(`https://wa.me/911800123456?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleReportProblem = () => {
    const subject = lang === 'hi' ? 'DukaanDost समस्या रिपोर्ट' : 'DukaanDost Problem Report';
    const body = lang === 'hi'
      ? 'कृपया अपनी समस्या यहाँ बताएं:\n\n\n---\nफ़ोन मॉडल: \nऐप वर्शन: 1.0'
      : 'Please describe your problem here:\n\n\n---\nPhone model: \nApp version: 1.0';
    window.location.href = `mailto:support@dukaandost.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
          ❓ {lang === 'hi' ? 'मदद' : 'Help'}
        </h1>
      </div>

      <div style={{ padding: 'var(--space-lg)' }}>
        {/* Contact Us */}
        <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
          <h2 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
            {lang === 'hi' ? 'संपर्क करें' : 'Contact us'}
          </h2>
          <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-lg) 0' }}>
            {lang === 'hi' 
              ? 'कोई सवाल या समस्या? हम मदद के लिए यहां हैं।'
              : 'Any questions or problems? We\'re here to help.'}
          </p>

          <button
            onClick={handleCallSupport}
            className="btn-primary"
            style={{ width: '100%', marginBottom: 'var(--space-md)' }}
          >
            📞 {lang === 'hi' ? 'कॉल करें' : 'Call us'}
          </button>

          <button
            onClick={handleWhatsAppSupport}
            className="btn-secondary"
            style={{ width: '100%', marginBottom: 'var(--space-md)' }}
          >
            💬 {lang === 'hi' ? 'WhatsApp करें' : 'WhatsApp us'}
          </button>

          <button
            onClick={handleReportProblem}
            className="btn-secondary"
            style={{ width: '100%' }}
          >
            🐛 {lang === 'hi' ? 'समस्या रिपोर्ट करें' : 'Report a problem'}
          </button>
        </div>

        {/* FAQs */}
        <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
          <h2 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
            {lang === 'hi' ? 'अक्सर पूछे जाने वाले सवाल' : 'FAQs'}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div>
              <p className="text-body-md" style={{ margin: '0 0 var(--space-xs) 0', fontWeight: 600 }}>
                {lang === 'hi' ? 'क्या मेरा डेटा सुरक्षित है?' : 'Is my data safe?'}
              </p>
              <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                {lang === 'hi' 
                  ? 'हाँ, सारा डेटा आपके फ़ोन में रहता है। हम कुछ नहीं देख सकते।'
                  : 'Yes, all data stays on your phone. We cannot see anything.'}
              </p>
            </div>

            <div>
              <p className="text-body-md" style={{ margin: '0 0 var(--space-xs) 0', fontWeight: 600 }}>
                {lang === 'hi' ? 'क्या यह फ्री है?' : 'Is it free?'}
              </p>
              <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                {lang === 'hi' 
                  ? 'हाँ, बिल्कुल फ्री। कोई विज्ञापन नहीं, कोई छुपे चार्ज नहीं।'
                  : 'Yes, completely free. No ads, no hidden charges.'}
              </p>
            </div>

            <div>
              <p className="text-body-md" style={{ margin: '0 0 var(--space-xs) 0', fontWeight: 600 }}>
                {lang === 'hi' ? 'डेटा डिलीट कैसे करें?' : 'How to delete data?'}
              </p>
              <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                {lang === 'hi' 
                  ? 'Profile में जाएं → "सारा डेटा डिलीट करें" पर टैप करें।'
                  : 'Go to Profile → Tap "Delete All Data".'}
              </p>
            </div>

            <div>
              <p className="text-body-md" style={{ margin: '0 0 var(--space-xs) 0', fontWeight: 600 }}>
                {lang === 'hi' ? 'ऑफ़लाइन काम करता है?' : 'Does it work offline?'}
              </p>
              <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                {lang === 'hi' 
                  ? 'हाँ, ज़्यादातर फीचर्स ऑफ़लाइन काम करते हैं।'
                  : 'Yes, most features work offline.'}
              </p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <h2 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
            {lang === 'hi' ? 'ऐप के बारे में' : 'About the app'}
          </h2>
          <p className="text-body-md" style={{ margin: '0 0 var(--space-sm) 0' }}>
            DukaanDost v1.0
          </p>
          <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            {lang === 'hi' 
              ? 'भारतीय दुकानदारों के लिए बनाया गया। आपकी दुकान बढ़ाने में मदद के लिए।'
              : 'Made for Indian shopkeepers. To help your shop grow.'}
          </p>
        </div>
      </div>
    </div>
  );
}

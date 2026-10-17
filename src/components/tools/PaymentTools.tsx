import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ToolLayout, { ToolInput, shareOnWhatsApp } from './ToolLayout';

interface PaymentToolsProps {
  toolId: string;
  onBack: () => void;
}

export default function PaymentTools({ toolId, onBack }: PaymentToolsProps) {
  if (toolId === 'digital-payments') {
    return <DigitalPaymentsHelper onBack={onBack} />;
  }
  return null;
}

// 8. Digital Payments Helper
function DigitalPaymentsHelper({ onBack }: { onBack: () => void }) {
  const { lang } = useTranslation();
  const [dailySales, setDailySales] = useState('');
  const [showResult, setShowResult] = useState(false);

  const sales = parseFloat(dailySales) || 0;
  
  // Assume 40% customers would pay digitally
  const digitalSales = sales * 0.4;
  const monthlyDigital = digitalSales * 30;
  
  // UPI is free, but estimate time saved
  const timeSavedMinutes = 30; // per day
  const timeSavedHours = (timeSavedMinutes * 30) / 60; // per month

  const shareText = lang === 'hi'
    ? `डिजिटल पेमेंट से फायदा:\nरोज़ की बिक्री: ₹${sales}\nडिजिटल बिक्री: ₹${digitalSales.toFixed(0)}/दिन\nमहीने का: ₹${monthlyDigital.toFixed(0)}\nसमय बचेगा: ${timeSavedHours.toFixed(0)} घंटे/महीने`
    : `Digital payment benefits:\nDaily sales: ₹${sales}\nDigital sales: ₹${digitalSales.toFixed(0)}/day\nMonthly: ₹${monthlyDigital.toFixed(0)}\nTime saved: ${timeSavedHours.toFixed(0)} hrs/month`;

  return (
    <ToolLayout
      title={lang === 'hi' ? 'डिजिटल पेमेंट' : 'Digital Payments'}
      emoji="📱"
      description={lang === 'hi' ? 'UPI और QR कोड कैसे लें?' : 'How to accept UPI & QR codes?'}
      onBack={onBack}
      onShare={() => shareOnWhatsApp(shareText)}
      showSave={false}
      result={
        showResult && sales > 0 ? (
          <div>
            <p className="text-number" style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--color-positive)' }}>
              ✓ {lang === 'hi' ? 'फायदेमंद है!' : 'Worth it!'}
            </p>
            <p className="text-body-md" style={{ margin: 0, whiteSpace: 'pre-line' }}>
              {lang === 'hi'
                ? `हर महीने ₹${monthlyDigital.toFixed(0)} की अतिरिक्त बिक्री\n${timeSavedHours.toFixed(0)} घंटे बचेंगे\nUPI बिल्कुल फ्री है\n\nइसका मतलब: QR लगाने से ज़्यादा ग्राहक आएंगे और समय बचेगा।`
                : `₹${monthlyDigital.toFixed(0)} extra sales per month\n${timeSavedHours.toFixed(0)} hours saved\nUPI is completely free\n\nThis means: QR code brings more customers and saves time.`}
            </p>
          </div>
        ) : null
      }
    >
      {/* Info Section */}
      <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
        <h3 className="text-heading-3" style={{ margin: '0 0 var(--space-md) 0' }}>
          {lang === 'hi' ? 'UPI कैसे शुरू करें?' : 'How to start UPI?'}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <span style={{ fontSize: '24px' }}>1️⃣</span>
            <p className="text-body-md" style={{ margin: 0 }}>
              {lang === 'hi'
                ? 'PhonePe/Paytm/Google Pay से बिज़नेस अकाउंट बनाएं'
                : 'Create business account on PhonePe/Paytm/Google Pay'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <span style={{ fontSize: '24px' }}>2️⃣</span>
            <p className="text-body-md" style={{ margin: 0 }}>
              {lang === 'hi'
                ? 'QR कोड प्रिंट करके काउंटर पर लगाएं'
                : 'Print QR code and place at counter'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <span style={{ fontSize: '24px' }}>3️⃣</span>
            <p className="text-body-md" style={{ margin: 0 }}>
              {lang === 'hi'
                ? 'पैसे सीधे बैंक में आते हैं, कोई चार्ज नहीं'
                : 'Money goes directly to bank, no charges'}
            </p>
          </div>
        </div>
      </div>

      {/* Worth it? Calculator */}
      <div className="card" style={{ padding: 'var(--space-lg)' }}>
        <h3 className="text-heading-3" style={{ margin: '0 0 var(--space-md) 0' }}>
          {lang === 'hi' ? 'क्या फायदेमंद है?' : 'Is it worth it?'}
        </h3>
        <ToolInput
          label={lang === 'hi' ? 'रोज़ की बिक्री' : 'Daily sales'}
          value={dailySales}
          onChange={(val) => { setDailySales(val); setShowResult(true); }}
          prefix="₹"
        />
      </div>
    </ToolLayout>
  );
}

import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import ToolLayout, { shareOnWhatsApp } from './ToolLayout';
import { getPendingUdhaar, formatCurrency } from '../../models/data';

interface StockToolsProps {
  toolId: string;
  onBack: () => void;
}

export default function StockTools({ toolId, onBack }: StockToolsProps) {
  switch (toolId) {
    case 'udhaar-tracker':
      return <UdhaarTracker onBack={onBack} />;
    case 'stock-reorder':
      return <StockReorderHelper onBack={onBack} />;
    case 'festival-planner':
      return <FestivalPlanner onBack={onBack} />;
    default:
      return null;
  }
}

// 4. Udhaar Tracker
function UdhaarTracker({ onBack }: { onBack: () => void }) {
  const { state, dispatch } = useApp();
  const { lang } = useTranslation();
  const pendingUdhaar = getPendingUdhaar(state.shopData);
  const totalOwed = pendingUdhaar.reduce((sum, u) => sum + u.amount, 0);

  const handleMarkPaid = (id: string) => {
    dispatch({ type: 'UPDATE_UDHAAR', payload: { id, updates: { status: 'paid' } } });
  };

  const handleSendReminder = (customerName: string, amount: number) => {
    const message = lang === 'hi'
      ? `नमस्ते ${customerName} जी,\nआपका ₹${amount} उधार बाकी है। कृपया जल्दी चुका दें। धन्यवाद!`
      : `Namaste ${customerName} ji,\nYou have ₹${amount} pending udhaar. Please clear it soon. Thank you!`;
    shareOnWhatsApp(message);
  };

  const shareText = lang === 'hi'
    ? `मेरा उधार हिसाब:\nकुल बाकी: ₹${totalOwed}\n${pendingUdhaar.length} ग्राहक`
    : `My udhaar summary:\nTotal pending: ₹${totalOwed}\n${pendingUdhaar.length} customers`;

  return (
    <ToolLayout
      title={lang === 'hi' ? 'उधार ट्रैकर' : 'Udhaar Tracker'}
      emoji="📒"
      description={lang === 'hi' ? 'किसका कितना बाकी?' : 'Who owes what?'}
      onBack={onBack}
      onShare={() => shareOnWhatsApp(shareText)}
      showSave={false}
      result={
        <div>
          <p className="text-number" style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--color-warning)' }}>
            {formatCurrency(totalOwed)}
          </p>
          <p className="text-body-md" style={{ margin: 0 }}>
            {lang === 'hi'
              ? `${pendingUdhaar.length} ग्राहकों से बाकी`
              : `Pending from ${pendingUdhaar.length} customers`}
          </p>
        </div>
      }
    >
      {pendingUdhaar.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
          <div style={{ fontSize: '48px', marginBottom: 'var(--space-md)' }}>✅</div>
          <p className="text-heading-2" style={{ margin: 0 }}>
            {lang === 'hi' ? 'कोई उधार बाकी नहीं' : 'No pending udhaar'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {pendingUdhaar.map((udhaar) => (
            <div key={udhaar.id} className="card" style={{ padding: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                <p className="text-heading-3" style={{ margin: 0 }}>{udhaar.customerName}</p>
                <p className="text-number" style={{ margin: 0, fontSize: '24px', color: 'var(--color-warning)' }}>
                  {formatCurrency(udhaar.amount)}
                </p>
              </div>
              {udhaar.promisedDate && (
                <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-sm) 0' }}>
                  {lang === 'hi' ? 'वादा: ' : 'Promised: '}{udhaar.promisedDate}
                </p>
              )}
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <button
                  onClick={() => handleSendReminder(udhaar.customerName, udhaar.amount)}
                  className="btn-secondary"
                  style={{ flex: 1, height: '44px', fontSize: '14px' }}
                >
                  📱 {lang === 'hi' ? 'रिमाइंडर' : 'Remind'}
                </button>
                <button
                  onClick={() => handleMarkPaid(udhaar.id)}
                  className="btn-ghost"
                  style={{ flex: 1, height: '44px', fontSize: '14px' }}
                >
                  ✓ {lang === 'hi' ? 'मिला' : 'Paid'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}

// 6. Stock Reorder Helper
function StockReorderHelper({ onBack }: { onBack: () => void }) {
  const { lang } = useTranslation();

  // Mock data for demo - in real app would use actual sales data
  const suggestions = [
    { item: lang === 'hi' ? 'मैगी' : 'Maggi', qty: 100, reason: lang === 'hi' ? 'रोज़ 20 बिकते हैं' : 'Sells 20/day' },
    { item: lang === 'hi' ? 'चीनी' : 'Sugar', qty: 50, reason: lang === 'hi' ? 'स्टॉक कम' : 'Low stock' },
    { item: lang === 'hi' ? 'तेल' : 'Oil', qty: 30, reason: lang === 'hi' ? 'हफ्ते में खत्म' : 'Finishes this week' },
  ];

  const shareText = lang === 'hi'
    ? `इस हफ्ते मंगाना:\n${suggestions.map(s => `${s.item}: ${s.qty}`).join('\n')}`
    : `Order this week:\n${suggestions.map(s => `${s.item}: ${s.qty}`).join('\n')}`;

  return (
    <ToolLayout
      title={lang === 'hi' ? 'स्टॉक रिऑर्डर' : 'Stock Reorder'}
      emoji="📦"
      description={lang === 'hi' ? 'इस हफ्ते क्या मंगाएं?' : 'What to buy this week?'}
      onBack={onBack}
      onShare={() => shareOnWhatsApp(shareText)}
      showSave={false}
      result={
        <div>
          <p className="text-heading-2" style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--color-primary)' }}>
            {lang === 'hi' ? '3 सामान मंगाएं' : 'Order 3 items'}
          </p>
          <p className="text-body-md" style={{ margin: 0 }}>
            {lang === 'hi'
              ? 'पिछली बिक्री के हिसाब से'
              : 'Based on past sales'}
          </p>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {suggestions.map((item, i) => (
          <div key={i} className="card" style={{ padding: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p className="text-heading-3" style={{ margin: '0 0 4px 0' }}>{item.item}</p>
                <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>{item.reason}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="text-number" style={{ margin: 0, fontSize: '24px' }}>{item.qty}</p>
                <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                  {lang === 'hi' ? 'यूनिट' : 'units'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}

// 7. Festival Planner
function FestivalPlanner({ onBack }: { onBack: () => void }) {
  const { lang } = useTranslation();

  // Mock upcoming festivals
  const festivals = [
    {
      name: lang === 'hi' ? 'दिवाली' : 'Diwali',
      date: lang === 'hi' ? '1 नवंबर' : 'Nov 1',
      tips: lang === 'hi'
        ? 'मिठाई, ड्राई फ्रूट, गिफ्ट आइटम स्टॉक करें\n50,000 अतिरिक्त कैश रखें'
        : 'Stock sweets, dry fruits, gift items\nKeep ₹50,000 extra cash',
    },
    {
      name: lang === 'hi' ? 'होली' : 'Holi',
      date: lang === 'hi' ? '25 मार्च' : 'Mar 25',
      tips: lang === 'hi'
        ? 'रंग, गुजिया, ठंडाई मसाला\n30,000 अतिरिक्त कैश'
        : 'Colors, gujiya, thandai masala\n₹30,000 extra cash',
    },
  ];

  const shareText = lang === 'hi'
    ? `अगले त्योहार:\n${festivals.map(f => `${f.name} (${f.date})`).join('\n')}`
    : `Upcoming festivals:\n${festivals.map(f => `${f.name} (${f.date})`).join('\n')}`;

  return (
    <ToolLayout
      title={lang === 'hi' ? 'त्योहार प्लानर' : 'Festival Planner'}
      emoji="🎉"
      description={lang === 'hi' ? 'अगले त्योहार की तैयारी' : 'Upcoming festival prep'}
      onBack={onBack}
      onShare={() => shareOnWhatsApp(shareText)}
      showSave={false}
      result={
        <div>
          <p className="text-heading-2" style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--color-accent)' }}>
            {festivals[0].name} {festivals[0].date}
          </p>
          <p className="text-body-md" style={{ margin: 0 }}>
            {lang === 'hi' ? '2 महीने बाद' : 'In 2 months'}
          </p>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {festivals.map((fest, i) => (
          <div key={i} className="card" style={{ padding: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <span style={{ fontSize: '36px' }}>🎊</span>
              <div>
                <p className="text-heading-2" style={{ margin: 0 }}>{fest.name}</p>
                <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>{fest.date}</p>
              </div>
            </div>
            <p className="text-body-md" style={{ margin: 0, whiteSpace: 'pre-line', color: 'var(--color-text-secondary)' }}>
              {fest.tips}
            </p>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}

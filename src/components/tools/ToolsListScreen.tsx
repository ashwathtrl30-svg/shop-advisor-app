import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';

interface ToolsListScreenProps {
  onSelectTool: (toolId: string) => void;
}

export default function ToolsListScreen({ onSelectTool }: ToolsListScreenProps) {
  const { state } = useApp();
  const { lang } = useTranslation();
  const shopType = state.shopProfile.shopType;

  // Define all tools with relevance per shop type
  const allTools = [
    {
      id: 'profit-calc',
      emoji: '🧮',
      title: lang === 'hi' ? 'मुनाफ़ा कैलकुलेटर' : 'Profit Calculator',
      desc: lang === 'hi' ? 'हर सामान पर कितना कमाया?' : 'How much profit per item?',
      relevance: ['kirana', 'medical', 'bakery', 'sweet', 'vegetable', 'mobile', 'hardware'],
    },
    {
      id: 'price-setter',
      emoji: '🏷️',
      title: lang === 'hi' ? 'कीमत तय करें' : 'Price Setter',
      desc: lang === 'hi' ? 'कितना में बेचें?' : 'What price to charge?',
      relevance: ['kirana', 'medical', 'bakery', 'sweet', 'vegetable', 'mobile', 'hardware', 'tailor'],
    },
    {
      id: 'break-even',
      emoji: '⚖️',
      title: lang === 'hi' ? 'ब्रेक-ईवन' : 'Break-Even',
      desc: lang === 'hi' ? 'रोज़ कितना बेचना ज़रूरी?' : 'How much to sell daily?',
      relevance: ['all'],
    },
    {
      id: 'udhaar-tracker',
      emoji: '📒',
      title: lang === 'hi' ? 'उधार ट्रैकर' : 'Udhaar Tracker',
      desc: lang === 'hi' ? 'किसका कितना बाकी?' : 'Who owes what?',
      relevance: ['all'],
    },
    {
      id: 'monthly-cost',
      emoji: '📊',
      title: lang === 'hi' ? 'मंथली खर्चा प्लानर' : 'Monthly Cost Planner',
      desc: lang === 'hi' ? 'हर महीने कितना खर्चा?' : 'Monthly expenses breakdown',
      relevance: ['all'],
    },
    {
      id: 'stock-reorder',
      emoji: '📦',
      title: lang === 'hi' ? 'स्टॉक रिऑर्डर' : 'Stock Reorder Helper',
      desc: lang === 'hi' ? 'इस हफ्ते क्या मंगाएं?' : 'What to buy this week?',
      relevance: ['kirana', 'medical', 'bakery', 'sweet', 'vegetable', 'mobile', 'hardware'],
    },
    {
      id: 'festival-planner',
      emoji: '🎉',
      title: lang === 'hi' ? 'त्योहार प्लानर' : 'Festival Planner',
      desc: lang === 'hi' ? 'अगले त्योहार की तैयारी' : 'Upcoming festival prep',
      relevance: ['kirana', 'bakery', 'sweet', 'vegetable', 'clothing'],
    },
    {
      id: 'digital-payments',
      emoji: '📱',
      title: lang === 'hi' ? 'डिजिटल पेमेंट' : 'Digital Payments',
      desc: lang === 'hi' ? 'UPI और QR कैसे लें?' : 'Accept UPI & QR codes',
      relevance: ['all'],
    },
    {
      id: 'loan-checker',
      emoji: '🏦',
      title: lang === 'hi' ? 'लोन चेकर' : 'Loan Checker',
      desc: lang === 'hi' ? 'दो लोन की तुलना करें' : 'Compare two loan offers',
      relevance: ['all'],
    },
    {
      id: 'savings-goal',
      emoji: '🎯',
      title: lang === 'hi' ? 'बचत लक्ष्य' : 'Savings Goal',
      desc: lang === 'hi' ? 'कितना बचाना है हर महीने?' : 'How much to save monthly?',
      relevance: ['all'],
    },
    {
      id: 'bill-splitter',
      emoji: '🧾',
      title: lang === 'hi' ? 'बिल बांटें' : 'Bill Splitter',
      desc: lang === 'hi' ? 'स्टाफ़ में खर्चा बांटें' : 'Split expenses with staff',
      relevance: ['restaurant', 'salon', 'all'],
    },
    {
      id: 'bargain-helper',
      emoji: '🤝',
      title: lang === 'hi' ? 'मोलभाव हेल्पर' : 'Bargain Helper',
      desc: lang === 'hi' ? 'कम से कम कितना लें?' : 'Lowest price to accept?',
      relevance: ['kirana', 'vegetable', 'hardware', 'mobile', 'tailor'],
    },
  ];

  // Sort tools: relevant to shop type first, then others
  const sortedTools = [...allTools].sort((a, b) => {
    const aRelevant = a.relevance.includes('all') || a.relevance.includes(shopType || '');
    const bRelevant = b.relevance.includes('all') || b.relevance.includes(shopType || '');
    
    if (aRelevant && !bRelevant) return -1;
    if (!aRelevant && bRelevant) return 1;
    return 0;
  });

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <h2 className="text-heading-1" style={{ margin: '0 0 var(--space-sm) 0' }}>
        {lang === 'hi' ? 'टूल्स' : 'Tools'}
      </h2>
      <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-lg) 0' }}>
        {lang === 'hi' 
          ? 'आपकी दुकान के लिए आसान टूल्स'
          : 'Simple tools for your shop'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {sortedTools.map((tool, index) => {
          const isRelevant = tool.relevance.includes('all') || tool.relevance.includes(shopType || '');
          
          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="card"
              style={{
                padding: 'var(--space-lg)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                textAlign: 'left',
                cursor: 'pointer',
                border: '1px solid var(--color-border)',
                position: 'relative',
              }}
            >
              <span style={{ fontSize: '36px' }}>{tool.emoji}</span>
              <div style={{ flex: 1 }}>
                <p className="text-heading-3" style={{ margin: '0 0 4px 0' }}>
                  {tool.title}
                </p>
                <p className="text-body-sm" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                  {tool.desc}
                </p>
              </div>
              {isRelevant && index < 5 && (
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: 'var(--color-accent)',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                }}>
                  {lang === 'hi' ? 'आपके लिए' : 'For you'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

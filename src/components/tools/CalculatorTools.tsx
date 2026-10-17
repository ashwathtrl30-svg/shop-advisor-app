import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ToolLayout, { ToolInput, shareOnWhatsApp } from './ToolLayout';

interface CalculatorToolsProps {
  toolId: string;
  onBack: () => void;
}

export default function CalculatorTools({ toolId, onBack }: CalculatorToolsProps) {
  switch (toolId) {
    case 'profit-calc':
      return <ProfitCalculator onBack={onBack} />;
    case 'price-setter':
      return <PriceSetter onBack={onBack} />;
    case 'break-even':
      return <BreakEvenCalculator onBack={onBack} />;
    case 'bargain-helper':
      return <BargainHelper onBack={onBack} />;
    default:
      return null;
  }
}

// 1. Profit Calculator
function ProfitCalculator({ onBack }: { onBack: () => void }) {
  const { lang } = useTranslation();
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [quantity, setQuantity] = useState('1');

  const cost = parseFloat(costPrice) || 0;
  const selling = parseFloat(sellingPrice) || 0;
  const qty = parseInt(quantity) || 1;

  const profitPerItem = selling - cost;
  const totalProfit = profitPerItem * qty;
  const profitPer100 = cost > 0 ? ((selling - cost) / cost) * 100 : 0;

  const resultText = lang === 'hi'
    ? `हर सामान पर मुनाफ़ा: ₹${profitPerItem.toFixed(0)}\nकुल मुनाफ़ा (${qty} सामान): ₹${totalProfit.toFixed(0)}\nहर ₹100 खर्च पर कमाई: ₹${profitPer100.toFixed(0)}\n\nइसका मतलब: आप हर ₹100 के सामान पर ₹${profitPer100.toFixed(0)} कमाते हैं।`
    : `Profit per item: ₹${profitPerItem.toFixed(0)}\nTotal profit (${qty} items): ₹${totalProfit.toFixed(0)}\nProfit per ₹100 spent: ₹${profitPer100.toFixed(0)}\n\nThis means: For every ₹100 you spend, you earn ₹${profitPer100.toFixed(0)} profit.`;

  const shareText = lang === 'hi'
    ? `मेरी दुकान का हिसाब:\nखरीद: ₹${cost}\nबिक्री: ₹${selling}\nमुनाफ़ा: ₹${profitPerItem.toFixed(0)} प्रति सामान`
    : `My shop calculation:\nCost: ₹${cost}\nSelling: ₹${selling}\nProfit: ₹${profitPerItem.toFixed(0)} per item`;

  return (
    <ToolLayout
      title={lang === 'hi' ? 'मुनाफ़ा कैलकुलेटर' : 'Profit Calculator'}
      emoji="🧮"
      description={lang === 'hi' ? 'हर सामान पर कितना कमाया?' : 'How much profit per item?'}
      onBack={onBack}
      onShare={() => shareOnWhatsApp(shareText)}
      result={
        cost > 0 && selling > 0 ? (
          <div>
            <p className="text-number" style={{ margin: '0 0 var(--space-sm) 0', color: totalProfit >= 0 ? 'var(--color-positive)' : 'var(--color-problem)' }}>
              ₹{totalProfit.toFixed(0)}
            </p>
            <p className="text-body-md" style={{ margin: 0, whiteSpace: 'pre-line' }}>
              {resultText}
            </p>
          </div>
        ) : null
      }
    >
      <ToolInput
        label={lang === 'hi' ? 'खरीद कीमत (एक सामान)' : 'Cost price (per item)'}
        value={costPrice}
        onChange={setCostPrice}
        prefix="₹"
      />
      <ToolInput
        label={lang === 'hi' ? 'बेचने की कीमत' : 'Selling price'}
        value={sellingPrice}
        onChange={setSellingPrice}
        prefix="₹"
      />
      <ToolInput
        label={lang === 'hi' ? 'कितने सामान?' : 'How many items?'}
        value={quantity}
        onChange={setQuantity}
      />
    </ToolLayout>
  );
}

// 2. Price Setter
function PriceSetter({ onBack }: { onBack: () => void }) {
  const { lang } = useTranslation();
  const [costPrice, setCostPrice] = useState('');
  const [profitPercent, setProfitPercent] = useState('20');

  const cost = parseFloat(costPrice) || 0;
  const profitPct = parseFloat(profitPercent) || 0;

  const sellingPrice = cost + (cost * profitPct / 100);
  const profitAmount = sellingPrice - cost;

  const resultText = lang === 'hi'
    ? `आपको ₹${sellingPrice.toFixed(0)} में बेचना चाहिए\nमुनाफ़ा होगा: ₹${profitAmount.toFixed(0)} (${profitPct}%)\n\nइसका मतलब: ₹${cost} के सामान पर ₹${profitAmount.toFixed(0)} कमाएंगे।`
    : `You should sell at ₹${sellingPrice.toFixed(0)}\nProfit will be: ₹${profitAmount.toFixed(0)} (${profitPct}%)\n\nThis means: On ₹${cost} cost, you'll earn ₹${profitAmount.toFixed(0)} profit.`;

  const shareText = lang === 'hi'
    ? `कीमत तय की:\nखरीद: ₹${cost}\n${profitPct}% मुनाफ़ा के लिए बेचें: ₹${sellingPrice.toFixed(0)}`
    : `Price set:\nCost: ₹${cost}\nSell at ₹${sellingPrice.toFixed(0)} for ${profitPct}% profit`;

  return (
    <ToolLayout
      title={lang === 'hi' ? 'कीमत तय करें' : 'Price Setter'}
      emoji="🏷️"
      description={lang === 'hi' ? 'कितना % मुनाफ़ा चाहिए, कितने में बेचें?' : 'Want X% profit, what to charge?'}
      onBack={onBack}
      onShare={() => shareOnWhatsApp(shareText)}
      result={
        cost > 0 ? (
          <div>
            <p className="text-number" style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--color-primary)' }}>
              ₹{sellingPrice.toFixed(0)}
            </p>
            <p className="text-body-md" style={{ margin: 0, whiteSpace: 'pre-line' }}>
              {resultText}
            </p>
          </div>
        ) : null
      }
    >
      <ToolInput
        label={lang === 'hi' ? 'खरीद कीमत' : 'Cost price'}
        value={costPrice}
        onChange={setCostPrice}
        prefix="₹"
      />
      <ToolInput
        label={lang === 'hi' ? 'कितना % मुनाफ़ा चाहिए?' : 'What % profit do you want?'}
        value={profitPercent}
        onChange={setProfitPercent}
      />
    </ToolLayout>
  );
}

// 3. Break-Even Calculator
function BreakEvenCalculator({ onBack }: { onBack: () => void }) {
  const { lang } = useTranslation();
  const [fixedCosts, setFixedCosts] = useState('');
  const [profitMargin, setProfitMargin] = useState('20');

  const fixed = parseFloat(fixedCosts) || 0;
  const margin = parseFloat(profitMargin) || 0;

  const breakEvenSales = margin > 0 ? fixed / (margin / 100) : 0;
  const dailyBreakEven = breakEvenSales / 30;

  const resultText = lang === 'hi'
    ? `हर महीने कम से कम ₹${breakEvenSales.toFixed(0)} की बिक्री करें\nरोज़ कम से कम ₹${dailyBreakEven.toFixed(0)} की बिक्री करें\n\nइसका मतलब: इतना बेचेंगे तभी किराया-तनख़्वाह निकलेगा।`
    : `Sell at least ₹${breakEvenSales.toFixed(0)} per month\nSell at least ₹${dailyBreakEven.toFixed(0)} per day\n\nThis means: You need this much sales just to cover rent and salary.`;

  const shareText = lang === 'hi'
    ? `ब्रेक-ईवन:\nफिक्स्ड खर्चा: ₹${fixed}\n${margin}% मार्जिन पर\nरोज़ ₹${dailyBreakEven.toFixed(0)} बेचें`
    : `Break-even:\nFixed costs: ₹${fixed}\nAt ${margin}% margin\nSell ₹${dailyBreakEven.toFixed(0)} daily`;

  return (
    <ToolLayout
      title={lang === 'hi' ? 'ब्रेक-ईवन' : 'Break-Even'}
      emoji="⚖️"
      description={lang === 'hi' ? 'रोज़ कितना बेचना ज़रूरी?' : 'How much to sell daily to cover costs?'}
      onBack={onBack}
      onShare={() => shareOnWhatsApp(shareText)}
      result={
        fixed > 0 && margin > 0 ? (
          <div>
            <p className="text-number" style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--color-warning)' }}>
              ₹{dailyBreakEven.toFixed(0)} / day
            </p>
            <p className="text-body-md" style={{ margin: 0, whiteSpace: 'pre-line' }}>
              {resultText}
            </p>
          </div>
        ) : null
      }
    >
      <ToolInput
        label={lang === 'hi' ? 'मंथली फिक्स्ड खर्चा (किराया + तनख़्वाह + बिजली)' : 'Monthly fixed costs (rent + salary + electricity)'}
        value={fixedCosts}
        onChange={setFixedCosts}
        prefix="₹"
      />
      <ToolInput
        label={lang === 'hi' ? 'मुनाफ़ा मार्जिन %' : 'Profit margin %'}
        value={profitMargin}
        onChange={setProfitMargin}
      />
    </ToolLayout>
  );
}

// 4. Bargain Helper
function BargainHelper({ onBack }: { onBack: () => void }) {
  const { lang } = useTranslation();
  const [costPrice, setCostPrice] = useState('');
  const [minProfit, setMinProfit] = useState('');
  const [customerOffer, setCustomerOffer] = useState('');

  const cost = parseFloat(costPrice) || 0;
  const minProfitAmt = parseFloat(minProfit) || 0;
  const offer = parseFloat(customerOffer) || 0;

  const lowestAcceptable = cost + minProfitAmt;
  const shouldAccept = offer >= lowestAcceptable;
  const lossIfAccepted = offer - cost;

  const resultText = shouldAccept
    ? lang === 'hi'
      ? `✓ यह डील लें!\nग्राहक ने ₹${offer} ऑफर किया\nआपका खर्चा: ₹${cost}\nमुनाफ़ा: ₹${lossIfAccepted.toFixed(0)}\n\nइसका मतलब: कम से कम ₹${minProfitAmt} मुनाफ़ा होगा।`
      : `✓ Accept this deal!\nCustomer offered ₹${offer}\nYour cost: ₹${cost}\nProfit: ₹${lossIfAccepted.toFixed(0)}\n\nThis means: You'll make at least ₹${minProfitAmt} profit.`
    : lang === 'hi'
      ? `✗ यह डील मत लें!\nग्राहक ने ₹${offer} ऑफर किया\nआपको कम से कम ₹${lowestAcceptable} चाहिए\nनुकसान: ₹${(offer - lowestAcceptable).toFixed(0)}\n\nइसका मतलब: ₹${Math.abs(offer - lowestAcceptable).toFixed(0)} कम मिलेगा आपकी सोची हुई कमाई से।`
      : `✗ Don't accept this deal!\nCustomer offered ₹${offer}\nYou need at least ₹${lowestAcceptable}\nShortfall: ₹${(offer - lowestAcceptable).toFixed(0)}\n\nThis means: You'll get ₹${Math.abs(offer - lowestAcceptable).toFixed(0)} less than your target profit.`;

  const shareText = lang === 'hi'
    ? `मोलभाव:\nखर्चा: ₹${cost}\nन्यूनतम मुनाफ़ा: ₹${minProfitAmt}\nकम से कम लें: ₹${lowestAcceptable}`
    : `Bargain:\nCost: ₹${cost}\nMin profit: ₹${minProfitAmt}\nAccept above: ₹${lowestAcceptable}`;

  return (
    <ToolLayout
      title={lang === 'hi' ? 'मोलभाव हेल्पर' : 'Bargain Helper'}
      emoji="🤝"
      description={lang === 'hi' ? 'कम से कम कितना लें?' : 'Lowest price to accept?'}
      onBack={onBack}
      onShare={() => shareOnWhatsApp(shareText)}
      result={
        cost > 0 ? (
          <div>
            <p className="text-number" style={{ 
              margin: '0 0 var(--space-sm) 0', 
              color: shouldAccept ? 'var(--color-positive)' : 'var(--color-problem)',
            }}>
              {shouldAccept ? '✓' : '✗'} ₹{offer || lowestAcceptable}
            </p>
            <p className="text-body-md" style={{ margin: 0, whiteSpace: 'pre-line' }}>
              {resultText}
            </p>
          </div>
        ) : null
      }
    >
      <ToolInput
        label={lang === 'hi' ? 'आपकी खरीद कीमत' : 'Your cost price'}
        value={costPrice}
        onChange={setCostPrice}
        prefix="₹"
      />
      <ToolInput
        label={lang === 'hi' ? 'कम से कम कितना मुनाफ़ा चाहिए?' : 'Minimum profit you want'}
        value={minProfit}
        onChange={setMinProfit}
        prefix="₹"
      />
      <ToolInput
        label={lang === 'hi' ? 'ग्राहक ने कितना ऑफर किया?' : 'What did customer offer?'}
        value={customerOffer}
        onChange={setCustomerOffer}
        prefix="₹"
      />
    </ToolLayout>
  );
}

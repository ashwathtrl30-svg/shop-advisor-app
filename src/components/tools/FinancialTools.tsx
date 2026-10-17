import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ToolLayout, { ToolInput, shareOnWhatsApp } from './ToolLayout';

interface FinancialToolsProps {
  toolId: string;
  onBack: () => void;
}

export default function FinancialTools({ toolId, onBack }: FinancialToolsProps) {
  switch (toolId) {
    case 'monthly-cost':
      return <MonthlyCostPlanner onBack={onBack} />;
    case 'loan-checker':
      return <LoanChecker onBack={onBack} />;
    case 'savings-goal':
      return <SavingsGoal onBack={onBack} />;
    case 'bill-splitter':
      return <BillSplitter onBack={onBack} />;
    default:
      return null;
  }
}

// 5. Monthly Cost Planner
function MonthlyCostPlanner({ onBack }: { onBack: () => void }) {
  const { lang } = useTranslation();
  const [rent, setRent] = useState('');
  const [salary, setSalary] = useState('');
  const [electricity, setElectricity] = useState('');
  const [other, setOther] = useState('');

  const r = parseFloat(rent) || 0;
  const s = parseFloat(salary) || 0;
  const e = parseFloat(electricity) || 0;
  const o = parseFloat(other) || 0;
  const total = r + s + e + o;

  const resultText = lang === 'hi'
    ? `कुल मंथली खर्चा: ₹${total.toLocaleString('en-IN')}\n\nकिराया: ₹${r.toLocaleString('en-IN')}\nतनख़्वाह: ₹${s.toLocaleString('en-IN')}\nबिजली: ₹${e.toLocaleString('en-IN')}\nअन्य: ₹${o.toLocaleString('en-IN')}\n\nइसका मतलब: हर महीने कम से कम इतना कमाना ज़रूरी।`
    : `Total monthly expenses: ₹${total.toLocaleString('en-IN')}\n\nRent: ₹${r.toLocaleString('en-IN')}\nSalary: ₹${s.toLocaleString('en-IN')}\nElectricity: ₹${e.toLocaleString('en-IN')}\nOther: ₹${o.toLocaleString('en-IN')}\n\nThis means: You need to earn at least this much every month.`;

  const shareText = lang === 'hi'
    ? `मेरा मंथली खर्चा:\nकिराया: ₹${r}\nतनख़्वाह: ₹${s}\nबिजली: ₹${e}\nअन्य: ₹${o}\nकुल: ₹${total}`
    : `My monthly expenses:\nRent: ₹${r}\nSalary: ₹${s}\nElectricity: ₹${e}\nOther: ₹${o}\nTotal: ₹${total}`;

  return (
    <ToolLayout
      title={lang === 'hi' ? 'मंथली खर्चा प्लानर' : 'Monthly Cost Planner'}
      emoji="📊"
      description={lang === 'hi' ? 'हर महीने कितना खर्चा?' : 'Monthly expenses breakdown'}
      onBack={onBack}
      onShare={() => shareOnWhatsApp(shareText)}
      result={
        total > 0 ? (
          <div>
            <p className="text-number" style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--color-warning)' }}>
              ₹{total.toLocaleString('en-IN')}
            </p>
            <p className="text-body-md" style={{ margin: 0, whiteSpace: 'pre-line' }}>
              {resultText}
            </p>
          </div>
        ) : null
      }
    >
      <ToolInput
        label={lang === 'hi' ? 'किराया' : 'Rent'}
        value={rent}
        onChange={setRent}
        prefix="₹"
      />
      <ToolInput
        label={lang === 'hi' ? 'तनख़्वाह' : 'Salary'}
        value={salary}
        onChange={setSalary}
        prefix="₹"
      />
      <ToolInput
        label={lang === 'hi' ? 'बिजली' : 'Electricity'}
        value={electricity}
        onChange={setElectricity}
        prefix="₹"
      />
      <ToolInput
        label={lang === 'hi' ? 'अन्य खर्चे' : 'Other expenses'}
        value={other}
        onChange={setOther}
        prefix="₹"
      />
    </ToolLayout>
  );
}

// 9. Loan Checker
function LoanChecker({ onBack }: { onBack: () => void }) {
  const { lang } = useTranslation();
  const [amount1, setAmount1] = useState('');
  const [rate1, setRate1] = useState('');
  const [months1, setMonths1] = useState('');
  const [amount2, setAmount2] = useState('');
  const [rate2, setRate2] = useState('');
  const [months2, setMonths2] = useState('');

  // Simple EMI calculation (flat rate for simplicity)
  const calcEMI = (principal: number, rate: number, months: number) => {
    if (!principal || !rate || !months) return { emi: 0, total: 0, interest: 0 };
    const interest = (principal * rate * months) / (12 * 100);
    const total = principal + interest;
    const emi = total / months;
    return { emi, total, interest };
  };

  const loan1 = calcEMI(parseFloat(amount1) || 0, parseFloat(rate1) || 0, parseInt(months1) || 0);
  const loan2 = calcEMI(parseFloat(amount2) || 0, parseFloat(rate2) || 0, parseInt(months2) || 0);

  const betterLoan = loan1.total < loan2.total ? 1 : 2;

  const resultText = lang === 'hi'
    ? `लोन 1: EMI ₹${loan1.emi.toFixed(0)}/महीने, कुल चुकाना: ₹${loan1.total.toFixed(0)}\nलोन 2: EMI ₹${loan2.emi.toFixed(0)}/महीने, कुल चुकाना: ₹${loan2.total.toFixed(0)}\n\n${betterLoan === 1 ? 'लोन 1' : 'लोन 2'} सस्ता है।\n\n⚠️ यह सिर्फ अनुमान है। बैंक से पक्का करें।`
    : `Loan 1: EMI ₹${loan1.emi.toFixed(0)}/month, Total: ₹${loan1.total.toFixed(0)}\nLoan 2: EMI ₹${loan2.emi.toFixed(0)}/month, Total: ₹${loan2.total.toFixed(0)}\n\n${betterLoan === 1 ? 'Loan 1' : 'Loan 2'} is cheaper.\n\n⚠️ This is an estimate. Confirm with bank.`;

  const shareText = lang === 'hi'
    ? `लोन तुलना:\nलोन 1: ₹${amount1} @ ${rate1}% for ${months1} महीने\nलोन 2: ₹${amount2} @ ${rate2}% for ${months2} महीने\nसस्ता: लोन ${betterLoan}`
    : `Loan comparison:\nLoan 1: ₹${amount1} @ ${rate1}% for ${months1} months\nLoan 2: ₹${amount2} @ ${rate2}% for ${months2} months\nCheaper: Loan ${betterLoan}`;

  return (
    <ToolLayout
      title={lang === 'hi' ? 'लोन चेकर' : 'Loan Checker'}
      emoji="🏦"
      description={lang === 'hi' ? 'दो लोन की तुलना करें' : 'Compare two loan offers'}
      onBack={onBack}
      onShare={() => shareOnWhatsApp(shareText)}
      result={
        loan1.total > 0 && loan2.total > 0 ? (
          <div>
            <p className="text-heading-2" style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--color-primary)' }}>
              {betterLoan === 1 ? (lang === 'hi' ? 'लोन 1 सस्ता' : 'Loan 1 is cheaper') : (lang === 'hi' ? 'लोन 2 सस्ता' : 'Loan 2 is cheaper')}
            </p>
            <p className="text-body-md" style={{ margin: 0, whiteSpace: 'pre-line' }}>
              {resultText}
            </p>
          </div>
        ) : null
      }
    >
      <p className="text-heading-3" style={{ margin: 0 }}>
        {lang === 'hi' ? 'लोन 1' : 'Loan 1'}
      </p>
      <ToolInput
        label={lang === 'hi' ? 'रकम' : 'Amount'}
        value={amount1}
        onChange={setAmount1}
        prefix="₹"
      />
      <ToolInput
        label={lang === 'hi' ? 'ब्याज दर %' : 'Interest rate %'}
        value={rate1}
        onChange={setRate1}
      />
      <ToolInput
        label={lang === 'hi' ? 'कितने महीने?' : 'How many months?'}
        value={months1}
        onChange={setMonths1}
      />

      <div style={{ height: 'var(--space-md)' }} />

      <p className="text-heading-3" style={{ margin: 0 }}>
        {lang === 'hi' ? 'लोन 2' : 'Loan 2'}
      </p>
      <ToolInput
        label={lang === 'hi' ? 'रकम' : 'Amount'}
        value={amount2}
        onChange={setAmount2}
        prefix="₹"
      />
      <ToolInput
        label={lang === 'hi' ? 'ब्याज दर %' : 'Interest rate %'}
        value={rate2}
        onChange={setRate2}
      />
      <ToolInput
        label={lang === 'hi' ? 'कितने महीने?' : 'How many months?'}
        value={months2}
        onChange={setMonths2}
      />
    </ToolLayout>
  );
}

// 10. Savings Goal
function SavingsGoal({ onBack }: { onBack: () => void }) {
  const { lang } = useTranslation();
  const [targetAmount, setTargetAmount] = useState('');
  const [months, setMonths] = useState('');

  const target = parseFloat(targetAmount) || 0;
  const m = parseInt(months) || 0;

  const monthlySaving = m > 0 ? target / m : 0;
  const dailySaving = monthlySaving / 30;

  const resultText = lang === 'hi'
    ? `हर महीने ₹${monthlySaving.toFixed(0)} बचाएं\nहर दिन ₹${dailySaving.toFixed(0)} बचाएं\n\n${m} महीने में ₹${target.toLocaleString('en-IN')} जमा हो जाएगा।\n\nइसका मतलब: रोज़ ₹${dailySaving.toFixed(0)} अलग रखें।`
    : `Save ₹${monthlySaving.toFixed(0)} per month\nSave ₹${dailySaving.toFixed(0)} per day\n\nYou'll have ₹${target.toLocaleString('en-IN')} in ${m} months.\n\nThis means: Set aside ₹${dailySaving.toFixed(0)} every day.`;

  const shareText = lang === 'hi'
    ? `बचत लक्ष्य:\n₹${target} चाहिए\n${m} महीने में\nहर महीने बचाएं: ₹${monthlySaving.toFixed(0)}`
    : `Savings goal:\nWant ₹${target}\nIn ${m} months\nSave ₹${monthlySaving.toFixed(0)}/month`;

  return (
    <ToolLayout
      title={lang === 'hi' ? 'बचत लक्ष्य' : 'Savings Goal'}
      emoji="🎯"
      description={lang === 'hi' ? 'कितना बचाना है हर महीने?' : 'How much to save monthly?'}
      onBack={onBack}
      onShare={() => shareOnWhatsApp(shareText)}
      result={
        target > 0 && m > 0 ? (
          <div>
            <p className="text-number" style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--color-primary)' }}>
              ₹{monthlySaving.toFixed(0)}/month
            </p>
            <p className="text-body-md" style={{ margin: 0, whiteSpace: 'pre-line' }}>
              {resultText}
            </p>
          </div>
        ) : null
      }
    >
      <ToolInput
        label={lang === 'hi' ? 'कितना बचाना है?' : 'How much to save?'}
        value={targetAmount}
        onChange={setTargetAmount}
        prefix="₹"
      />
      <ToolInput
        label={lang === 'hi' ? 'कितने महीने में?' : 'In how many months?'}
        value={months}
        onChange={setMonths}
      />
    </ToolLayout>
  );
}

// 11. Bill Splitter
function BillSplitter({ onBack }: { onBack: () => void }) {
  const { lang } = useTranslation();
  const [totalBill, setTotalBill] = useState('');
  const [numPeople, setNumPeople] = useState('');

  const total = parseFloat(totalBill) || 0;
  const people = parseInt(numPeople) || 0;

  const perPerson = people > 0 ? total / people : 0;

  const resultText = lang === 'hi'
    ? `हर व्यक्ति का हिस्सा: ₹${perPerson.toFixed(0)}\n\nकुल बिल: ₹${total.toLocaleString('en-IN')}\nलोग: ${people}\n\nइसका मतलब: हर व्यक्ति ₹${perPerson.toFixed(0)} देगा।`
    : `Each person pays: ₹${perPerson.toFixed(0)}\n\nTotal bill: ₹${total.toLocaleString('en-IN')}\nPeople: ${people}\n\nThis means: Each person contributes ₹${perPerson.toFixed(0)}.`;

  const shareText = lang === 'hi'
    ? `बिल बटा:\nकुल: ₹${total}\n${people} लोग\nहर व्यक्ति: ₹${perPerson.toFixed(0)}`
    : `Bill split:\nTotal: ₹${total}\n${people} people\nEach: ₹${perPerson.toFixed(0)}`;

  return (
    <ToolLayout
      title={lang === 'hi' ? 'बिल बांटें' : 'Bill Splitter'}
      emoji="🧾"
      description={lang === 'hi' ? 'स्टाफ़ में खर्चा बांटें' : 'Split expenses with staff'}
      onBack={onBack}
      onShare={() => shareOnWhatsApp(shareText)}
      result={
        total > 0 && people > 0 ? (
          <div>
            <p className="text-number" style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--color-primary)' }}>
              ₹{perPerson.toFixed(0)} each
            </p>
            <p className="text-body-md" style={{ margin: 0, whiteSpace: 'pre-line' }}>
              {resultText}
            </p>
          </div>
        ) : null
      }
    >
      <ToolInput
        label={lang === 'hi' ? 'कुल बिल' : 'Total bill'}
        value={totalBill}
        onChange={setTotalBill}
        prefix="₹"
      />
      <ToolInput
        label={lang === 'hi' ? 'कितने लोग?' : 'How many people?'}
        value={numPeople}
        onChange={setNumPeople}
      />
    </ToolLayout>
  );
}

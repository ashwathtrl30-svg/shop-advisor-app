import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { validateInput } from '../../utils/sensitiveData';

interface PhaseAQuestionsProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function PhaseAQuestions({ onComplete, onSkip }: PhaseAQuestionsProps) {
  const { state, dispatch } = useApp();
  const { lang } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<typeof state.shopProfile>>({});
  const [textInput, setTextInput] = useState('');
  const [numberInput, setNumberInput] = useState('');
  const [error, setError] = useState('');

  const totalQuestions = 10;

  const questions = [
    {
      id: 'mainItems',
      title: lang === 'hi' ? 'आपकी दुकान में 3-5 मुख्य सामान कौन से हैं?' : 'What are your 3-5 main items?',
      type: 'text',
      placeholder: lang === 'hi' ? 'जैसे: चावल, दाल, तेल' : 'e.g., rice, dal, oil',
    },
    {
      id: 'busiestDays',
      title: lang === 'hi' ? 'सप्ताह के कौन से दिन सबसे व्यस्त रहते हैं?' : 'Which days of the week are busiest?',
      type: 'multi-select',
      options: [
        { value: 'monday', label: lang === 'hi' ? 'सोमवार' : 'Monday' },
        { value: 'tuesday', label: lang === 'hi' ? 'मंगलवार' : 'Tuesday' },
        { value: 'wednesday', label: lang === 'hi' ? 'बुधवार' : 'Wednesday' },
        { value: 'thursday', label: lang === 'hi' ? 'गुरुवार' : 'Thursday' },
        { value: 'friday', label: lang === 'hi' ? 'शुक्रवार' : 'Friday' },
        { value: 'saturday', label: lang === 'hi' ? 'शनिवार' : 'Saturday' },
        { value: 'sunday', label: lang === 'hi' ? 'रविवार' : 'Sunday' },
      ],
    },
    {
      id: 'busiestHours',
      title: lang === 'hi' ? 'दिन के कौन से घंटे सबसे व्यस्त रहते हैं?' : 'Which hours of the day are busiest?',
      type: 'text',
      placeholder: lang === 'hi' ? 'जैसे: सुबह 9-11, शाम 5-7' : 'e.g., 9-11 AM, 5-7 PM',
    },
    {
      id: 'monthlyRent',
      title: lang === 'hi' ? 'हर महीने कितना किराया देते हैं?' : 'How much rent do you pay each month?',
      type: 'number',
      prefix: '₹',
      placeholder: '0',
      hint: lang === 'hi' ? 'अगर अपनी दुकान है तो 0 डालें' : 'Enter 0 if you own the shop',
    },
    {
      id: 'monthlySalaries',
      title: lang === 'hi' ? 'हर महीने कुल कितनी तनख्वाह देते हैं?' : 'How much do you pay in total salaries each month?',
      type: 'number',
      prefix: '₹',
      placeholder: '0',
    },
    {
      id: 'monthlyFixedCosts',
      title: lang === 'hi' ? 'बिजली और अन्य खर्चे मिलाकर हर महीने कितने होते हैं?' : 'What are your monthly electricity and other fixed costs together?',
      type: 'number',
      prefix: '₹',
      placeholder: '0',
    },
    {
      id: 'monthlyLoanInstallment',
      title: lang === 'hi' ? 'क्या हर महीने कोई लोन की किस्त देते हैं?' : 'Do you pay a loan installment every month?',
      type: 'yes-no-amount',
      yesLabel: lang === 'hi' ? 'हाँ' : 'Yes',
      noLabel: lang === 'hi' ? 'नहीं' : 'No',
      amountPlaceholder: lang === 'hi' ? 'किस्त की रकम' : 'Installment amount',
    },
    {
      id: 'openingCash',
      title: lang === 'hi' ? 'आज दुकान शुरू करते समय कितना नकद पैसा था?' : 'How much cash did you start with today?',
      type: 'number',
      prefix: '₹',
      placeholder: '0',
      hint: lang === 'hi' ? 'वैकल्पिक' : 'Optional',
    },
    {
      id: 'existingUdhaar',
      title: lang === 'hi' ? 'ऐप शुरू करने से पहले कुल कितना उधार बाकी था?' : 'How much udhaar was already pending before you started using this app?',
      type: 'number',
      prefix: '₹',
      placeholder: '0',
      hint: lang === 'hi' ? 'सिर्फ कुल रकम, नाम बाद में डाल सकते हैं' : 'Total amount only; names can be added later',
    },
    {
      id: 'profitTarget',
      title: lang === 'hi' ? 'हर महीने कितना मुनाफ़ा कमाना चाहते हैं?' : 'How much profit do you want to make each month?',
      type: 'number',
      prefix: '₹',
      placeholder: '0',
      hint: lang === 'hi' ? 'आपका लक्ष्य' : 'Your target',
    },
  ];

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTextInput('');
      setNumberInput('');
      setError('');
    } else {
      // Save all answers
      dispatch({
        type: 'UPDATE_PROFILE',
        payload: answers,
      });
      onComplete();
    }
  };

  const handleSkip = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTextInput('');
      setNumberInput('');
      setError('');
    } else {
      dispatch({
        type: 'UPDATE_PROFILE',
        payload: answers,
      });
      onSkip();
    }
  };

  const handleTextSubmit = (value: string) => {
    const validation = validateInput(value);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid input');
      return;
    }

    const question = questions[currentQuestion];
    let processedValue: any = value;

    if (question.id === 'mainItems') {
      // Split by comma and clean up
      processedValue = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    }

    // Update answers using type-safe approach
    const updatedAnswers = { ...answers };
    switch (question.id) {
      case 'mainItems':
        updatedAnswers.mainItems = processedValue;
        break;
      case 'busiestHours':
        updatedAnswers.busiestHours = value;
        break;
    }
    
    setAnswers(updatedAnswers);
    setTextInput('');
    setError('');
    handleNext();
  };

  const handleNumberSubmit = (value: string) => {
    const num = parseInt(value) || 0;
    const question = questions[currentQuestion];
    
    const updatedAnswers = { ...answers };
    switch (question.id) {
      case 'monthlyRent':
        updatedAnswers.monthlyRent = num;
        break;
      case 'monthlySalaries':
        updatedAnswers.monthlySalaries = num;
        break;
      case 'monthlyFixedCosts':
        updatedAnswers.monthlyFixedCosts = num;
        break;
      case 'monthlyLoanInstallment':
        updatedAnswers.monthlyLoanInstallment = num;
        break;
      case 'openingCash':
        updatedAnswers.openingCash = num;
        break;
      case 'existingUdhaar':
        updatedAnswers.existingUdhaar = num;
        break;
      case 'profitTarget':
        updatedAnswers.profitTarget = num;
        break;
    }
    
    setAnswers(updatedAnswers);
    setNumberInput('');
    handleNext();
  };

  const handleMultiSelect = (value: string) => {
    const question = questions[currentQuestion];
    
    if (question.id === 'busiestDays') {
      const current = answers.busiestDays || [];
      
      if (current.includes(value)) {
        setAnswers({ ...answers, busiestDays: current.filter(v => v !== value) });
      } else {
        setAnswers({ ...answers, busiestDays: [...current, value] });
      }
    }
  };

  const handleYesNoAmount = (hasLoan: boolean, amount?: number) => {
    const question = questions[currentQuestion];
    
    if (question.id === 'monthlyLoanInstallment') {
      setAnswers({ 
        ...answers, 
        monthlyLoanInstallment: hasLoan ? amount || 0 : 0 
      });
    }
    
    handleNext();
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-lg)',
      backgroundColor: 'var(--color-bg)',
    }}>
      {/* Progress Bar */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-2)',
        }}>
          <span className="text-body-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {currentQuestion + 1} / {totalQuestions}
          </span>
          <button
            onClick={handleSkip}
            className="btn-ghost"
            style={{ fontSize: 'var(--text-sm)' }}
          >
            {lang === 'hi' ? 'छोड़ें' : 'Skip'}
          </button>
        </div>
        <div style={{
          height: '4px',
          backgroundColor: 'var(--color-border)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: 'var(--color-primary)',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Question */}
      <div style={{ flex: 1 }}>
        <h2 className="text-heading-1" style={{ marginBottom: 'var(--space-lg)' }}>
          {question.title}
        </h2>

        {error && (
          <div style={{
            padding: 'var(--space-3)',
            backgroundColor: 'var(--color-warning)',
            color: 'white',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-4)',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Text Input */}
        {question.type === 'text' && (
          <div>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={question.placeholder}
              className="input-field"
              style={{ marginBottom: 'var(--space-3)' }}
            />
            {question.hint && (
              <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                {question.hint}
              </p>
            )}
            <button
              onClick={() => handleTextSubmit(textInput)}
              className="btn-primary"
              disabled={!textInput.trim()}
            >
              {lang === 'hi' ? 'आगे' : 'Next'}
            </button>
          </div>
        )}

        {/* Number Input */}
        {question.type === 'number' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              {question.prefix && <span className="text-heading-2">{question.prefix}</span>}
              <input
                type="number"
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
                placeholder={question.placeholder}
                className="input-field"
                style={{ flex: 1 }}
              />
            </div>
            {question.hint && (
              <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                {question.hint}
              </p>
            )}
            <button
              onClick={() => handleNumberSubmit(numberInput)}
              className="btn-primary"
            >
              {lang === 'hi' ? 'आगे' : 'Next'}
            </button>
          </div>
        )}

        {/* Multi-Select */}
        {question.type === 'multi-select' && question.options && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              {question.options.map((option) => {
                const isSelected = question.id === 'busiestDays' && (answers.busiestDays || []).includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => handleMultiSelect(option.value)}
                    className={`card ${isSelected ? 'selected' : ''}`}
                    style={{
                      padding: 'var(--space-4)',
                      textAlign: 'left',
                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-bg-card)',
                    }}
                  >
                    <span className="text-body-lg">{option.label}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleNext}
              className="btn-primary"
            >
              {lang === 'hi' ? 'आगे' : 'Next'}
            </button>
          </div>
        )}

        {/* Yes/No with Amount */}
        {question.type === 'yes-no-amount' && (
          <div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <button
                onClick={() => handleYesNoAmount(false)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                {question.noLabel}
              </button>
              <button
                onClick={() => {
                  const amount = prompt(question.amountPlaceholder || 'Amount');
                  if (amount !== null) {
                    handleYesNoAmount(true, parseInt(amount) || 0);
                  }
                }}
                className="btn-primary"
                style={{ flex: 1 }}
              >
                {question.yesLabel}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Back Button */}
      {currentQuestion > 0 && (
        <button
          onClick={() => {
            setCurrentQuestion(currentQuestion - 1);
            setTextInput('');
            setNumberInput('');
            setError('');
          }}
          className="btn-ghost"
          style={{ marginTop: 'var(--space-4)' }}
        >
          ← {lang === 'hi' ? 'पीछे' : 'Back'}
        </button>
      )}
    </div>
  );
}

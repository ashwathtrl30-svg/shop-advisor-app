import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { TranslationKey } from '../../i18n/translations';

interface InterviewScreenProps {
  questionNumber: number;
}

export default function InterviewScreen({ questionNumber }: InterviewScreenProps) {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();
  const totalQuestions = 10;
  const progress = ((questionNumber + 1) / totalQuestions) * 100;

  const handleBack = () => {
    if (questionNumber > 0) {
      dispatch({ type: 'SET_QUESTION', payload: questionNumber - 1 });
    } else {
      dispatch({ type: 'SET_STEP', payload: 'otp' });
    }
  };

  const handleSkip = () => {
    if (questionNumber < totalQuestions - 1) {
      dispatch({ type: 'SET_QUESTION', payload: questionNumber + 1 });
    } else {
      dispatch({ type: 'SET_STEP', payload: 'profile-summary' });
    }
  };

  const handleNext = () => {
    if (questionNumber < totalQuestions - 1) {
      dispatch({ type: 'SET_QUESTION', payload: questionNumber + 1 });
    } else {
      dispatch({ type: 'SET_STEP', payload: 'profile-summary' });
    }
  };

  // Can skip all questions except first two (0 and 1)
  const canSkip = questionNumber >= 2;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-lg)',
    }}>
      {/* Progress Bar */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-sm)',
        }}>
          <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            {questionNumber + 1} {t('of')} {totalQuestions}
          </p>
          {canSkip && (
            <button onClick={handleSkip} className="btn-ghost" style={{ padding: '4px 12px' }}>
              {t('skip')}
            </button>
          )}
        </div>
        <div style={{
          height: '6px',
          backgroundColor: 'var(--color-border)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: 'var(--color-primary)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Question Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <QuestionContent questionNumber={questionNumber} onNext={handleNext} />
      </div>

      {/* Back Button */}
      <div style={{ marginTop: 'var(--space-lg)' }}>
        <button onClick={handleBack} className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
          ← {t('back')}
        </button>
      </div>
    </div>
  );
}

function QuestionContent({ questionNumber, onNext }: { questionNumber: number; onNext: () => void }) {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();

  const updateProfile = (data: any) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: data });
    onNext();
  };

  switch (questionNumber) {
    case 0:
      return <Q1ShopType value={state.shopProfile.shopType} onUpdate={updateProfile} />;
    case 1:
      return <Q2ShopName value={state.shopProfile.shopName} onUpdate={updateProfile} />;
    case 2:
      return <Q3City value={state.shopProfile.city} onUpdate={updateProfile} />;
    case 3:
      return <Q4Duration value={state.shopProfile.duration} onUpdate={updateProfile} />;
    case 4:
      return <Q5Ownership value={state.shopProfile.ownership} onUpdate={updateProfile} />;
    case 5:
      return <Q6Workers value={state.shopProfile.workers} onUpdate={updateProfile} />;
    case 6:
      return <Q7Sales value={state.shopProfile.monthlySales} onUpdate={updateProfile} />;
    case 7:
      return <Q8Credit value={state.shopProfile.credit} onUpdate={updateProfile} />;
    case 8:
      return <Q9Accounts value={state.shopProfile.accounts} onUpdate={updateProfile} />;
    case 9:
      return <Q10Worries value={state.shopProfile.worries || []} onUpdate={updateProfile} />;
    default:
      return null;
  }
}

// Question Components
function Q1ShopType({ value, onUpdate }: { value?: string; onUpdate: (data: any) => void }) {
  const { t } = useTranslation();
  
  const shopTypes = [
    { key: 'kirana', label: 'shopKirana', emoji: '🏪' },
    { key: 'medical', label: 'shopMedical', emoji: '💊' },
    { key: 'bakery', label: 'shopBakery', emoji: '🍰' },
    { key: 'sweet', label: 'shopSweet', emoji: '🍬' },
    { key: 'vegetable', label: 'shopVegetable', emoji: '🥬' },
    { key: 'tea', label: 'shopTea', emoji: '☕' },
    { key: 'restaurant', label: 'shopRestaurant', emoji: '🍽️' },
    { key: 'salon', label: 'shopSalon', emoji: '💇' },
    { key: 'tailor', label: 'shopTailor', emoji: '🧵' },
    { key: 'hardware', label: 'shopHardware', emoji: '🔨' },
    { key: 'mobile', label: 'shopMobile', emoji: '📱' },
    { key: 'other', label: 'shopOther', emoji: '✨' },
  ];

  return (
    <div>
      <h2 className="text-heading-1" style={{ margin: '0 0 var(--space-lg) 0' }}>
        {t('q1Title')}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
        {shopTypes.map((shop) => (
          <button
            key={shop.key}
            onClick={() => onUpdate({ shopType: shop.key })}
            className="card"
            style={{
              padding: 'var(--space-lg)',
              textAlign: 'center',
              cursor: 'pointer',
              border: value === shop.key ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              backgroundColor: value === shop.key ? 'var(--color-primary-light)' : 'var(--color-bg-card)',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: 'var(--space-sm)' }}>{shop.emoji}</div>
            <p className="text-body-md" style={{ margin: 0, fontWeight: 500 }}>
              {t(shop.label as TranslationKey)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Q2ShopName({ value, onUpdate }: { value?: string; onUpdate: (data: any) => void }) {
  const { t } = useTranslation();
  const [name, setName] = useState(value || '');

  return (
    <div>
      <h2 className="text-heading-1" style={{ margin: '0 0 var(--space-sm) 0' }}>
        {t('q2Title')}
      </h2>
      <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-lg) 0' }}>
        {t('q2Subtitle')}
      </p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('q2Placeholder')}
        style={{
          width: '100%',
          height: 'var(--button-height)',
          fontSize: '18px',
          padding: '0 var(--space-md)',
          border: '2px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-bg-card)',
          color: 'var(--color-text)',
          fontFamily: 'var(--font-family)',
          outline: 'none',
        }}
        autoFocus
      />
      <div style={{ marginTop: 'var(--space-xl)' }}>
        <button
          onClick={() => onUpdate({ shopName: name })}
          className="btn-primary"
          style={{ fontSize: '20px' }}
        >
          {t('next')}
        </button>
      </div>
    </div>
  );
}

function Q3City({ value, onUpdate }: { value?: string; onUpdate: (data: any) => void }) {
  const { t } = useTranslation();
  const [city, setCity] = useState(value || '');
  const [showInput, setShowInput] = useState(false);
  const detectedCity = 'Mumbai'; // Mock detected location

  if (showInput) {
    return (
      <div>
        <h2 className="text-heading-1" style={{ margin: '0 0 var(--space-lg) 0' }}>
          {t('q3Title')}
        </h2>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t('q3Placeholder')}
          style={{
            width: '100%',
            height: 'var(--button-height)',
            fontSize: '18px',
            padding: '0 var(--space-md)',
            border: '2px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-bg-card)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-family)',
            outline: 'none',
          }}
          autoFocus
        />
        <div style={{ marginTop: 'var(--space-xl)' }}>
          <button
            onClick={() => onUpdate({ city })}
            className="btn-primary"
            style={{ fontSize: '20px' }}
            disabled={!city.trim()}
          >
            {t('next')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-heading-1" style={{ margin: '0 0 var(--space-sm) 0' }}>
        {t('q3Title')}
      </h2>
      <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-lg) 0' }}>
        {t('q3Subtitle')}
      </p>
      <div className="card" style={{
        padding: 'var(--space-xl)',
        textAlign: 'center',
        marginBottom: 'var(--space-lg)',
      }}>
        <div style={{ fontSize: '48px', marginBottom: 'var(--space-md)' }}>📍</div>
        <p className="text-heading-2" style={{ margin: 0 }}>{detectedCity}</p>
      </div>
      <button
        onClick={() => onUpdate({ city: detectedCity })}
        className="btn-primary"
        style={{ fontSize: '20px', marginBottom: 'var(--space-md)' }}
      >
        {t('q3Confirm')}
      </button>
      <button
        onClick={() => setShowInput(true)}
        className="btn-secondary"
      >
        {t('q3Change')}
      </button>
    </div>
  );
}

function Q4Duration({ value, onUpdate }: { value?: string; onUpdate: (data: any) => void }) {
  const { t } = useTranslation();
  
  const options = [
    { key: 'under1', label: 'durUnder1' },
    { key: '1to5', label: 'dur1to5' },
    { key: '5to10', label: 'dur5to10' },
    { key: 'over10', label: 'durOver10' },
  ];

  return (
    <div>
      <h2 className="text-heading-1" style={{ margin: '0 0 var(--space-lg) 0' }}>
        {t('q4Title')}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onUpdate({ duration: opt.key })}
            className="card"
            style={{
              padding: 'var(--space-lg)',
              textAlign: 'left',
              cursor: 'pointer',
              border: value === opt.key ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              backgroundColor: value === opt.key ? 'var(--color-primary-light)' : 'var(--color-bg-card)',
            }}
          >
            <p className="text-body-lg" style={{ margin: 0, fontWeight: 500 }}>
              {t(opt.label as TranslationKey)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Q5Ownership({ value, onUpdate }: { value?: string; onUpdate: (data: any) => void }) {
  const { t } = useTranslation();
  
  const options = [
    { key: 'own', label: 'ownOwn', emoji: '🏠' },
    { key: 'rent', label: 'ownRent', emoji: '🔑' },
  ];

  return (
    <div>
      <h2 className="text-heading-1" style={{ margin: '0 0 var(--space-lg) 0' }}>
        {t('q5Title')}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onUpdate({ ownership: opt.key })}
            className="card"
            style={{
              padding: 'var(--space-xl)',
              textAlign: 'center',
              cursor: 'pointer',
              border: value === opt.key ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              backgroundColor: value === opt.key ? 'var(--color-primary-light)' : 'var(--color-bg-card)',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: 'var(--space-sm)' }}>{opt.emoji}</div>
            <p className="text-body-lg" style={{ margin: 0, fontWeight: 500 }}>
              {t(opt.label as TranslationKey)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Q6Workers({ value, onUpdate }: { value?: string; onUpdate: (data: any) => void }) {
  const { t } = useTranslation();
  
  const options = [
    { key: '1', label: 'people1' },
    { key: '2to3', label: 'people2to3' },
    { key: '4to5', label: 'people4to5' },
    { key: '6plus', label: 'people6plus' },
  ];

  return (
    <div>
      <h2 className="text-heading-1" style={{ margin: '0 0 var(--space-lg) 0' }}>
        {t('q6Title')}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onUpdate({ workers: opt.key })}
            className="card"
            style={{
              padding: 'var(--space-lg)',
              textAlign: 'left',
              cursor: 'pointer',
              border: value === opt.key ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              backgroundColor: value === opt.key ? 'var(--color-primary-light)' : 'var(--color-bg-card)',
            }}
          >
            <p className="text-body-lg" style={{ margin: 0, fontWeight: 500 }}>
              {t(opt.label as TranslationKey)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Q7Sales({ value, onUpdate }: { value?: string; onUpdate: (data: any) => void }) {
  const { t } = useTranslation();
  
  const options = [
    { key: 'under50k', label: 'salesUnder50k' },
    { key: '50kTo1L', label: 'sales50kTo1L' },
    { key: '1LTo3L', label: 'sales1LTo3L' },
    { key: '3LTo5L', label: 'sales3LTo5L' },
    { key: 'over5L', label: 'salesOver5L' },
  ];

  return (
    <div>
      <h2 className="text-heading-1" style={{ margin: '0 0 var(--space-lg) 0' }}>
        {t('q7Title')}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onUpdate({ monthlySales: opt.key })}
            className="card"
            style={{
              padding: 'var(--space-lg)',
              textAlign: 'left',
              cursor: 'pointer',
              border: value === opt.key ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              backgroundColor: value === opt.key ? 'var(--color-primary-light)' : 'var(--color-bg-card)',
            }}
          >
            <p className="text-body-lg" style={{ margin: 0, fontWeight: 500 }}>
              {t(opt.label as TranslationKey)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Q8Credit({ value, onUpdate }: { value?: string; onUpdate: (data: any) => void }) {
  const { t } = useTranslation();
  
  const options = [
    { key: 'never', label: 'creditNever' },
    { key: 'sometimes', label: 'creditSometimes' },
    { key: 'often', label: 'creditOften' },
  ];

  return (
    <div>
      <h2 className="text-heading-1" style={{ margin: '0 0 var(--space-lg) 0' }}>
        {t('q8Title')}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onUpdate({ credit: opt.key })}
            className="card"
            style={{
              padding: 'var(--space-lg)',
              textAlign: 'left',
              cursor: 'pointer',
              border: value === opt.key ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              backgroundColor: value === opt.key ? 'var(--color-primary-light)' : 'var(--color-bg-card)',
            }}
          >
            <p className="text-body-lg" style={{ margin: 0, fontWeight: 500 }}>
              {t(opt.label as TranslationKey)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Q9Accounts({ value, onUpdate }: { value?: string; onUpdate: (data: any) => void }) {
  const { t } = useTranslation();
  
  const options = [
    { key: 'memory', label: 'accMemory' },
    { key: 'notebook', label: 'accNotebook' },
    { key: 'app', label: 'accApp' },
    { key: 'nothing', label: 'accNothing' },
  ];

  return (
    <div>
      <h2 className="text-heading-1" style={{ margin: '0 0 var(--space-lg) 0' }}>
        {t('q9Title')}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onUpdate({ accounts: opt.key })}
            className="card"
            style={{
              padding: 'var(--space-lg)',
              textAlign: 'left',
              cursor: 'pointer',
              border: value === opt.key ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              backgroundColor: value === opt.key ? 'var(--color-primary-light)' : 'var(--color-bg-card)',
            }}
          >
            <p className="text-body-lg" style={{ margin: 0, fontWeight: 500 }}>
              {t(opt.label as TranslationKey)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Q10Worries({ value, onUpdate }: { value: string[]; onUpdate: (data: any) => void }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string[]>(value);
  
  const options = [
    { key: 'lowProfit', label: 'worryLowProfit' },
    { key: 'tooMuchStock', label: 'worryTooMuchStock' },
    { key: 'notPaying', label: 'worryNotPaying' },
    { key: 'risingCosts', label: 'worryRisingCosts' },
    { key: 'competition', label: 'worryCompetition' },
    { key: 'noTime', label: 'worryNoTime' },
    { key: 'dontKnow', label: 'worryDontKnow' },
  ];

  const toggleOption = (key: string) => {
    setSelected(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  return (
    <div>
      <h2 className="text-heading-1" style={{ margin: '0 0 var(--space-sm) 0' }}>
        {t('q10Title')}
      </h2>
      <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-lg) 0' }}>
        {t('q10Subtitle')}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => toggleOption(opt.key)}
            className="card"
            style={{
              padding: 'var(--space-lg)',
              textAlign: 'left',
              cursor: 'pointer',
              border: selected.includes(opt.key) ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              backgroundColor: selected.includes(opt.key) ? 'var(--color-primary-light)' : 'var(--color-bg-card)',
            }}
          >
            <p className="text-body-lg" style={{ margin: 0, fontWeight: 500 }}>
              {t(opt.label as TranslationKey)}
            </p>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 'var(--space-xl)' }}>
        <button
          onClick={() => onUpdate({ worries: selected })}
          className="btn-primary"
          style={{ fontSize: '20px' }}
          disabled={selected.length === 0}
        >
          {t('next')}
        </button>
      </div>
    </div>
  );
}

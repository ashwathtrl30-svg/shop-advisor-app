import React from 'react';
import { useApp, ShopProfile } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { TranslationKey } from '../../i18n/translations';

export default function ProfileSummaryScreen() {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();
  const profile = state.shopProfile;

  const handleEdit = (questionIndex: number) => {
    dispatch({ type: 'SET_QUESTION', payload: questionIndex });
    dispatch({ type: 'SET_STEP', payload: 'interview' });
  };

  const handleDone = () => {
    dispatch({ type: 'SET_STEP', payload: 'tour' });
  };

  const shopTypeLabels: Record<string, TranslationKey> = {
    kirana: 'shopKirana',
    medical: 'shopMedical',
    bakery: 'shopBakery',
    sweet: 'shopSweet',
    vegetable: 'shopVegetable',
    tea: 'shopTea',
    restaurant: 'shopRestaurant',
    salon: 'shopSalon',
    tailor: 'shopTailor',
    hardware: 'shopHardware',
    mobile: 'shopMobile',
    other: 'shopOther',
  };

  const durationLabels: Record<string, TranslationKey> = {
    under1: 'durUnder1',
    '1to5': 'dur1to5',
    '5to10': 'dur5to10',
    over10: 'durOver10',
  };

  const ownershipLabels: Record<string, TranslationKey> = {
    own: 'ownOwn',
    rent: 'ownRent',
  };

  const workerLabels: Record<string, TranslationKey> = {
    '1': 'people1',
    '2to3': 'people2to3',
    '4to5': 'people4to5',
    '6plus': 'people6plus',
  };

  const salesLabels: Record<string, TranslationKey> = {
    under50k: 'salesUnder50k',
    '50kTo1L': 'sales50kTo1L',
    '1LTo3L': 'sales1LTo3L',
    '3LTo5L': 'sales3LTo5L',
    over5L: 'salesOver5L',
  };

  const creditLabels: Record<string, TranslationKey> = {
    never: 'creditNever',
    sometimes: 'creditSometimes',
    often: 'creditOften',
  };

  const accountsLabels: Record<string, TranslationKey> = {
    memory: 'accMemory',
    notebook: 'accNotebook',
    app: 'accApp',
    nothing: 'accNothing',
  };

  const worryLabels: Record<string, TranslationKey> = {
    lowProfit: 'worryLowProfit',
    tooMuchStock: 'worryTooMuchStock',
    notPaying: 'worryNotPaying',
    risingCosts: 'worryRisingCosts',
    competition: 'worryCompetition',
    noTime: 'worryNoTime',
    dontKnow: 'worryDontKnow',
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-xl)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h1 className="text-heading-1" style={{ margin: '0 0 var(--space-sm) 0' }}>
          {t('profileTitle')}
        </h1>
        <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
          {t('profileSubtitle')}
        </p>
      </div>

      {/* Profile Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', flex: 1, overflowY: 'auto' }}>
        <ProfileRow
          label={t('q1Title')}
          value={profile.shopType ? t(shopTypeLabels[profile.shopType]) : '—'}
          onEdit={() => handleEdit(0)}
          editLabel={t('profileEdit')}
        />
        {profile.shopName && (
          <ProfileRow
            label={t('q2Title')}
            value={profile.shopName}
            onEdit={() => handleEdit(1)}
            editLabel={t('profileEdit')}
          />
        )}
        {profile.city && (
          <ProfileRow
            label={t('q3Title')}
            value={profile.city}
            onEdit={() => handleEdit(2)}
            editLabel={t('profileEdit')}
          />
        )}
        {profile.duration && (
          <ProfileRow
            label={t('q4Title')}
            value={t(durationLabels[profile.duration])}
            onEdit={() => handleEdit(3)}
            editLabel={t('profileEdit')}
          />
        )}
        {profile.ownership && (
          <ProfileRow
            label={t('q5Title')}
            value={t(ownershipLabels[profile.ownership])}
            onEdit={() => handleEdit(4)}
            editLabel={t('profileEdit')}
          />
        )}
        {profile.workers && (
          <ProfileRow
            label={t('q6Title')}
            value={t(workerLabels[profile.workers])}
            onEdit={() => handleEdit(5)}
            editLabel={t('profileEdit')}
          />
        )}
        {profile.monthlySales && (
          <ProfileRow
            label={t('q7Title')}
            value={t(salesLabels[profile.monthlySales])}
            onEdit={() => handleEdit(6)}
            editLabel={t('profileEdit')}
          />
        )}
        {profile.credit && (
          <ProfileRow
            label={t('q8Title')}
            value={t(creditLabels[profile.credit])}
            onEdit={() => handleEdit(7)}
            editLabel={t('profileEdit')}
          />
        )}
        {profile.accounts && (
          <ProfileRow
            label={t('q9Title')}
            value={t(accountsLabels[profile.accounts])}
            onEdit={() => handleEdit(8)}
            editLabel={t('profileEdit')}
          />
        )}
        {profile.worries && profile.worries.length > 0 && (
          <ProfileRow
            label={t('q10Title')}
            value={profile.worries.map(w => t(worryLabels[w])).join(', ')}
            onEdit={() => handleEdit(9)}
            editLabel={t('profileEdit')}
          />
        )}
      </div>

      {/* Done Button */}
      <div style={{ marginTop: 'var(--space-lg)' }}>
        <button onClick={handleDone} className="btn-primary" style={{ fontSize: '20px' }}>
          {t('profileDone')}
        </button>
      </div>
    </div>
  );
}

function ProfileRow({ label, value, onEdit, editLabel }: { 
  label: string; 
  value: string; 
  onEdit: () => void;
  editLabel: string;
}) {
  return (
    <button
      onClick={onEdit}
      className="card"
      style={{
        padding: 'var(--space-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'left',
        cursor: 'pointer',
        width: '100%',
      }}
    >
      <div style={{ flex: 1 }}>
        <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>
          {label}
        </p>
        <p className="text-body-lg" style={{ margin: 0, fontWeight: 500 }}>
          {value}
        </p>
      </div>
      <span style={{ color: 'var(--color-primary)', fontSize: '14px', fontWeight: 500, flexShrink: 0, marginLeft: 'var(--space-md)' }}>
        {editLabel} ✏️
      </span>
    </button>
  );
}

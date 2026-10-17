import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useTranslation();

  const tabs = [
    { id: 'home', label: t('navHome'), icon: HomeIcon },
    { id: 'insights', label: t('navInsights'), icon: InsightsIcon },
    { id: 'ask', label: t('navAsk'), icon: AskIcon },
    { id: 'tools', label: t('navTools'), icon: ToolsIcon },
    { id: 'learn', label: t('navLearn'), icon: LearnIcon },
  ];

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            aria-label={tab.label}
          >
            <Icon active={activeTab === tab.id} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
      {!active && <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />}
      {!active && <polyline points="9 22 9 12 15 12 15 22" />}
      {active && <path d="M10 3.5L3 9v11a2 2 0 002 2h4V14h6v8h4a2 2 0 002-2V9l-7-5.5a2 2 0 00-2.4 0z" />}
    </svg>
  );
}

function AskIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill={active ? 'currentColor' : 'none'} />
      <circle cx="12" cy="10" r="1" fill={active ? 'var(--color-bg-card)' : 'currentColor'} />
      <line x1="9" y1="10" x2="9.01" y2="10" strokeWidth={3} stroke={active ? 'var(--color-bg-card)' : 'currentColor'} />
      <line x1="15" y1="10" x2="15.01" y2="10" strokeWidth={3} stroke={active ? 'var(--color-bg-card)' : 'currentColor'} />
    </svg>
  );
}

function ToolsIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
      {!active && <>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </>}
      {active && <path d="M4 7h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2zM14 21V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v16" />}
    </svg>
  );
}

function LearnIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
      {!active && <>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </>}
      {active && <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3zm20 0h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" />}
    </svg>
  );
}

function InsightsIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
      {!active && <>
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
      </>}
      {active && <path d="M9 18h6M10 22h4M12 2a7 7 0 00-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 00-7-7z" />}
    </svg>
  );
}

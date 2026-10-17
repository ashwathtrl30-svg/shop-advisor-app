import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { lessons, getLessonOfDay, getLessonsForShop, Lesson } from '../../models/lessons';
import LessonCard from './LessonCard';
import CommunityBenchmarks from './CommunityBenchmarks';

export default function LearnScreen() {
  const { state } = useApp();
  const { lang } = useTranslation();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const lessonOfDay = getLessonOfDay(state.shopProfile, state.lessonProgress.completed);
  const relevantLessons = getLessonsForShop(state.shopProfile.shopType);
  const completedCount = state.lessonProgress.completed.length;
  const totalLessons = lessons.length;
  const progressPercent = (completedCount / totalLessons) * 100;

  if (selectedLesson) {
    return (
      <LessonCard
        lesson={selectedLesson}
        onBack={() => setSelectedLesson(null)}
      />
    );
  }

  return (
    <div style={{ padding: 'var(--space-lg)', paddingBottom: 'calc(var(--nav-height) + var(--space-lg))' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h1 className="text-heading-1" style={{ margin: '0 0 var(--space-sm) 0' }}>
          {lang === 'hi' ? 'सीखें' : 'Learn'}
        </h1>
        <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
          {lang === 'hi' 
            ? '2 मिनट के छोटे पाठ। अपनी दुकान बढ़ाएं।'
            : '2-minute lessons. Grow your shop.'}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="card" style={{ padding: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
          <span className="text-body-sm" style={{ fontWeight: 600 }}>
            {lang === 'hi' ? 'आपकी प्रगति' : 'Your progress'}
          </span>
          <span className="text-body-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {completedCount}/{totalLessons}
          </span>
        </div>
        <div style={{
          height: '8px',
          backgroundColor: 'var(--color-border)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: 'var(--color-primary)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.3s ease',
          }} />
        </div>
        {state.lessonProgress.streak > 0 && (
          <p className="text-body-sm" style={{ margin: 'var(--space-sm) 0 0 0', color: 'var(--color-accent)' }}>
            🔥 {state.lessonProgress.streak} {lang === 'hi' ? 'दिन लगातार!' : 'day streak!'}
          </p>
        )}
      </div>

      {/* Lesson of the Day */}
      {lessonOfDay && (
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <h2 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
            {lang === 'hi' ? 'आज का पाठ' : 'Lesson of the day'}
          </h2>
          <button
            onClick={() => setSelectedLesson(lessonOfDay)}
            className="card"
            style={{
              width: '100%',
              padding: 'var(--space-lg)',
              textAlign: 'left',
              cursor: 'pointer',
              border: '2px solid var(--color-accent)',
              backgroundColor: 'var(--color-accent-light)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <span style={{ fontSize: '48px' }}>{lessonOfDay.emoji}</span>
              <div style={{ flex: 1 }}>
                <p className="text-heading-3" style={{ margin: '0 0 var(--space-xs) 0' }}>
                  {lessonOfDay.title[lang]}
                </p>
                <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                  ⏱️ {lessonOfDay.durationMinutes} {lang === 'hi' ? 'मिनट' : 'min'}
                </p>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* All Lessons */}
      <h2 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
        {lang === 'hi' ? 'सभी पाठ' : 'All lessons'}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        {relevantLessons.map((lesson) => {
          const isCompleted = state.lessonProgress.completed.includes(lesson.id);
          const isRelevant = lesson.relevantShopTypes.includes('all') || 
                            lesson.relevantShopTypes.includes(state.shopProfile.shopType || '');
          
          return (
            <button
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className="card"
              style={{
                width: '100%',
                padding: 'var(--space-md)',
                textAlign: 'left',
                cursor: 'pointer',
                opacity: isRelevant ? 1 : 0.7,
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <span style={{ fontSize: '36px' }}>{lesson.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p className="text-body-lg" style={{ margin: '0 0 var(--space-xs) 0', fontWeight: 600 }}>
                    {lesson.title[lang]}
                  </p>
                  <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                    ⏱️ {lesson.durationMinutes} {lang === 'hi' ? 'मिनट' : 'min'}
                  </p>
                </div>
                {isCompleted && (
                  <span style={{ fontSize: '24px' }}>✅</span>
                )}
              </div>
              {isRelevant && !isCompleted && (
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

      {/* Community Benchmarks */}
      <CommunityBenchmarks />

      {/* Real Shopkeeper Stories (placeholder) */}
      <div className="card" style={{
        padding: 'var(--space-lg)',
        marginTop: 'var(--space-lg)',
        backgroundColor: 'var(--color-bg)',
        border: '1px dashed var(--color-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <span style={{ fontSize: '36px' }}>📖</span>
          <div>
            <p className="text-heading-3" style={{ margin: '0 0 var(--space-xs) 0' }}>
              {lang === 'hi' ? 'असली दुकानदार की कहानियाँ' : 'Real shopkeeper stories'}
            </p>
            <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
              {lang === 'hi' ? 'जल्द आ रहा है' : 'Coming soon'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

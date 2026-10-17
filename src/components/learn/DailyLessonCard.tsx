import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Lesson, getPersonalizedLine, completeLesson } from '../../models/lessons';

interface DailyLessonCardProps {
  lesson: Lesson;
  isStartHere?: boolean;
  isCompleted?: boolean;
}

export default function DailyLessonCard({ lesson, isStartHere, isCompleted }: DailyLessonCardProps) {
  const { state, dispatch } = useApp();
  const { lang } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const personalizedLine = getPersonalizedLine(lesson, state.shopData, state.shopProfile);

  const handleComplete = () => {
    if (!isCompleted) {
      // Find today's selection
      const today = new Date().toISOString().split('T')[0];
      const todaySelection = state.lessonProgress.dailySelections.find(d => d.date === today);
      
      if (todaySelection) {
        const updatedProgress = completeLesson(lesson.id, state.lessonProgress, todaySelection);
        
        dispatch({
          type: 'UPDATE_LESSON_PROGRESS',
          payload: updatedProgress,
        });
      }
    }
  };

  const handleDoIt = () => {
    if (lesson.toolLink) {
      // Navigate to tool - for now just log
      console.log('Navigate to:', lesson.toolLink);
      // In real app: dispatch navigation action
    }
    handleComplete();
  };

  return (
    <div className="card" style={{
      padding: 'var(--space-md)',
      borderLeft: isStartHere ? '4px solid var(--color-accent)' : isCompleted ? '4px solid var(--color-positive)' : '4px solid var(--color-border)',
      opacity: isCompleted ? 0.7 : 1,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
        <div style={{ flex: 1 }}>
          {isStartHere && (
            <span style={{
              display: 'inline-block',
              padding: '2px 8px',
              backgroundColor: 'var(--color-accent)',
              color: 'white',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              marginBottom: 'var(--space-xs)',
            }}>
              {lang === 'hi' ? 'यहाँ से शुरू करें' : 'Start here'}
            </span>
          )}
          <h3 className="text-heading-3" style={{ margin: '0 0 var(--space-xs) 0' }}>
            {lesson.title}
          </h3>
        </div>
        {isCompleted && (
          <span style={{ fontSize: '24px' }}>✅</span>
        )}
      </div>

      {/* Content (expandable) */}
      {isExpanded && (
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <p className="text-body-md" style={{ margin: '0 0 var(--space-md) 0', lineHeight: 1.6 }}>
            {lesson.content}
          </p>

          {/* Example */}
          <div style={{
            padding: 'var(--space-md)',
            backgroundColor: 'var(--color-bg)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--space-md)',
          }}>
            <p className="text-body-sm" style={{ margin: '0 0 var(--space-xs) 0', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              {lang === 'hi' ? 'उदाहरण:' : 'Example:'}
            </p>
            <p className="text-body-sm" style={{ margin: 0, lineHeight: 1.6 }}>
              {lesson.example}
            </p>
          </div>

          {/* Personalized line */}
          {personalizedLine && (
            <div style={{
              padding: 'var(--space-md)',
              backgroundColor: 'var(--color-primary-light)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 'var(--space-md)',
            }}>
              <p className="text-body-sm" style={{ margin: 0, fontWeight: 500 }}>
                💡 {personalizedLine}
              </p>
            </div>
          )}

          {/* Action */}
          <div style={{
            padding: 'var(--space-md)',
            backgroundColor: 'var(--color-accent-light)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--space-md)',
          }}>
            <p className="text-body-sm" style={{ margin: '0 0 var(--space-xs) 0', fontWeight: 600 }}>
              {lang === 'hi' ? 'आज करें:' : 'Try this today:'}
            </p>
            <p className="text-body-sm" style={{ margin: 0 }}>
              {lesson.action}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className="btn-secondary"
            style={{ flex: 1, fontSize: '14px' }}
          >
            {lang === 'hi' ? 'पढ़ें' : 'Read'}
          </button>
        ) : (
          <>
            <button
              onClick={() => setIsExpanded(false)}
              className="btn-ghost"
              style={{ flex: 1, fontSize: '14px' }}
            >
              {lang === 'hi' ? 'कम दिखाएं' : 'Show less'}
            </button>
            {!isCompleted && lesson.toolLink && (
              <button
                onClick={handleDoIt}
                className="btn-primary"
                style={{ flex: 1, fontSize: '14px' }}
              >
                {lang === 'hi' ? 'अपनी दुकान में करें' : 'Do it in my shop'}
              </button>
            )}
            {!isCompleted && !lesson.toolLink && (
              <button
                onClick={handleComplete}
                className="btn-primary"
                style={{ flex: 1, fontSize: '14px' }}
              >
                {lang === 'hi' ? 'पूरा हुआ' : 'Done'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { lessonLibrary, selectDailyLessons, DailyLessonSelection, Lesson } from '../../models/lessons';
import DailyLessonCard from './DailyLessonCard';
import CommunityBenchmarks from './CommunityBenchmarks';

export default function LearnScreen() {
  const { state, dispatch } = useApp();
  const { lang } = useTranslation();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Safety check: ensure lessonProgress has required properties
  if (!state.lessonProgress || !Array.isArray(state.lessonProgress.dailySelections)) {
    return (
      <div style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
        <h2 className="text-heading-2" style={{ marginBottom: 'var(--space-md)' }}>
          {lang === 'hi' ? 'कुछ गलत हो गया' : 'Something went wrong'}
        </h2>
        <p className="text-body-md" style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-text-secondary)' }}>
          {lang === 'hi' ? 'आपका डेटा सुरक्षित है। कृपया पुनः प्रयास करें।' : 'Your data is safe. Please try again.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
          style={{ marginBottom: 'var(--space-md)' }}
        >
          {lang === 'hi' ? 'पुनः प्रयास करें' : 'Try again'}
        </button>
      </div>
    );
  }

  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Get or create daily selection
  const displayDate = selectedDate || today;
  let dailySelection = state.lessonProgress.dailySelections.find(d => d.date === displayDate);
  
  // Create daily selection if needed (in useEffect to avoid render-time dispatch)
  useEffect(() => {
    if (!dailySelection && displayDate === today) {
      try {
        const newSelection = selectDailyLessons(
          lessonLibrary,
          state.lessonProgress,
          state.shopProfile,
          state.shopData
        );
        
        // Ensure we have lessons
        if (!newSelection || !newSelection.lessons || newSelection.lessons.length === 0) {
          setError(lang === 'hi' ? 'पाठ लोड नहीं हो सके' : 'Could not load lessons');
          return;
        }
        
        // Save to state
        dispatch({
          type: 'UPDATE_LESSON_PROGRESS',
          payload: {
            ...state.lessonProgress,
            dailySelections: [...state.lessonProgress.dailySelections, newSelection],
            lessonsShown: [...state.lessonProgress.lessonsShown, ...newSelection.lessons.map(l => l.id)],
          },
        });
      } catch (err) {
        console.error('Error creating daily lessons:', err);
        setError(lang === 'hi' ? 'पाठ लोड करने में त्रुटि' : 'Error loading lessons');
      }
    }
  }, [dailySelection, displayDate, today, state.lessonProgress, state.shopProfile, state.shopData, dispatch, lang]);

  const lessons = dailySelection?.lessons || [];
  const completedToday = dailySelection?.completed || [];
  const startHere = dailySelection?.startHere || [];
  
  // Calculate progress
  const completedCount = state.lessonProgress.lessonsCompleted.length;
  const totalLessons = lessonLibrary.length;
  const progressPercent = (completedCount / totalLessons) * 100;
  
  // Show top 3 or all
  const displayedLessons = showAll ? lessons : lessons.slice(0, 3);

  if (selectedLesson) {
    return (
      <DailyLessonCard
        lesson={selectedLesson}
        isStartHere={startHere.includes(selectedLesson.id)}
        isCompleted={completedToday.includes(selectedLesson.id)}
      />
    );
  }

  return (
    <div style={{ padding: 'var(--space-lg)', paddingBottom: 'calc(var(--nav-height) + var(--space-lg))' }}>
      {/* Error message if any */}
      {error && (
        <div className="card" style={{ 
          padding: 'var(--space-md)', 
          marginBottom: 'var(--space-lg)',
          backgroundColor: 'var(--color-warning-light)',
          borderLeft: '4px solid var(--color-warning)'
        }}>
          <p className="text-body-md" style={{ margin: 0, color: 'var(--color-warning-dark)' }}>
            ⚠️ {error}
          </p>
          <button
            onClick={() => setError(null)}
            className="btn-secondary"
            style={{ marginTop: 'var(--space-sm)' }}
          >
            {lang === 'hi' ? 'पुनः प्रयास करें' : 'Try again'}
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h1 className="text-heading-1" style={{ margin: '0 0 var(--space-sm) 0' }}>
          {lang === 'hi' ? 'सीखें' : 'Learn'}
        </h1>
        <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
          {lang === 'hi' 
            ? 'रोज़ 10 नए पाठ। अपनी दुकान बढ़ाएं।'
            : '10 new lessons daily. Grow your shop.'}
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
        {state.lessonProgress.currentStreak > 0 && (
          <p className="text-body-sm" style={{ margin: 'var(--space-sm) 0 0 0', color: 'var(--color-accent)' }}>
            🔥 {state.lessonProgress.currentStreak} {lang === 'hi' ? 'दिन लगातार!' : 'day streak!'}
          </p>
        )}
      </div>

      {/* Today's Progress */}
      {dailySelection && (
        <div className="card" style={{ 
          padding: 'var(--space-md)', 
          marginBottom: 'var(--space-lg)',
          backgroundColor: 'var(--color-accent-light)',
        }}>
          <p className="text-body-md" style={{ margin: 0, fontWeight: 600 }}>
            {lang === 'hi' 
              ? `आज ${completedToday.length} of 10 पूरे किए`
              : `${completedToday.length} of 10 done today`}
          </p>
        </div>
      )}

      {/* Date selector (if viewing past days) */}
      {selectedDate && (
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <button
            onClick={() => setSelectedDate(null)}
            className="btn-ghost"
            style={{ fontSize: '14px' }}
          >
            ← {lang === 'hi' ? 'आज पर वापस जाएं' : 'Back to today'}
          </button>
          <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-xs) 0 0 0' }}>
            {lang === 'hi' ? 'दिनांक:' : 'Date:'} {new Date(selectedDate).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN')}
          </p>
        </div>
      )}

      {/* Today's Lessons */}
      {lessons.length > 0 ? (
        <>
          <h2 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
            {selectedDate ? (lang === 'hi' ? 'उस दिन के पाठ' : 'Lessons from that day') : (lang === 'hi' ? 'आज के पाठ' : "Today's lessons")}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
            {displayedLessons.map((lesson) => (
              <DailyLessonCard
                key={lesson.id}
                lesson={lesson}
                isStartHere={startHere.includes(lesson.id)}
                isCompleted={completedToday.includes(lesson.id)}
              />
            ))}
          </div>

          {/* See all button */}
          {!showAll && lessons.length > 3 && (
            <button
              onClick={() => setShowAll(true)}
              className="btn-secondary"
              style={{ marginBottom: 'var(--space-md)' }}
            >
              {lang === 'hi' ? `सभी 10 पाठ देखें` : `See all 10 lessons`}
            </button>
          )}

          {/* Show less button */}
          {showAll && lessons.length > 3 && (
            <button
              onClick={() => setShowAll(false)}
              className="btn-ghost"
              style={{ marginBottom: 'var(--space-md)', width: '100%', justifyContent: 'center' }}
            >
              {lang === 'hi' ? 'कम दिखाएं' : 'Show less'}
            </button>
          )}
        </>
      ) : (
        <div className="card" style={{
          padding: 'var(--space-2xl)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '64px', marginBottom: 'var(--space-lg)' }}>📚</div>
          <h3 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
            {lang === 'hi' ? 'कोई पाठ उपलब्ध नहीं' : 'No lessons available'}
          </h3>
          <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            {lang === 'hi'
              ? 'कल फिर देखें।'
              : 'Check back tomorrow.'}
          </p>
        </div>
      )}

      {/* Past days selector */}
      {!selectedDate && state.lessonProgress.dailySelections.length > 1 && (
        <div style={{ marginTop: 'var(--space-xl)' }}>
          <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-sm) 0' }}>
            {lang === 'hi' ? 'पिछले दिन:' : 'Past days:'}
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
            {state.lessonProgress.dailySelections
              .filter(d => d.date !== today)
              .slice(-5)
              .reverse()
              .map(day => (
                <button
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  className="btn-ghost"
                  style={{ 
                    padding: 'var(--space-xs) var(--space-sm)',
                    fontSize: '12px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {new Date(day.date).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short' })}
                </button>
              ))}
          </div>
        </div>
      )}

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

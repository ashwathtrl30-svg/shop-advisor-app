import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Lesson } from '../../models/lessons';

interface LessonCardProps {
  lesson: Lesson;
  onBack: () => void;
}

export default function LessonCard({ lesson, onBack }: LessonCardProps) {
  const { state, dispatch } = useApp();
  const { lang } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const slides = lesson.content[lang];
  const totalSlides = slides.length;
  const progress = ((currentSlide + 1) / (totalSlides + (lesson.quiz ? 1 : 0))) * 100;

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    } else if (lesson.quiz && !showQuiz) {
      setShowQuiz(true);
    } else {
      // Complete lesson
      dispatch({ type: 'COMPLETE_LESSON', payload: lesson.id });
      onBack();
    }
  };

  const handlePrev = () => {
    if (showQuiz) {
      setShowQuiz(false);
    } else if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleQuizAnswer = (index: number) => {
    setQuizAnswer(index);
    if (lesson.quiz && index === lesson.quiz.correctIndex) {
      dispatch({ type: 'SET_QUIZ_SCORE', payload: { lessonId: lesson.id, score: 1 } });
    }
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(slides[currentSlide]);
        utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  const handleTryIt = () => {
    // Navigate to the matching tool
    dispatch({ type: 'SET_TAB', payload: 'tools' });
    // The tool will need to be selected - for now just go to tools tab
    onBack();
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-bg)',
    }}>
      {/* Header */}
      <div style={{
        padding: 'var(--space-md) var(--space-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
      }}>
        <button onClick={onBack} className="btn-ghost" style={{ minWidth: 'auto', padding: '8px' }}>
          ←
        </button>
        <div style={{ flex: 1 }}>
          <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            {lesson.emoji} {lesson.title[lang]}
          </p>
        </div>
        <button
          onClick={handleSpeak}
          className="btn-ghost"
          style={{ minWidth: 'auto', padding: '8px' }}
          title={lang === 'hi' ? 'सुनें' : 'Listen'}
        >
          {isSpeaking ? '⏸️' : '🔊'}
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{
        height: '4px',
        backgroundColor: 'var(--color-border)',
        margin: '0 var(--space-lg)',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: 'var(--color-primary)',
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: 'var(--space-2xl) var(--space-lg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        {!showQuiz ? (
          <>
            <div style={{ fontSize: '80px', textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
              {lesson.emoji}
            </div>
            <p className="text-heading-2" style={{
              textAlign: 'center',
              margin: '0 0 var(--space-xl) 0',
              lineHeight: 1.5,
            }}>
              {slides[currentSlide]}
            </p>
            <p className="text-body-sm" style={{
              textAlign: 'center',
              color: 'var(--color-text-secondary)',
              margin: 0,
            }}>
              {currentSlide + 1} / {totalSlides}
            </p>
          </>
        ) : lesson.quiz ? (
          <>
            <div style={{ fontSize: '60px', textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
              🤔
            </div>
            <p className="text-heading-2" style={{
              textAlign: 'center',
              margin: '0 0 var(--space-xl) 0',
            }}>
              {lesson.quiz.question[lang]}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {lesson.quiz.options[lang].map((option, index) => {
                const isSelected = quizAnswer === index;
                const isCorrect = quizAnswer !== null && index === lesson.quiz!.correctIndex;
                const isWrong = isSelected && quizAnswer !== null && index !== lesson.quiz!.correctIndex;
                
                return (
                  <button
                    key={index}
                    onClick={() => quizAnswer === null && handleQuizAnswer(index)}
                    disabled={quizAnswer !== null}
                    className="card"
                    style={{
                      padding: 'var(--space-md)',
                      cursor: quizAnswer === null ? 'pointer' : 'default',
                      border: `2px solid ${
                        isCorrect ? 'var(--color-positive)' :
                        isWrong ? 'var(--color-problem)' :
                        isSelected ? 'var(--color-primary)' :
                        'var(--color-border)'
                      }`,
                      backgroundColor: isCorrect ? 'var(--color-positive)' :
                                      isWrong ? 'var(--color-problem)' :
                                      'var(--color-bg-card)',
                      color: isCorrect || isWrong ? 'white' : 'var(--color-text)',
                      opacity: quizAnswer !== null && !isSelected && !isCorrect ? 0.6 : 1,
                    }}
                  >
                    <p className="text-body-lg" style={{ margin: 0, fontWeight: 500 }}>
                      {option}
                    </p>
                  </button>
                );
              })}
            </div>
            {quizAnswer !== null && (
              <p className="text-body-md" style={{
                textAlign: 'center',
                margin: 'var(--space-lg) 0 0 0',
                color: quizAnswer === lesson.quiz.correctIndex ? 'var(--color-positive)' : 'var(--color-text-secondary)',
                fontWeight: 600,
              }}>
                {quizAnswer === lesson.quiz.correctIndex
                  ? (lang === 'hi' ? '✅ सही जवाब!' : '✅ Correct!')
                  : (lang === 'hi' ? '❌ कोई बात नहीं, अगली बार!' : '❌ Not quite, try next time!')}
              </p>
            )}
          </>
        ) : null}
      </div>

      {/* Action Buttons */}
      <div style={{
        padding: 'var(--space-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
      }}>
        {quizAnswer !== null && showQuiz && (
          <button onClick={handleTryIt} className="btn-primary">
            🎯 {lang === 'hi' ? 'अपनी दुकान में आज़माएं' : 'Try it in my shop'}
          </button>
        )}
        
        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          {currentSlide > 0 || showQuiz ? (
            <button onClick={handlePrev} className="btn-secondary" style={{ flex: 1 }}>
              {lang === 'hi' ? 'पीछे' : 'Back'}
            </button>
          ) : null}
          <button onClick={handleNext} className="btn-primary" style={{ flex: 1 }}>
            {currentSlide === totalSlides - 1 && !showQuiz && !lesson.quiz
              ? (lang === 'hi' ? 'पूरा हुआ ✓' : 'Complete ✓')
              : showQuiz && quizAnswer !== null
              ? (lang === 'hi' ? 'आगे' : 'Next')
              : (lang === 'hi' ? 'आगे' : 'Next')}
          </button>
        </div>
      </div>
    </div>
  );
}

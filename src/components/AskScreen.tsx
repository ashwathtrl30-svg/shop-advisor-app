import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { 
  Message, 
  Conversation, 
  generateSuggestedQuestions, 
  generateAnswer
} from '../models/conversation';

export default function AskScreen() {
  const { state, dispatch } = useApp();
  const { t, lang } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate suggested questions on mount
  useEffect(() => {
    const questions = generateSuggestedQuestions(state.shopData, state.shopProfile, lang);
    setSuggestedQuestions(questions);
  }, [state.shopData, state.shopProfile, lang]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Generate answer
    const conversation: Conversation = {
      id: 'current',
      messages: [...messages, userMessage],
      createdAt: Date.now(),
      shopProfile: state.shopProfile,
    };

    const answer = generateAnswer(text, conversation, state.shopData, state.shopProfile, lang);

    // Add assistant message
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: answer,
      timestamp: Date.now(),
    };

    setTimeout(() => {
      setMessages(prev => [...prev, assistantMessage]);
    }, 500);
  };

  const handleFeedback = (messageId: string, feedback: 'helpful' | 'not_helpful') => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, feedback } : m
    ));
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - var(--nav-height))',
      backgroundColor: 'var(--color-bg)',
    }}>
      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'var(--space-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-2xl)',
            color: 'var(--color-text-secondary)',
          }}>
            <div style={{ fontSize: '64px', marginBottom: 'var(--space-md)' }}>💬</div>
            <h3 className="text-heading-2" style={{ margin: '0 0 var(--space-md) 0' }}>
              {lang === 'hi' ? 'कुछ भी पूछें' : 'Ask me anything'}
            </h3>
            <p className="text-body-md" style={{ margin: 0 }}>
              {lang === 'hi' 
                ? 'आप अपनी दुकान के बारे में कोई भी सवाल पूछ सकते हैं'
                : 'You can ask any question about your shop'}
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: msg.role === 'user' ? 'var(--color-primary)' : 'var(--color-bg-card)',
                color: msg.role === 'user' ? 'white' : 'var(--color-text)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div 
                className="text-body-md" 
                style={{ 
                  margin: 0, 
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                }}
                dangerouslySetInnerHTML={{ 
                  __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }}
              />
              
              {msg.role === 'assistant' && (
                <div style={{ marginTop: 'var(--space-sm)', display: 'flex', gap: 'var(--space-sm)' }}>
                  {!msg.feedback && (
                    <>
                      <button
                        onClick={() => handleFeedback(msg.id, 'helpful')}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          padding: '4px 8px',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        👍 {lang === 'hi' ? 'मददगार' : 'Helpful'}
                      </button>
                      <button
                        onClick={() => handleFeedback(msg.id, 'not_helpful')}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          padding: '4px 8px',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        👎 {lang === 'hi' ? 'बेकार' : 'Not helpful'}
                      </button>
                    </>
                  )}

                  {msg.feedback && (
                    <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                      {msg.feedback === 'helpful' 
                        ? (lang === 'hi' ? '✅ धन्यवाद!' : '✅ Thanks!')
                        : (lang === 'hi' ? '📝 सुधार करेंगे' : '📝 We\'ll improve')}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 0 && suggestedQuestions.length > 0 && (
        <div style={{
          padding: '0 var(--space-lg) var(--space-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)',
        }}>
          <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--space-xs) 0' }}>
            {lang === 'hi' ? 'ये पूछ सकते हैं:' : 'You can ask:'}
          </p>
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSuggestedQuestion(q)}
              className="card"
              style={{
                padding: 'var(--space-md)',
                textAlign: 'left',
                cursor: 'pointer',
                border: '1px solid var(--color-border)',
                fontSize: '14px',
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div style={{
        padding: 'var(--space-md) var(--space-lg)',
        backgroundColor: 'var(--color-bg-card)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        gap: 'var(--space-md)',
        alignItems: 'center',
      }}>
        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
          placeholder={lang === 'hi' ? 'यहां टाइप करें...' : 'Type here...'}
          style={{
            flex: 1,
            height: '48px',
            padding: '0 var(--space-md)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)',
            fontSize: '16px',
            fontFamily: 'var(--font-family)',
          outline: 'none',
        }}
      />
    </div>    </div>
  );
}

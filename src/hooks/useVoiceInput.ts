import { useState, useEffect, useRef } from 'react';

interface UseVoiceInputReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
  error: string | null;
}

export function useVoiceInput(): UseVoiceInputReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Check if speech recognition is supported
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Support both Hindi and English
    recognition.lang = 'hi-IN'; // Hindi with English support
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSupported]);

  const startListening = () => {
    if (!isSupported) {
      setError('Voice input not supported on this device');
      return;
    }
    setTranscript('');
    setError(null);
    try {
      recognitionRef.current?.start();
    } catch (e) {
      setError('Could not start voice input');
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported,
    error,
  };
}

// Parse voice transcript into structured data
export function parseVoiceEntry(transcript: string, type: 'sale' | 'expense'): { amount: number; description?: string } | null {
  if (!transcript) return null;

  // Extract numbers from transcript
  const numberMatches = transcript.match(/\d+/g);
  if (!numberMatches || numberMatches.length === 0) return null;

  // Take the largest number as the amount
  const numbers = numberMatches.map(n => parseInt(n, 10));
  const amount = Math.max(...numbers);

  // Clean up description (remove numbers)
  const description = transcript.replace(/\d+/g, '').replace(/\s+/g, ' ').trim();

  return {
    amount,
    description: description || undefined,
  };
}

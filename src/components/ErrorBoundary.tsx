import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Error boundary class component (required by React)
class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Store error for reporting
    try {
      const errorLog = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('dukaandost-last-error', JSON.stringify(errorLog));
    } catch (e) {
      console.error('Could not save error log:', e);
    }
  }

  handleTryAgain = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onTryAgain={this.handleTryAgain} onGoHome={this.handleGoHome} />;
    }

    return this.props.children;
  }
}

// Functional component for error fallback UI
function ErrorFallback({ error, onTryAgain, onGoHome }: { error: Error | null; onTryAgain: () => void; onGoHome: () => void }) {
  const { lang } = useTranslation();

  return (
    <div style={{
      padding: 'var(--space-lg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '64px', marginBottom: 'var(--space-lg)' }}>⚠️</div>
      <h2 className="text-heading-2" style={{ marginBottom: 'var(--space-md)' }}>
        {lang === 'hi' ? 'कुछ गलत हो गया' : 'Something went wrong'}
      </h2>
      <p className="text-body-md" style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-text-secondary)' }}>
        {lang === 'hi' 
          ? 'इस स्क्रीन पर कुछ गलत हो गया। आपका डेटा सुरक्षित है।'
          : 'Something went wrong on this screen. Your data is safe.'}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', width: '100%', maxWidth: '300px' }}>
        <button onClick={onTryAgain} className="btn-primary">
          {lang === 'hi' ? 'पुनः प्रयास करें' : 'Try again'}
        </button>
        <button onClick={onGoHome} className="btn-secondary">
          {lang === 'hi' ? 'होम पर जाएं' : 'Go to Home'}
        </button>
      </div>
    </div>
  );
}

// Export as functional component wrapper for hooks
export function ErrorBoundary({ children, fallback }: Props) {
  return <ErrorBoundaryClass fallback={fallback}>{children}</ErrorBoundaryClass>;
}

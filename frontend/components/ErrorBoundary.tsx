import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global error boundary — catches unhandled React errors and shows a
 * user-friendly fallback instead of a blank screen.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#111827',
            color: '#f9fafb',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '2rem',
          }}
        >
          <div style={{ maxWidth: 480, textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#9ca3af', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              MoltyDEX encountered an unexpected error. Your funds are safe — this is a display issue only.
            </p>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '0.625rem 1.5rem',
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                marginRight: '0.75rem',
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.625rem 1.5rem',
                background: 'transparent',
                color: '#9ca3af',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

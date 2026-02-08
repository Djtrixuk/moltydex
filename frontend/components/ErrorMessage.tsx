/**
 * Error Message Component
 * Provides user-friendly error messages with actionable guidance
 */

interface ErrorMessageProps {
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  type?: 'error' | 'warning' | 'info';
  showIcon?: boolean;
}

export default function ErrorMessage({ 
  title,
  message,
  action,
  type = 'error',
  showIcon = true
}: ErrorMessageProps) {
  const typeStyles = {
    error: {
      bg: 'bg-red-900/20',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    warning: {
      bg: 'bg-yellow-900/20',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    info: {
      bg: 'bg-blue-900/20',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const styles = typeStyles[type];

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-lg p-4 md:p-6`}>
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className={`${styles.text} flex-shrink-0 mt-0.5`}>
            {styles.icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`${styles.text} font-semibold mb-2 text-base md:text-lg`}>
              {title}
            </h3>
          )}
          <p className="text-gray-300 text-sm md:text-base mb-3">
            {message}
          </p>
          {action && (
            <button
              onClick={action.onClick}
              className={`${styles.text} hover:opacity-80 underline text-sm font-semibold transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 rounded`}
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

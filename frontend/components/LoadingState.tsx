/**
 * Loading State Component
 * Provides consistent loading indicators with progress feedback
 */

interface LoadingStateProps {
  message?: string;
  progress?: number; // 0-100
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingState({ 
  message = 'Loading...', 
  progress,
  showProgress = false,
  size = 'md'
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4`} />
      <p className="text-gray-300 text-sm md:text-base mb-2">{message}</p>
      {showProgress && progress !== undefined && (
        <div className="w-full max-w-xs">
          <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <p className="text-gray-400 text-xs mt-2 text-center">{progress}%</p>
        </div>
      )}
    </div>
  );
}

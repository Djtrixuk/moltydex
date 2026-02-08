/**
 * Enhanced CTA Component
 * Provides consistent, accessible call-to-action buttons with better UX
 */

import Link from 'next/link';

interface EnhancedCTAProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  external?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function EnhancedCTA({
  href,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  external = false,
  onClick,
  className = ''
}: EnhancedCTAProps) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950 inline-flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white active:bg-blue-800',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white active:bg-gray-900',
    outline: 'border-2 border-blue-600 text-blue-400 hover:bg-blue-600/10 active:bg-blue-600/20'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        onClick={onClick}
      >
        {children}
        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={classes}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

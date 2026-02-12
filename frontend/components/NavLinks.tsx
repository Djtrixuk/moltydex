import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const PRIMARY_LINKS = [
  { href: '/for-traders', label: 'Traders' },
  { href: '/developers', label: 'Developers' },
  { href: '/sdk', label: 'SDK' },
  { href: '/api-providers', label: 'API Providers' },
  { href: '/blog', label: 'Blog' },
];

const MORE_LINKS = [
  { href: '/use-cases', label: 'Use Cases' },
  { href: '/examples', label: 'Examples' },
  { href: '/security', label: 'Security' },
  { href: '/whitepaper', label: 'Whitepaper' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
];

export default function NavLinks() {
  const [moreOpen, setMoreOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [moreOpen]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMoreOpen(false);
    }
    if (moreOpen) {
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }
  }, [moreOpen]);

  const linkClass = 'text-sm text-gray-300 hover:text-white transition-colors whitespace-nowrap';

  return (
    <nav className="hidden md:flex items-center gap-1 lg:gap-1.5" aria-label="Main navigation">
      {PRIMARY_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`${linkClass} px-2 py-1 rounded-md hover:bg-white/5`}
        >
          {link.label}
        </Link>
      ))}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className={`${linkClass} px-2 py-1 rounded-md hover:bg-white/5 flex items-center gap-1`}
          aria-expanded={moreOpen}
          aria-haspopup="true"
        >
          More
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {moreOpen && (
          <div className="absolute top-full right-0 mt-1.5 w-44 bg-gray-900 border border-gray-700/60 rounded-lg shadow-xl shadow-black/40 py-1.5 z-50">
            {MORE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => setMoreOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

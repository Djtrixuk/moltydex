import Link from 'next/link';
import Image from 'next/image';
import MobileNav from './MobileNav';
import NavLinks from './NavLinks';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps = {}) {
  return (
    <>
      <div className="bg-gray-950">
        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="flex items-center justify-between mb-6 md:mb-8 pb-4 border-b border-gray-800">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/moltydex-icon.png"
          alt="MoltyDEX Logo - x402 Token Aggregator for AI Agents"
          width={32}
          height={32}
          className="w-8 h-8"
          priority
        />
        <span className="text-white font-semibold text-lg">MoltyDEX</span>
      </Link>
      {/* Desktop Navigation */}
      <NavLinks />
      {/* Mobile Navigation */}
      <MobileNav />
          </div>
          {(title || subtitle) && (
            <div className="mb-8 text-center">
              {title && <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h1>}
              {subtitle && <p className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto">{subtitle}</p>}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

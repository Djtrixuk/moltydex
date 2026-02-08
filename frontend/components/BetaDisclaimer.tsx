import { useState, useEffect } from 'react';

export default function BetaDisclaimer() {
  const [showModal, setShowModal] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    // Check if user has already agreed
    const hasAgreed = localStorage.getItem('moltydex-beta-disclaimer-agreed');
    if (!hasAgreed) {
      setShowModal(true);
    }
  }, []);

  const handleAgree = () => {
    if (agreed) {
      localStorage.setItem('moltydex-beta-disclaimer-agreed', 'true');
      setShowModal(false);
    }
  };

  const handleClose = () => {
    // Don't allow closing without agreeing
    if (agreed) {
      handleAgree();
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative bg-gray-900 border border-gray-700 rounded-xl md:rounded-2xl shadow-2xl max-w-lg w-full my-auto p-4 md:p-6 max-h-[90vh] overflow-y-auto">
        {/* Close button - only visible when agreed */}
        {agreed && (
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-white transition-colors z-10 p-2 touch-manipulation"
            aria-label="Close"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Warning Icon and Title */}
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 pr-8">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Beta Application Warning</h2>
        </div>

        {/* Content - Scrollable */}
        <div className="space-y-3 md:space-y-4 text-gray-300 text-sm md:text-base">
          <p>
            MoltyDEX is currently in <strong className="text-white">BETA</strong>. This application is still under active development and may contain bugs or undergo significant changes.
          </p>

          <p>
            By proceeding to use this application, you acknowledge and accept that:
          </p>

          <ul className="list-disc list-inside space-y-1.5 md:space-y-2 ml-2 text-sm md:text-base">
            <li>The application may contain bugs or errors</li>
            <li>Features, UI, and functionality may change without notice</li>
            <li>Your experience may be impacted by ongoing development</li>
            <li>This is not a final production version of the software</li>
            <li>Token swaps involve financial risk - always verify transactions</li>
            <li>x402 payment integration is experimental and may have limitations</li>
          </ul>

          <p className="pt-2">
            Please report any bugs or issues via the project repository or contact the development team.
          </p>

          {/* Consent Checkbox - Mobile Friendly */}
          <div className="flex items-start gap-3 pt-3 md:pt-4 pb-2">
            <input
              type="checkbox"
              id="beta-consent"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 md:mt-1 w-5 h-5 md:w-5 md:h-5 rounded border-gray-600 bg-gray-800 text-white focus:ring-white/30 focus:ring-2 touch-manipulation flex-shrink-0"
            />
            <label htmlFor="beta-consent" className="text-sm md:text-base text-gray-300 cursor-pointer leading-tight">
              <strong className="text-white">I understand the risks and agree to the terms</strong>
            </label>
          </div>
        </div>

        {/* Action Button - Mobile Friendly */}
        <button
          onClick={handleAgree}
          disabled={!agreed}
          className={`w-full mt-4 md:mt-6 py-3 md:py-3 px-4 rounded-lg font-semibold text-sm md:text-base transition-all touch-manipulation min-h-[48px] flex items-center justify-center ${
            agreed
              ? 'bg-white text-gray-950 hover:bg-gray-100 cursor-pointer active:bg-gray-200'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          I Understand, Continue to App
        </button>
      </div>
    </div>
  );
}

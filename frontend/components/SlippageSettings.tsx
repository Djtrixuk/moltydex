/**
 * Slippage Tolerance Settings Component
 */

import { useState } from 'react';

interface SlippageSettingsProps {
  slippageBps: number;
  onSlippageChange: (slippageBps: number) => void;
}

export default function SlippageSettings({ slippageBps, onSlippageChange }: SlippageSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customSlippage, setCustomSlippage] = useState('');

  const presets = [
    { label: '0.1%', value: 10 },
    { label: '0.5%', value: 50 },
    { label: '1%', value: 100 },
  ];

  const handlePresetClick = (value: number) => {
    onSlippageChange(value);
    setCustomSlippage('');
    setIsOpen(false);
  };

  const handleCustomSubmit = () => {
    const num = parseFloat(customSlippage);
    if (!isNaN(num) && num >= 0.01 && num <= 50) {
      onSlippageChange(Math.round(num * 100)); // Convert to basis points
      setCustomSlippage('');
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-300 transition-colors"
        title="Slippage Tolerance"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 rounded-xl border border-gray-700 shadow-2xl z-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">Slippage Tolerance</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handlePresetClick(preset.value)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      slippageBps === preset.value
                        ? 'bg-white text-gray-950'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Custom</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={customSlippage}
                    onChange={(e) => setCustomSlippage(e.target.value)}
                    placeholder="0.5"
                    step="0.1"
                    min="0.01"
                    max="50"
                    className="flex-1 px-3 py-2 bg-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <span className="text-gray-400 text-sm py-2">%</span>
                  <button
                    onClick={handleCustomSubmit}
                    disabled={!customSlippage}
                    className="px-3 py-2 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-gray-950 text-sm font-medium transition-colors"
                  >
                    Set
                  </button>
                </div>
              </div>

              <div className="text-xs text-gray-500 pt-2 border-t border-gray-700">
                <p>Current: {(slippageBps / 100).toFixed(2)}%</p>
                <p className="mt-1">Higher slippage = more tolerance for price movement</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

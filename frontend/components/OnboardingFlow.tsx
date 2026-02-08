/**
 * Onboarding Flow Component
 * Guides new users through getting started with MoltyDEX
 */

import { useState } from 'react';
import Link from 'next/link';
import EnhancedCTA from './EnhancedCTA';

interface Step {
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

const steps: Step[] = [
  {
    title: 'Connect Your Wallet',
    description: 'Connect your Solana wallet to start swapping tokens. We support Phantom, Solflare, and other popular wallets.',
    action: {
      label: 'Connect Wallet',
      href: '/'
    }
  },
  {
    title: 'Try a Swap',
    description: 'Make your first swap to see how easy it is. Swap any SPL token with best prices and zero fees.',
    action: {
      label: 'Try Swap',
      href: '/'
    }
  },
  {
    title: 'Integrate for Agents',
    description: 'Build AI agents that handle x402 payments automatically. Get started with our developer SDK.',
    action: {
      label: 'View Docs',
      href: '/developers'
    }
  },
  {
    title: 'You\'re All Set!',
    description: 'You\'re ready to use MoltyDEX. Start swapping tokens or building agents with automatic x402 payments.',
    action: {
      label: 'Explore Features',
      href: '/x402-payments'
    }
  }
];

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleStepComplete = (stepIndex: number) => {
    setCompletedSteps(new Set(Array.from(completedSteps).concat([stepIndex])));
    if (stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Get Started with MoltyDEX</h2>
          <button
            onClick={() => setCurrentStep(0)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Reset
          </button>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-400">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{currentStepData.title}</h3>
        <p className="text-gray-300 mb-4">{currentStepData.description}</p>
        
        {currentStepData.action && (
          <div className="flex gap-3">
            <EnhancedCTA
              href={currentStepData.action.href}
              variant="primary"
              onClick={() => handleStepComplete(currentStep)}
            >
              {currentStepData.action.label}
            </EnhancedCTA>
            {currentStep < steps.length - 1 && (
              <button
                onClick={handleSkip}
                className="px-6 py-3 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
              >
                Skip
              </button>
            )}
          </div>
        )}
      </div>

      {/* Step Indicators */}
      <div className="flex gap-2 justify-center">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentStep
                ? 'bg-blue-600 w-8'
                : completedSteps.has(index)
                ? 'bg-green-500'
                : 'bg-gray-700'
            }`}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * FAQ Accordion Component
 * SEO-friendly accordion that keeps all content in DOM for search engines
 * Uses semantic HTML and proper ARIA attributes for accessibility
 */

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQItem[];
  defaultOpen?: number; // Index of FAQ to open by default (optional)
}

export default function FAQAccordion({ faqs, defaultOpen }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen ?? null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="bg-gray-900/60 rounded-lg border border-gray-800/50 overflow-hidden transition-all duration-200"
          >
            {/* Question Button - Always Visible */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left p-4 md:p-6 flex items-center justify-between hover:bg-gray-800/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
              id={`faq-question-${index}`}
            >
              <h3 className="text-lg md:text-xl font-semibold text-white pr-4">
                {faq.question}
              </h3>
              {/* Chevron Icon */}
              <svg
                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                  isOpen ? 'transform rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Answer - Always in DOM for SEO, hidden/shown with CSS */}
            <div
              id={`faq-answer-${index}`}
              role="region"
              aria-labelledby={`faq-question-${index}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              {/* Divider line with proper spacing */}
              {isOpen && (
                <div className="border-t border-gray-700/60 mx-4 md:mx-6 my-0"></div>
              )}
              <div className={`px-4 md:px-6 pb-4 md:pb-6 ${isOpen ? 'pt-4 md:pt-6' : 'pt-0'}`}>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Developer Mode Panel
 * Shows API request/response, transaction details, and rate limit info
 */

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.moltydex.com';

interface DeveloperModePanelProps {
  quoteRequest?: {
    url: string;
    method: string;
    body?: any;
  };
  quoteResponse?: any;
  swapRequest?: {
    url: string;
    method: string;
    body?: any;
  };
  swapResponse?: any;
  txSignature?: string | null;
  txStatus?: any;
}

interface RateLimitStatus {
  limit: number;
  remaining: number;
  reset_at: string;
  endpoint: string;
}

export default function DeveloperModePanel({
  quoteRequest,
  quoteResponse,
  swapRequest,
  swapResponse,
  txSignature,
  txStatus,
}: DeveloperModePanelProps) {
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(null);
  const [rateLimitLoading, setRateLimitLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['rate-limit']));

  // Fetch rate limit status
  useEffect(() => {
    const fetchRateLimit = async () => {
      setRateLimitLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/rate-limit/status`);
        if (response.ok) {
          const data = await response.json();
          setRateLimitStatus(data);
        }
      } catch (err) {
        // Silently fail - rate limit is optional info
      } finally {
        setRateLimitLoading(false);
      }
    };

    fetchRateLimit();
    // Refresh every 10 seconds
    const interval = setInterval(fetchRateLimit, 10000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const formatJson = (obj: any) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  const generateCurl = (request: { url: string; method: string; body?: any }) => {
    const fullUrl = request.url.startsWith('http') ? request.url : `${API_URL}${request.url}`;
    let curl = `curl -X ${request.method} "${fullUrl}"`;
    
    if (request.method === 'POST' && request.body) {
      curl += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(request.body)}'`;
    }
    
    return curl;
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  return (
    <div className="mt-4 bg-gray-900/80 backdrop-blur-lg rounded-xl p-4 border border-gray-700 space-y-4 text-sm">
      <h3 className="text-lg font-semibold text-white mb-3">Developer Mode</h3>

      {/* Rate Limit Status - Always visible */}
      {rateLimitStatus && (
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 font-medium">Rate Limit Status</span>
            <span className={`text-xs px-2 py-1 rounded ${
              rateLimitStatus.remaining > 20 
                ? 'bg-green-500/20 text-green-300' 
                : rateLimitStatus.remaining > 10
                ? 'bg-yellow-500/20 text-yellow-300'
                : 'bg-red-500/20 text-red-300'
            }`}>
              {rateLimitStatus.remaining} / {rateLimitStatus.limit} remaining
            </span>
          </div>
          <div className="text-xs text-gray-400 space-y-1">
            <div>Endpoint: {rateLimitStatus.endpoint}</div>
            <div>Resets: {new Date(rateLimitStatus.reset_at).toLocaleTimeString()}</div>
          </div>
        </div>
      )}

      {/* Quote API Request/Response */}
      {quoteRequest && (
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => toggleSection('quote')}
              className="text-gray-300 font-medium hover:text-white flex items-center gap-2"
            >
              <span>{expandedSections.has('quote') ? '▼' : '▶'}</span>
              <span>Quote API</span>
            </button>
            <button
              onClick={() => copyToClipboard(generateCurl(quoteRequest), 'quote-curl')}
              className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
            >
              {copied === 'quote-curl' ? 'Copied!' : 'Copy cURL'}
            </button>
          </div>
          {expandedSections.has('quote') && (
            <div className="space-y-2 mt-2">
              <div>
                <div className="text-xs text-gray-400 mb-1">Request:</div>
                <pre className="text-xs bg-black/30 p-2 rounded overflow-x-auto text-gray-300">
                  {quoteRequest.method} {quoteRequest.url}
                </pre>
              </div>
              {quoteResponse && (
                <div>
                  <div className="text-xs text-gray-400 mb-1">Response:</div>
                  <pre className="text-xs bg-black/30 p-2 rounded overflow-x-auto text-gray-300 max-h-40 overflow-y-auto">
                    {formatJson(quoteResponse)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Swap API Request/Response */}
      {swapRequest && (
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => toggleSection('swap')}
              className="text-gray-300 font-medium hover:text-white flex items-center gap-2"
            >
              <span>{expandedSections.has('swap') ? '▼' : '▶'}</span>
              <span>Swap Build API</span>
            </button>
            <button
              onClick={() => copyToClipboard(generateCurl(swapRequest), 'swap-curl')}
              className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
            >
              {copied === 'swap-curl' ? 'Copied!' : 'Copy cURL'}
            </button>
          </div>
          {expandedSections.has('swap') && (
            <div className="space-y-2 mt-2">
              <div>
                <div className="text-xs text-gray-400 mb-1">Request:</div>
                <pre className="text-xs bg-black/30 p-2 rounded overflow-x-auto text-gray-300">
                  {swapRequest.method} {swapRequest.url}
                </pre>
                {swapRequest.body && (
                  <pre className="text-xs bg-black/30 p-2 rounded overflow-x-auto text-gray-300 mt-1 max-h-32 overflow-y-auto">
                    {formatJson(swapRequest.body)}
                  </pre>
                )}
              </div>
              {swapResponse && (
                <div>
                  <div className="text-xs text-gray-400 mb-1">Response:</div>
                  <pre className="text-xs bg-black/30 p-2 rounded overflow-x-auto text-gray-300 max-h-40 overflow-y-auto">
                    {formatJson(swapResponse)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Transaction Details */}
      {txSignature && (
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => toggleSection('transaction')}
              className="text-gray-300 font-medium hover:text-white flex items-center gap-2"
            >
              <span>{expandedSections.has('transaction') ? '▼' : '▶'}</span>
              <span>Transaction</span>
            </button>
            <a
              href={`https://solscan.io/tx/${txSignature}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-white border border-white/20"
            >
              View on Solscan
            </a>
          </div>
          {expandedSections.has('transaction') && (
            <div className="space-y-2 mt-2">
              <div className="text-xs text-gray-400">
                <div>Signature: <span className="text-gray-300 font-mono">{txSignature.slice(0, 16)}...</span></div>
              </div>
              {txStatus && (
                <div>
                  <div className="text-xs text-gray-400 mb-1">Status:</div>
                  <pre className="text-xs bg-black/30 p-2 rounded overflow-x-auto text-gray-300 max-h-32 overflow-y-auto">
                    {formatJson(txStatus)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Info Note */}
      <div className="text-xs text-gray-500 italic pt-2 border-t border-gray-700">
        Developer Mode exposes raw MoltyDEX API activity for debugging and verification. Agents should integrate directly with the API.
      </div>
    </div>
  );
}

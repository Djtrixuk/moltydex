/**
 * HTTP Interceptor
 * Intercepts fetch requests and handles 402 responses automatically
 */

import { X402AutoPayAgent } from './X402AutoPayAgent.js';
import type { AgentConfig } from './types.js';

export class HTTPInterceptor {
  private agent: X402AutoPayAgent;
  private originalFetch: typeof fetch;

  constructor(config: AgentConfig) {
    this.agent = new X402AutoPayAgent(config);
    this.originalFetch = globalThis.fetch;
    this.setupInterceptor();
  }

  /**
   * Setup fetch interceptor
   */
  private setupInterceptor() {
    const self = this;
    
    globalThis.fetch = async function(
      input: RequestInfo | URL,
      init?: RequestInit
    ): Promise<Response> {
      // Make original request
      const response = await self.originalFetch(input, init);

      // Check for 402 Payment Required
      if (response.status === 402) {
        console.log('[Interceptor] 402 Payment Required detected');
        
        // Clone response to read body
        const clonedResponse = response.clone();
        const paymentBody = await clonedResponse.json();

        // Handle payment (no retry callback — we retry once below with the proof)
        const result = await self.agent.handle402(paymentBody);

        if (result.success && result.payment_proof) {
          // Retry original request exactly once with payment proof header
          const retryInit: RequestInit = {
            ...init,
            headers: {
              ...init?.headers,
              'X-Payment': result.payment_proof,
            },
          };
          return self.originalFetch(input, retryInit);
        } else {
          throw new Error(`Auto-pay failed: ${result.error || 'Unknown error'}`);
        }
      }

      return response;
    };
  }

  /**
   * Get the agent instance
   */
  getAgent(): X402AutoPayAgent {
    return this.agent;
  }

  /**
   * Restore original fetch
   */
  restore() {
    globalThis.fetch = this.originalFetch;
  }
}

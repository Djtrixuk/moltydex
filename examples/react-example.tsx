/**
 * MoltyDEX React Hook Example
 * 
 * Example showing how to use MoltyDEX in a React application
 */

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface Quote {
  inputAmount: string;
  outputAmount: string;
  feeAmount: string;
  priceImpact: string;
}

interface SwapParams {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippageBps?: number;
}

/**
 * Custom hook for MoltyDEX operations
 */
function useMoltyDEX() {
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quote = async (params: SwapParams): Promise<Quote | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.moltydex.com/api/quote?` +
          `input_mint=${params.inputMint}&` +
          `output_mint=${params.outputMint}&` +
          `amount=${params.amount}&` +
          `slippage_bps=${params.slippageBps || 50}`
      );

      if (!response.ok) {
        throw new Error('Failed to get quote');
      }

      const data = await response.json();
      return {
        inputAmount: data.input_amount,
        outputAmount: data.output_amount,
        feeAmount: data.fee_amount,
        priceImpact: data.price_impact,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const swap = async (params: SwapParams): Promise<string | null> => {
    if (!publicKey) {
      setError('Wallet not connected');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      // Build swap transaction
      const buildResponse = await fetch('https://api.moltydex.com/api/swap/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: publicKey.toBase58(),
          input_mint: params.inputMint,
          output_mint: params.outputMint,
          amount: params.amount.toString(),
          slippage_bps: (params.slippageBps || 50).toString(),
        }),
      });

      if (!buildResponse.ok) {
        throw new Error('Failed to build swap');
      }

      const { transaction } = await buildResponse.json();

      // Sign transaction
      const txBuffer = Buffer.from(transaction, 'base64');
      const signedTx = await signTransaction(
        // Parse transaction (simplified - actual implementation would use @solana/web3.js)
        txBuffer as any
      );

      // Send transaction (simplified)
      // In production, you'd send this to Solana network
      console.log('Signed transaction:', signedTx);

      return 'transaction_signature';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { quote, swap, loading, error };
}

/**
 * Swap Component
 */
export function SwapInterface() {
  const { publicKey } = useWallet();
  const { quote, swap, loading, error } = useMoltyDEX();
  const [quoteResult, setQuoteResult] = useState<Quote | null>(null);
  const [inputAmount, setInputAmount] = useState('1');
  const [inputToken, setInputToken] = useState(
    'So11111111111111111111111111111111111111112' // SOL
  );
  const [outputToken, setOutputToken] = useState(
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' // USDC
  );

  const handleGetQuote = async () => {
    const amount = parseFloat(inputAmount) * 1_000_000_000; // Convert to lamports
    const result = await quote({
      inputMint: inputToken,
      outputMint: outputToken,
      amount,
    });
    setQuoteResult(result);
  };

  const handleSwap = async () => {
    if (!publicKey) {
      alert('Please connect your wallet');
      return;
    }

    const amount = parseFloat(inputAmount) * 1_000_000_000;
    const signature = await swap({
      inputMint: inputToken,
      outputMint: outputToken,
      amount,
    });

    if (signature) {
      alert(`Swap successful! Transaction: ${signature}`);
    }
  };

  return (
    <div className="swap-interface">
      <h2>MoltyDEX Swap</h2>

      {!publicKey && (
        <p className="warning">Please connect your wallet to swap</p>
      )}

      <div className="form-group">
        <label>Input Amount</label>
        <input
          type="number"
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
          placeholder="1.0"
        />
      </div>

      <div className="form-group">
        <label>Input Token</label>
        <select value={inputToken} onChange={(e) => setInputToken(e.target.value)}>
          <option value="So11111111111111111111111111111111111111112">SOL</option>
          <option value="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v">USDC</option>
        </select>
      </div>

      <div className="form-group">
        <label>Output Token</label>
        <select value={outputToken} onChange={(e) => setOutputToken(e.target.value)}>
          <option value="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v">USDC</option>
          <option value="So11111111111111111111111111111111111111112">SOL</option>
        </select>
      </div>

      <button onClick={handleGetQuote} disabled={loading}>
        Get Quote
      </button>

      {quoteResult && (
        <div className="quote-result">
          <p>Output: {quoteResult.outputAmount}</p>
          <p>Fee: {quoteResult.feeAmount}</p>
          <p>Price Impact: {quoteResult.priceImpact}%</p>
        </div>
      )}

      <button onClick={handleSwap} disabled={loading || !publicKey}>
        {loading ? 'Processing...' : 'Swap'}
      </button>

      {error && <p className="error">Error: {error}</p>}
    </div>
  );
}

export default SwapInterface;

/**
 * Transaction routes
 * Handle transaction sending and status tracking
 */

const express = require('express');
const router = express.Router();
const { Connection, PublicKey } = require('@solana/web3.js');
const { registerWebhook, notifyWebhooks, getWebhookStatus } = require('../utils/webhooks');
const { transactionFailedError } = require('../utils/errorHandler');

/**
 * POST /api/transaction/send
 * Send signed transaction via API RPC (avoids browser 403 from RPC providers)
 * Accepts both 'signedTransaction' (frontend) and 'transaction' (SDK) for compatibility
 */
router.post('/send', async (req, res) => {
  try {
    const signedB64 = req.body.signedTransaction || req.body.transaction;

    if (!signedB64 || typeof signedB64 !== 'string') {
      return res.status(400).json({ 
        error: 'Missing signedTransaction or transaction (base64 string)' 
      });
    }

    const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const connection = new Connection(RPC_URL, 'confirmed');

    const raw = Buffer.from(signedB64, 'base64');
    const signature = await connection.sendRawTransaction(raw, {
      skipPreflight: true,
      maxRetries: 3,
    });

    res.json({ 
      signature,
      status: 'pending',
      message: 'Transaction sent successfully',
    });
  } catch (err) {
    const message = err.message || String(err);
    const details = err.response?.data ?? err.logs;
    res.status(500).json({
      error: 'Failed to send transaction',
      message,
      details: details || undefined,
    });
  }
});

/**
 * GET /api/transaction/status/:signature
 * Get transaction status and confirmation details
 */
router.get('/status/:signature', async (req, res) => {
  try {
    const { signature } = req.params;

    if (!signature || signature.length < 32) {
      return res.status(400).json({ error: 'Invalid transaction signature' });
    }

    const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const connection = new Connection(RPC_URL, 'confirmed');

    // Get transaction status
    const status = await connection.getSignatureStatus(signature);

    if (!status.value) {
      return res.json({
        signature,
        status: 'not_found',
        confirmed: false,
        message: 'Transaction not found. It may not have been submitted yet.',
      });
    }

    const { err, confirmationStatus, slot } = status.value;

    // Check if transaction is confirmed by trying to fetch it
    // This is more reliable than just checking confirmationStatus
    let transactionDetails = null;
    let isConfirmed = false;
    
    if (!err) {
      try {
        const tx = await connection.getTransaction(signature, {
          commitment: 'confirmed',
          maxSupportedTransactionVersion: 0,
        });
        
        if (tx && tx.slot) {
          // Transaction exists and has a slot = it's confirmed
          isConfirmed = true;
          transactionDetails = {
            block_time: tx.blockTime,
            slot: tx.slot,
            fee: tx.meta?.fee,
            pre_balances: tx.meta?.preBalances,
            post_balances: tx.meta?.postBalances,
            log_messages: tx.meta?.logMessages,
            err: tx.meta?.err,
          };
        }
      } catch (err) {
        // Transaction might not be fully confirmed yet
      }
    }

    // Also check confirmationStatus as a fallback
    // confirmationStatus can be: null, 'processed', 'confirmed', or 'finalized'
    const hasConfirmationStatus = confirmationStatus && 
      (confirmationStatus === 'confirmed' || confirmationStatus === 'finalized' || confirmationStatus === 'processed');
    
    // Transaction is confirmed if:
    // 1. We successfully fetched it (has slot), OR
    // 2. confirmationStatus indicates confirmed/finalized, OR  
    // 3. confirmationStatus is 'processed' (processed means it went through)
    isConfirmed = isConfirmed || hasConfirmationStatus || (confirmationStatus === 'processed' && !err);

    const statusData = {
      signature,
      status: err ? 'failed' : (isConfirmed ? 'confirmed' : (confirmationStatus || 'pending')),
      confirmed: isConfirmed && !err,
      confirmation_status: confirmationStatus,
      slot,
      error: err ? {
        code: typeof err === 'object' && err.constructor?.name ? err.constructor.name : String(err),
        message: typeof err === 'object' && err.message ? err.message : (typeof err === 'string' ? err : 'Transaction failed'),
        details: typeof err === 'object' ? err : (typeof err === 'string' ? err : JSON.stringify(err)),
        // Extract instruction error details for better error messages
        instruction_error: typeof err === 'object' && err.InstructionError ? err.InstructionError : null,
        custom_error_code: typeof err === 'object' && err.InstructionError && Array.isArray(err.InstructionError) && err.InstructionError[1]?.Custom !== undefined 
          ? err.InstructionError[1].Custom 
          : null,
      } : null,
      transaction_details: transactionDetails,
      timestamp: transactionDetails?.block_time 
        ? new Date(transactionDetails.block_time * 1000).toISOString()
        : null,
    };

    // Notify webhooks if transaction is confirmed or failed
    if (confirmationStatus || err) {
      notifyWebhooks(signature, statusData).catch((err) => {
        console.warn('Webhook notification failed:', err.message);
      });
    }

    res.json(statusData);
  } catch (err) {
    console.error('Transaction status error:', err.message);
    res.status(500).json({
      error: 'Failed to get transaction status',
      message: err.message,
    });
  }
});

/**
 * GET /api/transaction/history/:wallet_address
 * Get transaction history for a wallet
 */
router.get('/history/:wallet_address', async (req, res) => {
  try {
    const { wallet_address } = req.params;
    const { limit = 20, before } = req.query;

    if (!wallet_address) {
      return res.status(400).json({ error: 'Missing wallet_address' });
    }

    const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const connection = new Connection(RPC_URL, 'confirmed');

    const publicKey = new PublicKey(wallet_address);

    // Get signatures
    const options = {
      limit: Math.min(parseInt(limit) || 20, 100), // Max 100
    };
    if (before) {
      options.before = before;
    }

    const signatures = await connection.getSignaturesForAddress(publicKey, options);

    // Get transaction details for each signature
    const transactions = await Promise.all(
      signatures.map(async (sigInfo) => {
        try {
          const tx = await connection.getTransaction(sigInfo.signature, {
            commitment: 'confirmed',
            maxSupportedTransactionVersion: 0,
          });

          return {
            signature: sigInfo.signature,
            status: sigInfo.err ? 'failed' : 'confirmed',
            confirmed: !sigInfo.err,
            slot: sigInfo.slot,
            block_time: sigInfo.blockTime,
            error: sigInfo.err ? {
              code: sigInfo.err.toString(),
              message: 'Transaction failed',
            } : null,
            fee: tx?.meta?.fee,
            timestamp: sigInfo.blockTime 
              ? new Date(sigInfo.blockTime * 1000).toISOString()
              : null,
          };
        } catch (err) {
          return {
            signature: sigInfo.signature,
            status: sigInfo.err ? 'failed' : 'pending',
            confirmed: !sigInfo.err,
            slot: sigInfo.slot,
            block_time: sigInfo.blockTime,
            error: sigInfo.err ? {
              code: sigInfo.err.toString(),
              message: 'Transaction failed',
            } : null,
            timestamp: sigInfo.blockTime 
              ? new Date(sigInfo.blockTime * 1000).toISOString()
              : null,
          };
        }
      })
    );

    res.json({
      wallet_address,
      transactions,
      count: transactions.length,
      has_more: signatures.length === parseInt(limit),
      next_before: signatures.length > 0 ? signatures[signatures.length - 1].signature : null,
    });
  } catch (err) {
    console.error('Transaction history error:', err.message);
    res.status(500).json({
      error: 'Failed to get transaction history',
      message: err.message,
    });
  }
});

/**
 * POST /api/transaction/webhook
 * Register a webhook to receive transaction status notifications
 */
router.post('/webhook', async (req, res) => {
  try {
    const { signature, callback_url, metadata } = req.body;

    if (!signature || !callback_url) {
      return res.status(400).json({
        error: 'Missing required fields: signature and callback_url',
        code: 'INVALID_INPUT',
        suggestions: [
          'Provide transaction signature',
          'Provide a valid HTTPS callback URL',
        ],
      });
    }

    // Validate callback URL
    let callbackUrl;
    try {
      callbackUrl = new URL(callback_url);
      if (callbackUrl.protocol !== 'https:') {
        return res.status(400).json({
          error: 'Callback URL must use HTTPS',
          code: 'INVALID_INPUT',
          suggestions: ['Use an HTTPS URL for the callback'],
        });
      }
    } catch (err) {
      return res.status(400).json({
        error: 'Invalid callback URL format',
        code: 'INVALID_INPUT',
        suggestions: ['Provide a valid URL (e.g., https://your-agent.com/webhook)'],
      });
    }

    const result = registerWebhook(signature, callbackUrl.toString(), metadata || {});

    if (result.error) {
      return res.status(400).json({
        error: result.error,
        code: 'INVALID_CALLBACK_URL',
      });
    }

    res.json({
      webhook_id: result.webhookId,
      signature,
      callback_url: callbackUrl.toString(),
      message: 'Webhook registered successfully. You will receive a notification when the transaction status changes.',
      registered_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Webhook registration error:', err.message);
    res.status(500).json({
      error: 'Failed to register webhook',
      message: err.message,
    });
  }
});

/**
 * GET /api/transaction/webhook/:webhook_id
 * Get webhook status
 */
router.get('/webhook/:webhook_id', async (req, res) => {
  try {
    const { webhook_id } = req.params;
    const status = getWebhookStatus(webhook_id);

    if (!status) {
      return res.status(404).json({
        error: 'Webhook not found',
        code: 'NOT_FOUND',
        suggestions: ['Verify the webhook ID is correct'],
      });
    }

    res.json(status);
  } catch (err) {
    console.error('Webhook status error:', err.message);
    res.status(500).json({
      error: 'Failed to get webhook status',
      message: err.message,
    });
  }
});

module.exports = router;

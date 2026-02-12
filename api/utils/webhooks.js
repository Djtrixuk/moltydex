/**
 * Webhook utilities for transaction status notifications
 */

const axios = require('axios');

// In-memory webhook registry (bounded to prevent memory leaks)
const MAX_WEBHOOKS = 500;
const webhookRegistry = new Map();

// SSRF protection: block private/internal IPs and non-HTTPS in production
const BLOCKED_HOSTS = [
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/,
  /^10\.\d+\.\d+\.\d+$/,
  /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/,
  /^192\.168\.\d+\.\d+$/,
  /^0\.0\.0\.0$/,
  /^\[::1?\]$/,
  /^169\.254\.\d+\.\d+$/, // link-local
  /^fc00:/i, /^fd00:/i, /^fe80:/i, // IPv6 private
];

/**
 * Validate a callback URL to prevent SSRF attacks
 * @param {string} callbackUrl - The URL to validate
 * @returns {{ valid: boolean, reason?: string }}
 */
function validateCallbackUrl(callbackUrl) {
  try {
    const url = new URL(callbackUrl);

    // Must be HTTPS in production
    if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
      return { valid: false, reason: 'Webhook callback must use HTTPS in production' };
    }

    // Must be HTTP or HTTPS
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return { valid: false, reason: 'Webhook callback must use HTTP or HTTPS' };
    }

    // Block private/internal hostnames
    const hostname = url.hostname;
    for (const pattern of BLOCKED_HOSTS) {
      if (pattern.test(hostname)) {
        return { valid: false, reason: 'Webhook callback cannot target private/internal addresses' };
      }
    }

    return { valid: true };
  } catch {
    return { valid: false, reason: 'Invalid URL' };
  }
}

/**
 * Register a webhook for transaction status updates
 * @param {string} signature - Transaction signature
 * @param {string} callbackUrl - Webhook callback URL
 * @param {Object} metadata - Optional metadata to include in webhook payload
 * @returns {{ webhookId?: string, error?: string }} Webhook ID or error
 */
function registerWebhook(signature, callbackUrl, metadata = {}) {
  // Validate callback URL to prevent SSRF
  const urlCheck = validateCallbackUrl(callbackUrl);
  if (!urlCheck.valid) {
    return { error: urlCheck.reason };
  }

  // Evict oldest webhook if at capacity
  if (webhookRegistry.size >= MAX_WEBHOOKS) {
    const oldestKey = webhookRegistry.keys().next().value;
    webhookRegistry.delete(oldestKey);
  }

  const webhookId = `${signature}-${Date.now()}`;
  webhookRegistry.set(webhookId, {
    signature,
    callbackUrl,
    metadata,
    registeredAt: new Date().toISOString(),
    notified: false,
  });
  return { webhookId };
}

/**
 * Get webhook by signature
 * @param {string} signature - Transaction signature
 * @returns {Array} Array of webhook registrations
 */
function getWebhooksBySignature(signature) {
  const webhooks = [];
  for (const [id, webhook] of webhookRegistry.entries()) {
    if (webhook.signature === signature && !webhook.notified) {
      webhooks.push({ id, ...webhook });
    }
  }
  return webhooks;
}

/**
 * Notify webhook subscribers about transaction status
 * @param {string} signature - Transaction signature
 * @param {Object} statusData - Transaction status data
 * @returns {Promise<Array>} Results of webhook notifications
 */
async function notifyWebhooks(signature, statusData) {
  const webhooks = getWebhooksBySignature(signature);
  const results = [];

  for (const webhook of webhooks) {
    try {
      const payload = {
        signature,
        status: statusData.status,
        confirmed: statusData.confirmed,
        confirmation_status: statusData.confirmation_status,
        error: statusData.error,
        transaction_details: statusData.transaction_details,
        timestamp: statusData.timestamp || new Date().toISOString(),
        metadata: webhook.metadata,
      };

      // Send webhook notification
      const response = await axios.post(webhook.callbackUrl, payload, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'MoltyDEX-Webhook/1.0',
        },
      });

      // Mark as notified
      webhookRegistry.set(webhook.id, {
        ...webhook,
        notified: true,
        notifiedAt: new Date().toISOString(),
        responseStatus: response.status,
      });

      results.push({
        webhookId: webhook.id,
        success: true,
        status: response.status,
      });
    } catch (err) {
      results.push({
        webhookId: webhook.id,
        success: false,
        error: err.message,
        status: err.response?.status,
      });
    }
  }

  return results;
}

/**
 * Remove old webhooks (cleanup)
 * @param {number} maxAgeHours - Maximum age in hours (default: 24)
 */
function cleanupWebhooks(maxAgeHours = 24) {
  const now = Date.now();
  const maxAge = maxAgeHours * 60 * 60 * 1000;

  for (const [id, webhook] of webhookRegistry.entries()) {
    const age = now - new Date(webhook.registeredAt).getTime();
    if (age > maxAge) {
      webhookRegistry.delete(id);
    }
  }
}

/**
 * Get webhook status
 * @param {string} webhookId - Webhook ID
 * @returns {Object|null} Webhook information
 */
function getWebhookStatus(webhookId) {
  const webhook = webhookRegistry.get(webhookId);
  if (!webhook) return null;

  return {
    id: webhookId,
    signature: webhook.signature,
    callbackUrl: webhook.callbackUrl,
    registeredAt: webhook.registeredAt,
    notified: webhook.notified,
    notifiedAt: webhook.notifiedAt,
    responseStatus: webhook.responseStatus,
  };
}

// NOTE: No setInterval — incompatible with serverless (Vercel).
// Old webhooks are evicted lazily: the MAX_WEBHOOKS bound in registerWebhook
// evicts the oldest entry on every new registration, and cleanupWebhooks()
// can be called explicitly if needed.

module.exports = {
  registerWebhook,
  validateCallbackUrl,
  getWebhooksBySignature,
  notifyWebhooks,
  cleanupWebhooks,
  getWebhookStatus,
};

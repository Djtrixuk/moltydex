/**
 * Webhook utilities for transaction status notifications
 */

const axios = require('axios');

// In-memory webhook registry (in production, use Redis or database)
const webhookRegistry = new Map();

/**
 * Register a webhook for transaction status updates
 * @param {string} signature - Transaction signature
 * @param {string} callbackUrl - Webhook callback URL
 * @param {Object} metadata - Optional metadata to include in webhook payload
 * @returns {string} Webhook ID
 */
function registerWebhook(signature, callbackUrl, metadata = {}) {
  const webhookId = `${signature}-${Date.now()}`;
  webhookRegistry.set(webhookId, {
    signature,
    callbackUrl,
    metadata,
    registeredAt: new Date().toISOString(),
    notified: false,
  });
  return webhookId;
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

// Cleanup old webhooks every hour
setInterval(() => {
  cleanupWebhooks(24);
}, 60 * 60 * 1000);

module.exports = {
  registerWebhook,
  getWebhooksBySignature,
  notifyWebhooks,
  cleanupWebhooks,
  getWebhookStatus,
};

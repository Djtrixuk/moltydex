/**
 * Input validation middleware using Joi
 * Applied consistently across all API routes
 */
const Joi = require('joi');

// -- Common validators --

// Solana addresses are base58-encoded, typically 32-44 chars
const solanaAddress = Joi.string()
  .min(32)
  .max(44)
  .pattern(/^[1-9A-HJ-NP-Za-km-z]+$/)
  .messages({
    'string.pattern.base': '{{#label}} must be a valid base58-encoded Solana address',
    'string.min': '{{#label}} must be at least 32 characters',
    'string.max': '{{#label}} must be at most 44 characters',
  });

const amount = Joi.string()
  .pattern(/^\d+$/)
  .messages({
    'string.pattern.base': '{{#label}} must be a positive integer string (lamports)',
  });

const slippageBps = Joi.number().integer().min(1).max(5000).default(50).messages({
  'number.min': 'slippage_bps must be at least 1 (0.01%)',
  'number.max': 'slippage_bps must be at most 5000 (50%)',
});

const paginationLimit = Joi.number().integer().min(1).max(100).default(20);

// -- Schemas --

const schemas = {
  // GET /api/quote
  quote: Joi.object({
    input_mint: solanaAddress.required(),
    output_mint: solanaAddress.required(),
    amount: amount.required(),
    slippage_bps: slippageBps,
  }),

  // POST /api/swap/build
  swapBuild: Joi.object({
    wallet_address: solanaAddress.required(),
    input_mint: solanaAddress.required(),
    output_mint: solanaAddress.required(),
    amount: amount.required(),
    slippage_bps: slippageBps,
    priority_fee_lamports: Joi.number().integer().min(0).default(0),
  }),

  // GET /api/balance
  balance: Joi.object({
    wallet_address: solanaAddress.required(),
    token_mint: solanaAddress.optional().allow(''),
  }),

  // POST /api/transaction/send
  transactionSend: Joi.object({
    signedTransaction: Joi.string().optional(),
    transaction: Joi.string().optional(),
  }).or('signedTransaction', 'transaction'),

  // POST /api/transaction/webhook
  transactionWebhook: Joi.object({
    signature: Joi.string().min(32).required(),
    callback_url: Joi.string().uri({ scheme: ['https'] }).required(),
    metadata: Joi.object().optional(),
  }),

  // POST /api/x402/parse-payment
  parsePayment: Joi.object({
    payment_response_body: Joi.alternatives()
      .try(Joi.object(), Joi.string())
      .required(),
  }),

  // POST /api/x402/prepare-payment
  preparePayment: Joi.object({
    wallet_address: solanaAddress.required(),
    payment_requirements: Joi.alternatives()
      .try(Joi.object(), Joi.array())
      .required(),
    preferred_input_token: solanaAddress.optional(),
  }),

  // POST /api/x402/simulate-payment
  simulatePayment: Joi.object({
    wallet_address: solanaAddress.required(),
    payment_requirements: Joi.alternatives()
      .try(Joi.object(), Joi.array())
      .required(),
    preferred_input_token: solanaAddress.optional(),
  }),

  // POST /api/x402/auto-pay
  autoPay: Joi.object({
    payment_response_body: Joi.alternatives()
      .try(Joi.object(), Joi.string())
      .required(),
    wallet_address: solanaAddress.required(),
    preferred_input_token: solanaAddress.optional(),
    auto_swap: Joi.boolean().default(false),
  }),

  // POST /api/batch/balance
  batchBalance: Joi.object({
    wallet_address: solanaAddress.required(),
    token_mints: Joi.array().items(solanaAddress).min(1).max(100).required(),
  }),

  // POST /api/batch/balances (legacy)
  batchBalances: Joi.object({
    requests: Joi.array()
      .items(
        Joi.object({
          wallet_address: solanaAddress.required(),
          token_mint: solanaAddress.optional(),
        })
      )
      .min(1)
      .max(50)
      .required(),
  }),

  // POST /api/batch/quotes
  batchQuotes: Joi.object({
    requests: Joi.array()
      .items(
        Joi.object({
          input_mint: solanaAddress.required(),
          output_mint: solanaAddress.required(),
          amount: amount.required(),
          slippage_bps: slippageBps,
        })
      )
      .min(1)
      .max(20)
      .required(),
  }),

  // POST /api/batch/token-metadata
  batchTokenMetadata: Joi.object({
    token_addresses: Joi.array()
      .items(solanaAddress)
      .min(1)
      .max(50)
      .required(),
  }),

  // GET /api/token
  token: Joi.object({
    mint: Joi.string().min(1).required(),
  }),

  // GET /api/wallet/tokens
  walletTokens: Joi.object({
    wallet_address: solanaAddress.required(),
  }),

  // GET /api/ultra/order
  ultraOrder: Joi.object({
    inputMint: solanaAddress.required(),
    outputMint: solanaAddress.required(),
    amount: amount.required(),
    taker: solanaAddress.optional(),
    slippageBps: Joi.number().integer().min(1).max(5000).optional(),
  }),

  // POST /api/ultra/execute
  ultraExecute: Joi.object({
    signedTransaction: Joi.string().required(),
    requestId: Joi.string().required(),
  }),
};

/**
 * Validation middleware factory for request body (POST)
 */
function validate(schemaName) {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      console.error(`[validation] CRITICAL: Unknown schema "${schemaName}" — blocking request`);
      return res.status(500).json({ error: 'Internal server error', error_code: 'MISSING_SCHEMA' });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, ''),
      }));

      return res.status(400).json({
        error: 'Validation failed',
        error_code: 'VALIDATION_ERROR',
        errors,
        suggestion: 'Check the field requirements and try again',
      });
    }

    req.body = value;
    next();
  };
}

/**
 * Query validation middleware (for GET requests)
 */
function validateQuery(schemaName) {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      console.error(`[validation] CRITICAL: Unknown schema "${schemaName}" — blocking request`);
      return res.status(500).json({ error: 'Internal server error', error_code: 'MISSING_SCHEMA' });
    }

    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: false, // Don't strip unknown query params (pagination, etc.)
      convert: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, ''),
      }));

      return res.status(400).json({
        error: 'Validation failed',
        error_code: 'VALIDATION_ERROR',
        errors,
        suggestion: 'Check the query parameters and try again',
      });
    }

    req.query = { ...req.query, ...value };
    next();
  };
}

/**
 * Params validation middleware (for URL params like :wallet_address)
 */
function validateParams(schemaName) {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      console.error(`[validation] CRITICAL: Unknown schema "${schemaName}" — blocking request`);
      return res.status(500).json({ error: 'Internal server error', error_code: 'MISSING_SCHEMA' });
    }

    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: false,
      convert: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, ''),
      }));

      return res.status(400).json({
        error: 'Validation failed',
        error_code: 'VALIDATION_ERROR',
        errors,
        suggestion: 'Check the URL parameters and try again',
      });
    }

    req.params = { ...req.params, ...value };
    next();
  };
}

module.exports = {
  validate,
  validateQuery,
  validateParams,
  schemas,
};

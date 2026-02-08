/**
 * Input validation middleware using Joi
 */
const Joi = require('joi');

// Common validators
const solanaAddress = Joi.string().length(44).pattern(/^[A-Za-z0-9]+$/);
const amount = Joi.string().pattern(/^\d+$/).required();
const slippageBps = Joi.number().integer().min(1).max(1000).default(50);

// Validation schemas
const schemas = {
  quote: Joi.object({
    input_mint: solanaAddress.required(),
    output_mint: solanaAddress.required(),
    amount: amount,
    slippage_bps: slippageBps,
  }),

  swapBuild: Joi.object({
    wallet_address: solanaAddress.required(),
    input_mint: solanaAddress.required(),
    output_mint: solanaAddress.required(),
    amount: amount,
    slippage_bps: slippageBps,
    priority_fee_lamports: Joi.number().integer().min(0).default(0),
  }),

  balance: Joi.object({
    wallet_address: solanaAddress.required(),
    token_mint: solanaAddress.optional(),
  }),

  parsePayment: Joi.object({
    payment_response_body: Joi.alternatives()
      .try(Joi.object(), Joi.string())
      .required(),
  }),

  preparePayment: Joi.object({
    wallet_address: solanaAddress.required(),
    payment_requirements: Joi.alternatives()
      .try(Joi.object(), Joi.array())
      .required(),
    preferred_input_token: solanaAddress.optional(),
  }),
};

/**
 * Validation middleware factory
 */
function validate(schemaName) {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(500).json({ error: 'Invalid validation schema' });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        error: 'Validation failed',
        errors,
      });
    }

    // Replace req.body with validated and sanitized value
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
      return res.status(500).json({ error: 'Invalid validation schema' });
    }

    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        error: 'Validation failed',
        errors,
      });
    }

    req.query = value;
    next();
  };
}

module.exports = {
  validate,
  validateQuery,
  schemas,
};

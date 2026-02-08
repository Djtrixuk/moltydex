/**
 * Swagger/OpenAPI configuration
 */

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MoltyDEX API',
      version: '1.0.0',
      description: 'Solana DEX aggregator API for x402 payments. Routes swaps through Jupiter aggregator with automatic token conversion for AI agents.',
      contact: {
        name: 'MoltyDEX Support',
        url: 'https://moltydex.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'https://api.moltydex.com',
        description: 'Production server',
      },
      {
        url: 'http://localhost:3001',
        description: 'Local development server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Quote',
        description: 'Get swap quotes',
      },
      {
        name: 'Swap',
        description: 'Build swap transactions',
      },
      {
        name: 'Balance',
        description: 'Check token balances',
      },
      {
        name: 'Token',
        description: 'Token metadata and information',
      },
      {
        name: 'x402',
        description: 'x402 payment protocol endpoints',
      },
      {
        name: 'Analytics',
        description: 'Usage statistics and analytics',
      },
      {
        name: 'Batch',
        description: 'Batch operations for multiple requests',
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
        Quote: {
          type: 'object',
          properties: {
            input_amount: {
              type: 'string',
              description: 'Input amount in lamports',
            },
            output_amount: {
              type: 'string',
              description: 'Output amount in lamports',
            },
            fee_amount: {
              type: 'string',
              description: 'Fee amount in lamports',
            },
            price_impact: {
              type: 'string',
              description: 'Price impact percentage',
            },
            route: {
              type: 'object',
              description: 'Swap route details',
            },
          },
        },
        SwapTransaction: {
          type: 'object',
          properties: {
            transaction: {
              type: 'string',
              description: 'Base64 encoded transaction',
            },
            input_mint: {
              type: 'string',
              description: 'Input token mint address',
            },
            output_mint: {
              type: 'string',
              description: 'Output token mint address',
            },
            input_amount: {
              type: 'string',
              description: 'Input amount',
            },
            output_amount: {
              type: 'string',
              description: 'Expected output amount',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js', './index.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

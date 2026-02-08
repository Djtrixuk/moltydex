#!/usr/bin/env node
/**
 * Register MoltyDEX agent on Moltbook
 * 
 * This script registers the MoltyDEX agent on Moltbook and saves the credentials.
 * After registration, you'll get a claim URL that you need to post on X (Twitter) to verify ownership.
 * 
 * Usage:
 *   node scripts/register-moltbook-agent.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const MOLTBOOK_API_URL = 'https://www.moltbook.com/api/v1';
const CREDENTIALS_PATH = path.join(__dirname, '..', '.moltbook-credentials.json');

// Agent details
const AGENT_NAME = 'MoltyDEX';
const AGENT_DESCRIPTION = 'The first DEX built for x402 payments. Enables AI agents to automatically swap tokens when making x402 payments. Best prices across all Solana DEXes, powered by Jupiter aggregator.';

async function registerAgent() {
  console.log('\n🦞 Registering MoltyDEX on Moltbook...\n');
  
  const postData = JSON.stringify({
    name: AGENT_NAME,
    description: AGENT_DESCRIPTION,
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.moltbook.com',
      path: '/api/v1/agents/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200 || res.statusCode === 201) {
            resolve(response);
          } else {
            reject(new Error(`Registration failed: ${response.error || data}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  try {
    // Check if already registered
    if (fs.existsSync(CREDENTIALS_PATH)) {
      const existing = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
      console.log('⚠️  Found existing credentials!');
      console.log(`   Agent: ${existing.agent_name}`);
      console.log(`   API Key: ${existing.api_key.substring(0, 20)}...`);
      console.log(`   Claim URL: ${existing.claim_url || 'N/A'}`);
      console.log('\n   If you want to register a new agent, delete this file first:');
      console.log(`   rm ${CREDENTIALS_PATH}\n`);
      
      // Check claim status
      if (existing.api_key) {
        console.log('📋 Checking claim status...');
        try {
          const status = await checkClaimStatus(existing.api_key);
          console.log(`   Status: ${status.status}`);
          if (status.status === 'pending_claim') {
            console.log(`\n   ⚠️  Agent is still pending claim!`);
            console.log(`   Claim URL: ${existing.claim_url}`);
            console.log(`   Verification Code: ${existing.verification_code}`);
            console.log('\n   To claim:');
            console.log('   1. Visit the claim URL above');
            console.log('   2. Post the verification tweet');
            console.log('   3. Your agent will be activated!\n');
          } else if (status.status === 'claimed') {
            console.log(`\n   ✅ Agent is claimed and active!`);
            console.log(`   Profile: https://www.moltbook.com/u/${existing.agent_name}\n`);
          }
        } catch (error) {
          console.log(`   Could not check status: ${error.message}`);
        }
      }
      return;
    }

    // Register new agent
    const response = await registerAgent();

    if (response.agent && response.agent.api_key) {
      const credentials = {
        agent_name: response.agent.name || AGENT_NAME,
        api_key: response.agent.api_key,
        claim_url: response.agent.claim_url,
        verification_code: response.agent.verification_code,
        registered_at: new Date().toISOString(),
      };

      // Save credentials
      fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(credentials, null, 2));
      
      console.log('✅ Registration successful!\n');
      console.log('📋 Your Agent Details:');
      console.log(`   Name: ${credentials.agent_name}`);
      console.log(`   API Key: ${credentials.api_key}`);
      console.log(`   Verification Code: ${credentials.verification_code}\n`);
      
      console.log('🔗 Claim URL:');
      console.log(`   ${credentials.claim_url}\n`);
      
      console.log('⚠️  IMPORTANT: Save your API key!');
      console.log(`   Credentials saved to: ${CREDENTIALS_PATH}\n`);
      
      console.log('📝 Next Steps:');
      console.log('   1. Visit the claim URL above');
      console.log('   2. Post the verification tweet with the verification code');
      console.log('   3. Your agent will be activated on Moltbook!');
      console.log('   4. Once claimed, your agent can start posting and engaging\n');
      
      console.log('💡 After claiming, your agent profile will be at:');
      console.log(`   https://www.moltbook.com/u/${credentials.agent_name}\n`);
      
    } else {
      throw new Error('Invalid response from Moltbook API');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

async function checkClaimStatus(apiKey) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.moltbook.com',
      path: '/api/v1/agents/status',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

main();

#!/usr/bin/env node
/**
 * Discord Webhook Posting Script
 * 
 * Usage:
 *   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/... node scripts/discord-webhook-post.js "Title" "Content" [channel]
 * 
 * Or set DISCORD_WEBHOOK_URL in .env file
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || process.argv[2];

function postToDiscord(webhookUrl, content, username = 'MoltyDEX Bot') {
  return new Promise((resolve, reject) => {
    const url = new URL(webhookUrl);
    const postData = JSON.stringify({
      username,
      content,
      embeds: content.includes('**') ? [
        {
          title: 'MoltyDEX Update',
          description: content,
          color: 0x00D9FF, // Solana blue
          timestamp: new Date().toISOString(),
        }
      ] : undefined,
    });

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data: responseData });
        } else {
          reject(new Error(`Discord API error: ${res.statusCode} - ${responseData}`));
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
  const args = process.argv.slice(2);
  
  // If first arg is a URL, use it as webhook, otherwise use env var
  let webhookUrl = WEBHOOK_URL;
  let content = args[0];
  let username = args[1] || 'MoltyDEX';

  if (!webhookUrl) {
    console.error('❌ Error: DISCORD_WEBHOOK_URL not set');
    console.error('\nUsage:');
    console.error('  DISCORD_WEBHOOK_URL=https://... node scripts/discord-webhook-post.js "Message"');
    console.error('\nOr set DISCORD_WEBHOOK_URL in .env.local');
    process.exit(1);
  }

  if (!content) {
    console.error('❌ Error: No message content provided');
    console.error('\nUsage:');
    console.error('  node scripts/discord-webhook-post.js "Your message here"');
    process.exit(1);
  }

  try {
    console.log('\n📢 Posting to Discord...\n');
    console.log(`Message: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}\n`);

    const result = await postToDiscord(webhookUrl, content, username);

    if (result.success) {
      console.log('✅ Message posted successfully!\n');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

main();

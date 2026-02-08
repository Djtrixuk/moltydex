#!/usr/bin/env node
/**
 * Verify a Moltbook post
 * 
 * Usage:
 *   node scripts/moltbook-verify.js VERIFICATION_CODE ANSWER
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const MOLTBOOK_API_URL = 'https://www.moltbook.com/api/v1';
const CREDENTIALS_PATH = path.join(__dirname, '..', '.moltbook-credentials.json');

function loadCredentials() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error('No Moltbook credentials found.');
  }
  return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
}

async function verifyPost(verificationCode, answer, apiKey) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      verification_code: verificationCode,
      answer: answer.toString(),
    });

    const options = {
      hostname: 'www.moltbook.com',
      path: '/api/v1/verify',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(parsed.error || responseData));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${responseData}`));
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

  if (args.length < 2) {
    console.error('Usage: node scripts/moltbook-verify.js VERIFICATION_CODE ANSWER');
    console.error('\nExample:');
    console.error('  node scripts/moltbook-verify.js moltbook_verify_xxx 30.00');
    process.exit(1);
  }

  const [verificationCode, answer] = args;

  try {
    const credentials = loadCredentials();
    const apiKey = credentials.api_key;

    console.log('\n🦞 Verifying post...\n');
    console.log(`Verification Code: ${verificationCode}`);
    console.log(`Answer: ${answer}\n`);

    const result = await verifyPost(verificationCode, answer, apiKey);

    if (result.success) {
      console.log('✅ Post verified and published!\n');
      if (result.post) {
        console.log(`Post ID: ${result.post.id}`);
        console.log(`URL: https://www.moltbook.com/p/${result.post.id}\n`);
      }
    } else {
      console.error('❌ Verification failed:', result);
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

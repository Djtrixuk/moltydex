#!/usr/bin/env node
/**
 * Post to Moltbook
 * 
 * Usage:
 *   node scripts/moltbook-post.js "Title" "Content" [submolt]
 * 
 * Example:
 *   node scripts/moltbook-post.js "Hello Moltbook!" "This is my first post!" general
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const MOLTBOOK_API_URL = 'https://www.moltbook.com/api/v1';
const CREDENTIALS_PATH = path.join(__dirname, '..', '.moltbook-credentials.json');

function loadCredentials() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error('No Moltbook credentials found. Run register-moltbook-agent.js first.');
  }
  return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
}

async function makeRequest(method, path, data = null, apiKey) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;

    const options = {
      hostname: 'www.moltbook.com',
      path: `/api/v1${path}`,
      method: method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        ...(postData && {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        }),
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

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function createPost(title, content, submolt = 'general', apiKey) {
  return makeRequest('POST', '/posts', {
    submolt,
    title,
    content,
  }, apiKey);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: node scripts/moltbook-post.js "Title" "Content" [submolt]');
    console.error('\nExample:');
    console.error('  node scripts/moltbook-post.js "Hello!" "This is my first post!" general');
    process.exit(1);
  }

  const [title, content, submolt = 'general'] = args;

  try {
    const credentials = loadCredentials();
    const apiKey = credentials.api_key;

    console.log('\n🦞 Posting to Moltbook...\n');
    console.log(`Title: ${title}`);
    console.log(`Submolt: ${submolt}`);
    console.log(`Content: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}\n`);

    const result = await createPost(title, content, submolt, apiKey);

    if (result.success && result.data) {
      const post = result.data;
      console.log('✅ Post created successfully!\n');
      console.log(`Post ID: ${post.id}`);
      console.log(`URL: https://www.moltbook.com/p/${post.id}\n`);
    } else {
      console.error('❌ Failed to create post:', result);
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

#!/usr/bin/env node
/**
 * Get comments on a Moltbook post
 * 
 * Usage:
 *   node scripts/moltbook-get-comments.js POST_ID
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CREDENTIALS_PATH = path.join(__dirname, '..', '.moltbook-credentials.json');

function loadCredentials() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error('No Moltbook credentials found.');
  }
  return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
}

async function getComments(postId, apiKey) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.moltbook.com',
      path: `/api/v1/posts/${postId}/comments?sort=top`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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

    req.end();
  });
}

async function main() {
  const args = process.argv.slice(2);
  const postId = args[0];

  if (!postId) {
    console.error('Usage: node scripts/moltbook-get-comments.js POST_ID');
    process.exit(1);
  }

  try {
    const credentials = loadCredentials();
    const apiKey = credentials.api_key;

    console.log(`\n🦞 Fetching comments for post ${postId}...\n`);
    const result = await getComments(postId, apiKey);
    
    if (result.success && result.data && result.data.comments) {
      const comments = result.data.comments;
      console.log(`Found ${comments.length} comments:\n`);
      
      comments.forEach((comment, i) => {
        console.log(`${i + 1}. [ID: ${comment.id}] ${comment.author?.name || 'Unknown'}:`);
        console.log(`   ${comment.content}`);
        console.log(`   ⬆️ ${comment.upvotes || 0} | ⬇️ ${comment.downvotes || 0}\n`);
      });
    } else {
      console.log('No comments found or unexpected response:', result);
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

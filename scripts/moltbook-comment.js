#!/usr/bin/env node
/**
 * Comment on a Moltbook post
 * 
 * Usage:
 *   node scripts/moltbook-comment.js POST_ID "Your comment"
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

async function createComment(postId, content, parentId = null, apiKey) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      content,
      ...(parentId && { parent_id: parentId }),
    });

    const options = {
      hostname: 'www.moltbook.com',
      path: `/api/v1/posts/${postId}/comments`,
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
    console.error('Usage: node scripts/moltbook-comment.js POST_ID "Your comment" [PARENT_COMMENT_ID]');
    console.error('\nExample:');
    console.error('  node scripts/moltbook-comment.js abc123 "Great post!"');
    process.exit(1);
  }

  // Handle both formats: POST_ID "content" [PARENT_ID] or POST_ID PARENT_ID "content"
  let postId, content, parentId;
  if (args.length === 2) {
    // POST_ID "content"
    postId = args[0];
    content = args[1];
    parentId = null;
  } else if (args.length === 3) {
    // Check if second arg looks like a UUID (parent comment ID)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidPattern.test(args[1])) {
      // POST_ID PARENT_ID "content"
      postId = args[0];
      parentId = args[1];
      content = args[2];
    } else {
      // POST_ID "content" PARENT_ID (less likely but handle it)
      postId = args[0];
      content = args[1];
      parentId = args[2];
    }
  } else {
    console.error('Usage: node scripts/moltbook-comment.js POST_ID "Your comment" [PARENT_COMMENT_ID]');
    console.error('\nExample:');
    console.error('  node scripts/moltbook-comment.js abc123 "Great post!"');
    console.error('  node scripts/moltbook-comment.js abc123 parent-uuid "Reply comment"');
    process.exit(1);
  }

  try {
    const credentials = loadCredentials();
    const apiKey = credentials.api_key;

    console.log('\n🦞 Posting comment...\n');
    console.log(`Post ID: ${postId}`);
    if (parentId) {
      console.log(`Replying to comment: ${parentId}`);
    }
    console.log(`Comment: ${content}\n`);

    const result = await createComment(postId, content, parentId, apiKey);

    if (result.success && result.data) {
      const comment = result.data;
      console.log('✅ Comment posted!\n');
      console.log(`Comment ID: ${comment.id}`);
      console.log(`URL: https://www.moltbook.com/p/${postId}#comment-${comment.id}\n`);
    } else {
      console.error('❌ Failed to post comment:', result);
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

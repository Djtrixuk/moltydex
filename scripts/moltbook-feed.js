#!/usr/bin/env node
/**
 * Get Moltbook feed
 * 
 * Usage:
 *   node scripts/moltbook-feed.js [limit] [sort]
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

async function getFeed(limit = 10, sort = 'new', apiKey) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.moltbook.com',
      path: `/api/v1/feed?sort=${sort}&limit=${limit}`,
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

async function getPost(postId, apiKey) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.moltbook.com',
      path: `/api/v1/posts/${postId}`,
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

  try {
    const credentials = loadCredentials();
    const apiKey = credentials.api_key;

    // Check if first arg looks like a post ID (UUID format)
    const postIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isPostId = args[0] && postIdPattern.test(args[0]);

    if (isPostId) {
      const postId = args[0];
      // Get specific post
      console.log(`\n🦞 Fetching post ${postId}...\n`);
      const result = await getPost(postId, apiKey);
      
      if (result.success && result.data) {
        const post = result.data;
        console.log(`Title: ${post.title}`);
        console.log(`Author: ${post.author?.name || 'Unknown'}`);
        console.log(`Upvotes: ${post.upvotes || 0} | Downvotes: ${post.downvotes || 0}`);
        console.log(`Comments: ${post.comment_count || 0}`);
        console.log(`\nContent:\n${post.content}\n`);
        console.log(`URL: https://www.moltbook.com/p/${post.id}\n`);
        
        if (post.comments && post.comments.length > 0) {
          console.log('Comments:');
          post.comments.forEach((comment, i) => {
            console.log(`\n${i + 1}. ${comment.author?.name || 'Unknown'}: ${comment.content}`);
          });
        }
      }
    } else {
      // Get feed
      const limit = parseInt(args[0] || '10');
      const sort = args[1] || 'new';
      console.log(`\n🦞 Fetching feed (${sort}, limit: ${limit})...\n`);
      const result = await getFeed(limit, sort, apiKey);
      
      if (result.success && result.data && result.data.posts) {
        const posts = result.data.posts;
        console.log(`Found ${posts.length} posts:\n`);
        
        posts.forEach((post, i) => {
          console.log(`${i + 1}. [${post.submolt?.name || 'general'}] ${post.title}`);
          console.log(`   By: ${post.author?.name || 'Unknown'} | ⬆️ ${post.upvotes || 0} | 💬 ${post.comment_count || 0}`);
          console.log(`   ${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}`);
          console.log(`   https://www.moltbook.com/p/${post.id}\n`);
        });
      }
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

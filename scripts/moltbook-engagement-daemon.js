#!/usr/bin/env node
/**
 * Moltbook Engagement Daemon
 * Checks for new comments and replies automatically
 * Runs continuously, checking every hour
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CREDENTIALS_PATH = path.join(__dirname, '..', '.moltbook-credentials.json');
const POST_IDS_FILE = path.join(__dirname, '..', '.moltbook-post-ids.json');

// Posts to monitor for comments
const POST_IDS = [
  'bdd3f7aa-faf9-43d6-886f-74b51fd597d5', // Understanding x402
  // Add more post IDs as they're posted
];

// Comments we've already replied to
let repliedComments = new Set();

function loadCredentials() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error('No Moltbook credentials found.');
  }
  return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
}

function loadPostIds() {
  if (fs.existsSync(POST_IDS_FILE)) {
    const data = JSON.parse(fs.readFileSync(POST_IDS_FILE, 'utf8'));
    return data.postIds || POST_IDS;
  }
  return POST_IDS;
}

function savePostIds(postIds) {
  fs.writeFileSync(POST_IDS_FILE, JSON.stringify({ postIds }, null, 2));
}

function loadRepliedComments() {
  const file = path.join(__dirname, '..', '.moltbook-replied-comments.json');
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return new Set(data.commentIds || []);
  }
  return new Set();
}

function saveRepliedComment(commentId) {
  repliedComments.add(commentId);
  const file = path.join(__dirname, '..', '.moltbook-replied-comments.json');
  const data = { commentIds: Array.from(repliedComments) };
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

async function getComments(postId, apiKey) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.moltbook.com',
      path: `/api/v1/posts/${postId}/comments?sort=new`,
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

async function createComment(postId, content, parentId, apiKey) {
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
          resolve(parsed);
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

function generateReply(comment, postTitle) {
  const content = comment.content.toLowerCase();
  
  // Questions about x402
  if (content.includes('how') || content.includes('what') || content.includes('why')) {
    if (content.includes('token') || content.includes('swap')) {
      return "Great question! Token swapping is the key challenge in x402. Agents often hold SOL but APIs want USDC. Automatic swapping solves this - the agent detects the mismatch, swaps automatically, then pays. It's seamless once implemented.";
    }
    if (content.includes('work') || content.includes('flow')) {
      return "x402 works through standard HTTP: API returns 402 with payment headers, agent pays, retries request with payment signature. The complexity is in handling token mismatches and payment verification. But the protocol itself is simple.";
    }
    if (content.includes('secure') || content.includes('safe')) {
      return "Security is crucial! Always verify payments on-chain - don't trust headers alone. Check transaction signature, amount, recipient, and confirmation status. Add payment expiration to prevent replay attacks.";
    }
    return "Thanks for the question! x402 is built on standard HTTP status codes and headers. The key is handling token mismatches and payment verification properly. Happy to dive deeper if you have specific questions!";
  }
  
  // Positive feedback
  if (content.includes('great') || content.includes('helpful') || content.includes('thanks')) {
    return "Glad it's helpful! x402 is still early but has huge potential for agent payments. The infrastructure is being built now. Feel free to ask if you have questions!";
  }
  
  // Technical questions
  if (content.includes('implement') || content.includes('build') || content.includes('code')) {
    return "Implementation is straightforward: return 402 with X-Payment-* headers, verify payment on-chain, return data. The challenge is handling edge cases (token swaps, failures, retries). Good tooling makes it much easier.";
  }
  
  // Default helpful reply
  return "Thanks for engaging! x402 enables pay-per-use payments for agents. The protocol is simple (HTTP 402 + headers), but making it seamless requires handling token swaps and payment verification. Happy to discuss more!";
}

async function checkAndReply(postId, apiKey) {
  try {
    const result = await getComments(postId, apiKey);
    
    if (result.success && result.data && result.data.comments) {
      const comments = result.data.comments;
      
      // Check recent comments (last 10)
      const recentComments = comments.slice(0, 10);
      
      for (const comment of recentComments) {
        // Skip if we've already replied
        if (repliedComments.has(comment.id)) {
          continue;
        }
        
        // Skip our own comments
        if (comment.author?.name === 'MoltyDEX') {
          continue;
        }
        
        // Skip spam/low-quality comments
        const content = comment.content.toLowerCase();
        if (content.length < 10 || 
            content.includes('http://') || 
            content.includes('https://') ||
            content.includes('click here') ||
            content.includes('free money')) {
          continue;
        }
        
        // Generate reply
        const reply = generateReply(comment, 'x402 Post');
        
        console.log(`\n💬 New comment on post ${postId}:`);
        console.log(`   Author: ${comment.author?.name || 'Unknown'}`);
        console.log(`   Content: ${comment.content.substring(0, 100)}...`);
        console.log(`   Reply: ${reply.substring(0, 100)}...`);
        
        // Post reply
        try {
          const replyResult = await createComment(postId, reply, comment.id, apiKey);
          
          if (replyResult.verification_required) {
            console.log(`   ⚠️  Reply needs verification (code: ${replyResult.verification.code})`);
            // Note: Would need to solve math challenge here
            // For now, just log it
          } else if (replyResult.success) {
            console.log(`   ✅ Reply posted!`);
            saveRepliedComment(comment.id);
          }
        } catch (err) {
          console.error(`   ❌ Failed to reply: ${err.message}`);
        }
      }
    }
  } catch (err) {
    console.error(`Error checking comments for post ${postId}:`, err.message);
  }
}

async function main() {
  const credentials = loadCredentials();
  const apiKey = credentials.api_key;
  const postIds = loadPostIds();
  repliedComments = loadRepliedComments();
  
  console.log('🦞 Moltbook Engagement Daemon');
  console.log(`📋 Monitoring ${postIds.length} posts`);
  console.log(`💬 Already replied to ${repliedComments.size} comments`);
  console.log('⏰ Checking every hour...\n');
  
  // Check immediately
  for (const postId of postIds) {
    await checkAndReply(postId, apiKey);
  }
  
  // Then check every hour
  setInterval(async () => {
    console.log(`\n🕐 ${new Date().toISOString()} - Checking for new comments...`);
    for (const postId of postIds) {
      await checkAndReply(postId, apiKey);
    }
  }, 60 * 60 * 1000); // 1 hour
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

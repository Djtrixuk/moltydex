#!/usr/bin/env node
/**
 * Post all x402 educational posts from markdown file
 * Handles rate limiting (30 min between posts) and verification
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CREDENTIALS_PATH = path.join(__dirname, '..', '.moltbook-credentials.json');
const POSTS_FILE = path.join(__dirname, '..', 'content', 'moltbook', 'x402-educational-posts.md');
const POSTED_FILE = path.join(__dirname, '..', '.x402-posts-posted.json');

function loadCredentials() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error('No Moltbook credentials found. Run moltbook-setup.js first.');
  }
  return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
}

function loadPostedPosts() {
  if (fs.existsSync(POSTED_FILE)) {
    return JSON.parse(fs.readFileSync(POSTED_FILE, 'utf8'));
  }
  return { posted: [] };
}

function savePostedPost(postNum, postId, title) {
  const data = loadPostedPosts();
  data.posted.push({ postNum, postId, title, postedAt: new Date().toISOString() });
  fs.writeFileSync(POSTED_FILE, JSON.stringify(data, null, 2));
}

function parseMarkdownPosts() {
  const content = fs.readFileSync(POSTS_FILE, 'utf8');
  const posts = [];
  
  // Find all post sections using regex
  const postRegex = /## Post (\d+): "([^"]+)"\s+\*\*Title:\*\* "([^"]+)"\s+\*\*Content:\*\*\s*```\s*\n([\s\S]*?)\n```\s+\*\*Category:\*\* (\w+)/g;
  
  let match;
  while ((match = postRegex.exec(content)) !== null) {
    const postNum = parseInt(match[1]);
    const title = match[3]; // Use Title field, not header
    const postContent = match[4].trim();
    const category = match[5];
    
    posts.push({ postNum, title, content: postContent, category });
  }
  
  return posts;
}

async function postToMoltbook(title, content, category, apiKey) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      title,
      submolt: category,
      content,
    });

    const options = {
      hostname: 'www.moltbook.com',
      path: '/api/v1/posts',
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function solveMathChallenge(challenge) {
  // Extract numbers from obfuscated challenge
  // Example: "A] lObStEr sW^iM sS[ aT tHiRtY tWo] cEeNnTtIiMeEeRs^ pEr[ sEeCoNd] aNd~ aCcEeLeRrAaTeS/ uP| bY^ fOuRtEeN, wHaT]s~ tHe/ nEw {vElAwCiTeE}?"
  // This is: 32 + 14 = 46.00
  
  // Try to extract numbers
  const numbers = challenge.match(/\d+/g);
  if (numbers && numbers.length >= 2) {
    const num1 = parseInt(numbers[0]);
    const num2 = parseInt(numbers[1]);
    
    // Check for operations
    const lowerChallenge = challenge.toLowerCase();
    if (lowerChallenge.includes('add') || lowerChallenge.includes('plus') || lowerChallenge.includes('accelerates') || lowerChallenge.includes('pushes')) {
      return (num1 + num2).toFixed(2);
    }
    if (lowerChallenge.includes('multipl') || lowerChallenge.includes('times')) {
      return (num1 * num2).toFixed(2);
    }
    if (lowerChallenge.includes('subtract') || lowerChallenge.includes('minus')) {
      return (num1 - num2).toFixed(2);
    }
    if (lowerChallenge.includes('divid') || lowerChallenge.includes('divide')) {
      return (num1 / num2).toFixed(2);
    }
    
    // Default to addition
    return (num1 + num2).toFixed(2);
  }
  
  return null;
}

async function verifyPost(code, answer, apiKey) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      verification_code: code,
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

async function handlePostResult(result, postNum, title, apiKey) {
  if (result.success && result.post) {
    const postId = result.post.id;
    console.log(`   ✅ Posted! ID: ${postId}`);
    savePostedPost(postNum, postId, title);
    
    if (result.verification_required && result.verification) {
      console.log(`   ⚠️  Verification required`);
      console.log(`      Challenge: ${result.verification.challenge.substring(0, 60)}...`);
      
      const answer = solveMathChallenge(result.verification.challenge);
      if (answer) {
        console.log(`   💡 Solved: ${answer}`);
        console.log(`   🔐 Verifying...`);
        
        try {
          const verifyResult = await verifyPost(result.verification.code, answer, apiKey);
          if (verifyResult.success) {
            console.log(`   ✅ Verified and published!`);
          } else {
            console.log(`   ❌ Verification failed: ${verifyResult.error || JSON.stringify(verifyResult)}`);
            console.log(`   💡 Manual verify: node scripts/moltbook-verify.js ${result.verification.code} ${answer}`);
          }
        } catch (err) {
          console.log(`   ❌ Verification error: ${err.message}`);
          console.log(`   💡 Manual verify: node scripts/moltbook-verify.js ${result.verification.code} ${answer}`);
        }
      } else {
        console.log(`   ⚠️  Could not solve challenge automatically`);
        console.log(`   💡 Manual verify: node scripts/moltbook-verify.js ${result.verification.code} <answer>`);
      }
    }
  } else {
    console.log(`   ❌ Unexpected response: ${JSON.stringify(result).substring(0, 200)}...`);
  }
}

async function main() {
  console.log('🦞 x402 Educational Posts - Automated Posting\n');
  
  const credentials = loadCredentials();
  const apiKey = credentials.api_key;
  const posted = loadPostedPosts();
  const allPosts = parseMarkdownPosts();
  
  // Filter out already posted
  const postedNums = new Set(posted.posted.map(p => p.postNum));
  const postsToPost = allPosts.filter(p => !postedNums.has(p.postNum));
  
  console.log(`📋 Found ${allPosts.length} total posts`);
  console.log(`✅ Already posted: ${posted.posted.length}`);
  console.log(`⏳ Remaining: ${postsToPost.length}\n`);
  
  if (postsToPost.length === 0) {
    console.log('✨ All posts already posted!');
    return;
  }
  
  // Sort by post number
  postsToPost.sort((a, b) => a.postNum - b.postNum);
  
  for (let i = 0; i < postsToPost.length; i++) {
    const post = postsToPost[i];
    
    console.log(`\n📝 Post ${post.postNum}: ${post.title}`);
    console.log(`   Content length: ${post.content.length} chars`);
    
    // Wait 30 minutes between posts (except first one)
    if (i > 0) {
      console.log(`   ⏳ Waiting 30 minutes for rate limit...`);
      await sleep(30 * 60 * 1000); // 30 minutes
    }
    
    try {
      const result = await postToMoltbook(post.title, post.content, post.category, apiKey);
      
      if (result.error) {
        if (result.error.includes('30 minutes')) {
          console.log(`   ⚠️  Rate limited. Waiting 30 minutes...`);
          await sleep(30 * 60 * 1000);
          // Retry
          const retryResult = await postToMoltbook(post.title, post.content, post.category, apiKey);
          await handlePostResult(retryResult, post.postNum, post.title, apiKey);
        } else {
          console.log(`   ❌ Error: ${result.error}`);
        }
      } else {
        await handlePostResult(result, post.postNum, post.title, apiKey);
      }
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    }
  }
  
  console.log(`\n✨ Done! Posted ${postsToPost.length} posts.`);
  console.log(`📋 Check .x402-posts-posted.json for details.`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

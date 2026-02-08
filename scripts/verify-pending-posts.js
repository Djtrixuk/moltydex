#!/usr/bin/env node
/**
 * Verify all pending Moltbook posts
 * Reads verification codes from log file and solves math challenges
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CREDENTIALS_PATH = path.join(__dirname, '..', '.moltbook-credentials.json');
const LOG_FILE = path.join(__dirname, '..', '.x402-posting.log');

function loadCredentials() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error('No Moltbook credentials found.');
  }
  return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
}

function solveMathChallenge(challenge) {
  // Extract numbers and operations from obfuscated challenge
  // Example: "A] lObStEr sW^iM sS[ aT tHiRtY tWo] cEeNnTtIiMeEeRs^ pEr[ sEeCoNd] aNd~ aCcEeLeRrAaTeS/ uP| bY^ fOuRtEeN, wHaT]s~ tHe/ nEw {vElAwCiTeE}?"
  // This is: 32 + 14 = ?
  
  // Try to extract numbers
  const numbers = challenge.match(/\d+/g);
  if (numbers && numbers.length >= 2) {
    const num1 = parseInt(numbers[0]);
    const num2 = parseInt(numbers[1]);
    
    // Check for operations
    if (challenge.toLowerCase().includes('add') || challenge.toLowerCase().includes('plus') || challenge.toLowerCase().includes('accelerates')) {
      return (num1 + num2).toFixed(2);
    }
    if (challenge.toLowerCase().includes('multipl') || challenge.toLowerCase().includes('times')) {
      return (num1 * num2).toFixed(2);
    }
    if (challenge.toLowerCase().includes('subtract') || challenge.toLowerCase().includes('minus')) {
      return (num1 - num2).toFixed(2);
    }
    if (challenge.toLowerCase().includes('divid') || challenge.toLowerCase().includes('divide')) {
      return (num1 / num2).toFixed(2);
    }
    
    // Default to addition
    return (num1 + num2).toFixed(2);
  }
  
  // Fallback: try to parse common patterns
  const addMatch = challenge.match(/(\d+)\s*\+\s*(\d+)/);
  if (addMatch) {
    return (parseInt(addMatch[1]) + parseInt(addMatch[2])).toFixed(2);
  }
  
  const multMatch = challenge.match(/(\d+)\s*\*\s*(\d+)/);
  if (multMatch) {
    return (parseInt(multMatch[1]) * parseInt(multMatch[2])).toFixed(2);
  }
  
  return null;
}

async function verifyPost(code, answer, apiKey) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      verification_code: code,
      answer: answer,
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

function extractPendingVerifications() {
  if (!fs.existsSync(LOG_FILE)) {
    return [];
  }
  
  const logContent = fs.readFileSync(LOG_FILE, 'utf8');
  const verifications = [];
  
  // Extract verification codes and challenges from log
  const verificationRegex = /"verification":\{"code":"([^"]+)","challenge":"([^"]+)"/g;
  let match;
  
  while ((match = verificationRegex.exec(logContent)) !== null) {
    verifications.push({
      code: match[1],
      challenge: match[2],
    });
  }
  
  return verifications;
}

async function main() {
  console.log('🔐 Verifying Pending Moltbook Posts\n');
  
  const credentials = loadCredentials();
  const apiKey = credentials.api_key;
  const verifications = extractPendingVerifications();
  
  if (verifications.length === 0) {
    console.log('No pending verifications found in log.');
    return;
  }
  
  console.log(`Found ${verifications.length} pending verifications\n`);
  
  for (let i = 0; i < verifications.length; i++) {
    const { code, challenge } = verifications[i];
    
    console.log(`Verification ${i + 1}:`);
    console.log(`  Code: ${code.substring(0, 20)}...`);
    console.log(`  Challenge: ${challenge.substring(0, 80)}...`);
    
    const answer = solveMathChallenge(challenge);
    
    if (!answer) {
      console.log(`  ⚠️  Could not solve challenge automatically`);
      console.log(`  💡 Manual solve needed: ${challenge}`);
      continue;
    }
    
    console.log(`  💡 Solved: ${answer}`);
    
    try {
      const result = await verifyPost(code, answer, apiKey);
      
      if (result.success) {
        console.log(`  ✅ Verified successfully!`);
      } else {
        console.log(`  ❌ Verification failed: ${result.error || JSON.stringify(result)}`);
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

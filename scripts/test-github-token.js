#!/usr/bin/env node
/**
 * Test GitHub Token
 * 
 * Quick test to verify your GitHub token is working
 * 
 * Usage:
 *   node scripts/test-github-token.js
 * 
 * Or with token:
 *   GITHUB_TOKEN=ghp_... node scripts/test-github-token.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Read .env.local manually (no dotenv dependency)
function loadEnvFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            process.env[key.trim()] = valueParts.join('=').trim();
          }
        }
      }
    }
  } catch (err) {
    // Ignore errors
  }
}

// Try loading from root .env.local
loadEnvFile(path.join(__dirname, '..', '.env.local'));
// Try loading from frontend .env.local
loadEnvFile(path.join(__dirname, '..', 'frontend', '.env.local'));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.argv[2];

function testGitHubToken(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: '/user',
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'MoltyDEX-Automation',
        'Accept': 'application/vnd.github.v3+json',
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
            reject(new Error(parsed.message || responseData));
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
  if (!GITHUB_TOKEN) {
    console.error('❌ Error: GITHUB_TOKEN not found');
    console.error('\nOptions:');
    console.error('  1. Add to .env.local: GITHUB_TOKEN=ghp_...');
    console.error('  2. Pass as argument: node scripts/test-github-token.js ghp_...');
    console.error('\nGet token at: https://github.com/settings/tokens');
    console.error('Required scopes: repo, public_repo, write:discussion');
    process.exit(1);
  }

  try {
    console.log('\n🔑 Testing GitHub token...\n');

    const user = await testGitHubToken(GITHUB_TOKEN);

    console.log('✅ Token is valid!\n');
    console.log(`Username: ${user.login}`);
    console.log(`Name: ${user.name || 'Not set'}`);
    console.log(`Email: ${user.email || 'Not public'}`);
    console.log(`Public Repos: ${user.public_repos}`);
    console.log(`\n✅ Ready to automate GitHub activities!\n`);

    // Test creating a repo (dry run - won't actually create)
    console.log('📋 Available commands:');
    console.log('  node scripts/github-automate.js create-repo <name> <description>');
    console.log('  node scripts/github-automate.js create-issue <owner> <repo> <title> <body>');
    console.log('  node scripts/github-automate.js comment <owner> <repo> <issue> <body>\n');

  } catch (error) {
    console.error('\n❌ Token test failed:', error.message);
    console.error('\nPossible issues:');
    console.error('  - Token is invalid or expired');
    console.error('  - Token missing required scopes');
    console.error('  - Network error');
    console.error('\nGet a new token at: https://github.com/settings/tokens');
    process.exit(1);
  }
}

main();

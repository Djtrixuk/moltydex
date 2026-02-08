#!/usr/bin/env node
/**
 * List issues from a GitHub repository
 * 
 * Usage:
 *   node scripts/github-list-issues.js <owner> <repo>
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

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
  } catch (err) {}
}

loadEnvFile(path.join(__dirname, '..', '.env.local'));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function makeGitHubRequest(method, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
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
  const [owner, repo] = process.argv.slice(2);

  if (!owner || !repo) {
    console.error('Usage: node scripts/github-list-issues.js <owner> <repo>');
    process.exit(1);
  }

  try {
    console.log(`\n📋 Listing issues from ${owner}/${repo}...\n`);
    const issues = await makeGitHubRequest('GET', `/repos/${owner}/${repo}/issues?state=open&per_page=10`);
    
    if (issues.length === 0) {
      console.log('No open issues found.\n');
      return;
    }

    issues.forEach((issue, index) => {
      console.log(`${index + 1}. #${issue.number}: ${issue.title}`);
      console.log(`   URL: ${issue.html_url}`);
      console.log(`   Comments: ${issue.comments}`);
      console.log('');
    });
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();

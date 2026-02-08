#!/usr/bin/env node
/**
 * Create file in GitHub repository using API
 * 
 * Usage:
 *   node scripts/github-create-file.js <owner> <repo> <path> <content> <message>
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { Buffer } = require('buffer');

// Load env
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

function makeGitHubRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;

    const options = {
      hostname: 'api.github.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'MoltyDEX-Automation',
        'Accept': 'application/vnd.github.v3+json',
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
            reject(new Error(parsed.message || responseData));
          }
        } catch (error) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(responseData);
          } else {
            reject(new Error(`Failed to parse response: ${responseData}`));
          }
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

async function getFileSha(owner, repo, filePath) {
  try {
    const file = await makeGitHubRequest('GET', `/repos/${owner}/${repo}/contents/${filePath}`);
    return file.sha;
  } catch (error) {
    // File doesn't exist, return null
    return null;
  }
}

async function createFile(owner, repo, filePath, content, message) {
  const encodedContent = Buffer.from(content).toString('base64');
  
  // Check if file exists
  const sha = await getFileSha(owner, repo, filePath);
  
  const payload = {
    message: message,
    content: encodedContent,
  };
  
  if (sha) {
    payload.sha = sha;
  }
  
  return makeGitHubRequest('PUT', `/repos/${owner}/${repo}/contents/${filePath}`, payload);
}

async function main() {
  if (!GITHUB_TOKEN) {
    console.error('❌ Error: GITHUB_TOKEN not set');
    process.exit(1);
  }

  const [owner, repo, filePath, contentPath, message] = process.argv.slice(2);

  if (!owner || !repo || !filePath || !contentPath || !message) {
    console.error('Usage: node scripts/github-create-file.js <owner> <repo> <path> <content-file> <message>');
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(contentPath, 'utf8');
    console.log(`\n📝 Creating file: ${filePath}...\n`);
    const result = await createFile(owner, repo, filePath, content, message);
    console.log('✅ File created!');
    console.log(`URL: ${result.content.html_url}\n`);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();

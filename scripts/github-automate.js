#!/usr/bin/env node
/**
 * GitHub Automation Script
 * 
 * Creates repos, comments, issues automatically
 * 
 * Requires: GITHUB_TOKEN environment variable
 * 
 * Usage:
 *   GITHUB_TOKEN=ghp_... node scripts/github-automate.js create-repo "moltydex-example" "Description"
 *   GITHUB_TOKEN=ghp_... node scripts/github-automate.js comment "coinbase/x402" "Great project! Built MoltyDEX..."
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

// Load environment variables
loadEnvFile(path.join(__dirname, '..', '.env.local'));
loadEnvFile(path.join(__dirname, '..', 'frontend', '.env.local'));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_API = 'https://api.github.com';

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

async function createRepo(name, description, isPrivate = false) {
  return makeGitHubRequest('POST', '/user/repos', {
    name,
    description,
    private: isPrivate,
    auto_init: true,
    license_template: 'mit',
  });
}

async function createIssue(owner, repo, title, body) {
  return makeGitHubRequest('POST', `/repos/${owner}/${repo}/issues`, {
    title,
    body,
  });
}

async function createComment(owner, repo, issueNumber, body) {
  return makeGitHubRequest('POST', `/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
    body,
  });
}

async function main() {
  if (!GITHUB_TOKEN) {
    console.error('❌ Error: GITHUB_TOKEN not set');
    console.error('\nGet a token at: https://github.com/settings/tokens');
    console.error('Required scopes: repo, public_repo');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'create-repo':
        const repoName = args[1];
        const description = args[2] || 'MoltyDEX example repository';
        console.log(`\n📦 Creating repo: ${repoName}...\n`);
        const repo = await createRepo(repoName, description);
        console.log('✅ Repo created!');
        console.log(`URL: ${repo.html_url}\n`);
        break;

      case 'create-issue': {
        const [issueOwner, issueRepo, issueTitle, ...issueBodyParts] = args.slice(1);
        const issueBody = issueBodyParts.join(' ');
        console.log(`\n📝 Creating issue in ${issueOwner}/${issueRepo}...\n`);
        const issue = await createIssue(issueOwner, issueRepo, issueTitle, issueBody);
        console.log('✅ Issue created!');
        console.log(`URL: ${issue.html_url}\n`);
        break;
      }

      case 'comment': {
        const [commentOwner, commentRepo, issueNum, ...commentParts] = args.slice(1);
        const commentBody = commentParts.join(' ');
        console.log(`\n💬 Adding comment to ${commentOwner}/${commentRepo}#${issueNum}...\n`);
        const comment = await createComment(commentOwner, commentRepo, issueNum, commentBody);
        console.log('✅ Comment added!');
        console.log(`URL: ${comment.html_url}\n`);
        break;
      }

      default:
        console.error('❌ Unknown command:', command);
        console.error('\nAvailable commands:');
        console.error('  create-repo <name> <description>');
        console.error('  create-issue <owner> <repo> <title> <body>');
        console.error('  comment <owner> <repo> <issue-number> <body>');
        process.exit(1);
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

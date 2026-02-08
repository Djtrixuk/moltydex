#!/usr/bin/env node
/**
 * Search GitHub for repositories matching a query
 * 
 * Usage:
 *   node scripts/github-search-repos.js <query>
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
      path: encodeURI(path),
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
  const query = process.argv.slice(2).join(' ');

  if (!query) {
    console.error('Usage: node scripts/github-search-repos.js <query>');
    process.exit(1);
  }

  try {
    console.log(`\n🔍 Searching for: "${query}"...\n`);
    const results = await makeGitHubRequest('GET', `/search/repositories?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=10`);
    
    if (results.items.length === 0) {
      console.log('No repositories found.\n');
      return;
    }

    console.log(`Found ${results.total_count} repositories. Showing top ${results.items.length}:\n`);

    results.items.forEach((repo, index) => {
      console.log(`${index + 1}. ${repo.full_name}`);
      console.log(`   ⭐ ${repo.stargazers_count} stars | 📝 ${repo.description || 'No description'}`);
      console.log(`   🔗 ${repo.html_url}`);
      console.log(`   📅 Updated: ${new Date(repo.updated_at).toLocaleDateString()}`);
      console.log('');
    });
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();

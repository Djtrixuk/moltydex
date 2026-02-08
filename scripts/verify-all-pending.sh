#!/bin/bash
# Verify all pending posts from log file

cd "$(dirname "$0")/.."

echo "🔐 Verifying All Pending Posts from Log"
echo "========================================="
echo ""

# Extract verification codes and challenges from log
node -e "
const fs = require('fs');
const log = fs.readFileSync('.x402-posting.log', 'utf8');
const matches = [...log.matchAll(/\"verification\":\{\"code\":\"([^\"]+)\",\"challenge\":\"([^\"]+)\"/g)];

console.log('Found ' + matches.length + ' pending verifications:\n');

matches.forEach((match, i) => {
  const code = match[1];
  const challenge = match[2];
  
  // Extract numbers
  const numbers = challenge.match(/\d+/g);
  let answer = null;
  
  if (numbers && numbers.length >= 2) {
    const num1 = parseInt(numbers[0]);
    const num2 = parseInt(numbers[1]);
    const lower = challenge.toLowerCase();
    
    if (lower.includes('add') || lower.includes('plus') || lower.includes('accelerates') || lower.includes('pushes')) {
      answer = (num1 + num2).toFixed(2);
    } else if (lower.includes('multipl') || lower.includes('times')) {
      answer = (num1 * num2).toFixed(2);
    } else {
      answer = (num1 + num2).toFixed(2); // default
    }
  }
  
  console.log(\`Verification \${i + 1}:\`);
  console.log(\`  Code: \${code.substring(0, 20)}...\`);
  console.log(\`  Challenge: \${challenge.substring(0, 60)}...\`);
  if (answer) {
    console.log(\`  Answer: \${answer}\`);
    console.log(\`  Command: node scripts/moltbook-verify.js \${code} \${answer}\`);
  } else {
    console.log(\`  ⚠️  Could not solve automatically\`);
  }
  console.log('');
});
"

echo ""
echo "💡 To verify all automatically, run:"
echo "   node scripts/verify-pending-posts.js"

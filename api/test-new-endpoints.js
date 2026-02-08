/**
 * Test script for new high-priority endpoints
 * Run: node test-new-endpoints.js
 */

const BASE_URL = process.env.API_URL || 'http://localhost:3001';

async function testEndpoint(name, method, path, body = null) {
  try {
    const url = `${BASE_URL}${path}`;
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }

    console.log(`\n🧪 Testing: ${name}`);
    console.log(`   ${method} ${path}`);
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`   ✅ Success (${response.status})`);
      console.log(`   Response:`, JSON.stringify(data, null, 2).substring(0, 200) + '...');
    } else {
      console.log(`   ❌ Failed (${response.status})`);
      console.log(`   Error:`, JSON.stringify(data, null, 2).substring(0, 200));
    }
    
    return { success: response.ok, status: response.status, data };
  } catch (err) {
    console.log(`   ❌ Error: ${err.message}`);
    return { success: false, error: err.message };
  }
}

async function runTests() {
  console.log('🚀 Testing New High-Priority Endpoints\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  // Test 1: Rate Limit Status
  await testEndpoint(
    'Rate Limit Status',
    'GET',
    '/api/rate-limit/status'
  );

  // Test 2: Rate Limit Status - All
  await testEndpoint(
    'Rate Limit Status - All',
    'GET',
    '/api/rate-limit/status/all'
  );

  // Test 3: Token Recommendations
  await testEndpoint(
    'Token Recommendations (Payment)',
    'GET',
    '/api/tokens/recommend?use_case=payment&limit=5'
  );

  // Test 4: Token Recommendations - Agent Tokens
  await testEndpoint(
    'Token Recommendations (Agent Tokens)',
    'GET',
    '/api/tokens/recommend?category=agent-token&limit=5'
  );

  // Test 5: Webhook Registration (will fail without valid signature, but tests endpoint)
  await testEndpoint(
    'Webhook Registration',
    'POST',
    '/api/transaction/webhook',
    {
      signature: 'test_signature_' + Date.now(),
      callback_url: 'https://example.com/webhook',
      metadata: { test: true }
    }
  );

  // Test 6: Enhanced Error Response (test invalid input)
  await testEndpoint(
    'Enhanced Error Response (Invalid Input)',
    'GET',
    '/api/balance' // Missing wallet_address
  );

  console.log('\n✅ Tests completed!\n');
}

// Run tests if executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testEndpoint, runTests };

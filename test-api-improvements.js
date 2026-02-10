#!/usr/bin/env node
/**
 * Test script for Phase 4 API improvements:
 * 1. Request ID in responses
 * 2. Payment simulation endpoint
 * 3. Enhanced error responses
 */

const https = require('https');
const http = require('http');

const API_URL = process.env.API_URL || 'http://127.0.0.1:3002';
const BASE_URL = API_URL.replace(/^https?:\/\//, '').split('/')[0];
const PROTOCOL = API_URL.startsWith('https') ? https : http;

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    const [hostname, port] = BASE_URL.includes(':') 
      ? BASE_URL.split(':') 
      : [BASE_URL, PROTOCOL === https ? 443 : 3001];

    const options = {
      hostname,
      port: parseInt(port) || (PROTOCOL === https ? 443 : 3001),
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData && { 'Content-Length': Buffer.byteLength(postData) }),
      },
    };

    const req = PROTOCOL.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: parsed,
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: responseData,
          });
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

async function testRequestId() {
  console.log('\n🧪 Test 1: Request ID in Responses');
  console.log('=' .repeat(50));
  
  try {
    const response = await makeRequest('GET', '/api/health');
    
    if (response.headers['x-request-id']) {
      console.log('✅ PASS: Request ID present in headers');
      console.log(`   X-Request-ID: ${response.headers['x-request-id']}`);
      
      // Verify it's a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(response.headers['x-request-id'])) {
        console.log('✅ PASS: Request ID is valid UUID format');
      } else {
        console.log('❌ FAIL: Request ID is not valid UUID format');
      }
    } else {
      console.log('❌ FAIL: Request ID missing from headers');
      console.log('   Available headers:', Object.keys(response.headers));
    }
    
    // Test multiple requests have different IDs
    const response2 = await makeRequest('GET', '/api/health');
    if (response.headers['x-request-id'] !== response2.headers['x-request-id']) {
      console.log('✅ PASS: Different requests have different Request IDs');
    } else {
      console.log('❌ FAIL: Multiple requests have same Request ID');
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
}

async function testPaymentSimulation() {
  console.log('\n🧪 Test 2: Payment Simulation Endpoint');
  console.log('=' .repeat(50));
  
  // Test with insufficient balance scenario
  const testWallet = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'; // Example wallet
  const paymentRequirements = {
    asset: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
    amount: '1000000', // 1 USDC (6 decimals)
  };
  
  try {
    const response = await makeRequest('POST', '/api/x402/simulate-payment', {
      wallet_address: testWallet,
      payment_requirements: paymentRequirements,
    });
    
    console.log(`Status Code: ${response.statusCode}`);
    
    if (response.statusCode === 200) {
      console.log('✅ PASS: Payment simulation endpoint responds');
      
      const body = response.body;
      
      // Check required fields
      const requiredFields = ['simulation', 'ready', 'has_sufficient_balance', 'swap_needed'];
      const missingFields = requiredFields.filter(field => !(field in body));
      
      if (missingFields.length === 0) {
        console.log('✅ PASS: All required fields present');
      } else {
        console.log(`❌ FAIL: Missing fields: ${missingFields.join(', ')}`);
      }
      
      // Check simulation flag
      if (body.simulation === true) {
        console.log('✅ PASS: Simulation flag is true');
      } else {
        console.log('❌ FAIL: Simulation flag is not true');
      }
      
      // Check fee breakdown
      if (body.fee_breakdown) {
        console.log('✅ PASS: Fee breakdown present');
        console.log(`   Fee breakdown keys: ${Object.keys(body.fee_breakdown).join(', ')}`);
      } else {
        console.log('❌ FAIL: Fee breakdown missing');
      }
      
      // Check validation
      if (body.validation) {
        console.log('✅ PASS: Validation object present');
        console.log(`   Validation keys: ${Object.keys(body.validation).join(', ')}`);
      } else {
        console.log('❌ FAIL: Validation object missing');
      }
      
      console.log('\n📊 Simulation Result:');
      console.log(`   Ready: ${body.ready}`);
      console.log(`   Has Sufficient Balance: ${body.has_sufficient_balance}`);
      console.log(`   Swap Needed: ${body.swap_needed}`);
      if (body.swap_details) {
        console.log(`   Input Token: ${body.swap_details.input_token}`);
        console.log(`   Output Token: ${body.swap_details.output_token}`);
      }
    } else {
      console.log(`❌ FAIL: Unexpected status code ${response.statusCode}`);
      console.log('Response:', JSON.stringify(response.body, null, 2));
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('   💡 Make sure the API server is running on port 3001');
    }
  }
}

async function testEnhancedErrors() {
  console.log('\n🧪 Test 3: Enhanced Error Responses');
  console.log('=' .repeat(50));
  
  // Test missing parameters
  try {
    const response = await makeRequest('POST', '/api/x402/simulate-payment', {
      // Missing wallet_address and payment_requirements
    });
    
    console.log(`Status Code: ${response.statusCode}`);
    
    if (response.statusCode === 400) {
      console.log('✅ PASS: Returns 400 for missing parameters');
      
      const body = response.body;
      
      // Check error structure
      const requiredFields = ['error', 'error_code', 'error_category'];
      const missingFields = requiredFields.filter(field => !(field in body));
      
      if (missingFields.length === 0) {
        console.log('✅ PASS: Enhanced error structure present');
        console.log(`   Error Code: ${body.error_code}`);
        console.log(`   Error Category: ${body.error_category}`);
        console.log(`   Error Message: ${body.error}`);
        
        if (body.suggestion) {
          console.log('✅ PASS: Error suggestion present');
          console.log(`   Suggestion: ${body.suggestion}`);
        } else {
          console.log('⚠️  WARN: Error suggestion missing (optional but recommended)');
        }
        
        if (body.details) {
          console.log('✅ PASS: Error details present');
          console.log(`   Details: ${JSON.stringify(body.details)}`);
        } else {
          console.log('⚠️  WARN: Error details missing (optional but recommended)');
        }
        
        if (body.timestamp) {
          console.log('✅ PASS: Timestamp present');
        } else {
          console.log('⚠️  WARN: Timestamp missing (optional but recommended)');
        }
      } else {
        console.log(`❌ FAIL: Missing error fields: ${missingFields.join(', ')}`);
        console.log('Response:', JSON.stringify(body, null, 2));
      }
    } else {
      console.log(`❌ FAIL: Expected 400, got ${response.statusCode}`);
      console.log('Response:', JSON.stringify(response.body, null, 2));
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
  
  // Test invalid payment requirements
  try {
    const response = await makeRequest('POST', '/api/x402/simulate-payment', {
      wallet_address: 'test',
      payment_requirements: {
        // Missing asset and amount
      },
    });
    
    if (response.statusCode === 400) {
      console.log('\n✅ PASS: Returns 400 for invalid payment requirements');
      if (response.body.error_code === 'INVALID_PAYMENT_REQUIREMENTS') {
        console.log('✅ PASS: Correct error code for invalid payment requirements');
      }
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Testing Phase 4 API Improvements');
  console.log('=' .repeat(50));
  console.log(`API URL: ${API_URL}`);
  console.log(`Testing at: ${new Date().toISOString()}`);
  
  await testRequestId();
  await testPaymentSimulation();
  await testEnhancedErrors();
  
  console.log('\n' + '=' .repeat(50));
  console.log('✅ Testing Complete!');
  console.log('=' .repeat(50));
}

runAllTests().catch(console.error);

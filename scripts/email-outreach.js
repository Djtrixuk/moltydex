#!/usr/bin/env node
/**
 * Email Outreach Automation Script
 * 
 * Sends emails via SMTP or email API
 * 
 * Supports:
 * - SMTP (Gmail, custom SMTP)
 * - SendGrid API
 * - Mailgun API
 * 
 * Usage:
 *   node scripts/email-outreach.js smtp "to@example.com" "Subject" "Body"
 *   node scripts/email-outreach.js sendgrid "to@example.com" "Subject" "Body"
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// SMTP would require nodemailer package
// For now, this is a template for API-based email services

async function sendViaSendGrid(to, subject, body) {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL || '[email protected]';

  if (!SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY not set');
  }

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: FROM_EMAIL },
      subject,
      content: [{ type: 'text/plain', value: body }],
    });

    const options = {
      hostname: 'api.sendgrid.com',
      path: '/v3/mail/send',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
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
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true });
        } else {
          reject(new Error(`SendGrid API error: ${res.statusCode} - ${responseData}`));
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

async function main() {
  const args = process.argv.slice(2);
  const service = args[0];
  const to = args[1];
  const subject = args[2];
  const body = args.slice(3).join(' ');

  if (!service || !to || !subject || !body) {
    console.error('❌ Error: Missing arguments');
    console.error('\nUsage:');
    console.error('  node scripts/email-outreach.js <service> <to> <subject> <body>');
    console.error('\nServices: sendgrid, mailgun');
    console.error('\nExample:');
    console.error('  node scripts/email-outreach.js sendgrid [email protected] "Hello" "Message body"');
    process.exit(1);
  }

  try {
    console.log(`\n📧 Sending email via ${service}...\n`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}\n`);

    let result;
    switch (service) {
      case 'sendgrid':
        result = await sendViaSendGrid(to, subject, body);
        break;
      default:
        throw new Error(`Unknown service: ${service}`);
    }

    if (result.success) {
      console.log('✅ Email sent successfully!\n');
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

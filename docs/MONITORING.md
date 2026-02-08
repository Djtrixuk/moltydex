# Monitoring & Reliability Guide

Complete guide for monitoring MoltyDEX API health and performance.

## Health Check Endpoint

### Basic Health Check

```bash
curl https://api.moltydex.com/api/health
```

### Response

```json
{
  "status": "ok",
  "fee_bps": 10,
  "fee_wallet_configured": true,
  "jupiter_api_key_set": true,
  "rpc": "https://api.mainnet-beta.solana.com",
  "features": {
    "secure_signing": true,
    "fee_collection": true,
    "x402_integration": true,
    "balance_checking": true
  }
}
```

## Uptime Monitoring

### UptimeRobot Setup

1. **Create Account**: https://uptimerobot.com
2. **Add Monitor**:
   - Type: HTTP(s)
   - URL: `https://api.moltydex.com/api/health`
   - Interval: 5 minutes
   - Alert Contacts: Your email

### Custom Monitoring Script

```bash
#!/bin/bash
# scripts/monitoring/uptime-check.sh

API_URL="https://api.moltydex.com/api/health"
ALERT_EMAIL="your@email.com"

response=$(curl -s -o /dev/null -w "%{http_code}" $API_URL)

if [ $response -ne 200 ]; then
    echo "API is down! Status: $response" | mail -s "MoltyDEX API Alert" $ALERT_EMAIL
fi
```

### Cron Job

```bash
# Add to crontab (crontab -e)
*/5 * * * * /path/to/uptime-check.sh
```

## Error Tracking

### Sentry Integration

1. **Install Sentry**:

```bash
cd api
npm install @sentry/node
```

2. **Initialize Sentry**:

```javascript
// api/index.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'production',
});

// Add error handler
app.use(Sentry.Handlers.errorHandler());
```

3. **Set Environment Variable**:

```bash
SENTRY_DSN=your_sentry_dsn
```

### Custom Error Logging

```javascript
// api/utils/errorHandler.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
});

function logError(error, context = {}) {
  logger.error({
    message: error.message,
    stack: error.stack,
    ...context,
  });
}
```

## Performance Monitoring

### Response Time Tracking

```javascript
// api/middleware/performance.js
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
    
    // Log slow requests
    if (duration > 1000) {
      console.warn(`Slow request: ${req.path} took ${duration}ms`);
    }
  });
  
  next();
});
```

### Analytics Dashboard

View real-time statistics:

1. Open `scripts/analytics-dashboard.html` in browser
2. Or access via API: `GET /api/analytics/stats`

## Alerting

### Email Alerts

```javascript
// api/utils/alerts.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_PASSWORD,
  },
});

async function sendAlert(subject, message) {
  await transporter.sendMail({
    from: process.env.ALERT_EMAIL,
    to: process.env.ALERT_RECIPIENT,
    subject: `MoltyDEX Alert: ${subject}`,
    text: message,
  });
}
```

### Slack Webhooks

```javascript
async function sendSlackAlert(message) {
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message }),
  });
}
```

## Status Page

### Create Status Page

1. Use a service like StatusPage.io or Cachet
2. Monitor key endpoints:
   - `/api/health`
   - `/api/quote`
   - `/api/swap/build`

### Public Status URL

Create a public status page at `https://status.moltydex.com`

## Logging

### Structured Logging

```javascript
// api/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

module.exports = logger;
```

### Log Rotation

Use `winston-daily-rotate-file`:

```bash
npm install winston-daily-rotate-file
```

## Metrics to Monitor

### Key Metrics

1. **Uptime**: Target > 99.9%
2. **Response Time**: Target < 500ms (p95)
3. **Error Rate**: Target < 0.1%
4. **API Calls**: Track daily/monthly
5. **Swap Success Rate**: Target > 95%
6. **Unique Wallets**: Track growth

### Dashboard

Use the analytics dashboard at `scripts/analytics-dashboard.html` to view:
- Total swaps
- Success rate
- API usage by endpoint
- Daily activity
- Unique wallets

## Incident Response

### Runbook

1. **Check Health Endpoint**: `GET /api/health`
2. **Check Logs**: Review error logs
3. **Check Dependencies**: Jupiter API, Solana RPC
4. **Check Rate Limits**: Verify not hitting limits
5. **Restart if Needed**: Redeploy if necessary

### Escalation

1. **Level 1**: Automated alerts
2. **Level 2**: On-call engineer
3. **Level 3**: Team lead

## Best Practices

1. **Monitor Continuously**: Set up 24/7 monitoring
2. **Set Alerts**: Configure alerts for critical issues
3. **Review Logs**: Regularly review error logs
4. **Track Metrics**: Monitor key performance indicators
5. **Test Regularly**: Run health checks frequently
6. **Document Incidents**: Keep incident log

## Tools

- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry, Rollbar
- **Logging**: Winston, Pino
- **Metrics**: Prometheus, Datadog
- **Status Page**: StatusPage.io, Cachet

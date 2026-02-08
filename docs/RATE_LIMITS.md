# Rate Limits

MoltyDEX API implements rate limiting to ensure fair usage and prevent abuse.

## Default Limits

- **100 requests per minute** per IP address
- **1000 requests per hour** per IP address

## Rate Limit Headers

All API responses include rate limit headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1707235200
```

### Header Descriptions

- `X-RateLimit-Limit`: Maximum number of requests allowed in the time window
- `X-RateLimit-Remaining`: Number of requests remaining in current window
- `X-RateLimit-Reset`: Unix timestamp when the rate limit resets

## Rate Limit Status Endpoint

Check your current rate limit status:

```bash
GET /api/rate-limit/status
```

### Response

```json
{
  "limit": 100,
  "remaining": 95,
  "reset": 1707235200,
  "retryAfter": 0
}
```

## Handling Rate Limits

### HTTP Status Code

When rate limit is exceeded, API returns:

- **Status Code**: `429 Too Many Requests`
- **Retry-After**: Seconds to wait before retrying

### Example Error Response

```json
{
  "error": "Too many requests, please try again later",
  "retryAfter": 30
}
```

## Best Practices

1. **Respect Limits**: Don't exceed rate limits
2. **Implement Backoff**: Use exponential backoff on 429 errors
3. **Cache Responses**: Cache responses to reduce API calls
4. **Batch Requests**: Use batch endpoints when available
5. **Monitor Headers**: Check rate limit headers in responses

## Exponential Backoff Example

```python
import time
import requests

def make_request_with_backoff(url, max_retries=3):
    for attempt in range(max_retries):
        response = requests.get(url)
        
        if response.status_code == 429:
            retry_after = int(response.headers.get('Retry-After', 2 ** attempt))
            time.sleep(retry_after)
            continue
        
        return response
    
    raise Exception("Max retries exceeded")
```

## Increasing Limits

For higher rate limits, contact us:
- **Email**: [INSERT EMAIL]
- **Discord**: [INSERT DISCORD]

## Endpoint-Specific Limits

Some endpoints may have different limits:

- **Quote Endpoint**: 100/min (same as default)
- **Swap Endpoint**: 50/min (lower to prevent abuse)
- **Balance Endpoint**: 200/min (higher for frequent checks)
- **Token Metadata**: 500/min (cached responses)

## Monitoring

Track your usage:

```bash
# Check rate limit status
curl https://api.moltydex.com/api/rate-limit/status
```

## FAQ

**Q: What happens if I exceed the rate limit?**
A: You'll receive a 429 error. Wait for the reset time or implement backoff.

**Q: Can I increase my rate limit?**
A: Yes, contact us for higher limits based on your use case.

**Q: Are rate limits per API key or IP?**
A: Currently per IP address. API key-based limits coming soon.

**Q: Do cached responses count against rate limits?**
A: Yes, but caching reduces the number of requests you need to make.

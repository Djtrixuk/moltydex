# Advanced Integration Guide

**For:** Experienced developers  
**Topics:** Custom error handling, retries, monitoring, optimization

---

## Custom Error Handling

### Retry Logic

```python
from moltydex import MoltyDEX
import time

def swap_with_retry(dex, input_mint, output_mint, amount, max_retries=3):
    """Execute swap with exponential backoff retry"""
    for attempt in range(max_retries):
        try:
            result = dex.swap(input_mint, output_mint, amount)
            return result
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            
            wait_time = 2 ** attempt  # Exponential backoff
            print(f"Attempt {attempt + 1} failed, retrying in {wait_time}s...")
            time.sleep(wait_time)
    
    return None
```

### Error Classification

```python
def handle_swap_error(error):
    """Classify and handle different error types"""
    error_msg = str(error).lower()
    
    if "insufficient" in error_msg:
        # Handle insufficient balance
        return "INSUFFICIENT_BALANCE"
    elif "route" in error_msg:
        # Handle no route found
        return "NO_ROUTE"
    elif "rate limit" in error_msg:
        # Handle rate limiting
        return "RATE_LIMIT"
    else:
        # Unknown error
        return "UNKNOWN"
```

---

## Monitoring & Logging

### Setup Logging

```python
import logging
from moltydex import MoltyDEX

# Setup logger
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('agent')

# Use in your agent
dex = MoltyDEX(api_url="https://api.moltydex.com")

try:
    result = dex.swap("SOL", "USDC", amount)
    logger.info(f"Swap successful: {result['signature']}")
except Exception as e:
    logger.error(f"Swap failed: {e}")
```

### Track Metrics

```python
class SwapTracker:
    def __init__(self):
        self.swaps = []
        self.failures = []
    
    def track_swap(self, result):
        self.swaps.append({
            'timestamp': time.time(),
            'signature': result['signature'],
            'success': True
        })
    
    def track_failure(self, error):
        self.failures.append({
            'timestamp': time.time(),
            'error': str(error)
        })
    
    def get_stats(self):
        total = len(self.swaps) + len(self.failures)
        success_rate = len(self.swaps) / total if total > 0 else 0
        return {
            'total': total,
            'successful': len(self.swaps),
            'failed': len(self.failures),
            'success_rate': success_rate
        }
```

---

## Optimization Strategies

### Cache Quotes

```python
from functools import lru_cache
import time

class CachedDEX:
    def __init__(self, dex):
        self.dex = dex
        self.quote_cache = {}
        self.cache_ttl = 30  # 30 seconds
    
    def get_quote(self, input_mint, output_mint, amount):
        cache_key = f"{input_mint}_{output_mint}_{amount}"
        
        # Check cache
        if cache_key in self.quote_cache:
            cached_time, cached_quote = self.quote_cache[cache_key]
            if time.time() - cached_time < self.cache_ttl:
                return cached_quote
        
        # Get fresh quote
        quote = self.dex.quote(input_mint, output_mint, amount)
        self.quote_cache[cache_key] = (time.time(), quote)
        
        return quote
```

### Batch Operations

```python
# Instead of multiple calls
balances = []
for token in tokens:
    balance = dex.get_balance(wallet, token)
    balances.append(balance)

# Use batch endpoint
balances = dex.batch_balances(wallet, tokens)
```

---

## Advanced x402 Handling

### Custom Payment Logic

```python
from moltydex import HTTPInterceptor
import requests

class CustomPaymentHandler(HTTPInterceptor):
    def handle_402(self, response):
        """Custom 402 handling logic"""
        payment_info = self.parse_402_response(response)
        
        # Check if we should pay
        if self.should_pay(payment_info):
            # Use MoltyDEX to swap and pay
            return super().handle_402(response)
        else:
            # Skip payment
            return None
    
    def should_pay(self, payment_info):
        """Determine if we should make payment"""
        # Custom logic here
        return True
```

---

## Performance Tips

1. **Use batch endpoints** - Reduce API calls
2. **Cache quotes** - Avoid redundant requests
3. **Monitor network** - Check Solana status
4. **Handle errors gracefully** - Retry with backoff
5. **Log everything** - Debug issues faster

---

## Security Best Practices

1. **Never expose private keys** - Use environment variables
2. **Validate inputs** - Check amounts, addresses
3. **Monitor transactions** - Track all swaps
4. **Set limits** - Prevent accidental large swaps
5. **Use devnet for testing** - Test before mainnet

---

## Next Steps

- Read API reference: [Link]
- Check examples: [Link]
- Join Discord: [Link]

---

**Advanced integration complete!** 🚀

# Performance Optimization Guide for MoltyDEX

**Tips to make your agent faster and more efficient**

---

## Caching Strategies

### Cache Quotes

```python
from functools import lru_cache
import time

class CachedMoltyDEX:
    def __init__(self, dex, ttl=30):
        self.dex = dex
        self.ttl = ttl
        self.cache = {}
    
    def get_quote(self, input_mint, output_mint, amount):
        key = f"{input_mint}_{output_mint}_{amount}"
        now = time.time()
        
        if key in self.cache:
            cached_time, cached_quote = self.cache[key]
            if now - cached_time < self.ttl:
                return cached_quote
        
        quote = self.dex.quote(input_mint, output_mint, amount)
        self.cache[key] = (now, quote)
        return quote
```

**Benefits:**
- Reduce API calls
- Faster responses
- Lower rate limit usage

---

## Batch Operations

### Use Batch Endpoints

**Instead of:**
```python
balances = []
for token in tokens:
    balance = dex.get_balance(wallet, token)
    balances.append(balance)
```

**Use:**
```python
balances = dex.batch_balances(wallet, tokens)
```

**Benefits:**
- Single API call
- Faster execution
- Lower overhead

---

## Parallel Processing

### Parallel Quote Requests

```python
import asyncio
from moltydex import MoltyDEX

async def get_multiple_quotes(dex, pairs):
    """Get multiple quotes in parallel"""
    tasks = [
        asyncio.create_task(
            dex.quote(pair['input'], pair['output'], pair['amount'])
        )
        for pair in pairs
    ]
    return await asyncio.gather(*tasks)
```

**Benefits:**
- Faster when checking multiple pairs
- Better resource utilization

---

## Connection Pooling

### Reuse Connections

```python
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

session = requests.Session()
retry_strategy = Retry(
    total=3,
    backoff_factor=1,
    status_forcelist=[429, 500, 502, 503, 504]
)
adapter = HTTPAdapter(max_retries=retry_strategy)
session.mount("https://", adapter)

# Use session for all requests
```

**Benefits:**
- Faster connections
- Better error handling
- Connection reuse

---

## Monitoring Performance

### Track Metrics

```python
import time
from collections import defaultdict

class PerformanceMonitor:
    def __init__(self):
        self.metrics = defaultdict(list)
    
    def track(self, operation, duration):
        self.metrics[operation].append(duration)
    
    def get_stats(self, operation):
        times = self.metrics[operation]
        if not times:
            return None
        return {
            'count': len(times),
            'avg': sum(times) / len(times),
            'min': min(times),
            'max': max(times)
        }
```

---

## Optimization Tips

1. **Cache quotes** - 30 second TTL recommended
2. **Use batch endpoints** - Reduce API calls
3. **Parallel processing** - For multiple operations
4. **Connection pooling** - Reuse connections
5. **Monitor performance** - Track what's slow

---

## Common Bottlenecks

### 1. Too Many API Calls
**Solution:** Cache and batch

### 2. Sequential Operations
**Solution:** Use parallel processing

### 3. Network Latency
**Solution:** Connection pooling, caching

### 4. Large Swaps
**Solution:** Split into smaller swaps if needed

---

## Best Practices

1. **Cache aggressively** - Quotes change slowly
2. **Batch when possible** - Reduce round trips
3. **Monitor performance** - Know what's slow
4. **Optimize hot paths** - Focus on frequent operations
5. **Test with real data** - Verify optimizations work

---

## Get Started

**Try optimizations:** Start with caching  
**Monitor:** Track your metrics  
**Improve:** Iterate based on data

---

**Optimize your agent for maximum performance!** 🚀

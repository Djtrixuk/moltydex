# Monitoring and Alerts Guide for MoltyDEX

**Set up monitoring for your agent's swaps and payments**

---

## Why Monitor?

### Key Metrics to Track
- Swap success rate
- Average swap time
- Failed swaps
- Balance levels
- API errors

---

## Basic Monitoring

### Log All Swaps

```python
import logging
from moltydex import MoltyDEX

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('agent')

dex = MoltyDEX(api_url="https://api.moltydex.com")

def swap_with_logging(input_mint, output_mint, amount):
    try:
        logger.info(f"Starting swap: {input_mint} -> {output_mint}, amount: {amount}")
        result = dex.swap(input_mint, output_mint, amount)
        logger.info(f"Swap successful: {result['signature']}")
        return result
    except Exception as e:
        logger.error(f"Swap failed: {e}")
        raise
```

---

## Advanced Monitoring

### Track Metrics

```python
from collections import defaultdict
import time

class SwapMonitor:
    def __init__(self):
        self.swaps = []
        self.metrics = defaultdict(list)
    
    def track_swap(self, result, duration):
        self.swaps.append({
            'timestamp': time.time(),
            'signature': result['signature'],
            'duration': duration,
            'success': True
        })
        self.metrics['duration'].append(duration)
        self.metrics['success'].append(True)
    
    def track_failure(self, error, duration):
        self.swaps.append({
            'timestamp': time.time(),
            'error': str(error),
            'duration': duration,
            'success': False
        })
        self.metrics['duration'].append(duration)
        self.metrics['success'].append(False)
    
    def get_stats(self):
        total = len(self.swaps)
        successful = sum(1 for s in self.swaps if s.get('success'))
        avg_duration = sum(self.metrics['duration']) / len(self.metrics['duration']) if self.metrics['duration'] else 0
        
        return {
            'total': total,
            'successful': successful,
            'failed': total - successful,
            'success_rate': successful / total if total > 0 else 0,
            'avg_duration': avg_duration
        }
```

---

## Alerts

### Low Balance Alert

```python
def check_balance_and_alert(wallet, min_sol=0.01):
    balance = dex.get_balance(wallet)
    sol_balance = balance['balance'] / 1e9  # Convert to SOL
    
    if sol_balance < min_sol:
        send_alert(f"Low SOL balance: {sol_balance} SOL")
        return False
    return True
```

### High Failure Rate Alert

```python
def check_failure_rate(monitor, threshold=0.1):
    stats = monitor.get_stats()
    failure_rate = 1 - stats['success_rate']
    
    if failure_rate > threshold:
        send_alert(f"High failure rate: {failure_rate:.2%}")
        return False
    return True
```

---

## Dashboard Ideas

### Key Metrics to Display
1. **Success Rate:** Percentage of successful swaps
2. **Average Duration:** How long swaps take
3. **Total Swaps:** Count of all swaps
4. **Balance Levels:** Current token balances
5. **Error Rate:** Percentage of errors

### Visualizations
- Success rate over time
- Swap duration distribution
- Error types breakdown
- Balance trends

---

## Integration with Monitoring Services

### Prometheus

```python
from prometheus_client import Counter, Histogram

swap_counter = Counter('moltydex_swaps_total', 'Total swaps')
swap_duration = Histogram('moltydex_swap_duration_seconds', 'Swap duration')

def swap_with_metrics(input_mint, output_mint, amount):
    start_time = time.time()
    try:
        result = dex.swap(input_mint, output_mint, amount)
        swap_counter.inc()
        swap_duration.observe(time.time() - start_time)
        return result
    except Exception as e:
        swap_counter.inc({'status': 'failed'})
        raise
```

### Datadog

```python
from datadog import initialize, statsd

def swap_with_datadog(input_mint, output_mint, amount):
    start_time = time.time()
    try:
        result = dex.swap(input_mint, output_mint, amount)
        statsd.increment('moltydex.swaps.success')
        statsd.timing('moltydex.swap.duration', (time.time() - start_time) * 1000)
        return result
    except Exception as e:
        statsd.increment('moltydex.swaps.failed')
        raise
```

---

## Best Practices

1. **Log everything** - Swaps, errors, balances
2. **Track metrics** - Success rate, duration, errors
3. **Set alerts** - Low balance, high failure rate
4. **Monitor trends** - Success rate over time
5. **Review regularly** - Weekly/monthly reviews

---

## Get Started

**Set up basic logging:** Start with simple logging  
**Add metrics:** Track key metrics  
**Set up alerts:** Get notified of issues

---

**Monitor your agent. Know what's happening.** 🚀

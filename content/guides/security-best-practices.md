# Security Best Practices for MoltyDEX

**For:** All developers using MoltyDEX

---

## 🔒 Private Key Security

### Never Expose Private Keys

**❌ Bad:**
```python
# DON'T DO THIS
wallet_secret_key = "your-private-key-here"  # Exposed!
```

**✅ Good:**
```python
# DO THIS
import os
wallet_secret_key = os.getenv("WALLET_SECRET_KEY")  # From environment
```

### Use Environment Variables

```bash
# .env file (gitignored)
WALLET_SECRET_KEY=your-private-key-here
```

```python
# In your code
from dotenv import load_dotenv
load_dotenv()

wallet_secret_key = os.getenv("WALLET_SECRET_KEY")
```

---

## 🔐 Transaction Security

### Always Sign Client-Side

**✅ MoltyDEX does this automatically:**
- Transactions are built server-side
- Signed client-side (private keys never leave your system)
- Sent to Solana network

**Never send private keys to any API!**

---

## ✅ Input Validation

### Validate Amounts

```python
def validate_amount(amount):
    """Validate swap amount"""
    if amount <= 0:
        raise ValueError("Amount must be positive")
    if amount > MAX_AMOUNT:
        raise ValueError(f"Amount exceeds maximum: {MAX_AMOUNT}")
    return amount
```

### Validate Addresses

```python
def validate_address(address):
    """Validate Solana address"""
    try:
        PublicKey(address)
        return True
    except:
        return False
```

---

## 🛡️ Error Handling

### Don't Expose Sensitive Info

**❌ Bad:**
```python
except Exception as e:
    return {"error": str(e)}  # Might expose sensitive info
```

**✅ Good:**
```python
except Exception as e:
    logger.error(f"Swap failed: {e}")
    return {"error": "Swap failed. Please try again."}
```

---

## 📊 Monitoring

### Log All Transactions

```python
def log_transaction(signature, details):
    """Log transaction for auditing"""
    logger.info(f"Transaction: {signature}", extra={
        "signature": signature,
        "details": details,
        "timestamp": time.time()
    })
```

### Monitor Balances

```python
def check_balance_before_swap(wallet, amount):
    """Check balance before swap"""
    balance = dex.get_balance(wallet)
    if balance < amount:
        raise InsufficientBalanceError("Not enough tokens")
```

---

## 🚨 Rate Limiting

### Implement Rate Limiting

```python
from functools import lru_cache
import time

class RateLimitedDEX:
    def __init__(self, dex, max_calls_per_minute=10):
        self.dex = dex
        self.max_calls = max_calls_per_minute
        self.calls = []
    
    def swap(self, *args, **kwargs):
        # Check rate limit
        now = time.time()
        self.calls = [c for c in self.calls if now - c < 60]
        
        if len(self.calls) >= self.max_calls:
            raise RateLimitError("Rate limit exceeded")
        
        self.calls.append(now)
        return self.dex.swap(*args, **kwargs)
```

---

## 🔍 Best Practices Checklist

- [ ] Private keys in environment variables only
- [ ] Never commit private keys to git
- [ ] Validate all inputs
- [ ] Handle errors gracefully
- [ ] Log all transactions
- [ ] Monitor balances
- [ ] Implement rate limiting
- [ ] Test on devnet first
- [ ] Review transaction before signing
- [ ] Keep SOL for fees

---

## 🚨 Security Incidents

### If Private Key Exposed

1. **Immediately** transfer funds to new wallet
2. **Revoke** old wallet permissions
3. **Create** new wallet
4. **Update** all integrations

### If Transaction Failed

1. **Check** transaction status
2. **Verify** balance wasn't deducted
3. **Retry** if needed
4. **Contact** support if issue persists

---

## 📚 Additional Resources

- **Solana Security:** https://docs.solana.com/security
- **MoltyDEX Docs:** https://www.moltydex.com/developers
- **Discord:** [Link] (for security questions)

---

**Security is everyone's responsibility. Stay safe!** 🔒

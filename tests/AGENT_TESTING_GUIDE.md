# Agent Testing Guide for MoltyDEX

Comprehensive guide for testing MoltyDEX with AI agents and documenting test results.

---

## Overview

This guide covers:
- How to test MoltyDEX with different AI agent frameworks
- Test scenarios for agent workflows
- Integration testing patterns
- Performance testing
- Error handling verification
- Documentation of test results

---

## Test Structure

```
tests/
├── test_x402_handler.py          # Unit tests (existing)
├── test_basic_functionality.py   # Basic tests (existing)
├── test_agent_integration.py     # Agent integration tests (NEW)
└── AGENT_TESTING_GUIDE.md        # This guide
```

---

## Running Tests

### Unit Tests (Fast, No Network)
```bash
cd /Users/danielstephenson/agentdex
python3 -m pytest tests/test_x402_handler.py -v
python3 -m pytest tests/test_basic_functionality.py -v
```

### Agent Integration Tests (Mocked)
```bash
python3 -m pytest tests/test_agent_integration.py -v
```

### All Tests
```bash
python3 -m pytest tests/ -v
```

### With Coverage
```bash
python3 -m pytest tests/ --cov=examples --cov-report=html
```

---

## Test Scenarios

### 1. Basic Agent Workflow

**Scenario:** Agent receives 402 Payment Required, MoltyDEX handles it automatically

**Test:** `test_agent_receives_402_and_handles_automatically`

**Expected Behavior:**
1. Agent makes API call
2. Receives 402 response
3. MoltyDEX parses payment requirements
4. Checks balance (has enough)
5. Makes payment
6. Retries original request
7. Gets successful response

**Verification:**
- Final response status is 200
- Payment was made
- Original request succeeded

---

### 2. Token Swapping Workflow

**Scenario:** Agent has SOL but needs USDC, swap happens automatically

**Test:** `test_agent_swaps_tokens_when_insufficient_balance`

**Expected Behavior:**
1. Agent receives 402 requiring USDC
2. Checks balance (has SOL, not USDC)
3. Swaps SOL → USDC automatically
4. Makes payment with USDC
5. Retries original request
6. Gets successful response

**Verification:**
- Swap was called
- Payment succeeded
- Final response is 200

---

### 3. Multiple 402 Responses

**Scenario:** Agent makes multiple API calls, handles multiple 402s

**Test:** `test_agent_handles_multiple_402_responses`

**Expected Behavior:**
1. Agent makes first API call → 402
2. Handles payment → success
3. Agent makes second API call → 402
4. Handles payment → success

**Verification:**
- Both calls succeed
- Each payment handled independently
- No state leakage between calls

---

### 4. Different Token Types

**Scenario:** Agent handles payments in different tokens (USDC, USDT, SOL)

**Test:** `test_agent_handles_different_tokens`

**Expected Behavior:**
- Agent can pay in USDC
- Agent can pay in USDT
- Agent can pay in SOL
- Each token handled correctly

**Verification:**
- Correct token checked for balance
- Correct token used for payment
- All token types work

---

### 5. LangChain Integration

**Scenario:** LangChain agent uses MoltyDEX for API calls

**Test:** `test_langchain_agent_uses_moltydex_for_api_calls`

**Expected Behavior:**
1. LangChain agent calls tool/API
2. Receives 402 response
3. MoltyDEX handler processes payment
4. LangChain agent gets tool output

**Verification:**
- LangChain agent receives successful response
- Tool output is correct
- Payment handled transparently

---

### 6. AutoGPT Integration

**Scenario:** AutoGPT plugin uses MoltyDEX for x402 payments

**Test:** `test_autogpt_agent_handles_402_in_plugin`

**Expected Behavior:**
1. AutoGPT makes API call through plugin
2. Receives 402 response
3. Plugin handles payment via MoltyDEX
4. AutoGPT gets action result

**Verification:**
- AutoGPT receives completed action
- Payment handled automatically
- Plugin integration works

---

### 7. Error Handling

**Scenarios:**
- No Solana payment option
- Swap failure
- API timeout

**Tests:**
- `test_agent_handles_no_solana_payment_option`
- `test_agent_handles_swap_failure`
- `test_agent_handles_api_timeout`

**Expected Behavior:**
- Errors are raised appropriately
- Error messages are clear
- Agent can handle errors gracefully

---

### 8. Performance Testing

**Scenario:** Agent handles rapid 402 responses

**Test:** `test_agent_handles_rapid_402_responses`

**Expected Behavior:**
- Multiple 402s processed quickly
- No blocking between requests
- All requests succeed

**Verification:**
- All responses succeed
- Performance is acceptable
- No resource leaks

---

## Integration Testing with Real Agents

### Prerequisites

1. **Test Wallet:** Create a test wallet with some SOL
   ```bash
   solana-keygen new --outfile test-wallet.json
   solana airdrop 1 <wallet-address> --url devnet
   ```

2. **Test API:** Set up a mock x402 API for testing
   - Returns 402 responses
   - Accepts payments
   - Returns data after payment

3. **Environment Variables:**
   ```bash
   export MOLTYDEX_API_URL=https://api.moltydex.com
   export TEST_WALLET_PATH=./test-wallet.json
   ```

### Manual Testing Steps

#### Test 1: Basic Flow
```python
from examples.x402_integration_example import X402PaymentHandler
import requests

handler = X402PaymentHandler("test-wallet.json")
response = requests.get("https://test-api.com/data")

if response.status_code == 402:
    paid_response = handler.handle_402_response(response, "https://test-api.com/data")
    print(paid_response.json())
```

#### Test 2: LangChain Integration
```python
from langchain.tools import Tool
from examples.x402_integration_example import X402PaymentHandler
import requests

handler = X402PaymentHandler("test-wallet.json")

def api_tool_with_402(query: str):
    response = requests.get(f"https://test-api.com/search?q={query}")
    if response.status_code == 402:
        response = handler.handle_402_response(response, response.url)
    return response.json()

tool = Tool(name="SearchAPI", func=api_tool_with_402)
# Use tool in LangChain agent
```

#### Test 3: AutoGPT Plugin
```python
# In AutoGPT plugin
from examples.x402_integration_example import X402PaymentHandler

handler = X402PaymentHandler("wallet.json")

def execute_command(command):
    response = requests.post("https://api.autogpt-plugin.com/execute", json={"command": command})
    if response.status_code == 402:
        response = handler.handle_402_response(response, response.url)
    return response.json()
```

---

## Test Documentation Template

### Test Run Report

**Date:** [Date]
**Tester:** [Name]
**Environment:** [devnet/mainnet]
**Wallet:** [Address]

#### Test Results

| Test | Status | Notes |
|------|--------|-------|
| Basic 402 handling | ✅ Pass | Handled automatically |
| Token swapping | ✅ Pass | SOL → USDC worked |
| Multiple 402s | ✅ Pass | All handled correctly |
| Error handling | ✅ Pass | Errors raised appropriately |
| LangChain integration | ✅ Pass | Works with LangChain |
| AutoGPT integration | ✅ Pass | Plugin works |
| Performance | ✅ Pass | Handles rapid requests |

#### Issues Found

- [List any issues]

#### Recommendations

- [List recommendations]

---

## Continuous Testing

### GitHub Actions (Future)

```yaml
name: Agent Integration Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - run: pip install -r requirements.txt
      - run: pytest tests/test_agent_integration.py -v
```

---

## Best Practices

1. **Mock External Dependencies:** Use mocks for API calls, wallet operations
2. **Test Error Cases:** Don't just test happy path
3. **Document Results:** Keep test reports for reference
4. **Test Different Agents:** Test with LangChain, AutoGPT, custom agents
5. **Performance Testing:** Test with rapid requests
6. **Real Integration:** Periodically test with real APIs (devnet)

---

## Next Steps

1. ✅ Create agent integration tests
2. ✅ Document test scenarios
3. ⏳ Add real integration tests (with testnet)
4. ⏳ Add performance benchmarks
5. ⏳ Set up CI/CD testing
6. ⏳ Create test reports dashboard

---

## Resources

- **Test Files:** `tests/test_agent_integration.py`
- **Example Code:** `examples/x402-integration-example.py`
- **LangChain Example:** `examples/langchain-integration.py`
- **AutoGPT Example:** `examples/autogpt-plugin.py`
- **API Docs:** https://www.moltydex.com/developers

---

**Last Updated:** 2026-02-06

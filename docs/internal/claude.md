# MoltyDEX - AI Agent Context

**Last Updated:** February 10, 2026  
**Purpose:** Persistent context for AI agents working on MoltyDEX

---

## 🏗️ Architecture Rules

### Project Structure
```
moltydex/
├── api/              # Express.js API (routes through Jupiter)
├── frontend/         # Next.js frontend
├── sdk/              # Python SDK
├── agent/            # x402 Auto-Pay Agent (TypeScript)
└── tests/            # Test suite
```

### Code Organization
- **API:** Express.js routes, middleware, utilities
- **Frontend:** Next.js pages, components, lib utilities
- **SDK:** Python package structure
- **Agent:** TypeScript agent implementation

### Naming Conventions
- **Files:** kebab-case (e.g., `swap-route.js`)
- **Functions:** camelCase (e.g., `buildSwapTransaction`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `JUPITER_API_URL`)
- **Components:** PascalCase (e.g., `SwapInterface`)

### Import Patterns
- Always use absolute imports in frontend (`@/components/...`)
- API uses relative imports
- SDK uses standard Python imports

---

## 🚫 Known Mistakes & Fixes

### Mistake 1: Missing Error Handling
**What Happened:** AI generated code without try-catch blocks  
**Fix:** Always wrap async operations in try-catch, return proper error responses  
**Pattern:**
```javascript
try {
  const result = await someAsyncOperation();
  return res.json({ success: true, data: result });
} catch (error) {
  console.error('Error:', error);
  return res.status(500).json({ error: error.message });
}
```

### Mistake 2: Hardcoded Values
**What Happened:** AI used hardcoded URLs/keys instead of env vars  
**Fix:** Always use environment variables, never hardcode  
**Pattern:** `process.env.VARIABLE_NAME || 'default'`

### Mistake 3: Missing Input Validation
**What Happened:** AI skipped input validation  
**Fix:** Always validate inputs before processing  
**Pattern:** Use validation middleware or explicit checks

### Mistake 4: Incomplete Error Messages
**What Happened:** Generic error messages  
**Fix:** Provide specific, actionable error messages  
**Pattern:** Include context (what failed, why, how to fix)

### Mistake 5: Missing Tests
**What Happened:** AI generated code without tests  
**Fix:** Always write tests first, or immediately after  
**Pattern:** Test edge cases, error conditions, success paths

### Mistake 6: Breaking Existing Patterns
**What Happened:** AI introduced new patterns instead of following existing ones  
**Fix:** Always check existing codebase patterns first  
**Pattern:** Search for similar implementations, follow established conventions

---

## 🔒 Security Policies

### Never Do These
- ❌ Never expose private keys or secrets
- ❌ Never skip input validation
- ❌ Never trust user input
- ❌ Never skip authentication/authorization checks
- ❌ Never log sensitive data (keys, passwords, tokens)
- ❌ Never commit `.env` files or secrets

### Always Do These
- ✅ Use environment variables for secrets
- ✅ Validate all inputs
- ✅ Sanitize user inputs
- ✅ Use parameterized queries (if using SQL)
- ✅ Rate limit API endpoints
- ✅ Add CORS headers appropriately
- ✅ Use HTTPS in production
- ✅ Client-side signing only (keys never leave client)

### Security Checklist
- [ ] Input validation
- [ ] Authentication/authorization
- [ ] Rate limiting
- [ ] Error handling (don't leak info)
- [ ] Secrets in env vars only
- [ ] CORS configured correctly

---

## ⚡ Performance Constraints

### API Response Times
- **Target:** < 2 seconds for all endpoints
- **Quote endpoint:** < 1 second
- **Swap build:** < 1.5 seconds
- **Balance check:** < 0.5 seconds

### Rate Limits
- **Default:** 100 requests/minute per IP
- **Swap endpoint:** 10 requests/minute per IP
- **Quote endpoint:** 50 requests/minute per IP

### Cost Constraints
- **Jupiter API:** Free tier (no API key costs)
- **Hosting:** Vercel free tier (serverless)
- **RPC:** Use public RPC or Helius free tier
- **Budget:** Keep costs minimal, optimize for free tiers

### Resource Limits
- **Memory:** Keep functions under 512MB
- **Timeout:** 10 seconds max for API calls
- **Concurrent requests:** Handle gracefully

---

## 🧪 Testing Requirements

### Test Coverage
- **Minimum:** 80% coverage for new code
- **Critical paths:** 100% coverage
- **Edge cases:** Must be tested

### Test Types Required
- **Unit tests:** All utility functions
- **Integration tests:** API endpoints
- **E2E tests:** Critical user flows
- **Error tests:** All error conditions

### Test Patterns
- **Before writing code:** List edge cases
- **Write tests first:** TDD when possible
- **Property-based tests:** For complex logic
- **Mock external APIs:** Don't hit real APIs in tests

### Test Files
- **Location:** `tests/` directory
- **Naming:** `test_*.py` or `*.test.js`
- **Run:** `python -m pytest tests/` or `npm test`

---

## 📐 Architecture Patterns

### API Layer
- **Express.js:** Use middleware for common concerns
- **Routes:** One file per resource (`swap.js`, `quote.js`)
- **Utils:** Shared utilities in `utils/` directory
- **Error handling:** Centralized error handler

### Frontend Layer
- **Next.js:** Use App Router patterns
- **Components:** Reusable, composable components
- **State:** React hooks, minimal state management
- **Styling:** Tailwind CSS, consistent design system

### Solana Integration
- **Client-side signing:** Always
- **Transaction building:** Use @solana/web3.js
- **Jupiter integration:** Use Jupiter API, not SDK
- **Error handling:** Handle Solana-specific errors

### x402 Protocol
- **Parsing:** Parse 402 responses correctly
- **Payment handling:** Automatic token swapping
- **Retry logic:** Retry original request after payment
- **Error recovery:** Handle payment failures gracefully

---

## 💰 Cost Management

### Infrastructure Costs
- **Vercel:** Free tier (serverless)
- **Upstash Redis:** Free tier (if used)
- **Jupiter API:** Free (no API key needed)
- **Solana RPC:** Public or Helius free tier

### Optimization Rules
- **Batch requests:** When possible
- **Cache responses:** Quote caching, token metadata
- **Lazy loading:** Load data when needed
- **Compression:** Use gzip/brotli

### Cost Monitoring
- **Track:** API calls, swap volume, errors
- **Alert:** If costs spike unexpectedly
- **Optimize:** Reduce unnecessary calls

---

## 🎨 Code Quality Standards

### Code Style
- **JavaScript/TypeScript:** ESLint rules, Prettier
- **Python:** PEP 8, Black formatter
- **Consistency:** Follow existing codebase style

### Documentation
- **Functions:** JSDoc/docstrings for all public functions
- **Complex logic:** Inline comments explaining why
- **API endpoints:** Document request/response formats
- **README:** Keep updated with changes

### Refactoring Rules
- **Don't break:** Existing functionality
- **Test first:** Write tests before refactoring
- **Small PRs:** One concern per PR
- **Review:** All refactors need review

---

## 🚀 Deployment Rules

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] No console.log statements
- [ ] Environment variables set
- [ ] Error handling in place
- [ ] Rate limiting configured
- [ ] CORS configured correctly

### Deployment Process
1. **Test locally:** `npm test` or `pytest`
2. **Check linting:** `npm run lint` or `flake8`
3. **Build:** `npm run build` or `python setup.py build`
4. **Deploy:** `vercel --prod` or deployment script
5. **Verify:** Check health endpoint, test critical flows

### Rollback Strategy
- **Vercel:** Automatic rollback on failure
- **Manual:** Keep previous deployment ready
- **Database:** Never break migrations

---

## 🔄 Workflow Patterns

### When Adding Features
1. **Plan first:** Write spec, get approval
2. **Create branch:** `feature/description`
3. **Write tests:** Before implementation
4. **Implement:** Following patterns
5. **Test:** Run full test suite
6. **Review:** Self-review before PR
7. **PR:** Clear description, link issues

### When Fixing Bugs
1. **Reproduce:** Write failing test
2. **Fix:** Minimal change
3. **Test:** Ensure fix works
4. **Verify:** No regressions
5. **Document:** Update docs if needed

### When Refactoring
1. **Identify:** What needs refactoring
2. **Plan:** Step-by-step approach
3. **Test:** Ensure tests cover area
4. **Refactor:** Small, incremental changes
5. **Verify:** Tests still pass
6. **Document:** Update architecture docs

---

## 📊 Monitoring & Observability

### What to Monitor
- **API health:** Response times, error rates
- **Swap success rate:** Track failures
- **Rate limit hits:** Identify abuse
- **Error logs:** Track patterns
- **Usage metrics:** Swaps, quotes, wallets

### Error Handling
- **Log errors:** With context
- **Don't expose:** Internal errors to users
- **Return:** User-friendly error messages
- **Track:** Error patterns, fix root causes

### Metrics to Track
- Total swaps
- Success rate
- Average response time
- Unique wallets
- Token pairs swapped
- Error types and frequencies

---

## 🎯 Non-Negotiables

### Never Ship Without
- ✅ Tests (unit + integration)
- ✅ Error handling
- ✅ Input validation
- ✅ Security review
- ✅ Documentation updates

### Always Verify
- ✅ Tests pass
- ✅ Linting passes
- ✅ No secrets committed
- ✅ Environment variables set
- ✅ Error handling works

### Always Ask
- "What happens at 10x scale?"
- "What's the cost at peak load?"
- "How does this interact with the rest of the system?"
- "What are the edge cases?"
- "How will we verify this works?"

---

## 🔧 Tool Configuration

### Required Tools
- **Linting:** ESLint (JS/TS), Flake8 (Python)
- **Formatting:** Prettier (JS/TS), Black (Python)
- **Testing:** Jest (JS/TS), Pytest (Python)
- **Type checking:** TypeScript, mypy (Python)

### CI/CD
- **GitHub Actions:** Run tests on PR
- **Vercel:** Auto-deploy on merge
- **Checks:** Tests, linting, type checking

---

## 📚 Examples & Patterns

### Good API Endpoint Pattern
```javascript
router.get('/api/endpoint', async (req, res) => {
  try {
    // Validate input
    const { param } = req.query;
    if (!param) {
      return res.status(400).json({ error: 'Missing param' });
    }
    
    // Process
    const result = await processData(param);
    
    // Return
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Good Test Pattern
```python
def test_function_success():
    # Arrange
    input_data = {...}
    
    # Act
    result = function_under_test(input_data)
    
    # Assert
    assert result.success == True
    assert result.data is not None

def test_function_error_case():
    # Test error handling
    with pytest.raises(ExpectedError):
        function_under_test(invalid_input)
```

---

## 🎓 Learning & Improvement

### After Code Reviews
- **If AI made mistake:** Add to "Known Mistakes" section
- **If pattern worked well:** Add to "Examples" section
- **If new constraint found:** Add to relevant section
- **Update:** This file after every significant review

### Continuous Improvement
- **Weekly:** Review and update this file
- **After incidents:** Document what went wrong
- **After successes:** Document what worked
- **Share:** Team knowledge through this file

---

## 🚨 Emergency Procedures

### If Production Breaks
1. **Rollback:** Immediately if possible
2. **Investigate:** Check logs, error reports
3. **Fix:** In separate branch
4. **Test:** Thoroughly before deploying
5. **Document:** What happened, why, how fixed

### If Security Issue Found
1. **Assess:** Severity and impact
2. **Fix:** Immediately if critical
3. **Test:** Security fix thoroughly
4. **Document:** Add to security policies
5. **Review:** Similar issues elsewhere

---

**Remember:** This file is a living document. Update it as we learn and improve. The AI agents use this to understand our codebase, patterns, and constraints. Keep it accurate and comprehensive.

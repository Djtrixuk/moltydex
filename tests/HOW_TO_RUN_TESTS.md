# How to Run Tests - Step-by-Step Guide

Complete step-by-step instructions for running MoltyDEX tests.

---

## Step 1: Check Python Version

First, make sure you have Python 3.9 or higher:

```bash
python3 --version
```

**Expected output:** `Python 3.9.x` or higher

If you don't have Python 3.9+, install it from [python.org](https://www.python.org/downloads/)

---

## Step 2: Navigate to Project Directory

Open your terminal and go to the project directory:

```bash
cd /Users/danielstephenson/agentdex
```

Verify you're in the right place:

```bash
pwd
# Should show: /Users/danielstephenson/agentdex

ls tests/
# Should show test files like test_x402_handler.py, test_agent_integration.py
```

---

## Step 3: Install Required Dependencies

Install pytest and other testing dependencies:

```bash
pip3 install --break-system-packages pytest pytest-mock requests
```

**Note:** On macOS with Homebrew Python, you may need the `--break-system-packages` flag. If you get permission errors, try:
```bash
pip3 install --user pytest pytest-mock requests
```

**What this installs:**
- `pytest` - Testing framework
- `pytest-mock` - Mocking utilities
- `requests` - HTTP library (for API calls)

**Expected output:**
```
Successfully installed pytest-x.x.x pytest-mock-x.x.x requests-x.x.x
```

**If you get permission errors:**
```bash
pip3 install --user pytest pytest-mock requests
```

---

## Step 4: Verify Installation

Check that pytest is installed correctly:

```bash
python3 -m pytest --version
```

**Expected output:** `pytest x.x.x`

---

## Step 5: Run Basic Functionality Tests

Start with the basic tests to make sure everything works:

```bash
python3 -m pytest tests/test_basic_functionality.py -v
```

**Expected output:**
```
tests/test_basic_functionality.py::TestBasicFunctionality::test_module_import PASSED
tests/test_basic_functionality.py::TestBasicFunctionality::test_class_exists PASSED
...
```

**What this tests:**
- Module imports work
- Classes exist
- Methods are accessible

---

## Step 6: Run Unit Tests

Run the unit tests for the x402 handler:

```bash
python3 -m pytest tests/test_x402_handler.py -v
```

**Expected output:**
```
tests/test_x402_handler.py::TestX402PaymentHandler::test_handle_402_response_non_402 PASSED
tests/test_x402_handler.py::TestX402PaymentHandler::test_parse_402_response_valid PASSED
tests/test_x402_handler.py::TestX402PaymentHandler::test_parse_402_response_no_solana_option PASSED
...
```

**What this tests:**
- 402 response parsing
- Balance checking
- Swap logic
- Error handling

**If tests fail:**
- Check that you're in the right directory
- Make sure all dependencies are installed
- See Troubleshooting section below

---

## Step 7: Run Agent Integration Tests

Run the comprehensive agent integration tests:

```bash
python3 -m pytest tests/test_agent_integration.py -v
```

**Expected output:**
```
tests/test_agent_integration.py::TestAgentWorkflows::test_agent_receives_402_and_handles_automatically PASSED
tests/test_agent_integration.py::TestAgentWorkflows::test_agent_swaps_tokens_when_insufficient_balance PASSED
tests/test_agent_integration.py::TestAgentWorkflows::test_agent_handles_multiple_402_responses PASSED
...
```

**What this tests:**
- Agent workflows
- LangChain integration
- AutoGPT integration
- Error handling
- Performance

---

## Step 8: Run All Tests

Run all tests together:

```bash
python3 -m pytest tests/ -v
```

**Expected output:**
```
tests/test_basic_functionality.py::TestBasicFunctionality::test_module_import PASSED
tests/test_x402_handler.py::TestX402PaymentHandler::test_handle_402_response_non_402 PASSED
tests/test_agent_integration.py::TestAgentWorkflows::test_agent_receives_402_and_handles_automatically PASSED
...
========================= X passed in X.XXs =========================
```

**Summary:**
- Shows all tests that passed
- Total number of tests
- Time taken

---

## Step 9: Run Tests with More Detail

To see more detailed output:

```bash
python3 -m pytest tests/ -v -s
```

**The `-s` flag shows:**
- Print statements
- More detailed error messages
- Debug output

---

## Step 10: Run Specific Test

To run a specific test:

```bash
# Run a specific test class
python3 -m pytest tests/test_agent_integration.py::TestAgentWorkflows -v

# Run a specific test method
python3 -m pytest tests/test_agent_integration.py::TestAgentWorkflows::test_agent_receives_402_and_handles_automatically -v
```

---

## Step 11: Run Tests with Coverage (Optional)

To see code coverage:

```bash
# Install coverage tool
pip3 install pytest-cov

# Run tests with coverage
python3 -m pytest tests/ --cov=examples --cov-report=term-missing
```

**Expected output:**
```
Name                                    Stmts   Miss  Cover   Missing
---------------------------------------------------------------------
examples/x402_integration_example.py     215     45    79%   45-50, 120-125
---------------------------------------------------------------------
TOTAL                                   215     45    79%
```

---

## Quick Reference Commands

### Most Common Commands

```bash
# Run all tests
python3 -m pytest tests/ -v

# Run specific test file
python3 -m pytest tests/test_agent_integration.py -v

# Run with detailed output
python3 -m pytest tests/ -v -s

# Run specific test
python3 -m pytest tests/test_agent_integration.py::TestAgentWorkflows::test_agent_receives_402_and_handles_automatically -v
```

---

## Troubleshooting

### Problem: "No module named pytest"

**Solution:**
```bash
pip3 install pytest pytest-mock requests
```

If that doesn't work:
```bash
pip3 install --user pytest pytest-mock requests
python3 -m pip install pytest pytest-mock requests
```

---

### Problem: "ModuleNotFoundError: No module named 'x402_integration_example'"

**Solution:**
Make sure you're in the project root directory:
```bash
cd /Users/danielstephenson/agentdex
pwd  # Should show /Users/danielstephenson/agentdex
```

---

### Problem: "ImportError: No module named 'solana'"

**Solution:**
The tests use mocks, so you don't need solana installed for unit tests. But if you want to run integration tests:
```bash
pip3 install solana solders
```

**Note:** Unit tests use mocks, so they don't require solana to be installed.

---

### Problem: Tests are slow

**Solution:**
The tests use mocks, so they should be fast. If they're slow:
- Check your internet connection (some tests might try to connect)
- Run specific tests instead of all: `pytest tests/test_x402_handler.py -v`

---

### Problem: Permission denied

**Solution:**
Use `--user` flag:
```bash
pip3 install --user pytest pytest-mock requests
```

Or use `sudo` (not recommended):
```bash
sudo pip3 install pytest pytest-mock requests
```

---

## Expected Test Results

### Successful Run

```
============================= test session starts ==============================
platform darwin -- Python 3.x.x, pytest-x.x.x
collected 24 items

tests/test_basic_functionality.py::TestBasicFunctionality::test_module_import PASSED
tests/test_basic_functionality.py::TestBasicFunctionality::test_class_exists PASSED
tests/test_x402_handler.py::TestX402PaymentHandler::test_handle_402_response_non_402 PASSED
tests/test_x402_handler.py::TestX402PaymentHandler::test_parse_402_response_valid PASSED
...
tests/test_agent_integration.py::TestAgentWorkflows::test_agent_receives_402_and_handles_automatically PASSED
tests/test_agent_integration.py::TestAgentWorkflows::test_agent_swaps_tokens_when_insufficient_balance PASSED
...

============================= 24 passed in 2.34s ==============================
```

### If Tests Fail

You'll see output like:
```
FAILED tests/test_x402_handler.py::TestX402PaymentHandler::test_parse_402_response_valid
```

With error details showing what went wrong.

---

## Next Steps After Running Tests

1. **Review Test Output:** Check that all tests pass
2. **Read Test Code:** Look at `tests/test_agent_integration.py` to understand what's being tested
3. **Read Documentation:** See `tests/AGENT_TESTING_GUIDE.md` for more details
4. **Run Specific Scenarios:** Test specific workflows you're interested in

---

## Summary

**Quick Start:**
```bash
# 1. Go to project directory
cd /Users/danielstephenson/agentdex

# 2. Install dependencies
pip3 install pytest pytest-mock requests

# 3. Run tests
python3 -m pytest tests/ -v
```

That's it! The tests should run and show you the results.

---

**Need Help?**
- Check `tests/AGENT_TESTING_GUIDE.md` for detailed test scenarios
- Check `tests/TEST_SUMMARY.md` for test overview
- Review test files in `tests/` directory

---

**Last Updated:** 2026-02-06

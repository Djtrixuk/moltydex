# MoltyDEX LangChain Integration

Add x402 payment handling to your LangChain agents with this easy-to-use integration.

## What is MoltyDEX?

MoltyDEX is a DEX aggregator built specifically for x402 payments. It automatically swaps tokens when agents receive 402 Payment Required responses, making x402 adoption seamless.

## Installation

```bash
pip install langchain moltydex
```

## Quick Start

```python
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_openai import ChatOpenAI
from moltydex.langchain import MoltyDEXTool, X402PaymentMiddleware

# Initialize MoltyDEX tool
moltydex_tool = MoltyDEXTool(wallet_path="wallet.json")

# Add x402 payment middleware
middleware = X402PaymentMiddleware(moltydex_tool)

# Create agent with x402 support
llm = ChatOpenAI(model="gpt-4")
tools = [moltydex_tool]
agent = create_openai_functions_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, middleware=[middleware])

# Your agent now automatically handles 402 payments!
result = agent_executor.invoke({"input": "Get data from https://api.example.com/data"})
```

## Features

✅ **Automatic 402 Handling** - Automatically swaps tokens when needed  
✅ **Balance Checking** - Checks token balances before payment  
✅ **LangChain Native** - Works seamlessly with LangChain agents  
✅ **Tool Integration** - Expose MoltyDEX as a LangChain tool  
✅ **Middleware Support** - Intercept and handle 402 responses  

## How It Works

1. **Agent makes request** - Your LangChain agent makes a request to an x402-protected API
2. **402 detected** - Middleware detects 402 Payment Required response
3. **Auto swap** - MoltyDEX automatically swaps tokens if needed
4. **Payment made** - Payment is made automatically
5. **Request retried** - Original request is retried with payment proof

## Example: Complete Agent

```python
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_openai import ChatOpenAI
from langchain.tools import Tool
from moltydex.langchain import MoltyDEXTool, X402PaymentMiddleware
import requests

# Initialize MoltyDEX
moltydex = MoltyDEXTool(wallet_path="wallet.json")

# Create custom tool for API calls
def call_api(url: str) -> str:
    """Call an API endpoint"""
    response = requests.get(url)
    if response.status_code == 402:
        # Middleware will handle this automatically
        return "Payment required - handling automatically..."
    return response.text

api_tool = Tool(
    name="call_api",
    func=call_api,
    description="Call an API endpoint"
)

# Create agent
llm = ChatOpenAI(model="gpt-4")
tools = [moltydex, api_tool]
agent = create_openai_functions_agent(llm, tools, prompt)
agent_executor = AgentExecutor(
    agent=agent, 
    tools=tools, 
    middleware=[X402PaymentMiddleware(moltydex)]
)

# Use agent
result = agent_executor.invoke({
    "input": "Get data from https://api.example.com/data"
})
```

## API Reference

### MoltyDEXTool

LangChain tool wrapper for MoltyDEX operations.

```python
from moltydex.langchain import MoltyDEXTool

tool = MoltyDEXTool(wallet_path="wallet.json")
```

### X402PaymentMiddleware

Middleware that automatically handles 402 responses.

```python
from moltydex.langchain import X402PaymentMiddleware

middleware = X402PaymentMiddleware(moltydex_tool)
```

## Resources

- **MoltyDEX Website**: https://www.moltydex.com
- **MoltyDEX Docs**: https://www.moltydex.com/developers
- **x402 Example**: https://github.com/Djtrixuk/moltydex-x402-example
- **LangChain Docs**: https://python.langchain.com

## License

MIT

## Contributing

Contributions welcome! Open an issue or submit a PR.

---

Built with ❤️ for the LangChain and x402 communities

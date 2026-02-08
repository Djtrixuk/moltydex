"""
LangChain Integration Example for MoltyDEX x402 Payments

This example shows how to integrate MoltyDEX into a LangChain agent
to handle x402 payments automatically.
"""

from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_openai import ChatOpenAI
from langchain.tools import Tool
from moltydex import MoltyDEX
import requests
import os

# Initialize MoltyDEX
dex = MoltyDEX(
    wallet_path=os.getenv("WALLET_PATH", "wallet.json"),
    api_url=os.getenv("MOLTYDEX_API_URL", "https://api.moltydex.com")
)

def call_api_with_payment(url: str) -> str:
    """
    Call an API that might require x402 payment.
    Automatically handles payment if needed.
    """
    response = requests.get(url)
    
    # Handle 402 Payment Required
    if response.status_code == 402:
        print(f"[x402] Payment required for {url}")
        payment_result = dex.handle_402_payment(response)
        
        if payment_result['success']:
            print(f"[x402] Payment successful: {payment_result['payment_signature']}")
            # Retry original request
            response = requests.get(url)
        else:
            return f"Payment failed: {payment_result.get('error', 'Unknown error')}"
    
    if response.ok:
        return response.text
    else:
        return f"API call failed: {response.status_code}"

# Create LangChain tool
api_tool = Tool(
    name="call_premium_api",
    func=call_api_with_payment,
    description="Call a premium API that might require payment. Automatically handles x402 payments."
)

# Create agent with MoltyDEX payment handling
llm = ChatOpenAI(temperature=0)
tools = [api_tool]
agent = create_openai_functions_agent(llm, tools, "You are a helpful AI assistant that can call premium APIs.")
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# Example usage
if __name__ == "__main__":
    result = agent_executor.invoke({
        "input": "Call the premium data API at https://premium-api.com/data and summarize the results"
    })
    print(result)

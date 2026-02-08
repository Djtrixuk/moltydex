"""
MoltyDEX Integration Template for Python Agents
Copy this template and customize for your agent
"""

from moltydex import MoltyDEX, HTTPInterceptor
import requests
import os
from typing import Optional, Dict, Any

class AgentWithMoltyDEX:
    """Template for an agent that uses MoltyDEX for payments"""
    
    def __init__(self, wallet_path: str = "wallet.json"):
        """Initialize agent with MoltyDEX"""
        self.dex = MoltyDEX(
            api_url=os.getenv("MOLTYDEX_API_URL", "https://api.moltydex.com"),
            wallet_path=wallet_path
        )
        
        # Setup HTTP interceptor for automatic 402 handling
        self.interceptor = HTTPInterceptor(
            api_url=os.getenv("MOLTYDEX_API_URL", "https://api.moltydex.com"),
            wallet_path=wallet_path,
            auto_swap=True
        )
    
    def make_api_request(self, url: str, method: str = "GET", **kwargs) -> Optional[Dict[Any, Any]]:
        """
        Make API request with automatic 402 handling
        
        Args:
            url: API endpoint URL
            method: HTTP method (GET, POST, etc.)
            **kwargs: Additional request arguments
        
        Returns:
            Response data or None if failed
        """
        try:
            response = requests.request(method, url, **kwargs)
            
            # HTTPInterceptor handles 402 automatically
            # But we can add custom handling here if needed
            if response.status_code == 402:
                # This shouldn't happen if interceptor is working
                # But handle it just in case
                print("402 Payment Required - should be handled by interceptor")
                return None
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"API request failed: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"Error making API request: {e}")
            return None
    
    def check_balance(self, token_mint: Optional[str] = None) -> Dict[str, Any]:
        """Check token balance"""
        wallet_address = self.dex.get_wallet_address()
        return self.dex.get_balance(wallet_address, token_mint)
    
    def swap_tokens(self, input_mint: str, output_mint: str, amount: int) -> Dict[str, Any]:
        """Execute token swap"""
        return self.dex.swap(input_mint, output_mint, amount)
    
    def get_quote(self, input_mint: str, output_mint: str, amount: int) -> Dict[str, Any]:
        """Get swap quote"""
        return self.dex.quote(input_mint, output_mint, amount)

# Example usage
if __name__ == "__main__":
    # Initialize agent
    agent = AgentWithMoltyDEX(wallet_path="wallet.json")
    
    # Check balances
    sol_balance = agent.check_balance()
    print(f"SOL Balance: {sol_balance['balance']}")
    
    # Make API request (handles 402 automatically)
    data = agent.make_api_request("https://premium-api.com/data")
    if data:
        print(f"Data retrieved: {data}")
    
    # Get quote if needed
    quote = agent.get_quote(
        "So11111111111111111111111111111111111111112",  # SOL
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",  # USDC
        1_000_000_000  # 1 SOL
    )
    print(f"Quote: {quote}")

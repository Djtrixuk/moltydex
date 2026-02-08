"""
AutoGPT Plugin Example for MoltyDEX x402 Payments

This example shows how to create an AutoGPT plugin that enables
automatic x402 payment handling.
"""

from autogpt_plugin import AutoGPTPlugin
from moltydex import MoltyDEX
import requests
import os

class MoltyDEXPlugin(AutoGPTPlugin):
    """AutoGPT plugin for automatic x402 payment handling"""
    
    def __init__(self):
        super().__init__()
        self.dex = MoltyDEX(
            wallet_path=os.getenv("WALLET_PATH", "wallet.json"),
            api_url=os.getenv("MOLTYDEX_API_URL", "https://api.moltydex.com")
        )
    
    def intercept_request(self, url: str, method: str = "GET", **kwargs):
        """
        Intercept HTTP requests and handle 402 responses automatically.
        """
        response = requests.request(method, url, **kwargs)
        
        # Handle 402 Payment Required
        if response.status_code == 402:
            print(f"[MoltyDEX] Payment required for {url}")
            payment_result = self.dex.handle_402_payment(response)
            
            if payment_result['success']:
                print(f"[MoltyDEX] Payment successful: {payment_result['payment_signature']}")
                # Retry original request
                response = requests.request(method, url, **kwargs)
            else:
                raise Exception(f"Payment failed: {payment_result.get('error', 'Unknown error')}")
        
        return response
    
    def get_balance(self):
        """Get current SOL balance"""
        return self.dex.get_balance("SOL")
    
    def get_capabilities(self):
        """Return plugin capabilities"""
        return {
            "name": "MoltyDEX x402 Payment Handler",
            "description": "Automatically handles x402 payments for premium APIs",
            "version": "1.0.0",
            "capabilities": [
                "automatic_token_swapping",
                "x402_payment_handling",
                "balance_checking"
            ]
        }

# Usage in AutoGPT
if __name__ == "__main__":
    plugin = MoltyDEXPlugin()
    
    # AutoGPT will automatically use the plugin to handle 402 responses
    # when making API calls
    
    print("MoltyDEX plugin loaded. AutoGPT can now handle x402 payments automatically!")

#!/usr/bin/env python3
"""
MoltyDEX x402 Integration Example
Demonstrates how to use MoltyDEX to handle 402 Payment Required responses
"""

import requests
import json
from solana.rpc.api import Client
from solders.keypair import Keypair
from solders.transaction import Transaction
import base64

# Configuration
MOLTYDEX_API = "https://api.moltydex.com"
SOLANA_RPC = "https://api.mainnet-beta.solana.com"

class X402PaymentHandler:
    """Handles x402 Payment Required responses using MoltyDEX"""
    
    def __init__(self, wallet_path: str):
        """Initialize with wallet"""
        with open(wallet_path, 'r') as f:
            keypair_data = json.load(f)
        self.keypair = Keypair.from_base58_string(keypair_data['secret_key'])
        self.wallet_address = str(self.keypair.pubkey())
    
    def handle_402_response(self, response: requests.Response, original_request_url: str):
        """
        Handle a 402 Payment Required response
        
        Args:
            response: The 402 response object
            original_request_url: The URL that returned 402
            
        Returns:
            The response after payment is made
        """
        if response.status_code != 402:
            return response
        
        # Parse x402 payment requirements
        payment_info = self._parse_402_response(response)
        print(f"402 Payment Required: {payment_info['amount']} {payment_info['token']}")
        
        # Check if we have the required token
        balance = self._check_balance(payment_info['token'])
        required_amount = int(payment_info['amount'])
        
        if balance < required_amount:
            # Need to swap tokens
            print(f"Insufficient balance. Need to swap...")
            swap_result = self._swap_tokens(
                input_token="So11111111111111111111111111111111111111112",  # SOL
                output_token=payment_info['token'],
                amount=required_amount
            )
            if not swap_result:
                raise Exception("Failed to swap tokens")
        
        # Make payment
        payment_tx = self._create_payment_transaction(payment_info)
        payment_signature = self._send_transaction(payment_tx)
        
        # Retry original request with payment header
        headers = {
            'X-Payment': payment_signature,
            'X-Payment-Amount': payment_info['amount'],
            'X-Payment-Token': payment_info['token']
        }
        
        return requests.get(original_request_url, headers=headers)
    
    def _parse_402_response(self, response: requests.Response) -> dict:
        """Parse x402 payment requirements from response"""
        # x402 format: {"accepts": [{"scheme": "solana", "token": "...", "amount": "..."}]}
        payment_data = response.json()
        accepts = payment_data.get('accepts', [])
        
        # Find Solana payment option
        for option in accepts:
            if option.get('scheme') == 'solana':
                return {
                    'token': option['token'],
                    'amount': option['amount'],
                    'network': option.get('network', 'mainnet')
                }
        
        raise Exception("No Solana payment option found")
    
    def _check_balance(self, token_address: str) -> int:
        """Check token balance"""
        url = f"{MOLTYDEX_API}/api/balance"
        params = {
            'wallet_address': self.wallet_address,
            'token_mint': token_address
        }
        response = requests.get(url, params=params)
        data = response.json()
        return int(data.get('balance', 0))
    
    def _swap_tokens(self, input_token: str, output_token: str, amount: int) -> bool:
        """Swap tokens using MoltyDEX"""
        # Get quote
        quote_url = f"{MOLTYDEX_API}/api/quote"
        quote_params = {
            'input_mint': input_token,
            'output_mint': output_token,
            'amount': str(amount),
            'slippage_bps': '50'  # 0.5% slippage
        }
        quote_response = requests.get(quote_url, params=quote_params)
        quote = quote_response.json()
        
        if not quote.get('output_amount'):
            return False
        
        # Build swap transaction
        swap_url = f"{MOLTYDEX_API}/api/swap/build"
        swap_data = {
            'wallet_address': self.wallet_address,
            'input_mint': input_token,
            'output_mint': output_token,
            'amount': str(amount),
            'slippage_bps': '50'
        }
        swap_response = requests.post(swap_url, json=swap_data)
        swap_result = swap_response.json()
        
        # Sign and send transaction
        tx_base64 = swap_result['transaction']
        tx_bytes = base64.b64decode(tx_base64)
        transaction = Transaction.from_bytes(tx_bytes)
        transaction.sign(self.keypair)
        
        # Send to Solana
        client = Client(SOLANA_RPC)
        signature = client.send_transaction(transaction)
        print(f"Swap transaction: {signature}")
        
        # Wait for confirmation
        client.confirm_transaction(signature)
        return True
    
    def _create_payment_transaction(self, payment_info: dict):
        """Create payment transaction (simplified - actual implementation would use SPL token transfer)"""
        # This is a simplified example
        # In production, you'd create an SPL token transfer transaction
        pass
    
    def _send_transaction(self, transaction) -> str:
        """Send transaction to Solana network"""
        # Simplified - actual implementation would send signed transaction
        return "transaction_signature"


# Example usage
if __name__ == "__main__":
    handler = X402PaymentHandler("wallet.json")
    
    # Make a request to an x402-protected API
    try:
        response = requests.get("https://example-api.com/data")
        if response.status_code == 402:
            # Automatically handle payment
            paid_response = handler.handle_402_response(response, "https://example-api.com/data")
            data = paid_response.json()
            print(f"Got data: {data}")
        else:
            print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

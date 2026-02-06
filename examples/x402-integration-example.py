#!/usr/bin/env python3
"""
MoltyDEX x402 Integration Example - Refactored for Lower Complexity
Demonstrates how to use MoltyDEX to handle 402 Payment Required responses

Refactored to reduce cyclomatic complexity from 14 to <10 by:
- Extracting smaller, focused functions
- Simplifying decision trees
- Focusing on happy path first
"""

import requests
import json
from solana.rpc.api import Client
from solders.keypair import Keypair
from solders.transaction import Transaction
import base64
from typing import Dict, Optional

# Configuration
MOLTYDEX_API = "https://api.moltydex.com"
SOLANA_RPC = "https://api.mainnet-beta.solana.com"
SOL_MINT = "So11111111111111111111111111111111111111112"


class X402PaymentHandler:
    """Handles x402 Payment Required responses using MoltyDEX"""
    
    def __init__(self, wallet_path: str):
        """Initialize with wallet"""
        with open(wallet_path, 'r') as f:
            keypair_data = json.load(f)
        self.keypair = Keypair.from_base58_string(keypair_data['secret_key'])
        self.wallet_address = str(self.keypair.pubkey())
    
    def handle_402_response(self, response: requests.Response, original_request_url: str) -> requests.Response:
        """
        Handle a 402 Payment Required response
        
        Simplified flow: parse → check balance → swap if needed → pay → retry
        
        Args:
            response: The 402 response object
            original_request_url: The URL that returned 402
            
        Returns:
            The response after payment is made
        """
        if response.status_code != 402:
            return response
        
        payment_info = self._parse_402_response(response)
        print(f"402 Payment Required: {payment_info['amount']} {payment_info['token']}")
        
        # Ensure we have sufficient balance (swap if needed)
        self._ensure_sufficient_balance(payment_info)
        
        # Make payment and retry request
        return self._pay_and_retry(payment_info, original_request_url)
    
    def _parse_402_response(self, response: requests.Response) -> Dict[str, str]:
        """Parse x402 payment requirements from response"""
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
        
        raise ValueError("No Solana payment option found in 402 response")
    
    def _ensure_sufficient_balance(self, payment_info: Dict[str, str]) -> None:
        """Ensure we have sufficient balance, swap if needed"""
        balance = self._check_balance(payment_info['token'])
        required_amount = int(payment_info['amount'])
        
        if balance >= required_amount:
            return  # We have enough, no swap needed
        
        print(f"Insufficient balance ({balance} < {required_amount}). Swapping...")
        self._swap_to_token(payment_info['token'], required_amount)
    
    def _swap_to_token(self, output_token: str, required_amount: int) -> None:
        """Swap SOL to the required token"""
        swap_result = self._swap_tokens(
            input_token=SOL_MINT,
            output_token=output_token,
            amount=required_amount
        )
        
        if not swap_result:
            raise RuntimeError(f"Failed to swap tokens to {output_token}")
    
    def _pay_and_retry(self, payment_info: Dict[str, str], url: str) -> requests.Response:
        """Make payment and retry original request"""
        payment_signature = self._make_payment(payment_info)
        
        headers = {
            'X-Payment': payment_signature,
            'X-Payment-Amount': payment_info['amount'],
            'X-Payment-Token': payment_info['token']
        }
        
        return requests.get(url, headers=headers)
    
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
        quote = self._get_quote(input_token, output_token, amount)
        if not quote:
            return False
        
        # Build and execute swap
        return self._execute_swap(input_token, output_token, amount)
    
    def _get_quote(self, input_token: str, output_token: str, amount: int) -> Optional[Dict]:
        """Get swap quote from MoltyDEX"""
        url = f"{MOLTYDEX_API}/api/quote"
        params = {
            'input_mint': input_token,
            'output_mint': output_token,
            'amount': str(amount),
            'slippage_bps': '50'
        }
        response = requests.get(url, params=params)
        quote = response.json()
        return quote if quote.get('output_amount') else None
    
    def _execute_swap(self, input_token: str, output_token: str, amount: int) -> bool:
        """Execute swap transaction"""
        # Build swap transaction
        swap_result = self._build_swap(input_token, output_token, amount)
        if not swap_result:
            return False
        
        # Sign and send
        signature = self._sign_and_send(swap_result['transaction'])
        if not signature:
            return False
        
        # Wait for confirmation
        self._wait_for_confirmation(signature)
        return True
    
    def _build_swap(self, input_token: str, output_token: str, amount: int) -> Optional[Dict]:
        """Build swap transaction"""
        url = f"{MOLTYDEX_API}/api/swap/build"
        data = {
            'wallet_address': self.wallet_address,
            'input_mint': input_token,
            'output_mint': output_token,
            'amount': str(amount),
            'slippage_bps': '50'
        }
        response = requests.post(url, json=data)
        return response.json() if response.status_code == 200 else None
    
    def _sign_and_send(self, tx_base64: str) -> Optional[str]:
        """Sign and send transaction"""
        try:
            tx_bytes = base64.b64decode(tx_base64)
            transaction = Transaction.from_bytes(tx_bytes)
            transaction.sign(self.keypair)
            
            client = Client(SOLANA_RPC)
            signature = client.send_transaction(transaction)
            print(f"Swap transaction: {signature}")
            return signature
        except Exception as e:
            print(f"Error signing/sending transaction: {e}")
            return None
    
    def _wait_for_confirmation(self, signature: str) -> None:
        """Wait for transaction confirmation"""
        client = Client(SOLANA_RPC)
        client.confirm_transaction(signature)
    
    def _make_payment(self, payment_info: Dict[str, str]) -> str:
        """Create and send payment transaction"""
        # Simplified - actual implementation would create SPL token transfer
        # For now, return a placeholder signature
        # In production, implement proper SPL token transfer
        return "payment_signature_placeholder"


# Example usage
if __name__ == "__main__":
    handler = X402PaymentHandler("wallet.json")
    
    try:
        response = requests.get("https://example-api.com/data")
        if response.status_code == 402:
            paid_response = handler.handle_402_response(response, "https://example-api.com/data")
            data = paid_response.json()
            print(f"Got data: {data}")
        else:
            print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

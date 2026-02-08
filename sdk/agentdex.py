"""
MoltyDEX Python SDK — x402 Token Aggregator for AI Agents
Routes through Jupiter + small fee. Secure client-side signing.
pip install requests solana
"""
import json
import base64
import time
from typing import Optional, Dict, Any, List
from solana.keypair import Keypair
from solana.rpc.api import Client
from solana.transaction import Transaction
import requests


class MoltyDEX:
    """Python SDK for MoltyDEX aggregator with x402 support."""

    def __init__(
        self,
        api_url: str = "http://localhost:3001",
        wallet_path: Optional[str] = None,
        wallet_keypair: Optional[Keypair] = None,
        wallet_secret_key: Optional[list] = None,
        rpc_url: Optional[str] = None,
    ):
        self.api_url = api_url.rstrip('/')
        
        if wallet_keypair:
            self.wallet = wallet_keypair
        elif wallet_secret_key:
            self.wallet = Keypair.from_secret_key(bytes(wallet_secret_key))
        elif wallet_path:
            with open(wallet_path) as f:
                key_data = json.load(f)
                self.wallet = Keypair.from_secret_key(bytes(key_data))
        else:
            raise ValueError("Must provide wallet_path, wallet_keypair, or wallet_secret_key")

        self.rpc_url = rpc_url or "https://api.devnet.solana.com"
        self.rpc_client = Client(self.rpc_url)

    def _request_with_retry(
        self,
        method: str,
        url: str,
        max_retries: int = 3,
        backoff_base: float = 1.0,
        **kwargs
    ) -> requests.Response:
        """
        Make HTTP request with automatic retry and exponential backoff.
        
        Args:
            method: HTTP method ('get', 'post', etc.)
            url: Request URL
            max_retries: Maximum number of retries
            backoff_base: Base delay in seconds for exponential backoff
            **kwargs: Additional arguments to pass to requests
        
        Returns:
            Response object
        """
        for attempt in range(max_retries + 1):
            try:
                response = requests.request(method, url, timeout=30, **kwargs)
                
                # Check rate limit headers
                if response.status_code == 429:
                    retry_after = response.headers.get('Retry-After')
                    if retry_after:
                        wait_time = int(retry_after)
                    else:
                        wait_time = backoff_base * (2 ** attempt)
                    
                    if attempt < max_retries:
                        time.sleep(wait_time)
                        continue
                
                # For 5xx errors, retry
                if response.status_code >= 500 and attempt < max_retries:
                    wait_time = backoff_base * (2 ** attempt)
                    time.sleep(wait_time)
                    continue
                
                return response
            except (requests.exceptions.RequestException, requests.exceptions.Timeout) as e:
                if attempt < max_retries:
                    wait_time = backoff_base * (2 ** attempt)
                    time.sleep(wait_time)
                    continue
                raise
        
        return response

    def quote(
        self,
        token_in: str,
        token_out: str,
        amount_in: int,
        slippage_bps: int = 50,
    ) -> dict:
        """
        Get swap quote (no execution) with full cost breakdown.
        
        Args:
            token_in: Token mint address (e.g., SOL)
            token_out: Token mint address (e.g., USDC)
            amount_in: Amount in smallest unit (lamports for SOL)
            slippage_bps: Slippage in basis points (50 = 0.5%)
        
        Returns:
            Quote with output amount, price impact, fee breakdown, cost estimates
        """
        response = self._request_with_retry(
            'get',
            f"{self.api_url}/api/quote",
            params={
                "input_mint": token_in,
                "output_mint": token_out,
                "amount": str(amount_in),
                "slippage_bps": slippage_bps,
            },
        )
        response.raise_for_status()
        return response.json()

    def swap_build(
        self,
        token_in: str,
        token_out: str,
        amount_in: int,
        slippage_bps: int = 50,
        priority_fee_lamports: int = 0,
    ) -> dict:
        """
        Build unsigned swap transaction (SECURE - you sign client-side) with retry.
        
        Args:
            token_in: Token mint address
            token_out: Token mint address
            amount_in: Amount in smallest unit
            slippage_bps: Slippage tolerance (50 = 0.5%)
            priority_fee_lamports: Optional priority fee
        
        Returns:
            Unsigned transaction (base64) ready to sign and send
        """
        response = self._request_with_retry(
            'post',
            f"{self.api_url}/api/swap/build",
            json={
                "wallet_address": str(self.wallet.public_key),
                "input_mint": token_in,
                "output_mint": token_out,
                "amount": str(amount_in),
                "slippage_bps": slippage_bps,
                "priority_fee_lamports": priority_fee_lamports,
            },
        )
        response.raise_for_status()
        return response.json()

    def swap(
        self,
        token_in: str,
        token_out: str,
        amount_in: int,
        slippage_bps: int = 50,
        priority_fee_lamports: int = 0,
        wait_for_confirmation: bool = True,
        confirmation_timeout: int = 60,
    ) -> dict:
        """
        Execute swap (builds, signs, and sends transaction) with automatic retry and polling.
        
        Args:
            token_in: Token mint address
            token_out: Token mint address
            amount_in: Amount in smallest unit
            slippage_bps: Slippage tolerance (50 = 0.5%)
            priority_fee_lamports: Optional priority fee
            wait_for_confirmation: If True, poll until transaction is confirmed
            confirmation_timeout: Maximum seconds to wait for confirmation
        
        Returns:
            Transaction signature and swap details with status
        """
        # Build unsigned transaction with retry
        build_result = None
        for attempt in range(3):
            try:
                build_result = self.swap_build(
                    token_in, token_out, amount_in, slippage_bps, priority_fee_lamports
                )
                break
            except Exception as e:
                if attempt < 2:
                    time.sleep(1 * (2 ** attempt))
                    continue
                raise
        
        # Deserialize transaction
        tx_bytes = base64.b64decode(build_result['transaction'])
        transaction = Transaction.deserialize(tx_bytes)
        
        # Sign transaction
        transaction.sign(self.wallet)
        
        # Send transaction with retry
        signature = None
        for attempt in range(3):
            try:
                signature = self.rpc_client.send_transaction(transaction).value
                break
            except Exception as e:
                if attempt < 2:
                    time.sleep(1 * (2 ** attempt))
                    continue
                raise
        
        result = {
            'success': True,
            'signature': signature,
            'status': 'pending',
            **build_result,
        }
        
        # Poll for confirmation if requested
        if wait_for_confirmation:
            status = self.poll_transaction_status(signature, timeout=confirmation_timeout)
            result['status'] = status['status']
            result['confirmed'] = status['confirmed']
            if status.get('error'):
                result['error'] = status['error']
        
        return result

    def poll_transaction_status(
        self,
        signature: str,
        timeout: int = 60,
        poll_interval: float = 2.0,
    ) -> dict:
        """
        Poll transaction status until confirmed or timeout.
        
        Args:
            signature: Transaction signature
            timeout: Maximum seconds to wait
            poll_interval: Seconds between status checks
        
        Returns:
            Transaction status
        """
        start_time = time.time()
        while time.time() - start_time < timeout:
            try:
                status = self.get_transaction_status(signature)
                if status['confirmed'] or status['status'] == 'failed':
                    return status
                time.sleep(poll_interval)
            except Exception as e:
                # If status check fails, wait and retry
                time.sleep(poll_interval)
                continue
        
        # Timeout - return last known status
        return self.get_transaction_status(signature)

    def get_balance(
        self,
        token_mint: Optional[str] = None,
        wallet_address: Optional[str] = None,
    ) -> dict:
        """
        Check token balance with automatic retry.
        
        Args:
            token_mint: Token mint address (None for SOL)
            wallet_address: Wallet address (None to use self.wallet)
        
        Returns:
            Balance information
        """
        address = wallet_address or str(self.wallet.public_key)
        params = {"wallet_address": address}
        if token_mint:
            params["token_mint"] = token_mint
        
        response = self._request_with_retry('get', f"{self.api_url}/api/balance", params=params)
        response.raise_for_status()
        return response.json()

    def parse_x402_payment(self, payment_response_body: Dict[str, Any]) -> dict:
        """
        Parse x402 Payment Required response with retry.
        
        Args:
            payment_response_body: JSON body from HTTP 402 response
        
        Returns:
            Parsed payment requirements
        """
        response = self._request_with_retry(
            'post',
            f"{self.api_url}/api/x402/parse-payment",
            json={"payment_response_body": payment_response_body},
        )
        response.raise_for_status()
        return response.json()

    def prepare_x402_payment(
        self,
        payment_requirements: Dict[str, Any],
        preferred_input_token: Optional[str] = None,
    ) -> dict:
        """
        Check balance and prepare swap if needed for x402 payment with retry.
        
        Args:
            payment_requirements: Payment requirements from 402 response
            preferred_input_token: Token to swap from (default: SOL)
        
        Returns:
            Payment preparation result (swap needed or ready)
        """
        response = self._request_with_retry(
            'post',
            f"{self.api_url}/api/x402/prepare-payment",
            json={
                "wallet_address": str(self.wallet.public_key),
                "payment_requirements": payment_requirements,
                "preferred_input_token": preferred_input_token,
            },
        )
        response.raise_for_status()
        return response.json()

    def handle_x402_payment(
        self,
        payment_response_body: Dict[str, Any],
        preferred_input_token: Optional[str] = None,
    ) -> dict:
        """
        Complete x402 payment flow: parse, check balance, swap if needed.
        
        Args:
            payment_response_body: JSON body from HTTP 402 response
            preferred_input_token: Token to swap from (default: SOL)
        
        Returns:
            Payment ready status and swap result if needed
        """
        # Parse payment requirements
        parsed = self.parse_x402_payment(payment_response_body)
        payment_req = parsed['recommended']
        
        # Prepare payment (check balance, get swap quote if needed)
        prepared = self.prepare_x402_payment(
            parsed['payment_requirements'],
            preferred_input_token
        )
        
        if prepared['ready']:
            return {
                'ready': True,
                'payment_requirements': payment_req,
                'message': 'Sufficient balance - ready to pay',
            }
        
        # Need to swap
        swap_info = prepared['swap_needed']
        swap_result = self.swap(
            swap_info['input_token'],
            swap_info['output_token'],
            int(swap_info['input_amount']),
        )
        
        return {
            'ready': False,
            'swap_completed': True,
            'swap_result': swap_result,
            'payment_requirements': payment_req,
            'message': 'Swap completed - ready to pay',
        }

    def get_tokens(self) -> list:
        """List popular tokens."""
        response = requests.get(f"{self.api_url}/api/tokens")
        response.raise_for_status()
        return response.json()["tokens"]

    def get_recommended_tokens(self) -> list:
        """Get recommended tokens for x402 payments."""
        response = requests.get(f"{self.api_url}/api/x402/recommended-tokens")
        response.raise_for_status()
        return response.json()["recommended"]

    def get_transaction_status(self, signature: str) -> dict:
        """
        Get transaction status and confirmation details with retry.
        
        Args:
            signature: Transaction signature
        
        Returns:
            Transaction status information
        """
        response = self._request_with_retry(
            'get',
            f"{self.api_url}/api/transaction/status/{signature}"
        )
        response.raise_for_status()
        return response.json()

    def get_transaction_history(
        self,
        wallet_address: Optional[str] = None,
        limit: int = 20,
        before: Optional[str] = None,
    ) -> dict:
        """
        Get transaction history for a wallet with retry.
        
        Args:
            wallet_address: Wallet address (None to use self.wallet)
            limit: Maximum number of transactions (default: 20, max: 100)
            before: Signature to fetch transactions before
        
        Returns:
            Transaction history
        """
        address = wallet_address or str(self.wallet.public_key)
        params = {"limit": limit}
        if before:
            params["before"] = before
        
        response = self._request_with_retry(
            'get',
            f"{self.api_url}/api/transaction/history/{address}",
            params=params
        )
        response.raise_for_status()
        return response.json()

    def search_tokens(self, query: str, limit: int = 20) -> dict:
        """
        Search for tokens by symbol, name, or address with retry.
        
        Args:
            query: Search query
            limit: Maximum results (default: 20, max: 100)
        
        Returns:
            Search results
        """
        response = self._request_with_retry(
            'get',
            f"{self.api_url}/api/tokens/search",
            params={"q": query, "limit": limit}
        )
        response.raise_for_status()
        return response.json()

    def get_token_by_symbol(self, symbol: str) -> dict:
        """
        Get token by symbol (exact match) with retry.
        
        Args:
            symbol: Token symbol (e.g., "USDC")
        
        Returns:
            Token information with agent-friendly metadata
        """
        response = self._request_with_retry(
            'get',
            f"{self.api_url}/api/tokens/by-symbol",
            params={"symbol": symbol}
        )
        response.raise_for_status()
        return response.json()

    def get_popular_tokens(self, category: Optional[str] = None, limit: int = 50) -> dict:
        """
        Get popular tokens, optionally filtered by category, with retry.
        
        Args:
            category: Filter by category ("stablecoin", "agent-token", etc.)
            limit: Maximum results (default: 50, max: 200)
        
        Returns:
            Popular tokens list
        """
        params = {"limit": limit}
        if category:
            params["category"] = category
        
        response = self._request_with_retry(
            'get',
            f"{self.api_url}/api/tokens/popular",
            params=params
        )
        response.raise_for_status()
        return response.json()

    def batch_balances(self, requests: list) -> dict:
        """
        Get multiple token balances in one request with retry.
        
        Args:
            requests: List of balance request dicts
                [{"wallet_address": "...", "token_mint": "..."}, ...]
        
        Returns:
            Batch balance results
        """
        response = self._request_with_retry(
            'post',
            f"{self.api_url}/api/batch/balances",
            json={"requests": requests}
        )
        response.raise_for_status()
        return response.json()

    def batch_quotes(self, requests: list) -> dict:
        """
        Get multiple swap quotes in one request with retry.
        
        Args:
            requests: List of quote request dicts
                [{"input_mint": "...", "output_mint": "...", "amount": "..."}, ...]
        
        Returns:
            Batch quote results with cost breakdowns
        """
        response = self._request_with_retry(
            'post',
            f"{self.api_url}/api/batch/quotes",
            json={"requests": requests}
        )
        response.raise_for_status()
        return response.json()

    def batch_token_metadata(self, token_addresses: list) -> dict:
        """
        Get metadata for multiple tokens in one request with retry.
        
        Args:
            token_addresses: List of token mint addresses
        
        Returns:
            Batch token metadata results with agent-friendly flags
        """
        response = self._request_with_retry(
            'post',
            f"{self.api_url}/api/batch/token-metadata",
            json={"token_addresses": token_addresses}
        )
        response.raise_for_status()
        return response.json()

    def x402_auto_pay(
        self,
        payment_response_body: Dict[str, Any],
        preferred_input_token: Optional[str] = None,
        auto_swap: bool = False,
    ) -> dict:
        """
        Complete x402 payment flow: parse, check balance, swap if needed.
        One-call solution for agents with retry.
        
        Args:
            payment_response_body: JSON body from HTTP 402 response
            preferred_input_token: Token to swap from (default: SOL)
            auto_swap: If True, automatically build swap transaction
        
        Returns:
            Complete payment preparation result with cost breakdown
        """
        response = self._request_with_retry(
            'post',
            f"{self.api_url}/api/x402/auto-pay",
            json={
                "payment_response_body": payment_response_body,
                "wallet_address": str(self.wallet.public_key),
                "preferred_input_token": preferred_input_token,
                "auto_swap": auto_swap,
            }
        )
        response.raise_for_status()
        return response.json()


# Example usage
if __name__ == "__main__":
    # Initialize
    dex = MoltyDEX(
        api_url="https://your-api.vercel.app",
        wallet_path="~/.config/solana/id.json"
    )
    
    # Example: Handle x402 payment
    # payment_402_response = {...}  # From HTTP 402 response
    # result = dex.handle_x402_payment(payment_402_response)
    # print(result)

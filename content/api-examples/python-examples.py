"""
MoltyDEX Python SDK Examples
Complete examples for common use cases
"""

from moltydex import MoltyDEX
import asyncio

# Initialize MoltyDEX
dex = MoltyDEX(
    api_url="https://api.moltydex.com",
    wallet_path="wallet.json"
)

# Example 1: Get a Quote
def example_get_quote():
    """Get a quote for swapping SOL to USDC"""
    quote = dex.quote(
        input_mint="So11111111111111111111111111111111111111112",  # SOL
        output_mint="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",  # USDC
        amount=1_000_000_000  # 1 SOL in lamports
    )
    print(f"Input: 1 SOL")
    print(f"Output: {quote['output_amount']} USDC")
    print(f"Price Impact: {quote.get('price_impact', 'N/A')}%")
    return quote

# Example 2: Execute a Swap
def example_execute_swap():
    """Execute a swap from SOL to USDC"""
    result = dex.swap(
        input_mint="So11111111111111111111111111111111111111112",  # SOL
        output_mint="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",  # USDC
        amount=1_000_000_000  # 1 SOL
    )
    print(f"Swap successful!")
    print(f"Transaction: {result['signature']}")
    print(f"Output: {result['output_amount']} USDC")
    return result

# Example 3: Check Balance
def example_check_balance():
    """Check SOL and USDC balances"""
    sol_balance = dex.get_balance(
        wallet_address="YOUR_WALLET_ADDRESS",
        token_mint=None  # None for SOL
    )
    print(f"SOL Balance: {sol_balance['balance']} SOL")
    
    usdc_balance = dex.get_balance(
        wallet_address="YOUR_WALLET_ADDRESS",
        token_mint="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"  # USDC
    )
    print(f"USDC Balance: {usdc_balance['balance']} USDC")
    return sol_balance, usdc_balance

# Example 4: Handle x402 Payment Automatically
def example_x402_payment():
    """Handle x402 Payment Required automatically"""
    from moltydex import HTTPInterceptor
    import requests
    
    # Setup interceptor
    interceptor = HTTPInterceptor(
        api_url="https://api.moltydex.com",
        wallet_path="wallet.json",
        auto_swap=True
    )
    
    # Make request - handles 402 automatically
    response = requests.get("https://premium-api.com/data")
    
    if response.status_code == 200:
        data = response.json()
        print("Data retrieved successfully!")
        return data
    else:
        print(f"Error: {response.status_code}")
        return None

# Example 5: Batch Operations
def example_batch_operations():
    """Check multiple balances at once"""
    balances = dex.batch_balances(
        wallet_address="YOUR_WALLET_ADDRESS",
        token_mints=[
            "So11111111111111111111111111111111111111112",  # SOL
            "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",  # USDC
            "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",  # USDT
        ]
    )
    
    for balance in balances:
        print(f"{balance['token_mint']}: {balance['balance']}")
    
    return balances

# Example 6: Error Handling
def example_error_handling():
    """Handle errors gracefully"""
    try:
        quote = dex.quote(
            input_mint="INVALID_MINT",
            output_mint="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            amount=1_000_000_000
        )
    except Exception as e:
        print(f"Error getting quote: {e}")
        # Handle error - maybe try different token, or notify user
        return None
    
    return quote

# Example 7: Custom Slippage
def example_custom_slippage():
    """Use custom slippage tolerance"""
    quote = dex.quote(
        input_mint="So11111111111111111111111111111111111111112",
        output_mint="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        amount=1_000_000_000,
        slippage_bps=50  # 0.5% slippage
    )
    return quote

# Example 8: Swap with Retry
def example_swap_with_retry(max_retries=3):
    """Execute swap with retry logic"""
    for attempt in range(max_retries):
        try:
            result = dex.swap(
                input_mint="So11111111111111111111111111111111111111112",
                output_mint="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                amount=1_000_000_000
            )
            return result
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            print(f"Attempt {attempt + 1} failed: {e}")
            import time
            time.sleep(2 ** attempt)  # Exponential backoff

if __name__ == "__main__":
    # Run examples
    print("Example 1: Get Quote")
    example_get_quote()
    
    print("\nExample 2: Check Balance")
    example_check_balance()
    
    # Uncomment to execute swaps (requires wallet with funds)
    # print("\nExample 3: Execute Swap")
    # example_execute_swap()

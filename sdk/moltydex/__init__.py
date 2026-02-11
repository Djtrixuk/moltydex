"""
MoltyDEX Python SDK - x402 token aggregator for AI agents on Solana.

Zero fees, best prices via Jupiter aggregator.

Usage:
    from moltydex import MoltyDEX

    dex = MoltyDEX(
        api_url="https://api.moltydex.com",
        wallet_path="~/.config/solana/id.json",
    )

    # Get a swap quote
    quote = dex.quote(
        token_in="So11111111111111111111111111111111111111112",   # SOL
        token_out="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", # USDC
        amount_in=100_000_000,  # 0.1 SOL
    )
    print(f"Output: {quote['output_after_fee']} USDC")
"""

__version__ = "1.0.0"

from .client import MoltyDEX

__all__ = ["MoltyDEX"]

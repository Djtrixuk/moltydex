# MoltyDEX AutoGPT Plugin

Add x402 payment handling to your AutoGPT agents with this easy-to-use plugin.

## What is MoltyDEX?

MoltyDEX is a DEX aggregator built specifically for x402 payments. It automatically swaps tokens when agents receive 402 Payment Required responses, making x402 adoption seamless for AI agents.

## Installation

1. Copy this plugin to your AutoGPT `plugins` directory
2. Install dependencies: `pip install moltydex requests`
3. Configure your wallet in `config.yaml`

## Quick Start

```python
# In your AutoGPT agent configuration
plugins:
  - moltydex_plugin

# The plugin automatically handles 402 responses
```

## Features

✅ **Automatic 402 Handling** - No manual intervention needed  
✅ **Token Swapping** - Automatically swaps tokens when required  
✅ **Balance Checking** - Checks balances before payment  
✅ **AutoGPT Native** - Works seamlessly with AutoGPT  
✅ **Error Handling** - Comprehensive error handling and retries  

## How It Works

1. Your AutoGPT agent makes a request to an x402-protected API
2. Plugin detects 402 Payment Required response
3. MoltyDEX automatically swaps tokens if needed
4. Payment is made automatically
5. Original request is retried with payment proof

## Configuration

```yaml
moltydex:
  wallet_path: "wallet.json"
  api_url: "https://api.moltydex.com"
  default_slippage: 50  # 0.5%
```

## Example Usage

```python
from moltydex_autogpt import MoltyDEXPlugin

plugin = MoltyDEXPlugin(config)
# Plugin automatically intercepts 402 responses
```

## Resources

- **MoltyDEX Website**: https://www.moltydex.com
- **MoltyDEX Docs**: https://www.moltydex.com/developers
- **x402 Example**: https://github.com/Djtrixuk/moltydex-x402-example
- **AutoGPT Docs**: https://docs.agpt.co

## License

MIT

## Contributing

Contributions welcome! Open an issue or submit a PR.

---

Built with ❤️ for the AutoGPT and x402 communities

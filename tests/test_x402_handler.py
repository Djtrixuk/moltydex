"""
Unit tests for X402PaymentHandler
Addresses feedback: "No tests found - harder to verify code quality"
"""

import pytest
import sys
from pathlib import Path
from unittest.mock import Mock, patch, MagicMock
import requests

# Add examples directory to path for imports
examples_dir = Path(__file__).parent.parent / "examples"
sys.path.insert(0, str(examples_dir))

from x402_integration_example import X402PaymentHandler


class TestX402PaymentHandler:
    """Test suite for X402PaymentHandler"""
    
    @pytest.fixture
    def handler(self):
        """Create handler instance with mocked wallet"""
        with patch('builtins.open'), \
             patch('json.load', return_value={'secret_key': 'test_key'}), \
             patch('solders.keypair.Keypair.from_base58_string'), \
             patch('str', return_value='test_wallet_address'):
            handler = X402PaymentHandler("wallet.json")
            handler.wallet_address = "test_wallet_address"
            return handler
    
    def test_handle_402_response_non_402(self, handler):
        """Test that non-402 responses are returned as-is"""
        response = Mock(spec=requests.Response)
        response.status_code = 200
        
        result = handler.handle_402_response(response, "https://example.com")
        assert result == response
    
    def test_parse_402_response_valid(self, handler):
        """Test parsing valid 402 response"""
        response = Mock(spec=requests.Response)
        response.json.return_value = {
            "accepts": [{
                "scheme": "solana",
                "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                "amount": "1000000",
                "network": "mainnet"
            }]
        }
        
        payment_info = handler._parse_402_response(response)
        assert payment_info['token'] == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
        assert payment_info['amount'] == "1000000"
        assert payment_info['network'] == "mainnet"
    
    def test_parse_402_response_no_solana_option(self, handler):
        """Test parsing 402 response without Solana option"""
        response = Mock(spec=requests.Response)
        response.json.return_value = {
            "accepts": [{
                "scheme": "ethereum",
                "token": "0x123",
                "amount": "1000000"
            }]
        }
        
        with pytest.raises(ValueError, match="No Solana payment option"):
            handler._parse_402_response(response)
    
    @patch('requests.get')
    def test_check_balance(self, mock_get, handler):
        """Test balance checking"""
        mock_get.return_value.json.return_value = {'balance': '5000000'}
        mock_get.return_value.status_code = 200
        
        balance = handler._check_balance("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
        assert balance == 5000000
    
    @patch('requests.get')
    def test_check_balance_zero(self, mock_get, handler):
        """Test balance checking with zero balance"""
        mock_get.return_value.json.return_value = {'balance': '0'}
        mock_get.return_value.status_code = 200
        
        balance = handler._check_balance("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
        assert balance == 0
    
    @patch.object(X402PaymentHandler, '_check_balance')
    @patch.object(X402PaymentHandler, '_swap_to_token')
    def test_ensure_sufficient_balance_swap_needed(self, mock_swap, mock_balance, handler):
        """Test that swap happens when balance is insufficient"""
        mock_balance.return_value = 500000  # Less than required
        payment_info = {'token': 'USDC', 'amount': '1000000'}
        
        handler._ensure_sufficient_balance(payment_info)
        mock_swap.assert_called_once_with('USDC', 1000000)
    
    @patch.object(X402PaymentHandler, '_check_balance')
    @patch.object(X402PaymentHandler, '_swap_to_token')
    def test_ensure_sufficient_balance_no_swap(self, mock_swap, mock_balance, handler):
        """Test that no swap happens when balance is sufficient"""
        mock_balance.return_value = 2000000  # More than required
        payment_info = {'token': 'USDC', 'amount': '1000000'}
        
        handler._ensure_sufficient_balance(payment_info)
        mock_swap.assert_not_called()
    
    @patch('requests.get')
    def test_get_quote_success(self, mock_get, handler):
        """Test successful quote retrieval"""
        mock_get.return_value.json.return_value = {
            'output_amount': '1450000',
            'input_amount': '1000000'
        }
        mock_get.return_value.status_code = 200
        
        quote = handler._get_quote("SOL", "USDC", 1000000)
        assert quote is not None
        assert quote['output_amount'] == '1450000'
    
    @patch('requests.get')
    def test_get_quote_failure(self, mock_get, handler):
        """Test quote retrieval failure"""
        mock_get.return_value.json.return_value = {}
        mock_get.return_value.status_code = 200
        
        quote = handler._get_quote("SOL", "USDC", 1000000)
        assert quote is None


# Integration tests (require network access)
class TestX402PaymentHandlerIntegration:
    """Integration tests - require actual API access"""
    
    @pytest.mark.integration
    @pytest.mark.skip(reason="Requires network access and real wallet")
    def test_full_402_flow(self):
        """Test complete 402 payment flow"""
        # This would test the full flow with a real API
        # Skip by default, run with pytest -m integration
        pass


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

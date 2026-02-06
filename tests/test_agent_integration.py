"""
Agent Integration Tests for MoltyDEX
Tests how AI agents use MoltyDEX for x402 payments

These tests simulate real agent workflows:
- LangChain agents
- AutoGPT agents
- Custom Python agents
- TypeScript agents
"""

import pytest
import sys
from pathlib import Path
from unittest.mock import Mock, patch, MagicMock, call
import requests
import json

# Add examples directory to path
examples_dir = Path(__file__).parent.parent / "examples"
sys.path.insert(0, str(examples_dir))

# Mock solana imports before loading module (for unit tests)
sys.modules['solana'] = MagicMock()
sys.modules['solana.rpc'] = MagicMock()
sys.modules['solana.rpc.api'] = MagicMock()
sys.modules['solders'] = MagicMock()
sys.modules['solders.keypair'] = MagicMock()
sys.modules['solders.transaction'] = MagicMock()

# Import module with hyphen in filename using importlib
import importlib.util
spec = importlib.util.spec_from_file_location(
    "x402_integration_example",
    examples_dir / "x402-integration-example.py"
)
x402_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(x402_module)
X402PaymentHandler = x402_module.X402PaymentHandler


class TestAgentWorkflows:
    """Test agent workflows and integration patterns"""
    
    @pytest.fixture
    def handler(self):
        """Create handler instance with mocked wallet"""
        mock_keypair = MagicMock()
        mock_keypair.pubkey.return_value = MagicMock()
        mock_keypair.pubkey.return_value.__str__ = lambda x: 'test_wallet_address'
        
        with patch('builtins.open'), \
             patch('json.load', return_value={'secret_key': 'test_key'}), \
             patch('solders.keypair.Keypair.from_base58_string', return_value=mock_keypair):
            handler = X402PaymentHandler("wallet.json")
            handler.wallet_address = "test_wallet_address"
            return handler
    
    @pytest.fixture
    def mock_402_response(self):
        """Create a mock 402 Payment Required response"""
        response = Mock(spec=requests.Response)
        response.status_code = 402
        response.json.return_value = {
            "accepts": [{
                "scheme": "solana",
                "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",  # USDC
                "amount": "1000000",  # 1 USDC
                "network": "mainnet"
            }]
        }
        return response
    
    def test_agent_receives_402_and_handles_automatically(self, handler, mock_402_response):
        """Test: Agent receives 402, MoltyDEX handles it automatically"""
        # Mock successful balance check (has enough)
        with patch.object(handler, '_check_balance', return_value=2000000), \
             patch.object(handler, '_make_payment', return_value='payment_signature'), \
             patch('requests.get') as mock_get:
            
            # Mock successful retry after payment
            mock_get.return_value.status_code = 200
            mock_get.return_value.json.return_value = {'data': 'success'}
            
            # Agent workflow: receive 402 → handle automatically
            result = handler.handle_402_response(mock_402_response, "https://api.example.com/data")
            
            # Verify agent got successful response
            assert result.status_code == 200
            assert result.json() == {'data': 'success'}
    
    def test_agent_swaps_tokens_when_insufficient_balance(self, handler, mock_402_response):
        """Test: Agent has SOL but needs USDC, swap happens automatically"""
        # Mock insufficient balance
        with patch.object(handler, '_check_balance', return_value=500000), \
             patch.object(handler, '_swap_to_token') as mock_swap, \
             patch.object(handler, '_make_payment', return_value='payment_signature'), \
             patch('requests.get') as mock_get:
            
            mock_get.return_value.status_code = 200
            mock_get.return_value.json.return_value = {'data': 'success'}
            
            # Agent workflow: 402 → insufficient balance → swap → pay → success
            result = handler.handle_402_response(mock_402_response, "https://api.example.com/data")
            
            # Verify swap was called
            mock_swap.assert_called_once()
            # Verify final response is successful
            assert result.status_code == 200
    
    def test_agent_handles_multiple_402_responses(self, handler):
        """Test: Agent makes multiple API calls, handles multiple 402s"""
        # First 402 response
        response1 = Mock(spec=requests.Response)
        response1.status_code = 402
        response1.json.return_value = {
            "accepts": [{
                "scheme": "solana",
                "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                "amount": "1000000"
            }]
        }
        
        # Second 402 response (different amount)
        response2 = Mock(spec=requests.Response)
        response2.status_code = 402
        response2.json.return_value = {
            "accepts": [{
                "scheme": "solana",
                "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                "amount": "2000000"
            }]
        }
        
        with patch.object(handler, '_check_balance', return_value=5000000), \
             patch.object(handler, '_make_payment', return_value='payment_sig'), \
             patch('requests.get') as mock_get:
            
            mock_get.return_value.status_code = 200
            mock_get.return_value.json.return_value = {'data': 'success'}
            
            # Agent makes multiple calls
            result1 = handler.handle_402_response(response1, "https://api.example.com/call1")
            result2 = handler.handle_402_response(response2, "https://api.example.com/call2")
            
            # Both should succeed
            assert result1.status_code == 200
            assert result2.status_code == 200
            assert mock_get.call_count == 2
    
    def test_agent_handles_different_tokens(self, handler):
        """Test: Agent handles payments in different tokens (USDC, USDT, SOL)"""
        tokens = [
            ("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "USDC"),
            ("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", "USDT"),
            ("So11111111111111111111111111111111111111112", "SOL")
        ]
        
        for token_address, token_name in tokens:
            response = Mock(spec=requests.Response)
            response.status_code = 402
            response.json.return_value = {
                "accepts": [{
                    "scheme": "solana",
                    "token": token_address,
                    "amount": "1000000"
                }]
            }
            
            with patch.object(handler, '_check_balance', return_value=2000000), \
                 patch.object(handler, '_make_payment', return_value='payment_sig'), \
                 patch('requests.get') as mock_get:
                
                mock_get.return_value.status_code = 200
                mock_get.return_value.json.return_value = {'data': 'success'}
                
                result = handler.handle_402_response(response, f"https://api.example.com/{token_name}")
                
                assert result.status_code == 200
                # Verify correct token was checked
                handler._check_balance.assert_called_with(token_address)


class TestLangChainIntegration:
    """Test LangChain agent integration patterns"""
    
    @pytest.fixture
    def handler(self):
        """Create handler instance"""
        mock_keypair = MagicMock()
        mock_keypair.pubkey.return_value = MagicMock()
        mock_keypair.pubkey.return_value.__str__ = lambda x: 'test_wallet_address'
        
        with patch('builtins.open'), \
             patch('json.load', return_value={'secret_key': 'test_key'}), \
             patch('solders.keypair.Keypair.from_base58_string', return_value=mock_keypair):
            handler = X402PaymentHandler("wallet.json")
            handler.wallet_address = "test_wallet_address"
            return handler
    
    def test_langchain_agent_uses_moltydex_for_api_calls(self, handler):
        """Test: LangChain agent wraps API calls with MoltyDEX handler"""
        # Simulate LangChain agent making API call
        api_url = "https://premium-api.com/langchain-tool"
        
        # Mock 402 response from API
        mock_response = Mock(spec=requests.Response)
        mock_response.status_code = 402
        mock_response.json.return_value = {
            "accepts": [{
                "scheme": "solana",
                "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                "amount": "1000000"
            }]
        }
        
        with patch('requests.get', side_effect=[mock_response]) as mock_get, \
             patch.object(handler, '_check_balance', return_value=2000000), \
             patch.object(handler, '_make_payment', return_value='payment_sig'):
            
            # After payment, second call succeeds
            success_response = Mock(spec=requests.Response)
            success_response.status_code = 200
            success_response.json.return_value = {'result': 'tool_output'}
            mock_get.side_effect = [mock_response, success_response]
            
            # LangChain agent workflow
            initial_response = requests.get(api_url)
            if initial_response.status_code == 402:
                final_response = handler.handle_402_response(initial_response, api_url)
            else:
                final_response = initial_response
            
            # Verify LangChain agent got the data
            assert final_response.status_code == 200
            assert final_response.json() == {'result': 'tool_output'}


class TestAutoGPTIntegration:
    """Test AutoGPT agent integration patterns"""
    
    @pytest.fixture
    def handler(self):
        """Create handler instance"""
        mock_keypair = MagicMock()
        mock_keypair.pubkey.return_value = MagicMock()
        mock_keypair.pubkey.return_value.__str__ = lambda x: 'test_wallet_address'
        
        with patch('builtins.open'), \
             patch('json.load', return_value={'secret_key': 'test_key'}), \
             patch('solders.keypair.Keypair.from_base58_string', return_value=mock_keypair):
            handler = X402PaymentHandler("wallet.json")
            handler.wallet_address = "test_wallet_address"
            return handler
    
    def test_autogpt_agent_handles_402_in_plugin(self, handler):
        """Test: AutoGPT plugin uses MoltyDEX for x402 payments"""
        # Simulate AutoGPT making API call through plugin
        plugin_api_url = "https://api.autogpt-plugin.com/execute"
        
        mock_402 = Mock(spec=requests.Response)
        mock_402.status_code = 402
        mock_402.json.return_value = {
            "accepts": [{
                "scheme": "solana",
                "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                "amount": "1000000"
            }]
        }
        
        with patch('requests.get', side_effect=[mock_402]) as mock_get, \
             patch.object(handler, '_check_balance', return_value=2000000), \
             patch.object(handler, '_make_payment', return_value='payment_sig'):
            
            success_response = Mock(spec=requests.Response)
            success_response.status_code = 200
            success_response.json.return_value = {'action': 'completed', 'result': 'task_done'}
            mock_get.side_effect = [mock_402, success_response]
            
            # AutoGPT plugin workflow
            response = requests.get(plugin_api_url)
            if response.status_code == 402:
                response = handler.handle_402_response(response, plugin_api_url)
            
            # Verify AutoGPT got successful response
            assert response.status_code == 200
            assert response.json()['action'] == 'completed'


class TestErrorHandling:
    """Test error handling in agent workflows"""
    
    @pytest.fixture
    def handler(self):
        """Create handler instance"""
        mock_keypair = MagicMock()
        mock_keypair.pubkey.return_value = MagicMock()
        mock_keypair.pubkey.return_value.__str__ = lambda x: 'test_wallet_address'
        
        with patch('builtins.open'), \
             patch('json.load', return_value={'secret_key': 'test_key'}), \
             patch('solders.keypair.Keypair.from_base58_string', return_value=mock_keypair):
            handler = X402PaymentHandler("wallet.json")
            handler.wallet_address = "test_wallet_address"
            return handler
    
    def test_agent_handles_no_solana_payment_option(self, handler):
        """Test: Agent receives 402 but no Solana option"""
        response = Mock(spec=requests.Response)
        response.status_code = 402
        response.json.return_value = {
            "accepts": [{
                "scheme": "ethereum",
                "token": "0x123",
                "amount": "1000000"
            }]
        }
        
        # Should raise ValueError
        with pytest.raises(ValueError, match="No Solana payment option"):
            handler.handle_402_response(response, "https://api.example.com")
    
    def test_agent_handles_swap_failure(self, handler):
        """Test: Agent handles swap failure gracefully"""
        response = Mock(spec=requests.Response)
        response.status_code = 402
        response.json.return_value = {
            "accepts": [{
                "scheme": "solana",
                "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                "amount": "1000000"
            }]
        }
        
        # Mock swap failure
        with patch.object(handler, '_check_balance', return_value=500000), \
             patch.object(handler, '_swap_to_token', side_effect=RuntimeError("Swap failed")):
            
            # Should raise error
            with pytest.raises(RuntimeError, match="Swap failed"):
                handler.handle_402_response(response, "https://api.example.com")
    
    def test_agent_handles_api_timeout(self, handler):
        """Test: Agent handles API timeout during balance check"""
        response = Mock(spec=requests.Response)
        response.status_code = 402
        response.json.return_value = {
            "accepts": [{
                "scheme": "solana",
                "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                "amount": "1000000"
            }]
        }
        
        # Mock timeout
        with patch.object(handler, '_check_balance', side_effect=requests.Timeout("API timeout")):
            # Should propagate timeout error
            with pytest.raises(requests.Timeout):
                handler.handle_402_response(response, "https://api.example.com")


class TestPerformance:
    """Test performance characteristics for agent usage"""
    
    @pytest.fixture
    def handler(self):
        """Create handler instance"""
        mock_keypair = MagicMock()
        mock_keypair.pubkey.return_value = MagicMock()
        mock_keypair.pubkey.return_value.__str__ = lambda x: 'test_wallet_address'
        
        with patch('builtins.open'), \
             patch('json.load', return_value={'secret_key': 'test_key'}), \
             patch('solders.keypair.Keypair.from_base58_string', return_value=mock_keypair):
            handler = X402PaymentHandler("wallet.json")
            handler.wallet_address = "test_wallet_address"
            return handler
    
    def test_agent_handles_rapid_402_responses(self, handler):
        """Test: Agent can handle multiple 402s quickly"""
        responses = []
        for i in range(5):
            resp = Mock(spec=requests.Response)
            resp.status_code = 402
            resp.json.return_value = {
                "accepts": [{
                    "scheme": "solana",
                    "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                    "amount": str(1000000 + i * 100000)
                }]
            }
            responses.append(resp)
        
        with patch.object(handler, '_check_balance', return_value=10000000), \
             patch.object(handler, '_make_payment', return_value='payment_sig'), \
             patch('requests.get') as mock_get:
            
            mock_get.return_value.status_code = 200
            mock_get.return_value.json.return_value = {'data': 'success'}
            
            # Process all 402s
            results = []
            for resp in responses:
                result = handler.handle_402_response(resp, f"https://api.example.com/call{len(results)}")
                results.append(result)
            
            # All should succeed
            assert len(results) == 5
            assert all(r.status_code == 200 for r in results)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

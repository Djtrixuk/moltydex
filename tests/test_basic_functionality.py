"""
Basic functionality tests - No pytest required
Tests that the refactored code maintains the same functionality
"""

import sys
from pathlib import Path

# Add examples directory to path
examples_dir = Path(__file__).parent.parent / "examples"
sys.path.insert(0, str(examples_dir))

def test_import():
    """Test that the module imports correctly"""
    try:
        import importlib.util
        spec = importlib.util.spec_from_file_location('x402_handler', examples_dir / 'x402-integration-example.py')
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        handler_class = module.X402PaymentHandler
        print("✅ Import successful")
        return True, handler_class
    except Exception as e:
        print(f"❌ Import failed: {e}")
        return False, None

def test_class_structure():
    """Test that the class has all required methods"""
    try:
        import importlib.util
        spec = importlib.util.spec_from_file_location('x402_handler', examples_dir / 'x402-integration-example.py')
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        X402PaymentHandler = module.X402PaymentHandler
        
        # Check main method exists
        assert hasattr(X402PaymentHandler, 'handle_402_response'), "Missing handle_402_response"
        
        # Check refactored methods exist
        assert hasattr(X402PaymentHandler, '_parse_402_response'), "Missing _parse_402_response"
        assert hasattr(X402PaymentHandler, '_ensure_sufficient_balance'), "Missing _ensure_sufficient_balance"
        assert hasattr(X402PaymentHandler, '_swap_to_token'), "Missing _swap_to_token"
        assert hasattr(X402PaymentHandler, '_pay_and_retry'), "Missing _pay_and_retry"
        assert hasattr(X402PaymentHandler, '_check_balance'), "Missing _check_balance"
        assert hasattr(X402PaymentHandler, '_swap_tokens'), "Missing _swap_tokens"
        assert hasattr(X402PaymentHandler, '_get_quote'), "Missing _get_quote"
        assert hasattr(X402PaymentHandler, '_execute_swap'), "Missing _execute_swap"
        assert hasattr(X402PaymentHandler, '_build_swap'), "Missing _build_swap"
        assert hasattr(X402PaymentHandler, '_sign_and_send'), "Missing _sign_and_send"
        assert hasattr(X402PaymentHandler, '_wait_for_confirmation'), "Missing _wait_for_confirmation"
        assert hasattr(X402PaymentHandler, '_make_payment'), "Missing _make_payment"
        
        print("✅ All required methods exist")
        return True
    except AssertionError as e:
        print(f"❌ Structure test failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Structure test error: {e}")
        return False

def test_method_signatures():
    """Test that method signatures are correct"""
    try:
        import inspect
        import importlib.util
        spec = importlib.util.spec_from_file_location('x402_handler', examples_dir / 'x402-integration-example.py')
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        X402PaymentHandler = module.X402PaymentHandler
        
        # Check handle_402_response signature
        sig = inspect.signature(X402PaymentHandler.handle_402_response)
        params = list(sig.parameters.keys())
        assert 'response' in params, "handle_402_response missing 'response' parameter"
        assert 'original_request_url' in params, "handle_402_response missing 'original_request_url' parameter"
        
        # Check return type annotation
        assert sig.return_annotation != inspect.Signature.empty, "handle_402_response missing return type"
        
        print("✅ Method signatures correct")
        return True
    except Exception as e:
        print(f"❌ Signature test failed: {e}")
        return False

if __name__ == "__main__":
    print("\n🧪 Testing refactored code...\n")
    
    results = []
    import_result, handler_class = test_import()
    results.append(("Import", import_result))
    
    if import_result:
        results.append(("Structure", test_class_structure()))
        results.append(("Signatures", test_method_signatures()))
    else:
        results.append(("Structure", False))
        results.append(("Signatures", False))
    
    print("\n" + "="*50)
    print("Test Results:")
    print("="*50)
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{name}: {status}")
    
    all_passed = all(result for _, result in results)
    print("="*50)
    if all_passed:
        print("✅ All tests passed! Refactored code is structurally correct.")
    else:
        print("❌ Some tests failed. Check errors above.")
    print("="*50 + "\n")

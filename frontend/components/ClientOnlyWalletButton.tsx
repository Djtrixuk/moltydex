import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { trackEvent } from '../lib/analytics';

/**
 * Renders WalletMultiButton only on the client to avoid hydration mismatch.
 * The wallet adapter renders different HTML on server vs client (icon, address).
 */
export default function ClientOnlyWalletButton() {
  const [mounted, setMounted] = useState(false);
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track wallet connection/disconnection
  useEffect(() => {
    if (!mounted) return;
    if (connected && publicKey) {
      trackEvent('wallet_connect', {
        wallet: publicKey.toString().slice(0, 8),
      });
    } else if (!connected) {
      trackEvent('wallet_disconnect');
    }
  }, [connected, publicKey, mounted]);

  if (!mounted) {
    return (
      <div className="h-10 w-40 rounded-lg bg-white/10 animate-pulse" aria-label="Loading wallet button" />
    );
  }

  return <WalletMultiButton />;
}

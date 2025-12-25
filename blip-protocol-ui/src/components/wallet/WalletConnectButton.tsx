import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";

export const WalletConnectButton = () => {
  const { publicKey, disconnect, connected, connecting, wallet } = useWallet();
  const { setVisible } = useWalletModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log("🔍 Wallet Button State:", {
      connected,
      connecting,
      hasPublicKey: !!publicKey,
      publicKey: publicKey?.toBase58(),
      walletName: wallet?.adapter.name,
    });

    if (connected && publicKey) {
      console.log("✅ Wallet connected successfully:", publicKey.toBase58());
    } else if (connected && !publicKey) {
      console.error("⚠️ Wallet connected but no public key available!");
    }
  }, [connected, publicKey, connecting, wallet]);

  if (!mounted) return null;

  const handleClick = async () => {
    if (connected) {
      console.log("Disconnecting wallet...");
      await disconnect();
    } else {
      console.log("Opening wallet modal...");
      setVisible(true);
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <button
      onClick={handleClick}
      disabled={connecting}
      className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 text-white text-sm hover:border-[#2BFF88] hover:shadow-[0_0_15px_rgba(43,255,136,0.3)] transition-all bg-black/40 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Wallet className="w-4 h-4" />
      <span>
        {connecting
          ? "Connecting..."
          : connected && publicKey
          ? shortenAddress(publicKey.toBase58())
          : "Connect Wallet"}
      </span>
    </button>
  );
};

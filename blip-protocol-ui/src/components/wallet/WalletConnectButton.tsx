import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { isMobile, isPhantomInstalled, getPhantomDeepLink } from "@/utils/mobile";

export const WalletConnectButton = () => {
  const { publicKey, disconnect, connected, connecting, wallet } = useWallet();
  const { setVisible } = useWalletModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  if (!mounted) return null;

  const handleClick = async () => {
    if (connected) {
      await disconnect();
    } else if (isMobile() && !isPhantomInstalled()) {
      window.location.href = getPhantomDeepLink();
    } else {
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
      className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 text-white text-sm hover:border-black/[0.12]  transition-all bg-black/40 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
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

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useAuth } from "@/contexts/AuthContext";
import { Wallet, Loader2, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import {
  isMobile,
  isPhantomInstalled,
  getPhantomDeepLink,
} from "@/utils/mobile";
import { toast } from "sonner";

interface MerchantWalletButtonProps {
  isDark: boolean;
}

export function MerchantWalletButton({ isDark }: MerchantWalletButtonProps) {
  const { publicKey, disconnect, connected, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const d = isDark;
  const chip = d
    ? "bg-white/5 border-white/10"
    : "bg-[#F5F3F0] border-black/[0.08]";
  const hov = d ? "hover:bg-white/10" : "hover:bg-black/[0.05]";
  const muted = d ? "text-white/60" : "text-black/60";
  const sub = d ? "text-white/40" : "text-black/40";

  const shortenAddress = (address: string) =>
    `${address.slice(0, 4)}...${address.slice(-4)}`;

  const handleClick = async () => {
    try {
      if (connected) {
        await disconnect();
        toast.success("Wallet disconnected");
      } else if (isMobile() && !isPhantomInstalled()) {
        window.location.href = getPhantomDeepLink();
      } else {
        setVisible(true);
      }
    } catch (error: any) {
      if (error?.name === "WalletNotReadyError") {
        toast.error("Wallet not found. Please install Phantom or Solflare.");
      } else {
        toast.error("Failed to connect wallet. Please try again.");
      }
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering disconnect

    if (!publicKey) return;

    try {
      await navigator.clipboard.writeText(publicKey.toBase58());
      toast.success("Wallet address copied");
    } catch {
      toast.error("Failed to copy address");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={connecting}
      className={`flex items-center gap-2 ${chip} border px-3 py-1.5 rounded-full text-[11px] font-bold cursor-pointer ${hov} transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {connecting ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span className={muted}>Connecting...</span>
        </>
      ) : connected && publicKey ? (
        <>
          <div
            className={`w-2 h-2 rounded-full ${
              user?.walletLinked
                ? "bg-emerald-500"
                : "bg-amber-500 animate-pulse"
            }`}
          />
          <Wallet className={`w-3.5 h-3.5 ${muted}`} />
          <span className={muted}>{shortenAddress(publicKey.toBase58())}</span>

          <button
            onClick={handleCopy}
            className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition"
            title="Copy wallet address"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </>
      ) : (
        <>
          <Wallet className={`w-3.5 h-3.5 ${sub}`} />
          <span className={sub}>Connect Wallet</span>
        </>
      )}
    </button>
  );
}

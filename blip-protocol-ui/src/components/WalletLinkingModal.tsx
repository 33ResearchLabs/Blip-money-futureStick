import { useState } from "react";
import { X, Wallet, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface WalletLinkingModalProps {
  isOpen: boolean;
  onClose?: () => void;
  required?: boolean;
}

export default function WalletLinkingModal({
  isOpen,
  onClose,
  required = true,
}: WalletLinkingModalProps) {
  const { publicKey, connected } = useWallet();
  const { linkWallet, user } = useAuth();
  const [isLinking, setIsLinking] = useState(false);
  const [linked, setLinked] = useState(false);

  if (!isOpen) return null;

  const handleLinkWallet = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsLinking(true);

    try {
      await linkWallet(publicKey.toBase58());
      setLinked(true);
      toast.success("Wallet linked successfully!");

      // Close modal after 2 seconds
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    } catch (error: any) {
      console.error("Wallet linking error:", error);
      const message = error.response?.data?.message || "Failed to link wallet";
      toast.error(message);
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-sm shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative p-6 border-b border-black/10 dark:border-white/10">
          {!required && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-black dark:text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black dark:text-white">
                Connect Your Wallet
              </h2>
              <p className="text-sm text-black/60 dark:text-white/60">
                {required ? "Required to continue" : "Link your Solana wallet"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-sm p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-black dark:text-white mb-1">
                  Why do I need to link my wallet?
                </p>
                <ul className="text-black/60 dark:text-white/60 space-y-1 list-disc list-inside">
                  <li>Receive rewards and BLIP points</li>
                  <li>Participate in protocol activities</li>
                  <li>Access all dashboard features</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Wallet Connection Status */}
          <div className="space-y-3">
            <div className={`p-4 border rounded-sm flex items-center justify-between ${
              connected
                ? "bg-green-500/10 border-green-500/20"
                : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  connected ? "bg-green-500/20" : "bg-black/10 dark:bg-white/10"
                }`}>
                  {connected ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Wallet className="w-5 h-5 text-black/40 dark:text-white/40" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-black dark:text-white">
                    {connected ? "Wallet Connected" : "Connect Wallet"}
                  </p>
                  {connected && publicKey && (
                    <p className="text-xs text-black/60 dark:text-white/60 font-mono">
                      {publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-8)}
                    </p>
                  )}
                </div>
              </div>
              {!connected && (
                <div className="wallet-adapter-button-trigger">
                  <WalletMultiButton />
                </div>
              )}
            </div>

            {/* Link Button */}
            {connected && !linked && (
              <button
                onClick={handleLinkWallet}
                disabled={isLinking}
                className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-sm hover:bg-black/90 dark:hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isLinking ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Linking Wallet...
                  </>
                ) : (
                  "Link Wallet to Account"
                )}
              </button>
            )}

            {/* Success State */}
            {linked && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-sm p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div className="text-sm">
                    <p className="font-medium text-black dark:text-white">
                      Wallet Linked Successfully!
                    </p>
                    <p className="text-black/60 dark:text-white/60">
                      You now have full access to all features
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Warning for required mode */}
          {required && !linked && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-sm p-3">
              <p className="text-xs text-black/60 dark:text-white/60 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                You must link a wallet to access the dashboard features
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {!required && !linked && (
          <div className="p-4 border-t border-black/10 dark:border-white/10 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-black/20 dark:border-white/20 text-black dark:text-white font-medium rounded-sm hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              Skip for Now
            </button>
          </div>
        )}
      </div>

      {/* Wallet Adapter Styles Override */}
      <style>{`
        .wallet-adapter-button-trigger .wallet-adapter-button {
          background: transparent !important;
          border: 1px solid rgba(0, 0, 0, 0.1) !important;
          color: #000 !important;
          font-size: 0.875rem !important;
          padding: 0.5rem 1rem !important;
          height: auto !important;
          border-radius: 0.125rem !important;
        }

        .dark .wallet-adapter-button-trigger .wallet-adapter-button {
          border-color: rgba(255, 255, 255, 0.1) !important;
          color: #fff !important;
        }

        .wallet-adapter-button-trigger .wallet-adapter-button:hover {
          background: rgba(0, 0, 0, 0.05) !important;
        }

        .dark .wallet-adapter-button-trigger .wallet-adapter-button:hover {
          background: rgba(255, 255, 255, 0.05) !important;
        }
      `}</style>
    </div>
  );
}

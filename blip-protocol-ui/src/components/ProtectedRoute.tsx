import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { connected, publicKey, connecting } = useWallet();
  const [walletChecked, setWalletChecked] = useState(false);

  // Wait for wallet to finish initializing before making decisions
  // Wallet adapter auto-reconnects on page refresh, but takes time
  useEffect(() => {
    // If wallet is connecting, wait
    if (connecting) {
      setWalletChecked(false);
      return;
    }

    // Give wallet adapter a moment to auto-reconnect on page refresh
    const timer = setTimeout(() => {
      setWalletChecked(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [connecting, connected]);

  // Show loading while auth is loading OR wallet is still connecting/initializing
  if (isLoading || connecting || !walletChecked) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#39ff14] animate-spin" />
          <p className="text-zinc-400 text-sm">
            {isLoading ? "Checking authentication..." : "Connecting wallet..."}
          </p>
        </div>
      </div>
    );
  }

  // Check if user session exists
  if (!isAuthenticated) {
    console.log("🚫 Not authenticated, redirecting to /waitlist");
    return <Navigate to="/waitlist" replace />;
  }

  // Check if wallet is connected and matches user
  if (!connected || !publicKey) {
    console.log("🚫 Wallet not connected, redirecting to /waitlist");
    return <Navigate to="/waitlist" replace />;
  }

  // Verify wallet address matches user
  if (user && user.wallet_address !== publicKey.toBase58()) {
    console.log("🚫 Wallet mismatch, redirecting to /waitlist");
    return <Navigate to="/waitlist" replace />;
  }

  return <>{children}</>;
};

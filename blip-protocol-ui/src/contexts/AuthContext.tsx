import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { api } from "@/services/api"; // axios instance withCredentials:true

type Role = "USER" | "ADMIN" | "MERCHANT" | "SUPERADMIN";

interface User {
  id: string;
  userName?: string;
  email: string;
  wallet_address?: string;
  phone?: string;
  referralCode?: string;
  totalBlipPoints: number;
  status?: string;
  role?: Role;
  // Additive: one user can hold multiple roles. Empty/missing → fall back to `role`.
  roles?: Role[];
  twoFactorEnabled?: boolean;
  emailVerified: boolean;
  walletLinked: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  linkWallet: (walletAddress: string) => Promise<void>;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
  updatePoints: (pointsToAdd: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { publicKey, connected } = useWallet();
  const hasLoadedOnce = useRef(false);

  /**
   * 🔄 Verify session using cookies
   * Backend reads httpOnly cookie and returns user
   */
  const refreshSession = useCallback(async () => {
    try {
      // Only set isLoading on initial load (first time)
      // This prevents ProtectedRoute from unmounting Dashboard
      // when manually refreshing points
      if (!hasLoadedOnce.current) {
        setIsLoading(true);
      }

      // api.get returns response.data due to interceptor (see api.ts line 27)
      const response: any = await api.get("/user/me", {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      }); // cookie auto-sent

      if (response?.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
      hasLoadedOnce.current = true;
    }
  }, []);

  /**
   * ✅ Check session on app load
   */
  useEffect(() => {
    refreshSession();
  }, []);

  /**
   * 🔐 Wallet ↔ session consistency check (OPTIONAL)
   * Since wallet is now optional, we only verify if both wallet and user.wallet_address exist
   */
  useEffect(() => {
    // If wallet is connected and user has a linked wallet, verify addresses match
    if (connected && publicKey && user?.wallet_address && user.walletLinked) {
      if (user.wallet_address !== publicKey.toBase58()) {
        // Wallet switched — user can manually relink in settings
      }
    }
  }, [connected, publicKey, user]);

  /**
   * ✅ Called after successful backend login/signup
   * (cookie already set by backend)
   */
  const login = (userData: User) => {
    setUser(userData);
  };

  /**
   * 🔗 Link wallet to user account
   */
  const linkWallet = async (walletAddress: string) => {
    try {
      const response: any = await api.post("/auth/link-wallet", {
        wallet_address: walletAddress,
      });

      if (response?.user) {
        // Merge with existing user data to prevent losing fields like emailVerified
        setUser((prev) => (prev ? { ...prev, ...response.user } : response.user));
      }
    } catch (error) {
      throw error;
    }
  };

  /**
   * 🔢 Update points locally (instant UI update, no refresh)
   */
  const updatePoints = useCallback((pointsToAdd: number) => {
    setUser((prev) =>
      prev
        ? { ...prev, totalBlipPoints: (prev.totalBlipPoints || 0) + pointsToAdd }
        : prev
    );
  }, []);

  /**
   * 🚪 Logout (clears cookie on backend)
   */
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // logout error handled silently
    } finally {
      setUser(null);
    }
  };

  // User is authenticated if we have user data and not loading
  // Wallet connection is checked separately for protected routes
  const isAuthenticated = !!user && !isLoading;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        linkWallet,
        isLoading,
        refreshSession,
        updatePoints,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

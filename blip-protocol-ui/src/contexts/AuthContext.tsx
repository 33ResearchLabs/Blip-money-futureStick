import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { api } from "@/services/api"; // axios instance withCredentials:true

interface User {
  id: string;
  wallet_address: string;
  email?: string;
  phone?: string;
  referralCode?: string;
  totalBlipPoints: number;
  status?: string;
  role?: "USER" | "ADMIN";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { publicKey, connected } = useWallet();

  /**
   * 🔄 Verify session using cookies
   * Backend reads httpOnly cookie and returns user
   */
  const refreshSession = async () => {
    try {
      setIsLoading(true);

      // api.get returns response.data due to interceptor (see api.ts line 27)
      const response: any = await api.get("/user/me"); // cookie auto-sent

      if (response?.user) {
        console.log("✅ Session restored from cookie:", response.user);
        setUser(response.user);
      } else {
        console.log("❌ No session found");
        setUser(null);
      }
    } catch (error) {
      console.log("❌ Session refresh failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ✅ Check session on app load
   */
  useEffect(() => {
    refreshSession();
  }, []);

  /**
   * 🔐 Wallet ↔ session consistency check
   * Only clear user if wallet is connected but address doesn't match
   */
  useEffect(() => {
    // If wallet is connected and we have a user, verify addresses match
    if (connected && publicKey && user) {
      if (user.wallet_address !== publicKey.toBase58()) {
        console.warn("⚠️ Wallet mismatch, clearing session");
        setUser(null);
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
   * 🚪 Logout (clears cookie on backend)
   */
  const logout = async () => {
    try {
      console.log("🚪 Calling backend logout to clear HTTP-only cookie");
      await api.post("/user/logout");
      console.log("✅ Backend logout successful");
    } catch (error) {
      console.error("❌ Logout failed:", error);
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
        isLoading,
        refreshSession,
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

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
  wallet_address: string;
  email?: string;
  referral_code?: string;
  referralCode?: string;
  isNewUser?: boolean;
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
   */
  useEffect(() => {
    if (!connected || !publicKey) {
      setUser(null);
      return;
    }

    if (user && user.wallet_address !== publicKey.toBase58()) {
      console.warn("⚠️ Wallet mismatch, clearing session");
      setUser(null);
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

  const isAuthenticated = !!user && connected && !!publicKey && !isLoading;

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

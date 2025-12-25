import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

interface User {
  wallet_address: string;
  email?: string;
  referral_code?: string;
  isNewUser?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { publicKey, connected } = useWallet();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("blip_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("blip_user");
      }
    }
    setIsLoading(false);
  }, []);

  // Sync with wallet connection
  useEffect(() => {
    if (!connected || !publicKey) {
      // Wallet disconnected, clear user
      setUser(null);
      localStorage.removeItem("blip_user");
    }
  }, [connected, publicKey]);

  const login = (userData: User) => {
    console.log("🔐 Logging in user:", userData);
    setUser(userData);
    localStorage.setItem("blip_user", JSON.stringify(userData));
  };

  const logout = () => {
    console.log("🚪 Logging out user");
    setUser(null);
    localStorage.removeItem("blip_user");
  };

  const isAuthenticated = !!user && connected && !!publicKey;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

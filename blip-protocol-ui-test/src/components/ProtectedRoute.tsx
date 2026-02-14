import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-black dark:text-white animate-spin" />
          <p className="text-black/60 dark:text-white/60 text-sm">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  if (!isAuthenticated || !user) {
    console.log("🚫 Not authenticated, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  // Check if email is verified
  if (!user.emailVerified) {
    console.log("🚫 Email not verified, redirecting to verification pending");
    return <Navigate to="/verification-pending" replace state={{ email: user.email }} />;
  }

  // User is authenticated and email is verified
  // They can access the dashboard even without wallet linked
  // The dashboard will prompt them to link wallet if needed
  return <>{children}</>;
};

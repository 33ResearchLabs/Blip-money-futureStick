import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "user" | "merchant" | "admin";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  const isMerchant = user?.role === "MERCHANT";
  const isSuperAdmin = user?.role === "SUPERADMIN";
  const loginRedirect = requiredRole === "merchant" ? "/merchant-waitlist" : "/waitlist";

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
    return <Navigate to={loginRedirect} replace />;
  }

  // Check if email is verified
  if (!user.emailVerified) {
    return <Navigate to={loginRedirect} replace state={{ email: user.email }} />;
  }

  // SUPERADMIN and ADMIN can access any dashboard
  if (isSuperAdmin || user.role === "ADMIN") {
    return <>{children}</>;
  }
  if (requiredRole === "merchant" && !isMerchant) {
    return <Navigate to="/dashboard" replace />;
  }
  if (requiredRole === "user" && isMerchant) {
    return <Navigate to="/merchant-dashboard" replace />;
  }

  return <>{children}</>;
};

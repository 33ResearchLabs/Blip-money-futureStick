import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "user" | "merchant" | "admin";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Effective role set: prefer the new `roles[]` array, fall back to legacy
  // single `role` for users created before the multi-role migration.
  const effectiveRoles = (user?.roles && user.roles.length > 0)
    ? user.roles
    : (user?.role ? [user.role] : []);
  const hasMerchantAccess = effectiveRoles.includes("MERCHANT");
  const hasUserAccess = effectiveRoles.includes("USER");
  const isSuperAdmin = effectiveRoles.includes("SUPERADMIN");
  const isAdmin = effectiveRoles.includes("ADMIN");
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
  if (isSuperAdmin || isAdmin) {
    return <>{children}</>;
  }
  if (requiredRole === "merchant" && !hasMerchantAccess) {
    return <Navigate to="/dashboard" replace />;
  }
  if (requiredRole === "user" && !hasUserAccess) {
    return <Navigate to="/merchant-dashboard" replace />;
  }

  return <>{children}</>;
};

import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { firebaseAuth } from "@/config/firebase";
import authApi from "@/services/auth";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const oobCode = searchParams.get("oobCode");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInvalidLink, setIsInvalidLink] = useState(false);

  // Verify the oobCode on mount
  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode) {
        setIsInvalidLink(true);
        setIsVerifying(false);
        return;
      }

      try {
        const userEmail = await verifyPasswordResetCode(firebaseAuth, oobCode);
        setEmail(userEmail);
      } catch {
        setIsInvalidLink(true);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyCode();
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      toast.error(
        "Password must contain at least 1 uppercase letter and 1 number",
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (!oobCode) {
      toast.error("Invalid reset link");
      return;
    }

    setIsLoading(true);

    try {
      // Reset password in Firebase
      await confirmPasswordReset(firebaseAuth, oobCode, password);

      // Sync new password to backend MongoDB
      try {
        await authApi.syncPassword(email, password);
      } catch {
        // Backend sync failure is non-critical - Firebase password is already updated
        console.error("Backend password sync failed");
      }

      setIsSuccess(true);
      toast.success("Password reset successfully!");
    } catch (error: any) {
      if (error.code === "auth/expired-action-code") {
        toast.error("Reset link has expired. Please request a new one.");
      } else if (error.code === "auth/invalid-action-code") {
        toast.error("Invalid reset link. Please request a new one.");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password is too weak. Please choose a stronger password.");
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while verifying oobCode
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-black/40 dark:text-white/40 mx-auto mb-4" />
          <p className="text-black/50 dark:text-white/50">
            Verifying reset link...
          </p>
        </div>
      </div>
    );
  }

  // Invalid or expired link
  if (isInvalidLink) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-3">
            Invalid Reset Link
          </h2>
          <p className="text-black/50 dark:text-white/50 mb-8">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/forgot-password")}
              className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-sm hover:bg-black/90 dark:hover:bg-white/90 transition-all"
            >
              Request New Link
            </button>
            <Link
              to="/waitlist"
              className="w-full py-3 flex items-center justify-center gap-2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-3">
            Password Reset!
          </h2>
          <p className="text-black/50 dark:text-white/50 mb-8">
            Your password has been updated successfully. You can now log in with
            your new password.
          </p>

          <button
            onClick={() => navigate("/waitlist")}
            className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-sm hover:bg-black/90 dark:hover:bg-white/90 transition-all"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: "rgba(255, 107, 53, 0.05)",
              border: "1px solid rgba(255, 107, 53, 0.15)",
            }}
          >
            <span className="text-[11px] font-semibold text-gray-600 dark:text-white uppercase tracking-wider">
              Password Recovery
            </span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-3">
            Set New Password
          </h2>
          <p className="text-black/50 dark:text-white/50">
            Enter your new password for{" "}
            <span className="text-black dark:text-white font-medium">
              {email}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black dark:text-white mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40 dark:text-white/40" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 bg-white dark:bg-black border border-black/20 dark:border-white/20 rounded-sm text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                placeholder="Min 8 characters"
                disabled={isLoading}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-black/40 dark:text-white/40">
              Must contain at least 1 uppercase letter and 1 number
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-black dark:text-white mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40 dark:text-white/40" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 bg-white dark:bg-black border border-black/20 dark:border-white/20 rounded-sm text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-sm hover:bg-black/90 dark:hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/waitlist"
            className="inline-flex items-center gap-2 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  CheckCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import authApi from "@/services/auth";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const isMerchant = searchParams.get("role") === "merchant";
  const loginPath = isMerchant ? "/merchant-waitlist" : "/waitlist";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInvalidLink] = useState(!token);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password strength checker
  const checkPasswordStrength = (pw: string) => {
    const checks = {
      length: pw.length >= 8,
      uppercase: /[A-Z]/.test(pw),
      lowercase: /[a-z]/.test(pw),
      number: /[0-9]/.test(pw),
    };
    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  };

  const passwordStrength = checkPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!passwordStrength.checks.length) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!passwordStrength.checks.uppercase) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!passwordStrength.checks.number) {
      newErrors.password = "Password must contain at least one number";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!token) {
      newErrors.password = "Invalid reset link";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);

    try {
      await authApi.resetPassword(token!, password);
      setIsSuccess(true);
      toast.success("Password reset successfully!");
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 400) {
        toast.error("Reset link has expired or is invalid. Please request a new one.");
      } else {
        const message = error.response?.data?.message || "Failed to reset password. Please try again.";
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Invalid or expired link (no token in URL)
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
              className="w-full py-3 bg-white text-black border border-black/10 font-semibold rounded-full transition-all duration-200 ease-out hover:scale-[1.01] hover:bg-gray-50 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] active:scale-[0.98]"
            >
              Request New Link
            </button>
            <Link
              to={loginPath}
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
            onClick={() => navigate(loginPath)}
            className="w-full py-3 bg-white text-black border border-black/10 font-semibold rounded-full transition-all duration-200 ease-out hover:scale-[1.01] hover:bg-gray-50 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] active:scale-[0.98]"
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
              background: "rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.15)",
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
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                }}
                className={`w-full pl-11 pr-11 py-3 bg-white dark:bg-black border ${
                  errors.password
                    ? "border-red-500 dark:border-red-400"
                    : "border-black/20 dark:border-white/20"
                } rounded-sm text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:border-black dark:focus:border-white transition-colors`}
                placeholder="Min 8 characters"
                maxLength={50}
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
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.password}
              </p>
            )}

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength.score <= 2
                          ? "bg-red-500 w-1/3"
                          : passwordStrength.score === 3
                            ? "bg-yellow-500 w-2/3"
                            : "bg-green-500 w-full"
                      }`}
                    />
                  </div>
                  <span className="text-xs text-black/60 dark:text-white/60">
                    {passwordStrength.score <= 2
                      ? "Weak"
                      : passwordStrength.score === 3
                        ? "Medium"
                        : "Strong"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    {passwordStrength.checks.length ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <XCircle className="w-3 h-3 text-black/30 dark:text-white/30" />
                    )}
                    <span
                      className={
                        passwordStrength.checks.length
                          ? "text-green-600 dark:text-green-400"
                          : "text-black/40 dark:text-white/40"
                      }
                    >
                      8+ characters
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {passwordStrength.checks.uppercase ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <XCircle className="w-3 h-3 text-black/30 dark:text-white/30" />
                    )}
                    <span
                      className={
                        passwordStrength.checks.uppercase
                          ? "text-green-600 dark:text-green-400"
                          : "text-black/40 dark:text-white/40"
                      }
                    >
                      Uppercase
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {passwordStrength.checks.number ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <XCircle className="w-3 h-3 text-black/30 dark:text-white/30" />
                    )}
                    <span
                      className={
                        passwordStrength.checks.number
                          ? "text-green-600 dark:text-green-400"
                          : "text-black/40 dark:text-white/40"
                      }
                    >
                      Number
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {passwordStrength.checks.lowercase ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <XCircle className="w-3 h-3 text-black/30 dark:text-white/30" />
                    )}
                    <span
                      className={
                        passwordStrength.checks.lowercase
                          ? "text-green-600 dark:text-green-400"
                          : "text-black/40 dark:text-white/40"
                      }
                    >
                      Lowercase
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
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
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                className={`w-full pl-11 pr-11 py-3 bg-white dark:bg-black border ${
                  errors.confirmPassword
                    ? "border-red-500 dark:border-red-400"
                    : "border-black/20 dark:border-white/20"
                } rounded-sm text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:border-black dark:focus:border-white transition-colors`}
                placeholder="Confirm your password"
                maxLength={50}
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
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-white text-black border border-black/10 font-semibold rounded-full transition-all duration-200 ease-out hover:scale-[1.01] hover:bg-gray-50 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
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
            to={loginPath}
            className="inline-flex items-center gap-2 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

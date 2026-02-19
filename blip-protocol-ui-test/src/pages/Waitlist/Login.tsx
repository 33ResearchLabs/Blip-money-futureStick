import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import authApi from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import { twoFactorApi } from "@/services/twoFatctor";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/config/firebase";

export default function Login({ role }: { role?: "user" | "merchant" }) {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const isMerchant = role === "merchant";
  const registerPath = isMerchant ? "/merchant-register" : "/register";

  // Determine dashboard from the server response user role, or fall back to prop/context
  const getDashboardForUser = (u?: any) => {
    if (u?.role === "SUPERADMIN" || user?.role === "SUPERADMIN")
      return "/admin-dashboard";
    if (u?.role === "MERCHANT" || u?.role === "merchant")
      return "/merchant-dashboard";
    if (user?.role === "MERCHANT") return "/merchant-dashboard";
    if (isMerchant) return "/merchant-dashboard";
    return "/dashboard";
  };

  // Redirect already-authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate(getDashboardForUser(user), { replace: true });
    }
  }, [isAuthenticated, navigate, user]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 2FA state
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      // Check if 2FA is required
      if (response.twoFactorRequired) {
        setShow2FA(true);
        setIsLoading(false);
        return;
      }

      // Regular login success - redirect based on server response role
      login(response.user);
      toast.success("Login successful!");
      navigate(getDashboardForUser(response.user));
    } catch (error: any) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message || "Login failed. Please try again.";

      if (
        error.response?.status === 403 &&
        error.response?.data?.emailVerified === false
      ) {
        // Check if Firebase has it verified - if so, sync to backend and retry
        try {
          const fbUser = await signInWithEmailAndPassword(
            firebaseAuth,
            formData.email,
            formData.password,
          );
          if (fbUser.user.emailVerified) {
            await authApi.confirmEmailVerified(formData.email);
            // Retry login now that backend is synced
            const retryResponse = await authApi.login({
              email: formData.email,
              password: formData.password,
            });
            if (retryResponse.twoFactorRequired) {
              setShow2FA(true);
              setIsLoading(false);
              return;
            }
            login(retryResponse.user);
            toast.success("Login successful!");
            navigate(getDashboardForUser(retryResponse.user));
            return;
          }
        } catch {
          // Firebase sign-in failed or sync failed - show original error
        }
        toast.error("Please verify your email before logging in");
        navigate("/email-verification-pending", {
          state: { email: formData.email, role },
        });
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!twoFactorCode || twoFactorCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);

    try {
      const response = await twoFactorApi.verifyOtpLogin({
        email: formData.email,
        otp: twoFactorCode,
      });

      login(response.user);
      toast.success("Login successful!");
      navigate(getDashboardForUser(response.user));
    } catch (error: any) {
      console.error("2FA verification error:", error);
      const message =
        error.response?.data?.message || "Invalid verification code";
      toast.error(message);
      setTwoFactorCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // 2FA Modal
  if (show2FA) {
    return (
      <div className="flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 mb-5">
              <Shield className="w-7 h-7 text-black dark:text-white" />
            </div>
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
              Two-Factor Authentication
            </h1>
            <p className="text-sm text-black/50 dark:text-white/50">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          <form onSubmit={handle2FASubmit} className="space-y-5">
            <div>
              <input
                type="text"
                value={twoFactorCode}
                onChange={(e) =>
                  setTwoFactorCode(
                    e.target.value.replace(/\D/g, "").slice(0, 6),
                  )
                }
                className="w-full px-4 py-4 text-center text-2xl tracking-[0.3em] font-mono bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-transparent transition-all"
                placeholder="000000"
                maxLength={6}
                autoFocus
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || twoFactorCode.length !== 6}
              className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Login"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setShow2FA(false);
                setTwoFactorCode("");
              }}
              className="w-full py-3.5 border border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 font-medium rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-all duration-200"
            >
              Back to Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex ">
      <div className="w-full max-w-lg">
        {/* Header - hidden when inside merchant wrapper which provides its own */}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-[13px] font-medium text-black/70 dark:text-white/70 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-black/30 dark:text-white/30" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3.5 bg-black/[0.02] dark:bg-white/[0.03] border ${
                  errors.email
                    ? "border-red-500/50 ring-2 ring-red-500/10"
                    : "border-black/10 dark:border-white/10"
                } rounded-xl text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-transparent transition-all duration-200`}
                placeholder="you@example.com"
                disabled={isLoading}
                autoFocus
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-[13px] font-medium text-black/70 dark:text-white/70"
              >
                Password
              </label>
              <Link
                to={
                  isMerchant
                    ? "/forgot-password?role=merchant"
                    : "/forgot-password"
                }
                className="text-xs text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-black/30 dark:text-white/30" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-12 pr-12 py-3.5 bg-black/[0.02] dark:bg-white/[0.03] border ${
                  errors.password
                    ? "border-red-500/50 ring-2 ring-red-500/10"
                    : "border-black/10 dark:border-white/10"
                } rounded-xl text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-transparent transition-all duration-200`}
                placeholder="Enter your password"
                maxLength={50}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="w-[18px] h-[18px]" />
                ) : (
                  <Eye className="w-[18px] h-[18px]" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : isMerchant ? (
                "Sign In as Merchant"
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-black/50 dark:text-white/40">
            Don't have an account?{" "}
            <Link
              to={registerPath}
              className="text-black dark:text-white font-semibold hover:underline underline-offset-4 transition-colors duration-200"
            >
              {isMerchant ? "Register as Merchant" : "Create one"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

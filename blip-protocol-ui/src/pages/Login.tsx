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
export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Redirect already-authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

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

      // Regular login success
      login(response.user);
      toast.success("Login successful!");
      navigate("/dashboard");
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
            navigate("/dashboard");
            return;
          }
        } catch {
          // Firebase sign-in failed or sync failed - show original error
        }
        toast.error("Please verify your email before logging in");
        navigate("/email-verification-pending", {
          state: { email: formData.email },
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
      navigate("/dashboard");
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
      <div className="  flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/10 dark:bg-white/10 mb-4">
              <Shield className="w-8 h-8 text-black dark:text-white" />
            </div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
              Two-Factor Authentication
            </h1>
            <p className="text-black/60 dark:text-white/60">
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
                className="w-full px-4 py-4 text-center text-2xl tracking-widest font-mono bg-white dark:bg-black border border-black/20 dark:border-white/20 rounded-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                placeholder="000000"
                maxLength={6}
                autoFocus
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || twoFactorCode.length !== 6}
              className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-sm hover:bg-black/90 dark:hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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
              className="w-full py-3 border border-black/20 dark:border-white/20 text-black dark:text-white font-medium rounded-sm hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex  p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-10 ">
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
            <span className="text-[11px] font-semibold text-gray-600 dark:text-whiteuppercase tracking-wider">
              Step 1 of 2
            </span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-3">
            Reserve Your Spot
          </h2>
          <p className="text-black/50 dark:text-white/50">
            Enter your email to begin verification
          </p>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black dark:text-white mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40 dark:text-white/40" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3 bg-white dark:bg-black border ${
                  errors.email
                    ? "border-red-500 dark:border-red-400"
                    : "border-black/20 dark:border-white/20"
                } rounded-sm text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:border-black dark:focus:border-white transition-colors`}
                placeholder="you@example.com"
                disabled={isLoading}
                autoFocus
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black dark:text-white"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40 dark:text-white/40" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-11 pr-11 py-3 bg-white dark:bg-black border ${
                  errors.password
                    ? "border-red-500 dark:border-red-400"
                    : "border-black/20 dark:border-white/20"
                } rounded-sm text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:border-black dark:focus:border-white transition-colors`}
                placeholder="••••••••"
                disabled={isLoading}
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
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-sm hover:bg-black/90 dark:hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-black/60 dark:text-white/60">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-black dark:text-white font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

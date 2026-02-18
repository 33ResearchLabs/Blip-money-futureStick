import { useState, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  CheckCircle,
  XCircle,
  Loader2,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import authApi from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseAuth } from "@/config/firebase";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref") || "";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    referral_code: referralCode,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // OTP verification state (kept for future email verification)
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  };

  const passwordStrength = checkPasswordStrength(formData.password);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!passwordStrength.checks.uppercase) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!passwordStrength.checks.number) {
      newErrors.password = "Password must contain at least one number";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      // 1. Create Firebase user and send verification email
      const firebaseUser = await createUserWithEmailAndPassword(
        firebaseAuth,
        formData.email,
        formData.password,
      );
      await sendEmailVerification(firebaseUser.user);

      // 2. Register on backend (creates MongoDB user with emailVerified: false)
      await authApi.register({
        email: formData.email,
        password: formData.password,
        referral_code: formData.referral_code || undefined,
        captchaToken: captchaToken || undefined,
      });

      // 3. Navigate to verification pending page
      toast.success("Verification email sent! Please check your inbox.");
      navigate("/email-verification-pending", {
        state: { email: formData.email },
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      // Handle Firebase-specific errors
      if (error.code === "auth/email-already-in-use") {
        // Try to sign in - if user exists but isn't verified, resend verification
        try {
          const existingUser = await signInWithEmailAndPassword(
            firebaseAuth,
            formData.email,
            formData.password,
          );
          if (!existingUser.user.emailVerified) {
            await sendEmailVerification(existingUser.user);
            toast.success(
              "Verification email resent! Please check your inbox.",
            );
            navigate("/email-verification-pending", {
              state: { email: formData.email },
            });
            return;
          }
          // Firebase says verified - sync to backend then redirect to login
          try {
            await authApi.confirmEmailVerified(formData.email);
          } catch {}
          toast.info("Email already verified. Please login.");
        } catch {
          toast.error("Email already registered. Please login instead.");
        }
      } else {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again.";
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsVerifying(true);

    try {
      const response: any = await authApi.verifyOTP(formData.email, otp);

      // Log the user in automatically
      login(response.user);

      toast.success("Email verified successfully! You are now logged in.");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("OTP verification error:", error);
      const message =
        error.response?.data?.message ||
        "Invalid verification code. Please try again.";
      toast.error(message);
      setOtp("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    try {
      await authApi.resendVerification(formData.email);
      toast.success("Verification code resent! Check your email.");
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to resend code. Try again.";
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4 mt-20">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
            Create Account
          </h1>
          <p className="text-black/60 dark:text-white/60">
            Join Blip Money and start earning rewards
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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black dark:text-white mb-2"
            >
              Password
            </label>
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

            {/* Password Strength Indicator */}
            {formData.password && (
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
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-11 pr-11 py-3 bg-white dark:bg-black border ${
                  errors.confirmPassword
                    ? "border-red-500 dark:border-red-400"
                    : "border-black/20 dark:border-white/20"
                } rounded-sm text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:border-black dark:focus:border-white transition-colors`}
                placeholder="••••••••"
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

          {/* Referral Code (Optional) */}
          <div>
            <label
              htmlFor="referral_code"
              className="block text-sm font-medium text-black dark:text-white mb-2"
            >
              Referral Code{" "}
              <span className="text-black/40 dark:text-white/40">
                (Optional)
              </span>
            </label>
            <input
              type="text"
              id="referral_code"
              name="referral_code"
              value={formData.referral_code}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white dark:bg-black border border-black/20 dark:border-white/20 rounded-sm text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:border-black dark:focus:border-white transition-colors uppercase"
              placeholder="BLIPXXXXXX"
              disabled={isLoading}
            />
          </div>

          {/* reCAPTCHA */}
          {import.meta.env.VITE_RECAPTCHA_SITE_KEY && (
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={(token) => setCaptchaToken(token)}
                onExpired={() => setCaptchaToken(null)}
                theme={
                  document.documentElement.classList.contains("dark")
                    ? "dark"
                    : "light"
                }
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              isLoading ||
              (!!import.meta.env.VITE_RECAPTCHA_SITE_KEY && !captchaToken)
            }
            className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-sm hover:bg-black/90 dark:hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-black/70 dark:text-white/60">
            Already have an account?{" "}
            <Link
              to="/waitlist"
              className="text-black dark:text-white font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
          <p className="text-sm text-black/70 dark:text-white/40">
            By creating an account, you agree to our{" "}
            <Link
              to="/terms"
              className="underline hover:text-black dark:hover:text-white"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="underline hover:text-black dark:hover:text-white"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-sm shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-black dark:text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black dark:text-white">
                    Verify Your Email
                  </h2>
                  <p className="text-sm text-black/60 dark:text-white/60">
                    We sent a code to {formData.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleVerifyOTP} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full px-4 py-4 text-center text-2xl tracking-widest font-mono bg-white dark:bg-black border border-black/20 dark:border-white/20 rounded-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                  disabled={isVerifying}
                />
                <p className="mt-2 text-xs text-black/40 dark:text-white/40 text-center">
                  Code expires in 10 minutes
                </p>
              </div>

              <button
                type="submit"
                disabled={isVerifying || otp.length !== 6}
                className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-sm hover:bg-black/90 dark:hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-black/50 dark:text-white/50 mb-2">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isResending || resendCooldown > 0}
                  className="text-sm font-medium text-black dark:text-white hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed transition-all"
                >
                  {isResending
                    ? "Sending..."
                    : resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend Email"}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowOTPModal(false)}
                className="w-full py-3 border border-black/20 dark:border-white/20 text-black dark:text-white font-medium rounded-sm hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                Go Back
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

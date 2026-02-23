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

export default function Register({
  role,
  embedded,
}: { role?: "user" | "merchant"; embedded?: boolean } = {}) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref") || "";

  const isMerchant = role === "merchant";
  const showStandalone = !isMerchant && !embedded;
  const loginPath = isMerchant ? "/merchant-waitlist" : "/waitlist";

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
        ...(isMerchant && { role: "merchant" }),
      });

      // 3. Navigate to verification pending page
      toast.success("Verification email sent! Please check your inbox.");
      navigate("/email-verification-pending", {
        state: { email: formData.email, role },
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
              state: { email: formData.email, role },
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
      const dest =
        response.user?.role === "MERCHANT" ||
        response.user?.role === "merchant" ||
        isMerchant
          ? "/merchant-dashboard"
          : "/dashboard";
      navigate(dest);
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
    <div
      className={`${showStandalone ? "min-h-screen bg-[#FAF8F5] dark:bg-black mt-20" : ""} flex items-center justify-center `}
    >
      <div className="w-full max-w-lg">
        {/* Header */}
        {showStandalone && (
          <div className=" mb-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: "rgba(255, 107, 53, 0.05)",
                border: "1px solid rgba(255, 107, 53, 0.15)",
              }}
            >
              <span className="text-[11px] font-semibold text-gray-600 dark:text-white uppercase tracking-wider">
                Get Started
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-3">
              Create Account
            </h1>
            <p className="text-black/50 dark:text-white/50">
              Join Blip Money and start earning rewards
            </p>
          </div>
        )}

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
            <label
              htmlFor="password"
              className="block text-[13px] font-medium text-black/70 dark:text-white/70 mb-2"
            >
              Password
            </label>
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
                placeholder="Min 8 characters"
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

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-3 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${
                        passwordStrength.score <= 2
                          ? "bg-red-400 w-1/3"
                          : passwordStrength.score === 3
                            ? "bg-amber-400 w-2/3"
                            : "bg-emerald-400 w-full"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[11px] font-medium ${
                      passwordStrength.score <= 2
                        ? "text-red-400"
                        : passwordStrength.score === 3
                          ? "text-amber-400"
                          : "text-emerald-400"
                    }`}
                  >
                    {passwordStrength.score <= 2
                      ? "Weak"
                      : passwordStrength.score === 3
                        ? "Medium"
                        : "Strong"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {[
                    {
                      check: passwordStrength.checks.length,
                      label: "8+ characters",
                    },
                    {
                      check: passwordStrength.checks.uppercase,
                      label: "Uppercase",
                    },
                    { check: passwordStrength.checks.number, label: "Number" },
                    {
                      check: passwordStrength.checks.lowercase,
                      label: "Lowercase",
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      {item.check ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-black/15 dark:text-white/15" />
                      )}
                      <span
                        className={`text-[11px] ${
                          item.check
                            ? "text-emerald-500 dark:text-emerald-400"
                            : "text-black/30 dark:text-white/30"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-[13px] font-medium text-black/70 dark:text-white/70 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-black/30 dark:text-white/30" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-12 pr-12 py-3.5 bg-black/[0.02] dark:bg-white/[0.03] border ${
                  errors.confirmPassword
                    ? "border-red-500/50 ring-2 ring-red-500/10"
                    : "border-black/10 dark:border-white/10"
                } rounded-xl text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-transparent transition-all duration-200`}
                placeholder="Confirm your password"
                maxLength={50}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors duration-200"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-[18px] h-[18px]" />
                ) : (
                  <Eye className="w-[18px] h-[18px]" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Referral Code (Optional) */}
          <div>
            <label
              htmlFor="referral_code"
              className="block text-[13px] font-medium text-black/70 dark:text-white/70 mb-2"
            >
              Referral Code{" "}
              <span className="text-black/30 dark:text-white/30 font-normal">
                (Optional)
              </span>
            </label>
            <input
              type="text"
              id="referral_code"
              name="referral_code"
              value={formData.referral_code}
              onChange={handleChange}
              className="w-full px-4 py-3.5 bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-transparent transition-all duration-200 uppercase"
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
          <div className="pt-1">
            <button
              type="submit"
              disabled={
                isLoading ||
                (!!import.meta.env.VITE_RECAPTCHA_SITE_KEY && !captchaToken)
              }
              className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isMerchant
                    ? "Creating Merchant Account..."
                    : "Creating Account..."}
                </>
              ) : isMerchant ? (
                "Create Merchant Account"
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-sm text-black/50 dark:text-white/40">
            Already have an account?{" "}
            <Link
              to={loginPath}
              className="text-black dark:text-white font-semibold hover:underline underline-offset-4 transition-colors duration-200"
            >
              {isMerchant ? "Merchant Sign In" : "Sign in"}
            </Link>
          </p>
          <p className="text-xs text-black/30 dark:text-white/30 leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link
              to="/terms"
              className="underline underline-offset-2 hover:text-black/60 dark:hover:text-white/60 transition-colors duration-200"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="underline underline-offset-2 hover:text-black/60 dark:hover:text-white/60 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md bg-white dark:bg-[#111] border border-black/5 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 pb-5 border-b border-black/5 dark:border-white/[0.06]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-black dark:text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black dark:text-white">
                    Verify Your Email
                  </h2>
                  <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">
                    We sent a code to {formData.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleVerifyOTP} className="p-6 space-y-5">
              <div>
                <label className="block text-[13px] font-medium text-black/70 dark:text-white/70 mb-2">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full px-4 py-4 text-center text-2xl tracking-[0.3em] font-mono bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-transparent transition-all duration-200"
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                  disabled={isVerifying}
                />
                <p className="mt-2 text-[11px] text-black/30 dark:text-white/30 text-center">
                  Code expires in 10 minutes
                </p>
              </div>

              <button
                type="submit"
                disabled={isVerifying || otp.length !== 6}
                className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
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
                <p className="text-xs text-black/40 dark:text-white/40 mb-2">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isResending || resendCooldown > 0}
                  className="text-xs font-semibold text-black dark:text-white hover:underline underline-offset-4 disabled:opacity-30 disabled:no-underline disabled:cursor-not-allowed transition-all duration-200"
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
                className="w-full py-3.5 border border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 font-medium rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-all duration-200"
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

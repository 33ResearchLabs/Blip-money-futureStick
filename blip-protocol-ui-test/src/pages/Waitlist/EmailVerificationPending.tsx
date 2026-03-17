import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, RefreshCw, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import authApi from "@/services/auth";

export default function EmailVerificationPending() {
  const location = useLocation();

  // Use location state first, then sessionStorage as fallback
  const stateEmail = location.state?.email || "";
  const stateRole = location.state?.role || "";
  const [email] = useState(() => {
    if (stateEmail) {
      sessionStorage.setItem("verification_email", stateEmail);
      return stateEmail;
    }
    return sessionStorage.getItem("verification_email") || "";
  });
  const [role] = useState(() => {
    if (stateRole) {
      sessionStorage.setItem("verification_role", stateRole);
      return stateRole;
    }
    return sessionStorage.getItem("verification_role") || "USER";
  });

  const isMerchant = role === "MERCHANT" || role === "merchant";
  const loginPath = isMerchant ? "/merchant-waitlist" : "/waitlist";

  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleResend = async () => {
    if (!email || resendCooldown > 0) return;

    setIsResending(true);
    try {
      await authApi.resendVerification(email);
      setResent(true);
      toast.success("Verification email resent! Please check your inbox.");

      // Start cooldown timer (60 seconds)
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

      setTimeout(() => setResent(false), 5000);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Failed to resend email. Please try again.";
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4 mt-16">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black/10 dark:bg-white/10 mb-6">
          <Mail className="w-10 h-10 text-black dark:text-white" />
        </div>

        {/* Header */}
        <h1 className="text-3xl font-bold text-black dark:text-white mb-3">
          Check Your Email
        </h1>
        <p className="text-black/60 dark:text-white/60 mb-2">
          We've sent a verification link to:
        </p>
        <p className="text-lg font-medium text-black dark:text-white mb-6">
          {email || "your email address"}
        </p>

        {/* Instructions */}
        <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-6 mb-6 text-left">
          <h2 className="font-medium text-black dark:text-white mb-3">
            What's next?
          </h2>
          <ol className="space-y-2 text-sm text-black/60 dark:text-white/60">
            <li className="flex items-start gap-2">
              <span className="font-bold text-black dark:text-white">1.</span>
              <span>Check your email inbox (and spam folder)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-black dark:text-white">2.</span>
              <span>Click the verification link in the email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-black dark:text-white">3.</span>
              <span>Once verified, you can log in to your account</span>
            </li>
          </ol>
        </div>

        {/* Note about link expiry */}
        <p className="text-sm text-black/40 dark:text-white/40 mb-4">
          The verification link expires in 30 minutes
        </p>

        {/* Resend Button */}
        <button
          onClick={handleResend}
          disabled={isResending || resent || resendCooldown > 0}
          className="w-full py-3 border border-black/20 dark:border-white/20 text-black dark:text-white font-medium rounded-sm hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mb-4"
        >
          {isResending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : resent ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-500" />
              Email Sent!
            </>
          ) : resendCooldown > 0 ? (
            `Resend available in ${resendCooldown}s`
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              Resend Verification Email
            </>
          )}
        </button>

        {/* Back to Login */}
        <Link
          to={loginPath}
          className="inline-block text-sm text-black/80 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
        >
          Back to Login
        </Link>

        {/* Help Text */}
        <div className="mt-8 pt-8 border-t border-black/10 dark:border-white/10">
          <p className="text-sm text-black/80 dark:text-white/40">
            Didn't receive the email? Check your spam folder or{" "}
            <Link
              to="/contact"
              className="underline hover:text-black dark:hover:text-white"
            >
              contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

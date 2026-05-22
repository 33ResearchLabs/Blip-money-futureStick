import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import authApi from "@/services/auth";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [userRole, setUserRole] = useState<string>("USER");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setErrorMessage("Invalid verification link.");
        return;
      }

      try {
        const res = await authApi.verifyEmail(token);
        setUserRole(res.data?.role || "USER");
        setStatus("success");
        toast.success("Email verified successfully!");
      } catch (error: any) {
        setStatus("error");
        const message =
          error.response?.data?.message ||
          "Verification failed. The link may be invalid or expired.";
        setErrorMessage(message);
      }
    };

    verify();
  }, [token]);

  const handleResendVerification = async () => {
    if (!resendEmail || resendCooldown > 0) return;

    setIsResending(true);
    try {
      await authApi.resendVerification(resendEmail);
      toast.success("Verification email sent! Check your inbox.");
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
        error.response?.data?.message || "Failed to resend verification email.";
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-black/40 dark:text-white/40 mx-auto mb-4" />
          <p className="text-black/50 dark:text-white/50">
            Verifying your email...
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
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
            Verification Failed
          </h2>
          <p className="text-black/50 dark:text-white/50 mb-8">
            {errorMessage}
          </p>

          {/* Resend verification email */}
          <div className="space-y-3 mb-6">
            <p className="text-sm text-black/60 dark:text-white/60">
              Enter your email to receive a new verification link:
            </p>
            <input
              type="email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-black border border-black/20 dark:border-white/20 rounded-sm text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              placeholder="you@example.com"
            />
            <button
              onClick={handleResendVerification}
              disabled={isResending || !resendEmail || resendCooldown > 0}
              className="w-full py-3 bg-white text-black border border-black/10 font-medium rounded-sm hover:scale-[1.01] hover:bg-gray-50 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : resendCooldown > 0 ? (
                `Resend available in ${resendCooldown}s`
              ) : (
                "Resend Verification Email"
              )}
            </button>
          </div>

          <Link
            to="/waitlist"
            className="w-full py-3 flex items-center justify-center gap-2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </motion.div>
      </div>
    );
  }

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
          Email Verified!
        </h2>
        <p className="text-black/50 dark:text-white/50 mb-8">
          Your email has been verified successfully. You can now log in to your
          account.
        </p>
        <button
          onClick={() => navigate(userRole === "MERCHANT" ? "/merchant-login" : "/login")}
          className="w-full py-3 bg-white text-black border border-black/10 font-medium rounded-sm hover:scale-[1.01] hover:bg-gray-50 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] active:scale-[0.98] transition-all"
        >
          Go to {userRole === "MERCHANT" ? "Merchant" : ""} Login
        </button>
      </motion.div>
    </div>
  );
}

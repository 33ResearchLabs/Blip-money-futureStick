import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { sendPasswordResetEmail } from "firebase/auth";
import { firebaseAuth } from "@/config/firebase";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const isMerchant = searchParams.get("role") === "merchant";
  const loginPath = isMerchant ? "/merchant-waitlist" : "/waitlist";

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format");
      return;
    }

    setError("");

    setIsLoading(true);

    try {
      await sendPasswordResetEmail(firebaseAuth, email, {
        url: `${window.location.origin}/reset-password`,
      });
      setIsSent(true);
      toast.success("Reset link sent! Check your email.");
    } catch {
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
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
            Check Your Email
          </h2>
          <p className="text-black/50 dark:text-white/50 mb-8">
            We've sent a password reset link to{" "}
            <span className="text-black dark:text-white font-medium">
              {email}
            </span>
            . The link will expire in 1 hour.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => {
                setIsSent(false);
                setEmail("");
              }}
              className="w-full py-3 border border-black/20 dark:border-white/20 text-black dark:text-white font-medium rounded-sm hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              Try a different email
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
            Forgot Password?
          </h2>
          <p className="text-black/50 dark:text-white/50">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className={`w-full pl-11 pr-4 py-3 bg-white dark:bg-black border ${
                  error
                    ? "border-red-500 dark:border-red-400"
                    : "border-black/20 dark:border-white/20"
                } rounded-sm text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:border-black dark:focus:border-white transition-colors`}
                placeholder="you@example.com"
                disabled={isLoading}
                autoFocus
              />
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-sm hover:bg-black/90 dark:hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
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

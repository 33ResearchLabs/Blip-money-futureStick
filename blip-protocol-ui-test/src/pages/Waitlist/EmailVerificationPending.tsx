import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, RefreshCw, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { firebaseAuth } from "@/config/firebase";
import { sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import authApi from "@/services/auth";

export default function EmailVerificationPending() {
  const location = useLocation();
  const navigate = useNavigate();

  // Use location state first, then sessionStorage as fallback
  const stateEmail = location.state?.email || "";
  const [email, setEmail] = useState(() => {
    if (stateEmail) {
      sessionStorage.setItem("verification_email", stateEmail);
      return stateEmail;
    }
    return sessionStorage.getItem("verification_email") || "";
  });

  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);

  // Wait for Firebase auth to initialize before polling
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setFirebaseReady(true);
      if (user && !email) {
        setEmail(user.email || "");
      }
    });
    return () => unsubscribe();
  }, []);

  // Auto-check Firebase verification status every 5 seconds (only after Firebase is ready)
  useEffect(() => {
    if (!firebaseReady) return;

    const interval = setInterval(async () => {
      const user = firebaseAuth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(interval);
          await handleVerified();
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [firebaseReady, email]);

  const handleVerified = async () => {
    setIsChecking(true);
    try {
      const verifyEmail = email || firebaseAuth.currentUser?.email || "";
      await authApi.confirmEmailVerified(verifyEmail);
      sessionStorage.removeItem("verification_email");
      toast.success("Email verified! You can now login.");
      navigate("/waitlist", { state: { email: verifyEmail } });
    } catch (error: any) {
      console.error("Confirm verification error:", error);
      toast.error("Something went wrong. Please try logging in.");
      navigate("/waitlist");
    } finally {
      setIsChecking(false);
    }
  };

  const handleCheckNow = async () => {
    setIsChecking(true);
    try {
      const user = firebaseAuth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          await handleVerified();
          return;
        }
        toast.error("Email not verified yet. Please check your inbox.");
      } else {
        toast.error("Session expired. Please register again.");
        navigate("/register");
      }
    } catch (error) {
      console.error("Check verification error:", error);
      toast.error("Could not check verification status.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const user = firebaseAuth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        setResent(true);
        toast.success("Verification email resent! Please check your inbox.");
        setTimeout(() => setResent(false), 5000);
      } else {
        toast.error("Session expired. Please register again.");
        navigate("/register");
      }
    } catch (error: any) {
      console.error("Resend error:", error);
      if (error.code === "auth/too-many-requests") {
        toast.error("Too many requests. Please wait before trying again.");
      } else {
        toast.error("Failed to resend email. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4 mt-16  ">
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
              <span>Come back here - we'll detect it automatically</span>
            </li>
          </ol>
        </div>

        {/* Check Now Button */}
        <button
          onClick={handleCheckNow}
          disabled={isChecking}
          className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-sm hover:bg-black/90 dark:hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mb-3"
        >
          {isChecking ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Checking...
            </>
          ) : (
            "I've Verified My Email"
          )}
        </button>

        {/* Resend Button */}
        <button
          onClick={handleResend}
          disabled={isResending || resent}
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
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              Resend Verification Email
            </>
          )}
        </button>

        {/* Auto-check notice */}
        <p className="text-sm text-black/80 dark:text-white/40 mb-4">
          This page automatically checks every 5 seconds
        </p>

        {/* Back to Login */}
        <Link
          to="/waitlist"
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

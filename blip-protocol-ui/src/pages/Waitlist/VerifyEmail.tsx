import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { applyActionCode } from "firebase/auth";
import { firebaseAuth } from "@/config/firebase";
import authApi from "@/services/auth";
import { motion } from "framer-motion";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get("oobCode");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!oobCode) {
        setStatus("error");
        setErrorMessage("Invalid verification link.");
        return;
      }

      try {
        // Apply the action code to verify email in Firebase
        await applyActionCode(firebaseAuth, oobCode);

        // Get the current user's email to sync with backend
        const user = firebaseAuth.currentUser;
        if (user) {
          await user.reload();
          if (user.email) {
            await authApi.confirmEmailVerified(user.email);
          }
        }

        setStatus("success");
      } catch (error: any) {
        setStatus("error");
        if (error.code === "auth/expired-action-code") {
          setErrorMessage(
            "This verification link has expired. Please request a new one.",
          );
        } else if (error.code === "auth/invalid-action-code") {
          setErrorMessage(
            "This verification link is invalid or has already been used.",
          );
        } else {
          setErrorMessage("Verification failed. Please try again.");
        }
      }
    };

    verify();
  }, [oobCode]);

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
          <div className="space-y-3">
            <button
              onClick={() => navigate("/register")}
              className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-sm hover:bg-black/90 dark:hover:bg-white/90 transition-all"
            >
              Register Again
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
          onClick={() => navigate("/waitlist")}
          className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-sm hover:bg-black/90 dark:hover:bg-white/90 transition-all"
        >
          Go to Login
        </button>
      </motion.div>
    </div>
  );
}

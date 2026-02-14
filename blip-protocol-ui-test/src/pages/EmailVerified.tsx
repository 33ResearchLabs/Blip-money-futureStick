import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import authApi from "@/services/auth";

export default function EmailVerified() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link");
        return;
      }

      try {
        const response = await authApi.verifyEmail(token);
        setStatus("success");
        setMessage(response.message || "Email verified successfully!");

        // Start countdown
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              navigate("/login");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(interval);
      } catch (error: any) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage(
          error.response?.data?.message || "Email verification failed. The link may be invalid or expired."
        );
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Loading State */}
        {status === "loading" && (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black/10 dark:bg-white/10 mb-6">
              <Loader2 className="w-10 h-10 text-black dark:text-white animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-3">
              Verifying Your Email
            </h1>
            <p className="text-black/60 dark:text-white/60">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-3">
              Email Verified!
            </h1>
            <p className="text-black/60 dark:text-white/60 mb-6">
              {message}
            </p>

            {/* Success Message Box */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-sm p-6 mb-6">
              <p className="text-sm text-black/80 dark:text-white/80 mb-4">
                Your account is now active. You can log in and start using Blip Money.
              </p>
              <p className="text-sm text-black/60 dark:text-white/60">
                Redirecting to login in <span className="font-bold text-black dark:text-white">{countdown}</span> seconds...
              </p>
            </div>

            {/* Manual Link */}
            <Link
              to="/login"
              className="inline-block w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-sm hover:bg-black/90 dark:hover:bg-white/90 transition-all"
            >
              Continue to Login
            </Link>
          </>
        )}

        {/* Error State */}
        {status === "error" && (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-3">
              Verification Failed
            </h1>
            <p className="text-black/60 dark:text-white/60 mb-6">
              {message}
            </p>

            {/* Error Message Box */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-sm p-6 mb-6">
              <h2 className="font-medium text-black dark:text-white mb-2">
                What can you do?
              </h2>
              <ul className="text-sm text-left text-black/60 dark:text-white/60 space-y-2">
                <li>• The verification link may have expired (valid for 24 hours)</li>
                <li>• Request a new verification email from the login page</li>
                <li>• Contact support if the problem persists</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-sm hover:bg-black/90 dark:hover:bg-white/90 transition-all"
              >
                Go to Login
              </Link>
              <Link
                to="/register"
                className="block w-full py-3 border border-black/20 dark:border-white/20 text-black dark:text-white font-medium rounded-sm hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                Register Again
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

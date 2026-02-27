import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle, AlertCircle, Link2, ArrowLeft, UserPlus, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { airdropApi } from "@/services/Airdrop";

const REDEEM_OTP_KEY = "blip_redeem_otp";
const REDEEM_ROLE_KEY = "blip_redeem_role";
const REDEEM_TOKEN_KEY = "blip_redeem_token";

interface RedeemStatus {
  linked: boolean;
  telegram_username?: string;
  telegram_name?: string;
  websitePoints: number;
  telegramPoints: number;
  totalPoints: number;
}

interface VerifyResult {
  telegram_username?: string;
  telegram_name?: string;
  websitePoints: number;
  telegramPoints: number;
  totalPoints: number;
}

const RedeemTelegram: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<VerifyResult | null>(null);
  const [status, setStatus] = useState<RedeemStatus | null>(null);
  const [tokenVerifying, setTokenVerifying] = useState(false);
  const [redeemRole, setRedeemRole] = useState(
    searchParams.get("role") || localStorage.getItem(REDEEM_ROLE_KEY) || "user"
  );

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get token / OTP from URL or localStorage
  const initialized = useRef(false);
  const linkToken = searchParams.get("token") || localStorage.getItem(REDEEM_TOKEN_KEY) || "";

  // Save token/OTP/role to localStorage on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const urlToken = searchParams.get("token");
    const urlOtp = searchParams.get("otp");
    const savedOtp = localStorage.getItem(REDEEM_OTP_KEY);
    const urlRole = searchParams.get("role");

    // Save linkToken for persistence through login/register
    if (urlToken) {
      localStorage.setItem(REDEEM_TOKEN_KEY, urlToken);
    }

    // Fall back to OTP if no token
    const otpValue = urlOtp && /^\d{6}$/.test(urlOtp) ? urlOtp : savedOtp;
    if (otpValue && /^\d{6}$/.test(otpValue)) {
      setOtp(otpValue.split(""));
      localStorage.setItem(REDEEM_OTP_KEY, otpValue);
    }

    if (urlRole === "merchant" || urlRole === "user") {
      localStorage.setItem(REDEEM_ROLE_KEY, urlRole);
    }
  }, [searchParams]);

  // Fetch role from token-info when we have a linkToken (works for unauthenticated users)
  useEffect(() => {
    const savedRole = localStorage.getItem(REDEEM_ROLE_KEY);
    if (savedRole) return; // Already have role
    if (!linkToken) return;

    const fetchRole = async () => {
      try {
        const res = await airdropApi.getTokenInfo(linkToken) as any;
        if (res.success && res.data?.role) {
          setRedeemRole(res.data.role);
          localStorage.setItem(REDEEM_ROLE_KEY, res.data.role);
        }
      } catch {
        // Ignore — will default to "user"
      }
    };
    fetchRole();
  }, [linkToken]);

  // Check existing link status on mount (only if authenticated)
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      setChecking(false);
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await airdropApi.getRedeemStatus() as any;
        if (res.success) {
          setStatus(res.data);
        }
      } catch {
        // Ignore
      } finally {
        setChecking(false);
      }
    };
    checkStatus();
  }, [isAuthenticated, isLoading]);

  // Auto-verify via linkToken when authenticated and token is present
  useEffect(() => {
    if (isLoading || checking) return;
    if (!isAuthenticated || !linkToken) return;
    if (success || status?.linked) return;
    if (tokenVerifying) return;

    const verifyToken = async () => {
      setTokenVerifying(true);
      setLoading(true);
      setError("");

      try {
        const res = await airdropApi.verifyLinkToken(linkToken) as any;
        if (res.success) {
          setSuccess(res.data);
          // Clear all saved redeem data on success
          localStorage.removeItem(REDEEM_TOKEN_KEY);
          localStorage.removeItem(REDEEM_OTP_KEY);
          localStorage.removeItem(REDEEM_ROLE_KEY);
        } else {
          setError(res.message || "Link verification failed. Try entering the OTP manually.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Link verification failed. Try entering the OTP manually.",
        );
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [isAuthenticated, isLoading, checking, linkToken, success, status, tokenVerifying]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await airdropApi.verifyRedeemOTP(otpString) as any;
      if (res.success) {
        setSuccess(res.data);
        localStorage.removeItem(REDEEM_OTP_KEY);
        localStorage.removeItem(REDEEM_ROLE_KEY);
        localStorage.removeItem(REDEEM_TOKEN_KEY);
      } else {
        setError(res.message || "Verification failed.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (isLoading || checking || (tokenVerifying && loading)) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-3" />
          {tokenVerifying && (
            <p className="text-black/50 dark:text-white/50 text-sm">
              Linking your Telegram account...
            </p>
          )}
        </div>
      </div>
    );
  }

  // NOT LOGGED IN — show register/login options
  if (!isAuthenticated || !user) {
    const isMerchant = redeemRole === "merchant";
    const registerUrl = isMerchant ? "/merchant-register" : "/register";
    const loginUrl = isMerchant ? "/merchant-waitlist" : "/waitlist";
    const label = isMerchant ? "Merchant Account" : "Blip Points";

    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="border border-black/10 dark:border-white/10 rounded-2xl p-8 bg-white/50 dark:bg-white/[0.02]">
            <div className="flex items-center gap-3 mb-2">
              <Link2 className="w-7 h-7 text-orange-500" />
              <h1 className="text-2xl font-display font-bold text-black dark:text-white">
                Link Telegram {label}
              </h1>
            </div>

            <p className="text-black/50 dark:text-white/50 text-sm mb-8">
              To link your Telegram {label.toLowerCase()}, you need a Blip.money
              {isMerchant ? " merchant" : ""} account.
              Register or log in to continue.
            </p>

            {linkToken && (
              <div className="mb-6 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <p className="text-orange-500 text-sm text-center font-semibold">
                  Your link is saved
                </p>
                <p className="text-black/40 dark:text-white/40 text-xs text-center mt-1">
                  It will auto-verify after you log in.
                </p>
              </div>
            )}

            {!linkToken && otp.join("").length === 6 && (
              <div className="mb-6 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <p className="text-orange-500 text-sm text-center font-mono font-bold tracking-widest">
                  OTP: {otp.join("")}
                </p>
                <p className="text-black/40 dark:text-white/40 text-xs text-center mt-1">
                  Your OTP is saved. It will auto-fill after you log in.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => navigate(registerUrl)}
                className="w-full py-3 rounded-xl bg-orange-500 text-white font-semibold
                  hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Create {isMerchant ? "Merchant " : ""}Account
              </button>

              <button
                onClick={() => navigate(loginUrl)}
                className="w-full py-3 rounded-xl border border-black/10 dark:border-white/10
                  text-black dark:text-white font-semibold
                  hover:bg-black/5 dark:hover:bg-white/5 transition-all
                  flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Log In
              </button>
            </div>

            <p className="text-black/30 dark:text-white/30 text-xs text-center mt-6">
              After logging in, you'll be redirected back here to link your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Already linked — show aggregated points
  if (status?.linked && !success) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="border border-black/10 dark:border-white/10 rounded-2xl p-8 bg-white/50 dark:bg-white/[0.02]">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <h1 className="text-2xl font-display font-bold text-black dark:text-white">
                Telegram Linked
              </h1>
            </div>

            <p className="text-black/60 dark:text-white/60 mb-6">
              Your Telegram account{" "}
              {status.telegram_username && (
                <span className="text-black dark:text-white font-medium">
                  @{status.telegram_username}
                </span>
              )}{" "}
              is linked to your Blip account.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-3 border-b border-black/5 dark:border-white/5">
                <span className="text-black/50 dark:text-white/50 text-sm">Website Points</span>
                <span className="text-black dark:text-white font-mono font-bold">{status.websitePoints}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-black/5 dark:border-white/5">
                <span className="text-black/50 dark:text-white/50 text-sm">Telegram Points</span>
                <span className="text-black dark:text-white font-mono font-bold">{status.telegramPoints}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-black dark:text-white font-semibold">Total Blip Points</span>
                <span className="text-orange-500 font-mono font-bold text-xl">{status.totalPoints}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-opacity"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success — just linked
  if (success) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="border border-green-500/20 rounded-2xl p-8 bg-green-500/5">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <h1 className="text-2xl font-display font-bold text-black dark:text-white">
                Successfully Linked!
              </h1>
            </div>

            <p className="text-black/60 dark:text-white/60 mb-6">
              Your Telegram account
              {success.telegram_username && (
                <span className="text-black dark:text-white font-medium">
                  {" "}@{success.telegram_username}
                </span>
              )}{" "}
              has been linked to your Blip account.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-3 border-b border-black/5 dark:border-white/5">
                <span className="text-black/50 dark:text-white/50 text-sm">Website Points</span>
                <span className="text-black dark:text-white font-mono font-bold">{success.websitePoints}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-black/5 dark:border-white/5">
                <span className="text-black/50 dark:text-white/50 text-sm">Telegram Points</span>
                <span className="text-black dark:text-white font-mono font-bold">{success.telegramPoints}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-black dark:text-white font-semibold">Total Blip Points</span>
                <span className="text-orange-500 font-mono font-bold text-xl">{success.totalPoints}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-opacity"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // OTP input form (authenticated, no token or token failed)
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        <div className="border border-black/10 dark:border-white/10 rounded-2xl p-8 bg-white/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-2">
            <Link2 className="w-7 h-7 text-orange-500" />
            <h1 className="text-2xl font-display font-bold text-black dark:text-white">
              Link Telegram
            </h1>
          </div>

          <p className="text-black/50 dark:text-white/50 text-sm mb-8">
            Enter the 6-digit OTP from the Telegram bot (/redeem command) to link
            your Telegram points to this account.
          </p>

          {/* Error from token auto-verify */}
          {error && !otp.join("") && (
            <div className="flex items-center gap-2 text-red-500 text-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* OTP Inputs */}
          <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-mono font-bold rounded-xl
                  border border-black/10 dark:border-white/10
                  bg-white dark:bg-white/5
                  text-black dark:text-white
                  focus:border-orange-500 focus:ring-1 focus:ring-orange-500
                  outline-none transition-all"
              />
            ))}
          </div>

          {/* Error from OTP verify */}
          {error && otp.join("") && (
            <div className="flex items-center gap-2 text-red-500 text-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Verify button */}
          <button
            onClick={handleVerify}
            disabled={loading || otp.join("").length !== 6}
            className="w-full py-3 rounded-xl bg-orange-500 text-white font-semibold
              hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed
              transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Link"
            )}
          </button>

          <p className="text-black/30 dark:text-white/30 text-xs text-center mt-4">
            OTP expires in 5 minutes. Generate a new one with /redeem in the bot.
          </p>
        </div>

        <p className="text-center text-black/30 dark:text-white/30 text-xs mt-4">
          Logged in as {user.email}
        </p>
      </div>
    </div>
  );
};

export default RedeemTelegram;

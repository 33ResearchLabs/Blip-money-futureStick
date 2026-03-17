import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  X,
  Copy,
  Check,
  Download,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { twoFactorApi } from "@/services/twoFatctor";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TwoFactorAuth() {
  const { user, refreshSession } = useAuth();
  const navigate = useNavigate();

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [manualKey, setManualKey] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [disableOtp, setDisableOtp] = useState("");
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);

  // Recovery codes state
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [recoveryCodesConfirmed, setRecoveryCodesConfirmed] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Regenerate recovery codes state
  const [showRegenerate, setShowRegenerate] = useState(false);
  const [regenOtp, setRegenOtp] = useState("");

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  if (!user) return null;

  const handleEnable2FA = async () => {
    try {
      const res = await twoFactorApi.enableGoogleAuth();
      setQrCode(res.qrCode);
      setManualKey(res.manualEntryKey);
      toast.success("Scan the QR code with your authenticator app");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to enable 2FA");
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await twoFactorApi.verifyGoogleAuth(otp);
      setRecoveryCodes(res.recoveryCodes);
      setQrCode(null);
      setManualKey(null);
      setOtp("");
      toast.success("2FA enabled! Save your recovery codes now.");
    } catch (error: any) {
      toast.error(error?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadRecoveryCodes = () => {
    if (!recoveryCodes) return;

    const content = [
      "===========================================",
      "  BLIP MONEY - 2FA RECOVERY CODES",
      "===========================================",
      "",
      "  Keep these codes in a safe place.",
      "  Each code can only be used ONCE.",
      "",
      `  Generated: ${new Date().toLocaleDateString()}`,
      `  Account: ${user.email}`,
      "",
      "-------------------------------------------",
      "",
      ...recoveryCodes.map((code, i) => `  ${i + 1}.  ${code}`),
      "",
      "-------------------------------------------",
      "",
      "  If you lose access to your authenticator",
      "  app, use one of these codes to sign in.",
      "",
      "  WARNING: Each code can only be used once.",
      "  Generate new codes from your account",
      "  settings when running low.",
      "",
      "===========================================",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blip-money-recovery-codes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Recovery codes downloaded");
  };

  const handleCopyManualKey = () => {
    if (!manualKey) return;
    navigator.clipboard.writeText(manualKey);
    setCopiedKey(true);
    toast.success("Manual key copied to clipboard");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleConfirmRecoveryCodes = async () => {
    setRecoveryCodes(null);
    setRecoveryCodesConfirmed(true);
    await refreshSession();
    toast.success("2FA setup complete!");
  };

  const handleRegenerateRecoveryCodes = async () => {
    if (regenOtp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await twoFactorApi.regenerateRecoveryCodes(regenOtp);
      setRecoveryCodes(res.recoveryCodes);
      setShowRegenerate(false);
      setRegenOtp("");
      toast.success("New recovery codes generated. Save them now!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to regenerate codes");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (disableOtp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      await twoFactorApi.disableGoogleAuth(disableOtp);
      toast.success("2FA Disabled Successfully");
      setDisableOtp("");
      setDisable(false);
      await refreshSession();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to disable 2FA");
    } finally {
      setLoading(false);
    }
  };

  // ── Recovery Codes Modal ──────────────────────────────
  if (recoveryCodes) {
    return (
      <div className="flex flex-col items-center px-4 pt-24 my-32 pb-12">
        <div
          className="w-full max-w-2xl
          bg-white dark:bg-[#0f0f0f]
          border border-black/10 dark:border-white/10
          shadow-xl dark:shadow-[0_0_40px_rgba(255,255,255,0.05)]
          rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-black dark:text-white">
                Save Your Recovery Codes
              </h1>
              <p className="text-sm text-black/60 dark:text-white/40">
                Store these codes securely. Each code can only be used once.
              </p>
            </div>
          </div>

          {/* Warning */}
          <div
            className="mb-6 p-4 rounded-xl
            bg-amber-50 dark:bg-amber-900/20
            border border-amber-200 dark:border-amber-700/40"
          >
            <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
              If you lose access to your authenticator app, you'll need one of
              these codes to sign in. Save them somewhere safe — you won't be
              able to see them again.
            </p>
          </div>

          {/* Recovery Codes Grid */}
          <div
            className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-xl
            bg-gray-50 dark:bg-black
            border border-black/10 dark:border-white/10"
          >
            {recoveryCodes.map((code, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 rounded-lg
                bg-white dark:bg-[#111]
                border border-black/5 dark:border-white/5
                font-mono text-sm text-black dark:text-white"
              >
                <span className="text-black/30 dark:text-white/30 text-xs w-5">
                  {i + 1}.
                </span>
                {code}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownloadRecoveryCodes}
              className="flex-1 flex items-center justify-center gap-2
              py-3 rounded-full font-semibold text-sm
              bg-black text-white
              dark:bg-white dark:text-black
              hover:opacity-90 transition"
            >
              <Download className="w-4 h-4" />
              Download Codes (.txt)
            </button>

            <button
              onClick={handleConfirmRecoveryCodes}
              className="flex-1 py-3 rounded-full font-semibold text-sm
              bg-green-600 text-white
              hover:bg-green-700 transition"
            >
              I've Saved My Codes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4 pt-24 my-32 pb-12">
      <div className="w-full max-w-2xl mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2
          px-3 py-1.5 rounded-full
          bg-black/5 dark:bg-white/5
          hover:bg-black/10 dark:hover:bg-white/10
          border border-black/10 dark:border-white/10
          text-black/60 dark:text-white/60 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      <div
        className="w-full max-w-2xl
        bg-white dark:bg-[#0f0f0f]
        border border-black/10 dark:border-white/10
        shadow-xl dark:shadow-[0_0_40px_rgba(255,255,255,0.05)]
        rounded-2xl p-8"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="p-2 rounded-lg
            bg-black/5 dark:bg-white/10
            text-black dark:text-white"
          >
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-black dark:text-white">
              Two-Factor Authentication
            </h1>
            <p className="text-sm text-black/60 dark:text-white/40">
              Secure your account with Google Authenticator
            </p>
          </div>
        </div>

        {/* Enable Section */}
        {!user.twoFactorEnabled && !recoveryCodesConfirmed && (
          <>
            <button
              onClick={handleEnable2FA}
              className="px-6 py-2.5 rounded-full font-semibold text-sm
              bg-black text-white
              dark:bg-white dark:text-black
              hover:opacity-90 transition"
            >
              Enable 2FA
            </button>

            {qrCode && (
              <div
                className="mt-6 p-6 rounded-xl
                bg-gray-50 dark:bg-black
                border border-black/10 dark:border-white/10"
              >
                {/* Instructions */}
                <div className="mb-4 space-y-2">
                  <p className="text-sm font-medium text-black dark:text-white">
                    Step 1: Scan QR Code
                  </p>
                  <p className="text-xs text-black/50 dark:text-white/40">
                    Open Google Authenticator (or any TOTP app) and scan this QR
                    code.
                  </p>
                </div>

                <img
                  src={qrCode}
                  alt="QR Code"
                  className="mx-auto mb-4 w-44 rounded-lg"
                />

                {/* Manual Entry Key */}
                {manualKey && (
                  <div className="mb-4">
                    <p className="text-xs text-black/50 dark:text-white/40 mb-2">
                      Can't scan? Enter this key manually:
                    </p>
                    <div
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg
                      bg-white dark:bg-[#111]
                      border border-black/10 dark:border-white/10"
                    >
                      <code className="flex-1 text-xs font-mono text-black dark:text-white break-all select-all">
                        {manualKey}
                      </code>
                      <button
                        onClick={handleCopyManualKey}
                        className="shrink-0 p-1.5 rounded-md
                        hover:bg-black/5 dark:hover:bg-white/10 transition"
                        title="Copy key"
                      >
                        {copiedKey ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-black/40 dark:text-white/40" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                <div className="mb-3">
                  <p className="text-sm font-medium text-black dark:text-white">
                    Step 2: Enter Verification Code
                  </p>
                  <p className="text-xs text-black/50 dark:text-white/40">
                    Enter the 6-digit code from your authenticator app to
                    confirm setup.
                  </p>
                </div>

                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-2.5 rounded-lg
                  bg-white dark:bg-[#111]
                  border border-black/10 dark:border-white/10
                  text-black dark:text-white text-center text-lg tracking-[0.2em] font-mono
                  focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.length !== 6}
                    className="flex-1 py-2.5 rounded-full font-semibold text-sm
                    bg-black text-white
                    dark:bg-white dark:text-black
                    disabled:opacity-50 transition"
                  >
                    {loading ? "Verifying..." : "Verify & Enable"}
                  </button>

                  <button
                    onClick={() => {
                      setQrCode(null);
                      setManualKey(null);
                      setOtp("");
                    }}
                    className="flex-1 py-2.5 rounded-full text-sm
                    bg-gray-200 dark:bg-white/10
                    text-black dark:text-white
                    hover:bg-gray-300 dark:hover:bg-white/20 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* 2FA Enabled - Status & Actions */}
        {(user.twoFactorEnabled || recoveryCodesConfirmed) && (
          <>
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6
              bg-green-50 dark:bg-green-900/20
              border border-green-200 dark:border-green-700/40"
            >
              <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Two-factor authentication is active
              </span>
            </div>

            {/* Regenerate Recovery Codes */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-black dark:text-white mb-2">
                Recovery Codes
              </h3>
              <p className="text-xs text-black/50 dark:text-white/40 mb-3">
                If you've used or lost your recovery codes, generate new ones
                here.
              </p>

              {!showRegenerate ? (
                <button
                  onClick={() => setShowRegenerate(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm
                  bg-black/5 dark:bg-white/5
                  hover:bg-black/10 dark:hover:bg-white/10
                  border border-black/10 dark:border-white/10
                  text-black dark:text-white transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate Recovery Codes
                </button>
              ) : (
                <div className="space-y-3 p-4 rounded-xl bg-gray-50 dark:bg-black border border-black/10 dark:border-white/10">
                  <p className="text-xs text-black/50 dark:text-white/40">
                    Enter your authenticator code to generate new recovery codes.
                    This will invalidate your old codes.
                  </p>
                  <input
                    value={regenOtp}
                    onChange={(e) =>
                      setRegenOtp(e.target.value.replace(/\D/g, ""))
                    }
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-2.5 rounded-lg
                    bg-white dark:bg-[#111]
                    border border-black/10 dark:border-white/10
                    text-black dark:text-white text-center font-mono tracking-[0.2em]
                    focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleRegenerateRecoveryCodes}
                      disabled={loading || regenOtp.length !== 6}
                      className="flex-1 py-2.5 rounded-full font-semibold text-sm
                      bg-black text-white dark:bg-white dark:text-black
                      disabled:opacity-50 transition"
                    >
                      {loading ? "Generating..." : "Generate New Codes"}
                    </button>
                    <button
                      onClick={() => {
                        setShowRegenerate(false);
                        setRegenOtp("");
                      }}
                      className="px-4 py-2.5 rounded-full text-sm
                      bg-gray-200 dark:bg-white/10
                      text-black dark:text-white transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Disable Section */}
            <div className="pt-6 border-t border-black/10 dark:border-white/10">
              <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3">
                Disable Two-Factor Authentication
              </h3>

              {!disable && (
                <button
                  onClick={() => setDisable(true)}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold
                  bg-red-600 text-white
                  hover:bg-red-700 transition"
                >
                  Disable 2FA
                </button>
              )}

              {disable && (
                <div className="mt-4 space-y-4">
                  <div className="flex justify-end">
                    <X
                      onClick={() => {
                        setDisable(false);
                        setDisableOtp("");
                      }}
                      className="cursor-pointer text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
                    />
                  </div>

                  <input
                    value={disableOtp}
                    onChange={(e) =>
                      setDisableOtp(e.target.value.replace(/\D/g, ""))
                    }
                    maxLength={6}
                    placeholder="Enter OTP to disable"
                    className="w-full px-4 py-2.5 rounded-lg
                    bg-white dark:bg-[#111]
                    border border-black/10 dark:border-white/10
                    text-black dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-red-500"
                  />

                  <button
                    onClick={handleDisable2FA}
                    disabled={loading || disableOtp.length !== 6}
                    className="w-full py-2.5 rounded-full text-sm font-semibold
                    bg-red-600 text-white
                    hover:bg-red-700 disabled:opacity-50 transition"
                  >
                    {loading ? "Disabling..." : "Confirm Disable"}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

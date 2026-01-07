import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { twoFactorApi } from "@/services/twoFatctor";
import { useAuth } from "@/contexts/AuthContext";

export default function TwoFactorAuth() {
  const { user, refreshSession } = useAuth();

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [disableOtp, setDisableOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  // ================= ENABLE 2FA =================
  const handleEnable2FA = async () => {
    try {
      const res = await twoFactorApi.enableGoogleAuth();

      
        setQrCode(res.qrCode);
        toast.success("Google Authenticator setup started", {
          description: "Scan the QR code using the Google Authenticator app.",
        });
      
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to enable 2FA");
    }
  };

  // ================= VERIFY OTP =================
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await twoFactorApi.verifyGoogleAuth(otp);

      toast.success("Google Authenticator enabled", {
        description: "Two-factor authentication is now active on your account.",
      });

      setQrCode(null);
      setOtp("");
      await refreshSession();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  // ================= DISABLE 2FA =================
  const handleDisable2FA = async () => {
    if (disableOtp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await twoFactorApi.disableGoogleAuth(disableOtp);

      toast.success("Google Authenticator disabled", {
        description: "Two-factor authentication has been turned off.",
      });

      setDisableOtp("");
      await refreshSession();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to disable 2FA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-40 bg-zinc-900 border border-zinc-700 rounded-md p-6">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck className="text-green-400" />
        <h1 className="text-lg font-semibold text-white">
          Two-Factor Authentication
        </h1>
      </div>

      <p className="text-sm text-zinc-400 mb-6">
        Add an extra layer of security using Google Authenticator.
      </p>

      {/* ================= ENABLE FLOW ================= */}
      {!user.twoFactorEnabled && (
        <>
          <button
            onClick={handleEnable2FA}
            className="px-4 py-2 bg-green-500 text-black text-sm font-bold rounded hover:bg-green-400"
          >
            Enable 2FA
          </button>

          {qrCode && (
            <div className="mt-6 p-4 bg-black border border-zinc-700 rounded">
              <p className="text-xs text-zinc-400 mb-3">
                Scan the QR code and enter OTP
              </p>

              <img src={qrCode} alt="2FA QR" className="mb-4 mx-auto" />

              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded text-white mb-3"
              />

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full px-4 py-2 bg-green-500 text-black font-bold rounded disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}
        </>
      )}

      {/* ================= DISABLE FLOW ================= */}
      {user.twoFactorEnabled && (
        <div className="mt-8 border-t border-zinc-700 pt-6">
          <h3 className="text-sm text-red-400 mb-2">
            Disable Two-Factor Authentication
          </h3>

          <input
            value={disableOtp}
            onChange={(e) => setDisableOtp(e.target.value.replace(/\D/g, ""))}
            maxLength={6}
            placeholder="Enter OTP to disable"
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded text-white mb-3"
          />

          <button
            onClick={handleDisable2FA}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-black font-bold rounded disabled:opacity-50"
          >
            {loading ? "Disabling..." : "Disable 2FA"}
          </button>
        </div>
      )}
    </div>
  );
}

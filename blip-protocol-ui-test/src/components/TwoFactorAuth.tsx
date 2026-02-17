import { useState, useEffect } from "react";
import { ArrowLeft, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { twoFactorApi } from "@/services/twoFatctor";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TwoFactorAuth() {
  const { user, refreshSession } = useAuth();
  const navigate = useNavigate();

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [disableOtp, setDisableOtp] = useState("");
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  if (!user) return null;

  const handleEnable2FA = async () => {
    try {
      const res = await twoFactorApi.enableGoogleAuth();
      setQrCode(res.qrCode);
      toast.success("Google Authenticator setup started");
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
      await twoFactorApi.verifyGoogleAuth(otp);
      toast.success("2FA Enabled Successfully");
      setQrCode(null);
      setOtp("");
      await refreshSession();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to verify OTP");
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
      await refreshSession();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to disable 2FA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center px-4 pt-24 pb-12"
    >
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
        {!user.twoFactorEnabled && (
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
                <p className="text-sm text-black/60 dark:text-white/40 mb-4 text-center">
                  Scan the QR code and enter OTP
                </p>

                <img src={qrCode} alt="QR Code" className="mx-auto mb-4 w-40" />

                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-2.5 rounded-lg
                  bg-white dark:bg-[#111]
                  border border-black/10 dark:border-white/10
                  text-black dark:text-white
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
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>

                  <button
                    onClick={() => {
                      setQrCode(null);
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

        {/* Disable Section */}
        {user.twoFactorEnabled && (
          <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
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
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Loader2, ExternalLink, CheckCircle2, XCircle, MessageCircle } from "lucide-react";

interface TelegramVerifyProps {
  onVerify: (telegramUserId: string) => Promise<void>;
  onClose: () => void;
  telegramLink: string;
}

export default function TelegramVerify({ onVerify, onClose, telegramLink }: TelegramVerifyProps) {
  const [telegramUserId, setTelegramUserId] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"join" | "verify">("join");

  const handleJoinChannel = () => {
    window.open(telegramLink, "_blank");
    setStep("verify");
  };

  const handleVerify = async () => {
    if (!telegramUserId.trim()) {
      setError("Please enter your Telegram User ID");
      return;
    }

    setError("");
    setVerifying(true);

    try {
      await onVerify(telegramUserId.trim());
    } catch (err: any) {
      setError(err?.response?.data?.message || "Verification failed. Make sure you joined the channel.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Join Telegram Channel</h2>
          <p className="text-sm text-zinc-400">
            Join our Telegram channel and verify your membership to earn points.
          </p>
        </div>

        {step === "join" ? (
          <div className="space-y-4">
            <button
              onClick={handleJoinChannel}
              className="w-full py-3 px-6 rounded-full font-bold bg-blue-500 text-white hover:bg-blue-600 transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Join Telegram Channel
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => setStep("verify")}
              className="w-full py-2 text-sm text-zinc-500 hover:text-white transition"
            >
              I already joined, verify now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Instructions */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded p-4 text-sm">
              <p className="text-zinc-300 font-medium mb-2">How to get your Telegram User ID:</p>
              <ol className="list-decimal list-inside text-zinc-400 space-y-1">
                <li>Open Telegram</li>
                <li>Search for <span className="text-blue-400">@userinfobot</span></li>
                <li>Start the bot and it will show your ID</li>
                <li>Copy and paste the numeric ID below</li>
              </ol>
            </div>

            {/* Input */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                Your Telegram User ID
              </label>
              <input
                type="text"
                value={telegramUserId}
                onChange={(e) => setTelegramUserId(e.target.value)}
                placeholder="e.g., 123456789"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <XCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={verifying || !telegramUserId.trim()}
              className="w-full py-3 px-6 rounded-full font-bold bg-[#39ff14] text-black hover:bg-[#2fe610] transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {verifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Verify Membership
                </>
              )}
            </button>

            <button
              onClick={() => setStep("join")}
              className="w-full py-2 text-sm text-zinc-500 hover:text-white transition"
            >
              ← Back to join channel
            </button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="w-full py-2 text-sm text-zinc-500 hover:text-white transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

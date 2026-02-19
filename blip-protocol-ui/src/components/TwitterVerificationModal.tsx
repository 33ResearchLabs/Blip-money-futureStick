import React, { useState } from "react";
import {
  X,
  Twitter,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { api } from "@/services/api";

interface TwitterVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (points: number) => void;
  userWallet: string;
  userRole?: string;
}

type VerificationStep = "tweet" | "submit" | "verifying" | "success" | "error";

const CAMPAIGN_MESSAGE = `🚀 Just joined @BlipMoney - the future of decentralized payments and rewards!

Earn points, participate in governance, and be part of the next-gen financial protocol.

Join the revolution: ${typeof window !== 'undefined' ? window.location.origin : ''}

#BlipMoney #DeFi #Web3`;

export default function TwitterVerificationModal({
  isOpen,
  onClose,
  userWallet,
  onSuccess,
  userRole,
}: TwitterVerificationModalProps) {
  const REWARD_POINTS = userRole === "MERCHANT" ? 500 : 100;
  const [step, setStep] = useState<VerificationStep>("tweet");
  const [tweetUrl, setTweetUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyMessage = async () => {
    await navigator.clipboard.writeText(CAMPAIGN_MESSAGE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTweetNow = () => {
    const tweetText = encodeURIComponent(CAMPAIGN_MESSAGE);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(twitterUrl, "_blank", "width=550,height=420");
    setStep("submit");
  };

  const extractTweetId = (url: string): string | null => {
    // Match patterns:
    // https://twitter.com/username/status/1234567890
    // https://x.com/username/status/1234567890
    const patterns = [
      /(?:twitter|x)\.com\/\w+\/status\/(\d+)/,
      /\/status\/(\d+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleVerifyTweet = async () => {
    setError("");

    // Validate URL format
    const tweetId = extractTweetId(tweetUrl);
    if (!tweetId) {
      setError("Invalid tweet URL. Please paste the full URL from Twitter/X.");
      return;
    }

    setStep("verifying");

    try {
      const data: any = await api.post("/twitter/verify", {
        tweetId,
        tweetUrl,
        wallet_address: userWallet,
      });

      if (data.success) {
        setStep("success");
        setTimeout(() => {
          onSuccess(REWARD_POINTS);
          handleClose();
        }, 2000);
      } else {
        setStep("error");
        setError(data.message || "Tweet verification failed.");
      }
    } catch (err: any) {
      setStep("error");
      setError(
        err.response?.data?.message ||
          "Network error. Please check your connection and try again."
      );
    }
  };

  const handleClose = () => {
    setStep("tweet");
    setTweetUrl("");
    setError("");
    onClose();
  };

  const handleRetry = () => {
    setStep("submit");
    setError("");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 dark:bg-black/90 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-neutral-800 shadow-2xl rounded-sm">
        <div className="p-8">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-black/50 dark:text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-black/5 dark:bg-neutral-900 border border-black/10 dark:border-neutral-800 text-black dark:text-white rounded-sm">
              <Twitter className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-black dark:text-white uppercase">
                Share on X (Twitter)
              </h3>
              <span className="text-xs text-black/60 dark:text-neutral-500">
                REWARD: {REWARD_POINTS} PTS
              </span>
            </div>
          </div>

          {/* Step 1: Tweet Message */}
          {step === "tweet" && (
            <>
              <div className="p-5 bg-black/5 dark:bg-neutral-900/30 border border-black/10 dark:border-neutral-800 rounded-sm mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[10px] uppercase tracking-widest text-black/50 dark:text-neutral-500">
                    Campaign Message
                  </h4>
                  <button
                    onClick={handleCopyMessage}
                    className="text-xs flex items-center gap-1 text-black/60 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-black/80 dark:text-neutral-300 whitespace-pre-line leading-relaxed">
                  {CAMPAIGN_MESSAGE}
                </p>
              </div>

              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-sm">
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-900 dark:text-blue-300">
                    <p className="font-semibold mb-1">Important:</p>
                    <ul className="space-y-1 text-blue-800 dark:text-blue-400">
                      <li>• Your tweet must be public (not protected)</li>
                      <li>• Must include @BlipMoney mention</li>
                      <li>• Each tweet can only be verified once</li>
                      <li>• Wallet must be connected</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={handleTweetNow}
                className="w-full py-3 px-4 bg-black text-white dark:bg-white dark:text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Twitter className="w-4 h-4" />
                Tweet Now
                <ExternalLink className="w-3 h-3" />
              </button>
            </>
          )}

          {/* Step 2: Submit Tweet URL */}
          {step === "submit" && (
            <>
              <div className="p-5 bg-black/5 dark:bg-neutral-900/30 border border-black/10 dark:border-neutral-800 rounded-sm mb-6">
                <h4 className="text-[10px] uppercase tracking-widest text-black/50 dark:text-neutral-500 mb-3">
                  Submit Your Tweet
                </h4>
                <p className="text-sm text-black/80 dark:text-neutral-300 mb-4">
                  After posting your tweet, paste the tweet URL below to verify
                  and claim your reward.
                </p>

                <div className="mb-4">
                  <label className="text-xs text-black/60 dark:text-neutral-400 mb-2 block">
                    Tweet URL
                  </label>
                  <input
                    type="text"
                    value={tweetUrl}
                    onChange={(e) => setTweetUrl(e.target.value)}
                    placeholder="https://twitter.com/username/status/..."
                    className="w-full px-3 py-2 bg-white dark:bg-black border border-black/20 dark:border-neutral-700 text-black dark:text-white text-sm focus:border-black dark:focus:border-white outline-none transition-colors"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-3 rounded-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("tweet")}
                  className="flex-1 py-3 text-xs uppercase tracking-wider border border-black/10 dark:border-neutral-800 text-black/60 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-neutral-900 transition-colors"
                >
                  Back
                </button>

                <button
                  onClick={handleVerifyTweet}
                  disabled={!tweetUrl}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-wider bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verify Tweet
                </button>
              </div>
            </>
          )}

          {/* Step 3: Verifying */}
          {step === "verifying" && (
            <div className="py-12 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-black dark:text-white animate-spin mb-4" />
              <p className="text-sm text-black dark:text-white font-semibold mb-2">
                Verifying your tweet...
              </p>
              <p className="text-xs text-black/60 dark:text-neutral-500">
                This may take a few seconds
              </p>
            </div>
          )}

          {/* Step 4: Success */}
          {step === "success" && (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-lg font-bold text-black dark:text-white mb-2">
                Verification Successful!
              </p>
              <p className="text-sm text-black/60 dark:text-neutral-400 mb-4">
                You earned {REWARD_POINTS} points
              </p>
              <div className="text-xs text-black/50 dark:text-neutral-500 bg-black/5 dark:bg-neutral-900/30 border border-black/10 dark:border-neutral-800 px-4 py-2 rounded-sm">
                Points will be added to your account
              </div>
            </div>
          )}

          {/* Step 5: Error */}
          {step === "error" && (
            <>
              <div className="py-8 flex flex-col items-center justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-lg font-bold text-black dark:text-white mb-2">
                  Verification Failed
                </p>
                <p className="text-sm text-black/60 dark:text-neutral-400 text-center max-w-md">
                  {error}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 text-xs uppercase tracking-wider border border-black/10 dark:border-neutral-800 text-black/60 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-neutral-900 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleRetry}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-wider bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition"
                >
                  Try Again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

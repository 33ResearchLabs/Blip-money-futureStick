import React, { useState, useEffect } from "react";
import {
  X,
  Copy,
  Share2,
  Check,
  Users,
  Loader2,
  Gift,
  Wallet,
  Calendar,
} from "lucide-react";
import { airdropApi } from "@/services/Airdrop";

interface ReferredUser {
  id: string;
  email: string;
  wallet_address: string;
  joinedAt: string;
  totalBlipPoints: number;
  rewardStatus: string;
  rewardAmount: number;
}

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
  referralLink: string;
  userRole?: string;
}

export default function ReferralModal({
  isOpen,
  onClose,
  referralCode,
  referralLink,
  userRole,
}: ReferralModalProps) {
  const referralRewardPoints = userRole === "MERCHANT" ? 1000 : 100;
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState<ReferredUser[]>([]);
  const [totalRewards, setTotalRewards] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchReferrals();
    }
  }, [isOpen]);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const res: any = await airdropApi.getMyReferrals();
      setReferrals(res.referrals || []);
      setTotalRewards(res.totalRewardsEarned || 0);
    } catch (err) {
      console.error("Failed to fetch referrals", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "Join Blip Money",
      text: `Join Blip Money and earn rewards! Use my referral code: ${referralCode}`,
      url: referralLink,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await handleCopy();
      }
    } catch (err) {
      console.log("Share cancelled or failed");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatWallet = (address: string) => {
    if (!address) return "—";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="
          bg-white dark:bg-[#0A0A0A]
          border border-black/10 dark:border-neutral-800
          rounded-sm shadow-2xl
          w-full max-w-lg sm:max-w-md
          max-h-[90vh] overflow-y-auto overflow-x-hidden
          mx-4 sm:mx-0
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-black dark:text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-black dark:text-white">
                Your Referrals
              </h2>
              <p className="text-xs text-black/50 dark:text-neutral-500">
                Earn +{referralRewardPoints.toLocaleString()} pts for each referral
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-black/5 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5 text-black/50 dark:text-neutral-400" />
          </button>
        </div>

        {/* Referral Link Section */}
        <div className="p-6 border-b border-black/10 dark:border-neutral-800 bg-black/[0.02] dark:bg-neutral-900/50">
          <div className="mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-neutral-500">
              Your Referral Code
            </span>

            <div className="text-2xl font-mono font-bold text-black dark:text-white mt-1">
              {referralCode}
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-neutral-700 rounded-sm">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 bg-transparent text-xs text-black/60 dark:text-neutral-400 outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="p-2 rounded-sm bg-black/5 dark:bg-neutral-700 hover:bg-black/10 dark:hover:bg-neutral-600 transition-colors"
              title="Copy link"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-black/60 dark:text-neutral-400" />
              )}
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-sm bg-black dark:bg-white hover:opacity-90 transition-colors"
              title="Share link"
            >
              <Share2 className="w-4 h-4 text-white dark:text-black" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 p-6 border-b border-black/10 dark:border-neutral-800">
          <div className="p-4 bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-neutral-800 rounded-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-black/40 dark:text-neutral-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-neutral-500">
                Total Referrals
              </span>
            </div>
            <span className="text-2xl font-bold text-black dark:text-white">
              {referrals.length}
            </span>
          </div>
          <div className="p-4 bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-neutral-800 rounded-sm">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-4 h-4 text-black/40 dark:text-neutral-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-neutral-500">
                Rewards Earned
              </span>
            </div>
            <span className="text-2xl font-bold text-black dark:text-white">
              +{totalRewards}
            </span>
          </div>
        </div>

        {/* Referred Users List */}
        <div className="p-6 max-h-[300px] overflow-y-auto">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-neutral-500 mb-4">
            Referred Users
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-black dark:text-white animate-spin" />
            </div>
          ) : referrals.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-black/20 dark:text-neutral-700 mx-auto mb-3" />
              <p className="text-black/50 dark:text-neutral-500 text-sm">
                No referrals yet
              </p>
              <p className="text-black/40 dark:text-neutral-600 text-xs mt-1">
                Share your link to start earning rewards!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((user, index) => (
                <div
                  key={user.id || index}
                  className="flex items-center justify-between p-4 bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-neutral-800 rounded-sm hover:border-black/20 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-neutral-700 flex items-center justify-center">
                      <span className="text-xs font-bold text-black/60 dark:text-neutral-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Wallet className="w-3 h-3 text-black/40 dark:text-neutral-500" />
                        <span className="text-sm font-mono text-black/70 dark:text-neutral-300">
                          {formatWallet(user.wallet_address)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-black/30 dark:text-neutral-600" />
                        <span className="text-[10px] text-black/40 dark:text-neutral-500">
                          Joined {formatDate(user.joinedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-black dark:text-white">
                      +{user.rewardAmount || 100}
                    </span>
                    <div className="text-[10px] text-black/40 dark:text-neutral-500">
                      pts earned
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black/10 dark:border-neutral-800 bg-black/[0.02] dark:bg-neutral-900/50">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-sm font-bold bg-black/5 dark:bg-neutral-800 text-black/70 dark:text-neutral-300 hover:bg-black/10 dark:hover:bg-neutral-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

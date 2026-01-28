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
}

export default function ReferralModal({
  isOpen,
  onClose,
  referralCode,
  referralLink,
}: ReferralModalProps) {
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg   w-full
    max-w-lg
    sm:max-w-md
    max-h-[90vh]

    overflow-y-auto
    overflow-x-hidden

    mx-4
    sm:mx-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF9F1A]/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#FF9F1A]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Your Referrals</h2>
              <p className="text-xs text-zinc-500">
                Earn +100 pts for each referral
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Referral Link Section */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/50">
          <div className="mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Your Referral Code
            </span>
            <div className="text-2xl font-mono font-bold text-[#FF9F1A] mt-1">
              {referralCode}
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-zinc-800/50 border border-zinc-700 rounded">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 bg-transparent text-xs text-zinc-400 outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="p-2 rounded bg-zinc-700 hover:bg-zinc-600 transition-colors"
              title="Copy link"
            >
              {copied ? (
                <Check className="w-4 h-4 text-[#FF9F1A]" />
              ) : (
                <Copy className="w-4 h-4 text-zinc-400" />
              )}
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded bg-[#FF9F1A] hover:bg-[#FF9F1A] transition-colors"
              title="Share link"
            >
              <Share2 className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 p-6 border-b border-zinc-800">
          <div className="p-4 bg-zinc-800/30 border border-zinc-800 rounded">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-zinc-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Total Referrals
              </span>
            </div>
            <span className="text-2xl font-bold text-white">
              {referrals.length}
            </span>
          </div>
          <div className="p-4 bg-zinc-800/30 border border-zinc-800 rounded">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-4 h-4 text-zinc-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Rewards Earned
              </span>
            </div>
            <span className="text-2xl font-bold text-[#FF9F1A]">
              +{totalRewards}
            </span>
          </div>
        </div>

        {/* Referred Users List */}
        <div className="p-6 max-h-[300px] overflow-y-auto">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">
            Referred Users
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-[#FF9F1A] animate-spin" />
            </div>
          ) : referrals.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">No referrals yet</p>
              <p className="text-zinc-600 text-xs mt-1">
                Share your link to start earning rewards!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((user, index) => (
                <div
                  key={user.id || index}
                  className="flex items-center justify-between p-4 bg-zinc-800/30 border border-zinc-800 rounded hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                      <span className="text-xs font-bold text-zinc-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Wallet className="w-3 h-3 text-zinc-500" />
                        <span className="text-sm font-mono text-zinc-300">
                          {formatWallet(user.wallet_address)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-zinc-600" />
                        <span className="text-[10px] text-zinc-500">
                          Joined {formatDate(user.joinedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#FF9F1A]">
                      +{user.rewardAmount || 100}
                    </span>
                    <div className="text-[10px] text-zinc-500">pts earned</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
          <button
            onClick={onClose}
            className="w-full py-3 rounded font-bold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

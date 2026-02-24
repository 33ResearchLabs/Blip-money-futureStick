import React, { useState, useEffect } from "react";
import {
  X,
  Loader2,
  Coins,
  Twitter,
  MessageCircle,
  BookOpen,
  UserPlus,
  Gift,
  ArrowLeftRight,
  Calendar,
} from "lucide-react";
import { airdropApi } from "@/services/Airdrop";

interface PointLog {
  id: string;
  points: number;
  event: string;
  eventLabel: string;
  date: string;
}

interface PointsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPoints: number;
}

export default function PointsHistoryModal({
  isOpen,
  onClose,
  totalPoints,
}: PointsHistoryModalProps) {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<PointLog[]>([]);

  // Calculate total from history instead of using cached value
  const calculatedTotal = history.reduce((sum, log) => sum + log.points, 0);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res: any = await airdropApi.getMyPointsHistory();
      setHistory(res.history || []);
    } catch (err) {
      // Failed to fetch points history
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get icon based on event type
  const getEventIcon = (event: string) => {
    switch (event) {
      case "REGISTER":
        return <UserPlus className="w-4 h-4" />;
      case "TWITTER_FOLLOW":
        return <Twitter className="w-4 h-4" />;
      case "TELEGRAM_JOIN":
        return <MessageCircle className="w-4 h-4" />;
      case "WHITEPAPER_READ":
        return <BookOpen className="w-4 h-4" />;
      case "CROSS_BORDER_SWAP":
        return <ArrowLeftRight className="w-4 h-4" />;
      case "REFERRAL_BONUS_EARNED":
      case "REFERRAL_BONUS_RECEIVED":
        return <Gift className="w-4 h-4" />;
      default:
        return <Coins className="w-4 h-4" />;
    }
  };

  // Get color based on event type
  const getEventColor = (event: string) => {
    switch (event) {
      case "REGISTER":
        return "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30";
      case "TWITTER_FOLLOW":
        return "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "TELEGRAM_JOIN":
        return "bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30";
      case "WHITEPAPER_READ":
        return "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "CROSS_BORDER_SWAP":
        return "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30";
      case "REFERRAL_BONUS_EARNED":
      case "REFERRAL_BONUS_RECEIVED":
        return "bg-pink-500/20 text-pink-600 dark:text-pink-400 border-pink-500/30";
      default:
        return "bg-zinc-500/20 text-zinc-600 dark:text-zinc-400 border-zinc-500/30";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-zinc-800 rounded-sm max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center">
              <Coins className="w-5 h-5 text-black dark:text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-black dark:text-white">Points History</h2>
              <p className="text-xs text-black/50 dark:text-zinc-500">
                Track your earned rewards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-black/5 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5 text-black/40 dark:text-zinc-400" />
          </button>
        </div>

        {/* Total Points */}
        <div className="p-6 border-b border-black/10 dark:border-zinc-800 bg-black/5 dark:bg-white/5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-zinc-500">
                Total Accumulated Points
              </span>
              <div className="text-4xl font-black text-black dark:text-white tracking-tighter mt-1">
                {calculatedTotal || totalPoints}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-zinc-500">
                Transactions
              </span>
              <div className="text-2xl font-bold text-black dark:text-white mt-1">
                {history.length}
              </div>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-zinc-500 mb-4">
            Points Breakdown
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-black dark:text-white animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <Coins className="w-12 h-12 text-black/20 dark:text-zinc-700 mx-auto mb-3" />
              <p className="text-black/50 dark:text-zinc-500 text-sm">No points earned yet</p>
              <p className="text-black/40 dark:text-zinc-600 text-xs mt-1">
                Complete tasks to earn points!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((log, index) => (
                <div
                  key={log.id || index}
                  className="flex items-center justify-between p-4 bg-black/5 dark:bg-zinc-800/30 border border-black/10 dark:border-zinc-800 rounded-sm hover:border-black/20 dark:hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border ${getEventColor(
                        log.event
                      )}`}
                    >
                      {getEventIcon(log.event)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-black dark:text-zinc-200">
                        {log.eventLabel}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3 text-black/30 dark:text-zinc-600" />
                        <span className="text-[10px] text-black/40 dark:text-zinc-500">
                          {formatDate(log.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-black dark:text-white">
                      +{log.points}
                    </span>
                    <div className="text-[10px] text-black/40 dark:text-zinc-500">pts</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black/10 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-sm font-bold bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

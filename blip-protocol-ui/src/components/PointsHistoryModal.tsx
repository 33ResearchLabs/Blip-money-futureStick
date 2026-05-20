import { useState, useEffect } from "react";
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
  TrendingUp,
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
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div
        className="
          w-full max-w-lg max-h-[90vh] overflow-hidden
          bg-white dark:bg-[#0f0f0f]
          border border-black/[0.08] dark:border-white/[0.06]
          rounded-xl shadow-2xl
          flex flex-col
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ff6b35]/15 border border-[#ff6b35]/30 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-[#ff6b35]" />
            </div>
            <div>
              <h2 className="text-base font-black font-display text-black dark:text-white tracking-tight">
                Points History
              </h2>
              <p className="text-[11px] text-black/40 dark:text-white/40">
                Track your earned rewards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-black/[0.03] dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4 text-black/40 dark:text-white/40" />
          </button>
        </div>

        {/* Total + Transactions */}
        <div className="px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.06] bg-[#F5F3F0] dark:bg-white/5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-black/40 dark:text-white/40">
                Total Points
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-black font-display text-black dark:text-white leading-none tracking-tight">
                  {(calculatedTotal || totalPoints).toLocaleString()}
                </span>
                <span className="text-xs font-bold text-black/40 dark:text-white/40">
                  pts
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-black/40 dark:text-white/40">
                Transactions
              </span>
              <div className="text-2xl font-black font-display text-black dark:text-white leading-none mt-1">
                {history.length}
              </div>
            </div>
          </div>
        </div>

        {/* History list */}
        <div className="px-5 py-4 overflow-y-auto flex-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-black/40 dark:text-white/40 mb-3">
            Points Breakdown
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-black/40 dark:text-white/40 animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <Coins className="w-10 h-10 text-black/20 dark:text-white/20 mx-auto mb-3" />
              <p className="text-sm font-medium text-black/60 dark:text-white/60">
                No points earned yet
              </p>
              <p className="text-[11px] text-black/40 dark:text-white/40 mt-1">
                Complete quests to earn points!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((log, index) => (
                <div
                  key={log.id || index}
                  className="
                    flex items-center justify-between
                    px-3 py-2.5 rounded-md
                    bg-[#F5F3F0] dark:bg-white/5
                    border border-black/[0.06] dark:border-white/[0.06]
                    hover:border-[#ff6b35]/30
                    transition-colors
                  "
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-md bg-white dark:bg-black/40 border border-black/[0.08] dark:border-white/[0.06] flex items-center justify-center text-black dark:text-white shrink-0">
                      {getEventIcon(log.event)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-black dark:text-white truncate">
                        {log.eventLabel}
                      </div>
                      <div className="text-[10px] text-black/40 dark:text-white/40 mt-0.5">
                        {formatDate(log.date)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <span className="text-base font-black font-display text-[#ff6b35]">
                      +{log.points.toLocaleString()}
                    </span>
                    <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-black/40 dark:text-white/40">
                      pts
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-black/[0.06] dark:border-white/[0.06]">
          <button
            onClick={onClose}
            className="
              w-full py-2.5 rounded-md
              bg-black text-white dark:bg-white dark:text-black
              text-[11px] font-bold uppercase tracking-[0.14em]
              hover:opacity-90 active:scale-[0.98] transition
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

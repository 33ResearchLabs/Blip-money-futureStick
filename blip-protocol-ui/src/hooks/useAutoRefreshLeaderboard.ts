import { useState, useEffect, useCallback, useRef } from "react";
import {
  generateLeaderboardData,
  type LeaderboardEntry,
} from "@/utils/leaderboardMockData";
import { airdropApi } from "@/services/Airdrop";

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
const TARGET_COUNT = 20;

export function useAutoRefreshLeaderboard(enabled: boolean = true) {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res: any = await airdropApi.getMerchantLeaderboard("points");
      const realData: LeaderboardEntry[] = res.leaderboard || [];

      // Fill remaining slots with mock data so the board always has 20 entries
      const mockCount = Math.max(0, TARGET_COUNT - realData.length);
      const realNames = new Set(realData.map((m) => m.name.toLowerCase()));
      const mockData = generateLeaderboardData(mockCount + 10)
        .filter((m) => !realNames.has(m.name.toLowerCase()))
        .slice(0, mockCount);

      // Real merchants first, then mock to fill
      const combined = [...realData, ...mockData];
      combined.sort((a, b) => b.allocation - a.allocation);
      combined.forEach((e, i) => {
        e.rank = i + 1;
      });

      setData(combined);
    } catch {
      setData(generateLeaderboardData(TARGET_COUNT));
    } finally {
      setLastRefreshed(new Date());
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (enabled) refresh();
  }, [enabled, refresh]);

  // 2-hour interval
  useEffect(() => {
    if (!enabled) return;

    intervalRef.current = setInterval(refresh, TWO_HOURS_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, refresh]);

  return { data, isRefreshing, lastRefreshed, refresh };
}

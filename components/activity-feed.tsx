"use client";

import { useQuery } from "@tanstack/react-query";

type RecentItem = {
  id: string;
  title: string;
  created_at: string;
};

async function fetchStats() {
  const res = await fetch("/api/stats");
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function ActivityFeed() {
  const { data, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 2,
  });

  if (isLoading)
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-10 bg-gray-50 rounded-lg
          animate-pulse"
          />
        ))}
      </div>
    );

  const recent: RecentItem[] = data?.recent ?? [];

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <p className="text-sm font-medium mb-4">Recent activity</p>
      {recent.length === 0 ? (
        <p className="text-gray-400 text-sm">No activity yet.</p>
      ) : (
        <div className="space-y-3">
          {recent.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between
                   py-2 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-1.5 h-1.5 rounded-full
                  bg-black flex shrink-0"
                />
                <p className="text-sm">{item.title}</p>
              </div>
              <p className="text-xs text-gray-400 flex shrink-0">
                {timeAgo(item.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

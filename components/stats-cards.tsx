"use client";

import { useQuery } from "@tanstack/react-query";

type Stats = {
  total: number;
  thisMonth: number;
  lastMonth: number;
  growth: number;
  recent: { id: string; title: string; created_at: string }[];
};

async function fetchStats(): Promise<Stats> {
  const res = await fetch("/api/stats");
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export default function StatsCards() {
  const { data, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 2,
  });

  if (isLoading)
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-lg p-4 h-20
          animate-pulse"
          />
        ))}
      </div>
    );

  const cards = [
    { label: "Total items", value: data?.total ?? 0, sub: "all time" },
    {
      label: "This month",
      value: data?.thisMonth ?? 0,
      sub: `${(data?.growth ?? 0 > 0) ? "+" : ""}${data?.growth ?? 0}% vs last`,
    },
    {
      label: "Last month",
      value: data?.lastMonth ?? 0,
      sub: "previous period",
    },
    {
      label: "Growth",
      value: `${(data?.growth ?? 0 > 0) ? "+" : ""}${data?.growth ?? 0}%`,
      sub: "month on month",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {cards.map((card) => (
        <div key={card.label} className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">{card.label}</p>
          <p className="text-2xl font-medium">{card.value}</p>
          <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}

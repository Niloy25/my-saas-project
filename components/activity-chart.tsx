"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

type ChartPoint = { date: string; count: number };

async function fetchChart(): Promise<ChartPoint[]> {
  const res = await fetch("/api/stats/chart");
  if (!res.ok) throw new Error("Failed");
  const { data } = await res.json();
  return data;
}

export default function ActivityChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["chart"],
    queryFn: fetchChart,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!data || !canvasRef.current) return;

    const loadChart = async () => {
      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);

      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      const lineColor = isDark ? "#9FE1CB" : "#1D9E75";
      const fillColor = isDark
        ? "rgba(29,158,117,0.12)"
        : "rgba(29,158,117,0.08)";
      const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
      const textColor = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.35)";
      const tooltipBg = isDark ? "#1a1a1a" : "#fff";
      const tooltipBorder = isDark
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.08)";

      chartRef.current = new Chart(canvasRef.current!, {
        type: "line",
        data: {
          labels: data.map((d) => d.date),
          datasets: [
            {
              data: data.map((d) => d.count),
              borderColor: lineColor,
              backgroundColor: fillColor,
              borderWidth: 1.5,
              fill: true,
              tension: 0.4,
              pointRadius: 3,
              pointBackgroundColor: lineColor,
              pointBorderColor: "transparent",
              pointHoverRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: tooltipBg,
              borderColor: tooltipBorder,
              borderWidth: 1,
              titleColor: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)",
              bodyColor: isDark ? "#fff" : "#000",
              bodyFont: { size: 13, weight: 500 },
              titleFont: { size: 11 },
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                title: (ctx) => ctx[0].label,
                label: (ctx) =>
                  ctx.parsed.y + " item" + (ctx.parsed.y !== 1 ? "s" : ""),
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              border: { display: false },
              ticks: { color: textColor, font: { size: 11 }, maxRotation: 0 },
            },
            y: {
              grid: { color: gridColor, lineWidth: 0.5 },
              border: { display: false },
              ticks: {
                color: textColor,
                font: { size: 11 },
                stepSize: 1,
                precision: 0,
                callback: (v: any) => (Number.isInteger(v) ? v : ""),
              },
              min: 0,
              suggestedMax: Math.max(...data.map((d) => d.count)) + 1,
            },
          },
        },
      });
    };

    loadChart();

    return () => {
      chartRef.current?.destroy();
    };
  }, [data]);

  const total = data?.reduce((a, b) => a + b.count, 0) ?? 0;
  const peak = data ? Math.max(...data.map((d) => d.count)) : 0;
  const avg = data ? (total / data.length).toFixed(1) : "0";

  if (isLoading)
    return <div className="bg-gray-50 rounded-xl h-52 animate-pulse mb-8" />;

  return (
    <div
      className="bg-white border border-gray-100
         rounded-xl p-5 mb-8"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Activity</p>
          <p className="text-xl font-medium">
            {total} item{total !== 1 ? "s" : ""} this week
          </p>
        </div>
        <div className="flex gap-5">
          <div className="text-right">
            <p className="text-xs text-gray-400">peak</p>
            <p className="text-sm font-medium">{peak}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">avg/day</p>
            <p className="text-sm font-medium">{avg}</p>
          </div>
        </div>
      </div>

      <div className="relative h-44">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Line chart showing items created per day over the last 7 days"
        >
          Items created per day over the last 7 days.
        </canvas>
      </div>
    </div>
  );
}

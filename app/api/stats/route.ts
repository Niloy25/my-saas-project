import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const now = new Date();
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  ).toISOString();
  const startOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1,
  ).toISOString();

  const [totalResult, thisMonthResult, lastMonthResult, recentResult] =
    await Promise.all([
      supabase
        .from("items")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("items")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gt("created_at", startOfMonth),
      supabase
        .from("items")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", startOfLastMonth)
        .lt("created_at", startOfMonth),
      supabase
        .from("items")
        .select("id, title, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);
  const total = totalResult.count ?? 0;
  const thisMonth = thisMonthResult.count ?? 0;
  const lastMonth = lastMonthResult.count ?? 0;
  const growth =
    lastMonth === 0
      ? 100
      : Math.round(((thisMonth - lastMonth) / lastMonth) * 100);

  return NextResponse.json({
    total,
    thisMonth,
    lastMonth,
    growth,
    recent: recentResult.data ?? [],
  });
}

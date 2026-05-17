import { createClient } from "@/lib/supabase-server";
import Layout from "@/components/layout";
import StatsCards from "@/components/stats-cards";
import ActivityChart from "@/components/activity-chart";
import ActivityFeed from "@/components/activity-feed";
import ItemForm from "@/components/item-form";
import ItemsList from "@/components/items-list";

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Layout userEmail={user?.email}>
      <div className="mb-8">
        <h1 className="text-2xl font-medium">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back, {user?.email}
        </p>
      </div>

      <StatsCards />
      <ActivityChart />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium mb-4">Add item</p>
          <ItemForm />
          <div className="mt-6">
            <p className="text-sm font-medium mb-4">All items</p>
            <ItemsList />
          </div>
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </Layout>
  );
}

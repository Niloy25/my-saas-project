import { createClient } from "@/lib/supabase-server";
import Layout from "@/components/layout";
import ItemForm from "@/components/item-form";
import ItemsList from "@/components/items-list";

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Layout userEmail={user?.email}>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <ItemForm />
      <div className="mt-6">
        <ItemsList />
      </div>
    </Layout>
  );
}

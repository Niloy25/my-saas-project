import { createClient } from "@/lib/supabase-server";
import Layout from "@/components/layout";

export default async function Settings() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Layout userEmail={user?.email}>
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-gray-500 mt-2">Manage your account here.</p>
    </Layout>
  );
}

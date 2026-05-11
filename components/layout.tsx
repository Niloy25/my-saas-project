"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type LayoutProps = {
  children: React.ReactNode;
  userEmail?: string;
};

export default function Layout({ children, userEmail }: LayoutProps) {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold">MySaaS</span>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            ☰
          </button>
          <div className="hidden md:flex items-center gap-4 text-sm">
            <a href="/dashboard">Dashboard</a>
            <a href="/settings">Settings</a>
            {userEmail && (
              <>
                <span className="text-gray-400">{userEmail}</span>
                <button onClick={signOut} className="text-red-500">
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}

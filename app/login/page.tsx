"use client";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div
      className="min-h-screen flex items-center
         justify-center bg-gray-50"
    >
      <div
        className="bg-white p-8 rounded-xl border
           border-gray-200 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-2">Welcome to MySaaS</h1>
        <p className="text-gray-500 text-sm mb-6">Sign in to continue</p>
        <button
          onClick={signInWithGoogle}
          className="w-full border border-gray-300 rounded-lg
               py-2.5 text-sm font-medium hover:bg-gray-50
               transition flex items-center justify-center gap-2"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}

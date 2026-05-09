"use client";

import { useState } from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold">MySaaS</span>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            ☰
          </button>
          <div className="hidden md:flex gap-4 text-sm text-gray-600">
            <a href="/dashboard">Dashboard</a>
            <a href="/settings">Settings</a>
          </div>
        </div>
        {open && (
          <div className="md:hidden flex flex-col gap-2 pt-3 text-sm text-gray-600">
            <a href="/dashboard">Dashboard</a>
            <a href="/settings">Settings</a>
          </div>
        )}
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}

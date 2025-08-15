"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminGuard from "./AdminGuard";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/"); // redirect to login page
  };

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-700 text-white p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
          <nav className="flex flex-col gap-3">
            <Link
              href="/admin/dashboard"
              className="hover:bg-gray-600 p-2 rounded"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/announcement"
              className="hover:bg-gray-600 p-2 rounded"
            >
              Announcement
            </Link>
            <Link
              href="/admin/events"
              className="hover:bg-gray-600 p-2 rounded"
            >
              Events
            </Link>
            <Link
              href="/admin/access"
              className="hover:bg-gray-600 p-2 rounded"
            >
              Access
            </Link>

            <Link
              href="/admin/Settings"
              className="hover:bg-gray-600 p-2 rounded"
            >
              Settings
            </Link>
          </nav>

          <button
            onClick={handleLogout}
            className="mt-auto bg-red-600 hover:bg-red-700 p-2 rounded text-white font-semibold transition"
          >
            Logout
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </AdminGuard>
  );
}

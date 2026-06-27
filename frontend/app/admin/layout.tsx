"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { signOutAction } from "@/lib/actions/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-surface transition-transform md:static md:z-auto md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-line px-4 md:h-16 md:px-6">
          <Link href="/admin/dashboard" className="text-lg font-bold tracking-tight text-heading">
            CMS
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="text-heading md:hidden"
            aria-label="Close sidebar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <SidebarLink href="/admin/dashboard">Dashboard</SidebarLink>
          <SidebarLink href="/admin/rooms">Rooms</SidebarLink>
          <SidebarLink href="/admin/services">Services</SidebarLink>
          <SidebarLink href="/admin/leisure">Leisure Sites</SidebarLink>
          <SidebarLink href="/admin/bookings">Bookings</SidebarLink>
          <SidebarLink href="/admin/gallery">Gallery</SidebarLink>
          <SidebarLink href="/admin/users">Users</SidebarLink>
          <div className="pt-4">
            <SidebarLink href="/">← Back to Site</SidebarLink>
          </div>
        </nav>
        <div className="border-t border-line px-4 py-4 md:px-6">
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-sm text-muted transition-colors hover:text-heading"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex h-14 items-center gap-3 border-b border-line bg-surface px-4 md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="text-heading"
            aria-label="Open sidebar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/admin/dashboard" className="text-lg font-bold tracking-tight text-heading">
            GB Hotel and Suite CMS
          </Link>
        </div>

        <div className="flex-1 overflow-x-auto">
          <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-accent text-white"
          : "text-body hover:bg-fill hover:text-heading"
      }`}
    >
      {children}
    </Link>
  );
}

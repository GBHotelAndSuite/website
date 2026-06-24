import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-line bg-surface">
        <div className="flex h-16 items-center border-b border-line px-6">
          <Link href="/admin/dashboard" className="text-lg font-bold tracking-tight text-heading">
            Grand Vista CMS
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          <SidebarLink href="/admin/dashboard">Dashboard</SidebarLink>
          <SidebarLink href="/admin/rooms">Rooms</SidebarLink>
          <SidebarLink href="/admin/services">Services</SidebarLink>
          <SidebarLink href="/admin/leisure">Leisure Sites</SidebarLink>
          <SidebarLink href="/admin/bookings">Bookings</SidebarLink>
          <SidebarLink href="/admin/gallery">Gallery</SidebarLink>
          <div className="pt-4">
            <SidebarLink href="/">← Back to Site</SidebarLink>
          </div>
        </nav>
        <div className="border-t border-line px-6 py-4">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="text-sm text-muted transition-colors hover:text-heading"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1">
        <div className="mx-auto max-w-5xl px-8 py-8">{children}</div>
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
  return (
    <Link
      href={href}
      className="block rounded-lg px-3 py-2 text-sm font-medium text-body transition-colors hover:bg-fill hover:text-heading"
    >
      {children}
    </Link>
  );
}

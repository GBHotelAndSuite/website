import { db } from "@/lib/db";
import { rooms, bookings, services, leisureSites } from "@/lib/schema";
import { count, eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [roomCount, bookingCount, servicesCount, leisureCount, activeRooms] =
    await Promise.all([
      db.select({ value: count() }).from(rooms).then((r) => r[0]?.value ?? 0),
      db
        .select({ value: count() })
        .from(bookings)
        .then((r) => r[0]?.value ?? 0),
      db
        .select({ value: count() })
        .from(services)
        .where(eq(services.isActive, 1))
        .then((r) => r[0]?.value ?? 0),
      db
        .select({ value: count() })
        .from(leisureSites)
        .where(eq(leisureSites.isActive, 1))
        .then((r) => r[0]?.value ?? 0),
      db
        .select({ value: count() })
        .from(rooms)
        .where(eq(rooms.isActive, 1))
        .then((r) => r[0]?.value ?? 0),
    ]);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-heading">
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Rooms" value={roomCount} sub={`${activeRooms} active`} />
        <StatCard label="Total Bookings" value={bookingCount} />
        <StatCard label="Services" value={servicesCount} sub="active" />
        <StatCard label="Leisure Sites" value={leisureCount} sub="active" />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: number | string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-6">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-1 text-3xl font-bold text-heading">{value}</p>
      {sub && <p className="mt-1 text-sm text-subtle">{sub}</p>}
    </div>
  );
}

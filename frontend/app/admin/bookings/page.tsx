import Link from "next/link";
import { db } from "@/lib/db";
import { bookings, rooms, roomTiers } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

const STATUSES = ["all", "confirmed", "checked_in", "checked_out", "cancelled", "no_show"];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: filter } = await searchParams;
  const activeFilter = filter && STATUSES.includes(filter) ? filter : "all";

  const allBookings = await db
    .select({
      id: bookings.id,
      guestName: bookings.guestName,
      guestEmail: bookings.guestEmail,
      checkIn: bookings.checkIn,
      checkOut: bookings.checkOut,
      totalPrice: bookings.totalPrice,
      status: bookings.status,
      notes: bookings.notes,
      createdAt: bookings.createdAt,
      roomName: rooms.name,
      tierName: roomTiers.name,
    })
    .from(bookings)
    .innerJoin(rooms, eq(bookings.roomId, rooms.id))
    .innerJoin(roomTiers, eq(rooms.tierId, roomTiers.id))
    .where(activeFilter !== "all" ? eq(bookings.status, activeFilter) : undefined)
    .orderBy(desc(bookings.createdAt))
    .all();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-heading">
          Bookings
        </h1>
      </div>

      {/* Status filter tabs */}
      <div className="mb-6 flex flex-wrap gap-1">
        {STATUSES.map((s) => {
          const href = s === "all" ? "/admin/bookings" : `/admin/bookings?status=${s}`;
          const isActive = activeFilter === s;
          return (
            <Link
              key={s}
              href={href}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                isActive
                  ? "bg-accent text-white"
                  : "bg-surface text-muted hover:bg-fill hover:text-heading"
              }`}
            >
              {s === "checked_in" ? "Checked In" : s === "checked_out" ? "Checked Out" : s === "no_show" ? "No Show" : s}
            </Link>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface">
            <tr>
              <th className="px-4 py-3 font-medium text-muted">ID</th>
              <th className="px-4 py-3 font-medium text-muted">Guest</th>
              <th className="px-4 py-3 font-medium text-muted">Room</th>
              <th className="px-4 py-3 font-medium text-muted">Check-in</th>
              <th className="px-4 py-3 font-medium text-muted">Check-out</th>
              <th className="px-4 py-3 font-medium text-muted">Total</th>
              <th className="px-4 py-3 font-medium text-muted">Status</th>
              <th className="px-4 py-3 font-medium text-muted">Notes</th>
              <th className="px-4 py-3 font-medium text-muted" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {allBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-surface">
                <td className="px-4 py-3 font-mono text-xs text-subtle">
                  <Link href={`/admin/bookings/${booking.id}`} className="hover:text-accent">
                    {booking.id}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-heading">
                    {booking.guestName}
                  </p>
                  <p className="text-xs text-subtle">
                    {booking.guestEmail}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-heading">{booking.roomName}</p>
                  <p className="text-xs text-subtle">{booking.tierName}</p>
                </td>
                <td className="px-4 py-3 text-body">
                  {booking.checkIn}
                </td>
                <td className="px-4 py-3 text-body">
                  {booking.checkOut}
                </td>
                <td className="px-4 py-3 font-medium text-heading">
                  ₦{booking.totalPrice.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      booking.status === "confirmed"
                        ? "bg-emerald-50 text-heading"
                        : booking.status === "checked_in"
                          ? "bg-blue-50 text-blue-600"
                          : booking.status === "checked_out"
                            ? "bg-gray-50 text-gray-600"
                            : booking.status === "cancelled"
                              ? "bg-red-50 text-red-500"
                              : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {booking.status === "checked_in"
                      ? "Checked In"
                      : booking.status === "checked_out"
                        ? "Checked Out"
                        : booking.status === "no_show"
                          ? "No Show"
                          : booking.status}
                  </span>
                </td>
                <td className="max-w-40 truncate px-4 py-3 text-xs text-subtle">
                  {booking.notes || "—"}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="text-sm text-muted transition-colors hover:text-heading"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {allBookings.length === 0 && (
        <p className="py-10 text-center text-subtle">
          {activeFilter === "all" ? "No bookings yet." : `No ${activeFilter} bookings.`}
        </p>
      )}
    </div>
  );
}
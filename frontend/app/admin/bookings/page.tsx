import { db } from "@/lib/db";
import { bookings, rooms, roomTiers } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { cancelBooking } from "@/lib/actions/admin";

export default async function AdminBookingsPage() {
  const allBookings = await db
    .select({
      id: bookings.id,
      guestName: bookings.guestName,
      guestEmail: bookings.guestEmail,
      checkIn: bookings.checkIn,
      checkOut: bookings.checkOut,
      totalPrice: bookings.totalPrice,
      status: bookings.status,
      createdAt: bookings.createdAt,
      roomName: rooms.name,
      tierName: roomTiers.name,
    })
    .from(bookings)
    .innerJoin(rooms, eq(bookings.roomId, rooms.id))
    .innerJoin(roomTiers, eq(rooms.tierId, roomTiers.id))
    .orderBy(desc(bookings.createdAt))
    .all();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-heading">
        Bookings
      </h1>

      <div className="overflow-hidden rounded-xl border border-line">
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
              <th className="px-4 py-3 font-medium text-muted" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {allBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-surface">
                <td className="px-4 py-3 font-mono text-xs text-subtle">
                  {booking.id}
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
                  ${booking.totalPrice}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      booking.status === "confirmed"
                        ? "bg-emerald-50 text-heading"
                        : booking.status === "cancelled"
                          ? "bg-red-50 text-red-500"
                          : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {booking.status === "confirmed" && (
                    <form
                      action={async () => {
                        "use server";
                        await cancelBooking(booking.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="text-sm text-red-500 transition-colors hover:text-red-700"
                      >
                        Cancel
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {allBookings.length === 0 && (
        <p className="py-10 text-center text-subtle">No bookings yet.</p>
      )}
    </div>
  );
}

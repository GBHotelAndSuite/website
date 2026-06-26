import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { bookings, rooms, roomTiers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import {
  updateBooking,
  updateBookingStatus,
  cancelBooking,
} from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

const STATUS_TRANSITIONS: Record<string, string[]> = {
  confirmed: ["checked_in", "cancelled"],
  checked_in: ["checked_out", "cancelled"],
  checked_out: [],
  cancelled: [],
  no_show: [],
};

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const booking = await db
    .select({
      id: bookings.id,
      guestName: bookings.guestName,
      guestEmail: bookings.guestEmail,
      guestPhone: bookings.guestPhone,
      checkIn: bookings.checkIn,
      checkOut: bookings.checkOut,
      totalPrice: bookings.totalPrice,
      status: bookings.status,
      notes: bookings.notes,
      createdAt: bookings.createdAt,
      roomId: bookings.roomId,
      roomName: rooms.name,
      tierName: roomTiers.name,
      basePrice: rooms.basePrice,
    })
    .from(bookings)
    .innerJoin(rooms, eq(bookings.roomId, rooms.id))
    .innerJoin(roomTiers, eq(rooms.tierId, roomTiers.id))
    .where(eq(bookings.id, id))
    .get();

  if (!booking) notFound();

  const transitions = STATUS_TRANSITIONS[booking.status ?? ""] || [];

  return (
    <div>
      <Link
        href="/admin/bookings"
        className="mb-6 inline-flex text-sm text-muted transition-colors hover:text-heading"
      >
        &larr; Back to Bookings
      </Link>

      <h1 className="mb-2 text-2xl font-bold tracking-tight text-heading">
        Booking {booking.id}
      </h1>
      <p className="mb-8 text-sm text-muted">
        {booking.roomName} &middot; {booking.tierName} &middot; Created{" "}
        {booking.createdAt}
      </p>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Edit form */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-line p-6">
            <h2 className="mb-5 text-lg font-semibold text-heading">
              Guest &amp; Booking Details
            </h2>
            <form
              action={async (formData) => {
                "use server";
                await updateBooking(id, formData);
              }}
              className="space-y-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-heading">
                    Guest Name
                  </label>
                  <input
                    name="guestName"
                    type="text"
                    required
                    defaultValue={booking.guestName}
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-heading">
                    Email
                  </label>
                  <input
                    name="guestEmail"
                    type="email"
                    required
                    defaultValue={booking.guestEmail}
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-heading">
                    Phone
                  </label>
                  <input
                    name="guestPhone"
                    type="tel"
                    defaultValue={booking.guestPhone || ""}
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-heading">
                    Room
                  </label>
                  <p className="rounded-lg border border-line px-3 py-2 text-sm text-body">
                    {booking.roomName} ({booking.roomId})
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-heading">
                    Check-in
                  </label>
                  <input
                    name="checkIn"
                    type="date"
                    required
                    defaultValue={booking.checkIn}
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-heading">
                    Check-out
                  </label>
                  <input
                    name="checkOut"
                    type="date"
                    required
                    defaultValue={booking.checkOut}
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-heading">
                  Special Requests / Notes
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  defaultValue={booking.notes || ""}
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <button
                type="submit"
                className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status card */}
          <div className="rounded-xl border border-line p-6">
            <h3 className="mb-3 text-sm font-semibold text-heading">Status</h3>
            <span
              className={`mb-4 inline-block rounded-full px-3 py-1 text-sm font-medium ${
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

            {transitions.length > 0 && (
              <div className="mt-4 space-y-2">
                {transitions.map((nextStatus) => (
                  <form
                    key={nextStatus}
                    action={async () => {
                      "use server";
                      await updateBookingStatus(id, nextStatus);
                    }}
                  >
                    <button
                      type="submit"
                      className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        nextStatus === "cancelled"
                          ? "border border-red-200 text-red-500 hover:bg-red-50"
                          : nextStatus === "checked_in"
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : nextStatus === "checked_out"
                              ? "bg-gray-500 text-white hover:bg-gray-600"
                              : "bg-accent text-white hover:bg-accent-dark"
                      }`}
                    >
                      {nextStatus === "checked_in"
                        ? "Mark as Checked In"
                        : nextStatus === "checked_out"
                          ? "Mark as Checked Out"
                          : nextStatus === "cancelled"
                            ? "Cancel Booking"
                            : `Set to ${nextStatus}`}
                    </button>
                  </form>
                ))}
              </div>
            )}
          </div>

          {/* Price summary */}
          <div className="rounded-xl border border-line p-6">
            <h3 className="mb-3 text-sm font-semibold text-heading">Price</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Base price / night</span>
                <span className="text-heading">
                  ₦{booking.basePrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-t border-line pt-2">
                <span className="font-medium text-heading">Total</span>
                <span className="font-bold text-heading">
                  ₦{booking.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          {booking.status !== "cancelled" && (
            <div className="rounded-xl border border-red-200 p-6">
              <h3 className="mb-3 text-sm font-semibold text-red-500">
                Danger Zone
              </h3>
              <form
                action={async () => {
                  "use server";
                  await cancelBooking(id);
                }}
              >
                <button
                  type="submit"
                  className="w-full rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                >
                  Cancel Booking
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
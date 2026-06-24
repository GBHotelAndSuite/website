import Link from "next/link";
import { db } from "@/lib/db";
import { bookings, rooms, roomTiers } from "@/lib/schema";
import { eq } from "drizzle-orm";

export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const { id } = await searchParams;

  const booking = await db
    .select({
      id: bookings.id,
      guestName: bookings.guestName,
      guestEmail: bookings.guestEmail,
      checkIn: bookings.checkIn,
      checkOut: bookings.checkOut,
      totalPrice: bookings.totalPrice,
      status: bookings.status,
      roomName: rooms.name,
      tierName: roomTiers.name,
    })
    .from(bookings)
    .innerJoin(rooms, eq(bookings.roomId, rooms.id))
    .innerJoin(roomTiers, eq(rooms.tierId, roomTiers.id))
    .where(eq(bookings.id, id))
    .get();

  if (!booking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-3 text-2xl font-bold text-heading">
            Booking Not Found
          </h1>
          <p className="mb-6 text-muted">
            We could not find a booking with that ID.
          </p>
          <Link
            href="/"
            className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-16">
      <div className="mx-auto max-w-lg px-4 text-center">
        <div className="mb-4 text-5xl">&#10003;</div>
        <h1 className="mb-2 text-2xl font-bold text-heading">
          Booking Confirmed!
        </h1>
        <p className="mb-8 text-muted">
          Thank you, {booking.guestName}. Your booking request has been
          received.
        </p>

        <div className="mb-8 rounded-xl border border-line bg-surface p-6 text-left">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Booking ID</span>
              <span className="font-medium text-heading">{booking.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Room</span>
              <span className="font-medium text-heading">
                {booking.roomName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Tier</span>
              <span className="font-medium text-heading">
                {booking.tierName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Check-in</span>
              <span className="font-medium text-heading">
                {booking.checkIn}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Check-out</span>
              <span className="font-medium text-heading">
                {booking.checkOut}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Status</span>
              <span className="font-medium text-heading">
                {booking.status}
              </span>
            </div>
            <div className="flex justify-between border-t border-line pt-3">
              <span className="font-medium text-heading">Total</span>
              <span className="font-bold text-heading">
                ${booking.totalPrice}
              </span>
            </div>
          </div>
        </div>

        <p className="mb-6 text-sm text-subtle">
          A confirmation will be sent to <strong>{booking.guestEmail}</strong>.
          We will contact you to finalize your reservation.
        </p>

        <Link
          href="/"
          className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { bookings } from "@/lib/schema";
import { rooms } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function createBooking(formData: FormData) {
  const roomId = formData.get("roomId") as string;
  const guestName = formData.get("guestName") as string;
  const guestEmail = formData.get("guestEmail") as string;
  const guestPhone = formData.get("guestPhone") as string;
  const checkIn = formData.get("checkIn") as string;
  const checkOut = formData.get("checkOut") as string;
  const notes = formData.get("notes") as string;

  if (!roomId || !guestName || !guestEmail || !checkIn || !checkOut) {
    throw new Error("Missing required fields");
  }

  const room = await db
    .select({ basePrice: rooms.basePrice })
    .from(rooms)
    .where(eq(rooms.id, roomId))
    .get();

  if (!room) {
    throw new Error("Room not found");
  }

  // Calculate nights
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  );
  const totalPrice = room.basePrice * nights;

  const bookingId = `BKG-${Date.now()}`;

  await db.insert(bookings).values({
    id: bookingId,
    roomId,
    guestName,
    guestEmail,
    guestPhone: guestPhone || null,
    checkIn,
    checkOut,
    totalPrice,
    notes: notes || null,
    status: "confirmed",
  });

  redirect(`/booking/confirmation?id=${bookingId}`);
}

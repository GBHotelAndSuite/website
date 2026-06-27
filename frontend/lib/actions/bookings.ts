"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { bookings, siteSettings } from "@/lib/schema";
import { rooms } from "@/lib/schema";
import { eq, and, lt, gte, sql } from "drizzle-orm";
import {
  sendBookingConfirmation,
  sendAdminNewBookingNotification,
} from "@/lib/email";
import { calculateNights } from "@/lib/utils";

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
    .select({ basePrice: rooms.basePrice, name: rooms.name })
    .from(rooms)
    .where(eq(rooms.id, roomId))
    .get();

  if (!room) {
    throw new Error("Room not found");
  }

  // Min stay / max advance validation
  const settingsRows = await db
    .select()
    .from(siteSettings)
    .where(
      sql`${siteSettings.key} IN ('min_stay_nights', 'max_advance_days', 'check_in_time', 'check_out_time', 'hotel_email')`
    )
    .all();
  const settings: Record<string, string> = {};
  for (const row of settingsRows) {
    settings[row.key] = row.value;
  }
  const minStay = parseInt(settings.min_stay_nights || "1", 10);
  const maxAdvance = parseInt(settings.max_advance_days || "365", 10);

  const checkInDate = new Date(checkIn);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkInDate < today) {
    throw new Error("Check-in cannot be in the past");
  }

  const advanceDays = Math.round(
    (checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (advanceDays > maxAdvance) {
    throw new Error(
      `Bookings can only be made up to ${maxAdvance} days in advance`
    );
  }

  const nights = calculateNights(checkIn, checkOut);
  if (nights < minStay) {
    throw new Error(
      `Minimum stay is ${minStay} night${minStay > 1 ? "s" : ""}`
    );
  }

  // Check for overlapping bookings (double-booking prevention)
  const conflicting = await db
    .select({ id: bookings.id })
    .from(bookings)
    .where(
      and(
        eq(bookings.roomId, roomId),
        sql`${bookings.status} != 'cancelled'`,
        lt(bookings.checkIn, checkOut),
        gte(bookings.checkOut, checkIn),
      )
    )
    .get();

  if (conflicting) {
    throw new Error(
      "This room is no longer available for the selected dates."
    );
  }

  const totalPrice = room.basePrice * nights;

  const bookingId = `BKG-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const shareToken = crypto.randomUUID();

  await db.insert(bookings).values({
    id: bookingId,
    shareToken,
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

  sendBookingConfirmation({
    id: bookingId,
    shareToken,
    guestName,
    guestEmail,
    checkIn,
    checkOut,
    checkInTime: settings.check_in_time || "15:00",
    checkOutTime: settings.check_out_time || "11:00",
    roomName: room.name,
    totalPrice,
  });

  sendAdminNewBookingNotification(settings.hotel_email || "info@gbhotelandsuite.com", {
    id: bookingId,
    guestName,
    guestEmail,
    guestPhone: guestPhone || null,
    checkIn,
    checkOut,
    roomName: room.name,
    totalPrice,
    notes: notes || null,
  });

  redirect(`/booking/confirmation?token=${shareToken}`);
}

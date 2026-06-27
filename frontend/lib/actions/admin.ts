"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import {
  rooms,
  roomTiers,
  services,
  leisureSites,
  bookings,
  adminUsers,
  siteSettings,
} from "@/lib/schema";
import { eq } from "drizzle-orm";
import { sendBookingStatusChange } from "@/lib/email";

// --- ROOMS ---

export async function updateRoom(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const tierId = formData.get("tierId") as string;
  const basePrice = parseFloat(formData.get("basePrice") as string);
  const capacity = parseInt(formData.get("capacity") as string);
  const size = formData.get("size")
    ? parseFloat(formData.get("size") as string)
    : null;
  const amenities = (formData.get("amenities") as string)
    .split("\n")
    .map((a) => a.trim())
    .filter(Boolean);
  const isActive = formData.get("isActive") === "on" ? 1 : 0;

  await db
    .update(rooms)
    .set({
      name,
      description,
      tierId,
      basePrice,
      capacity,
      size,
      amenities,
      isActive,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(rooms.id, id));

  revalidatePath("/admin/rooms");
  revalidatePath(`/rooms/${id}`);
  redirect("/admin/rooms");
}

export async function createRoom(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const tierId = formData.get("tierId") as string;
  const basePrice = parseFloat(formData.get("basePrice") as string);
  const capacity = parseInt(formData.get("capacity") as string);
  const size = formData.get("size")
    ? parseFloat(formData.get("size") as string)
    : null;
  const amenities = (formData.get("amenities") as string)
    .split("\n")
    .map((a) => a.trim())
    .filter(Boolean);

  await db.insert(rooms).values({
    id,
    name,
    description,
    tierId,
    basePrice,
    capacity,
    size,
    amenities,
    isActive: 1,
  });

  revalidatePath("/admin/rooms");
  revalidatePath("/rooms");
  redirect("/admin/rooms");
}

export async function deleteRoom(id: string) {
  await db.delete(rooms).where(eq(rooms.id, id));
  revalidatePath("/admin/rooms");
  revalidatePath("/rooms");
  redirect("/admin/rooms");
}

// --- SERVICES ---

export async function updateService(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;
  const isActive = formData.get("isActive") === "on" ? 1 : 0;

  await db
    .update(services)
    .set({ name, description, icon, isActive })
    .where(eq(services.id, id));

  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function createService(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;

  await db.insert(services).values({ id, name, description, icon, isActive: 1 });

  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  await db.delete(services).where(eq(services.id, id));
  revalidatePath("/admin/services");
}

// --- LEISURE ---

export async function updateLeisureSite(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const isActive = formData.get("isActive") === "on" ? 1 : 0;

  await db
    .update(leisureSites)
    .set({ name, description, isActive })
    .where(eq(leisureSites.id, id));

  revalidatePath("/admin/leisure");
  redirect("/admin/leisure");
}

export async function createLeisureSite(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  await db
    .insert(leisureSites)
    .values({ id, name, description, isActive: 1 });

  revalidatePath("/admin/leisure");
  redirect("/admin/leisure");
}

export async function deleteLeisureSite(id: string) {
  await db.delete(leisureSites).where(eq(leisureSites.id, id));
  revalidatePath("/admin/leisure");
}

// --- BOOKINGS ---

async function getHotelEmail(): Promise<string> {
  const row = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "hotel_email"))
    .get();
  return row?.value || "info@gbhotelandsuite.com";
}

async function getBookingForNotification(id: string) {
  return await db
    .select({
      id: bookings.id,
      guestName: bookings.guestName,
      guestEmail: bookings.guestEmail,
      status: bookings.status,
      roomName: rooms.name,
      checkIn: bookings.checkIn,
      checkOut: bookings.checkOut,
      totalPrice: bookings.totalPrice,
      shareToken: bookings.shareToken,
    })
    .from(bookings)
    .innerJoin(rooms, eq(bookings.roomId, rooms.id))
    .where(eq(bookings.id, id))
    .get();
}

export async function cancelBooking(id: string) {
  const booking = await getBookingForNotification(id);
  const hotelEmail = await getHotelEmail();

  await db
    .update(bookings)
    .set({ status: "cancelled" })
    .where(eq(bookings.id, id));

  if (booking) {
    sendBookingStatusChange(booking.guestEmail, "guest", {
      ...booking, status: "cancelled",
    });
    sendBookingStatusChange(hotelEmail, "admin", {
      ...booking, status: "cancelled",
    });
  }

  revalidatePath("/admin/bookings");
}

export async function updateBookingStatus(id: string, status: string) {
  const booking = await getBookingForNotification(id);
  const hotelEmail = await getHotelEmail();

  await db
    .update(bookings)
    .set({ status })
    .where(eq(bookings.id, id));

  if (booking) {
    sendBookingStatusChange(booking.guestEmail, "guest", {
      ...booking, status,
    });
    sendBookingStatusChange(hotelEmail, "admin", {
      ...booking, status,
    });
  }

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${id}`);
}

export async function updateBooking(id: string, formData: FormData) {
  const guestName = formData.get("guestName") as string;
  const guestEmail = formData.get("guestEmail") as string;
  const guestPhone = formData.get("guestPhone") as string;
  const checkIn = formData.get("checkIn") as string;
  const checkOut = formData.get("checkOut") as string;
  const notes = formData.get("notes") as string;

  await db
    .update(bookings)
    .set({
      guestName,
      guestEmail,
      guestPhone: guestPhone || null,
      checkIn,
      checkOut,
      notes: notes || null,
    })
    .where(eq(bookings.id, id));

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${id}`);
  redirect(`/admin/bookings/${id}`);
}

// --- ADMIN USERS ---

export async function createAdminUser(formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  const id = `admin-${crypto.randomUUID()}`;
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    await db.insert(adminUsers).values({ id, email, name, hashedPassword });
  } catch {
    // duplicate email — redirect back without inserting
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateAdminUser(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  if (name || password) {
    const updates: { name?: string; hashedPassword?: string } = {};
    if (name) updates.name = name;
    if (password) updates.hashedPassword = await bcrypt.hash(password, 12);
    await db.update(adminUsers).set(updates).where(eq(adminUsers.id, id));
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteAdminUser(id: string) {
  await db.delete(adminUsers).where(eq(adminUsers.id, id));

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

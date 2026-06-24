"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  rooms,
  roomTiers,
  services,
  leisureSites,
  bookings,
} from "@/lib/schema";
import { eq } from "drizzle-orm";

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

export async function cancelBooking(id: string) {
  await db
    .update(bookings)
    .set({ status: "cancelled" })
    .where(eq(bookings.id, id));

  revalidatePath("/admin/bookings");
}

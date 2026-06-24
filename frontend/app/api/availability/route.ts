import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { rooms, roomTiers, bookings } from "@/lib/schema";
import { eq, and, or, gte, lt, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const roomId = searchParams.get("roomId");

  if (!checkIn || !checkOut) {
    return Response.json(
      { error: "checkIn and checkOut are required" },
      { status: 400 }
    );
  }

  if (checkIn >= checkOut) {
    return Response.json(
      { error: "checkOut must be after checkIn" },
      { status: 400 }
    );
  }

  const conditions = [eq(rooms.isActive, 1)];

  if (roomId) {
    conditions.push(eq(rooms.id, roomId));
  }

  const allRooms = await db
    .select({
      id: rooms.id,
      name: rooms.name,
      basePrice: rooms.basePrice,
      capacity: rooms.capacity,
      tierName: roomTiers.name,
      tierId: rooms.tierId,
    })
    .from(rooms)
    .innerJoin(roomTiers, eq(rooms.tierId, roomTiers.id))
    .where(and(...conditions))
    .all();

  // Check which rooms have conflicting bookings
  const conflictingRoomIds = await db
    .select({ roomId: bookings.roomId })
    .from(bookings)
    .where(
      and(
        sql`${bookings.status} != 'cancelled'`,
        and(
          // Existing booking overlaps with requested range
          // Existing: checkIn---checkOut
          // Requested:          checkIn---checkOut
          // Overlap if existing checkIn < requested checkOut AND existing checkOut > requested checkIn
          lt(bookings.checkIn, checkOut as string),
          gte(bookings.checkOut, checkIn as string)
        )
      )
    )
    .all();

  const bookedRoomIds = new Set(conflictingRoomIds.map((b) => b.roomId));

  const availableRooms = allRooms.filter((r) => !bookedRoomIds.has(r.id));

  return Response.json({
    available: availableRooms,
    checkIn,
    checkOut,
  });
}

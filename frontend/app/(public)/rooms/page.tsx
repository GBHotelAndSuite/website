import Link from "next/link";
import { db } from "@/lib/db";
import { rooms, roomTiers } from "@/lib/schema";
import { eq, asc, sql } from "drizzle-orm";

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>;
}) {
  const { tier } = await searchParams;

  const tiers = await db
    .select()
    .from(roomTiers)
    .orderBy(asc(roomTiers.sortOrder))
    .all();

  const allRooms = await db
    .select({
      id: rooms.id,
      name: rooms.name,
      description: rooms.description,
      basePrice: rooms.basePrice,
      capacity: rooms.capacity,
      size: rooms.size,
      amenities: rooms.amenities,
      images: rooms.images,
      tierId: rooms.tierId,
      tierName: roomTiers.name,
    })
    .from(rooms)
    .innerJoin(roomTiers, eq(rooms.tierId, roomTiers.id))
    .where(eq(rooms.isActive, 1))
    .orderBy(asc(roomTiers.sortOrder))
    .all();

  const filteredRooms = tier
    ? allRooms.filter((r) => r.tierId === tier)
    : allRooms;

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-heading">
            Our Rooms
          </h1>
          <p className="mt-2 text-lg text-muted">
            Choose from our selection of thoughtfully designed rooms and suites.
          </p>
        </div>

        {/* Tier filter */}
        <div className="mb-10 flex flex-wrap gap-2">
          <Link
            href="/rooms"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !tier
                ? "bg-accent text-white"
                : "bg-fill text-body hover:bg-fill"
            }`}
          >
            All
          </Link>
          {tiers.map((t) => (
            <Link
              key={t.id}
              href={`/rooms?tier=${t.id}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                tier === t.id
                  ? "bg-accent text-white"
                  : "bg-fill text-body hover:bg-fill"
              }`}
            >
              {t.name}
            </Link>
          ))}
        </div>

        {/* Room grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.map((room) => (
            <Link
              key={room.id}
              href={`/rooms/${room.id}`}
              className="group overflow-hidden rounded-xl border border-line transition-all hover:border-accent hover:shadow-lg"
            >
              <div className="aspect-[4/3] bg-fill" />
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-fill px-2.5 py-0.5 text-xs font-medium text-body">
                    {room.tierName}
                  </span>
                  <span className="text-xs text-subtle">Up to {room.capacity} guests</span>
                </div>
                <h3 className="mb-1 text-lg font-semibold text-heading group-hover:underline">
                  {room.name}
                </h3>
                <p className="mb-4 line-clamp-2 text-sm text-muted">
                  {room.description}
                </p>
                <p className="text-sm font-medium text-heading">
                  From ${room.basePrice}
                  <span className="font-normal text-subtle"> / night</span>
                </p>
              </div>
            </Link>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <p className="py-20 text-center text-subtle">No rooms found.</p>
        )}
      </div>
    </div>
  );
}

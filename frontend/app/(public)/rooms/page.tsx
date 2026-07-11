import Link from "next/link";
import { db } from "@/lib/db";
import { rooms, roomTiers } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { getGalleryCategories } from "@/lib/gallery-images";
import TierSlideshow from "./TierSlideshow";

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

  const activeTier = tier ? tiers.find((t) => t.id === tier) : null;
  const galleryCategories = getGalleryCategories();
  const tierGallery = tier
    ? galleryCategories.find((c) => c.slug === tier)
    : null;

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
              !tier ? "bg-accent text-white" : "bg-fill text-body hover:bg-fill"
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

        {/* Tier slideshow */}
        {tierGallery && tierGallery.images.length > 0 && activeTier && (
          <TierSlideshow
            images={tierGallery.images}
            tierName={activeTier.name}
            tierDescription={activeTier.description}
          />
        )}

        {/* Room grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.map((room) => (
            <Link
              key={room.id}
              href={`/booking?room=${room.id}`}
              className="group rounded-xl border border-line p-6 transition-all hover:border-accent hover:shadow-lg"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-fill px-2.5 py-0.5 text-xs font-medium text-body">
                  {room.tierName}
                </span>
                <span className="text-xs text-subtle">
                  Up to {room.capacity} guest{room.capacity > 1 ? "s" : ""}
                </span>
              </div>
              <h3 className="mb-1.5 text-lg font-semibold text-heading group-hover:underline">
                {room.name}
              </h3>
              <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted">
                {room.description}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-heading">
                  From ₦{room.basePrice.toLocaleString()}
                  <span className="font-normal text-subtle"> / night</span>
                </p>
                <span className="rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-white transition-colors group-hover:bg-accent-dark">
                  Book Now
                </span>
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

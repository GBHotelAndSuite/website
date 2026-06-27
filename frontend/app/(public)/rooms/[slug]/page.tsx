import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { rooms, roomTiers } from "@/lib/schema";
import { eq } from "drizzle-orm";

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const room = await db
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
      tierDescription: roomTiers.description,
    })
    .from(rooms)
    .innerJoin(roomTiers, eq(rooms.tierId, roomTiers.id))
    .where(eq(rooms.id, slug))
    .get();

  if (!room) notFound();

  return (
    <div className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/rooms"
          className="mb-6 inline-flex text-sm text-muted transition-colors hover:text-heading"
        >
          ← Back to Rooms
        </Link>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Gallery */}
          <div className="lg:col-span-3">
            <div className="relative aspect-[4/3] rounded-xl bg-fill">
              <Image
                src={room.images?.[0] || "/placeholder-room.svg"}
                alt={room.name}
                fill
                className="rounded-xl object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
            {room.images && room.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {room.images.slice(1).map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-lg bg-fill">
                    <Image
                      src={img}
                      alt={`${room.name} ${i + 2}`}
                      fill
                      className="rounded-lg object-cover"
                      sizes="25vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-fill px-3 py-1 text-xs font-medium text-body">
                {room.tierName}
              </span>
              <span className="text-sm text-subtle">
                Up to {room.capacity} guests
              </span>
            </div>

            <h1 className="mb-2 text-3xl font-bold tracking-tight text-heading">
              {room.name}
            </h1>

            {room.size && (
              <p className="mb-4 text-sm text-muted">{room.size} m&sup2;</p>
            )}

            <p className="mb-6 text-sm leading-relaxed text-body">
              {room.description}
            </p>

            <div className="mb-8">
              <p className="mb-1 text-3xl font-bold text-heading">
                ₦{room.basePrice.toLocaleString()}
                <span className="text-base font-normal text-subtle">
                  {" "}
                  / night
                </span>
              </p>
            </div>

            <Link
              href={`/booking?room=${room.id}`}
              className="mb-8 inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
            >
              Book This Room
            </Link>

            {/* Amenities */}
            {room.amenities && room.amenities.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-heading">
                  Amenities
                </h2>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {room.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="text-sm text-body before:mr-2 before:text-body before:content-['✓']"
                    >
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

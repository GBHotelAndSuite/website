import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { rooms, roomTiers } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { updateRoom, createRoom, deleteRoom } from "@/lib/actions/admin";

export default async function AdminRoomEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";

  const tiers = await db
    .select()
    .from(roomTiers)
    .orderBy(asc(roomTiers.sortOrder))
    .all();

  let room: typeof rooms.$inferSelect | undefined;

  if (!isNew) {
    room = await db.select().from(rooms).where(eq(rooms.id, id)).get();
    if (!room) notFound();
  }

  return (
    <div>
      <Link
        href="/admin/rooms"
        className="mb-6 inline-flex text-sm text-muted transition-colors hover:text-heading"
      >
        &larr; Back to Rooms
      </Link>

      <h1 className="mb-8 text-2xl font-bold tracking-tight text-heading">
        {isNew ? "Add Room" : `Edit: ${room?.name}`}
      </h1>

      <div className="max-w-2xl">
        <form
          action={async (formData) => {
            "use server";
            if (isNew) {
              await createRoom(formData);
            } else {
              await updateRoom(id, formData);
            }
          }}
          className="space-y-5"
        >
          {isNew && (
            <div>
              <label className="mb-1 block text-sm font-medium text-heading">
                Room ID (slug)
              </label>
              <input
                name="id"
                type="text"
                required
                placeholder="e.g., std-103"
                className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-heading">
              Name
            </label>
            <input
              name="name"
              type="text"
              required
              defaultValue={room?.name}
              className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-heading">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={room?.description || ""}
              className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-heading">
                Tier
              </label>
              <select
                name="tierId"
                required
                defaultValue={room?.tierId || tiers[0]?.id}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {tiers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-heading">
                Base Price ($/night)
              </label>
              <input
                name="basePrice"
                type="number"
                step="0.01"
                required
                defaultValue={room?.basePrice}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-heading">
                Capacity (max guests)
              </label>
              <input
                name="capacity"
                type="number"
                required
                defaultValue={room?.capacity}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-heading">
                Size (m&sup2;, optional)
              </label>
              <input
                name="size"
                type="number"
                step="0.1"
                defaultValue={room?.size || ""}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-heading">
              Amenities (one per line)
            </label>
            <textarea
              name="amenities"
              rows={6}
              defaultValue={room?.amenities?.join("\n") || ""}
              placeholder="Free Wi-Fi&#10;Air Conditioning&#10;Smart TV"
              className="w-full rounded-lg border border-line px-3 py-2 text-sm font-mono focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {!isNew && (
            <label className="flex items-center gap-2">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked={room?.isActive === 1}
                className="h-4 w-4 accent-accent"
              />
              <span className="text-sm text-heading">Active (visible on site)</span>
            </label>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
            >
              {isNew ? "Create Room" : "Save Changes"}
            </button>
          </div>
        </form>
        {!isNew && (
          <form action={deleteRoom.bind(null, id)} className="mt-4">
            <button
              type="submit"
              className="rounded-full border border-red-200 px-6 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
            >
              Delete
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

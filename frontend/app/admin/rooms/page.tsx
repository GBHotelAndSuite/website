import Link from "next/link";
import { db } from "@/lib/db";
import { rooms, roomTiers } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";

export default async function AdminRoomsPage() {
  const allRooms = await db
    .select({
      id: rooms.id,
      name: rooms.name,
      basePrice: rooms.basePrice,
      capacity: rooms.capacity,
      isActive: rooms.isActive,
      tierName: roomTiers.name,
    })
    .from(rooms)
    .innerJoin(roomTiers, eq(rooms.tierId, roomTiers.id))
    .orderBy(asc(rooms.name))
    .all();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-heading">
          Rooms
        </h1>
        <Link
          href="/admin/rooms/new"
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
        >
          Add Room
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface">
            <tr>
              <th className="px-4 py-3 font-medium text-muted">ID</th>
              <th className="px-4 py-3 font-medium text-muted">Name</th>
              <th className="px-4 py-3 font-medium text-muted">Tier</th>
              <th className="px-4 py-3 font-medium text-muted">Price</th>
              <th className="px-4 py-3 font-medium text-muted">Capacity</th>
              <th className="px-4 py-3 font-medium text-muted">Status</th>
              <th className="px-4 py-3 font-medium text-muted" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {allRooms.map((room) => (
              <tr key={room.id} className="hover:bg-surface">
                <td className="px-4 py-3 font-mono text-xs text-subtle">
                  {room.id}
                </td>
                <td className="px-4 py-3 font-medium text-heading">
                  {room.name}
                </td>
                <td className="px-4 py-3 text-muted">{room.tierName}</td>
                <td className="px-4 py-3 text-heading">
                  ${room.basePrice}
                </td>
                <td className="px-4 py-3 text-muted">{room.capacity}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      room.isActive
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {room.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/rooms/${room.id}`}
                    className="text-sm text-muted transition-colors hover:text-heading"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

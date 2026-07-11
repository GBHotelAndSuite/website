import { createClient } from "@libsql/client";

const dbUrl = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!dbUrl) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}

const client = createClient({ url: dbUrl, authToken });

console.log("Connecting to database...");

const rooms = [
  // ── Deluxe (₦30,000) ──
  { id: "colorado-5",   tier: "deluxe",     name: "Colorado",       price: 30000 },
  { id: "california-4", tier: "deluxe",     name: "California",     price: 30000 },
  { id: "florida-6",    tier: "deluxe",     name: "Florida",        price: 30000 },
  { id: "maryland-8",   tier: "deluxe",     name: "Maryland",       price: 30000 },

  // ── Supreme (₦35,000) ──
  { id: "georgia-26",   tier: "supreme",    name: "Georgia",        price: 35000 },
  { id: "virginia-16",  tier: "supreme",    name: "Virginia",       price: 35000 },

  // ── Executive (₦40,000) ──
  { id: "alabama-1",        tier: "executive", name: "Alabama",        price: 40000 },
  { id: "alaska-2",         tier: "executive", name: "Alaska",         price: 40000 },
  { id: "arizona-3",        tier: "executive", name: "Arizona",        price: 40000 },
  { id: "georgia-7",        tier: "executive", name: "Georgia",        price: 40000 },
  { id: "minnesota-9",      tier: "executive", name: "Minnesota",      price: 40000 },
  { id: "mississippi-10",   tier: "executive", name: "Mississippi",    price: 40000 },
  { id: "montana-11",       tier: "executive", name: "Montana",        price: 40000 },
  { id: "new-jersey-12",    tier: "executive", name: "New Jersey",     price: 40000 },
  { id: "new-mexico-13",    tier: "executive", name: "New Mexico",     price: 40000 },
  { id: "texas-15",         tier: "executive", name: "Texas",          price: 40000 },
  { id: "washington-17",    tier: "executive", name: "Washington",     price: 40000 },
  { id: "missouri-18",      tier: "executive", name: "Missouri",       price: 40000 },
  { id: "iowa-19",          tier: "executive", name: "Iowa",           price: 40000 },
  { id: "ohio-20",          tier: "executive", name: "Ohio",           price: 40000 },
  { id: "oregon-21",        tier: "executive", name: "Oregon",         price: 40000 },
  { id: "vermont-23",       tier: "executive", name: "Vermont",        price: 40000 },
  { id: "north-carolina-24",tier: "executive", name: "North Carolina", price: 40000 },
  { id: "utah-25",          tier: "executive", name: "Utah",           price: 40000 },
];

try {
  console.log("Deleting existing bookings and rooms...");
  await client.execute("DELETE FROM bookings");
  await client.execute("DELETE FROM rooms");

  console.log(`Inserting ${rooms.length} rooms...`);
  for (const room of rooms) {
    const description = `A comfortable room in the ${room.tier.charAt(0).toUpperCase() + room.tier.slice(1)} category.`;
    await client.execute({
      sql: `INSERT INTO rooms (id, tier_id, name, description, base_price, capacity, size, amenities, images, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 2, NULL, '[]', '[]', 1, datetime('now'), datetime('now'))`,
      args: [room.id, room.tier, room.name, description, room.price],
    });
  }

  console.log("✓ Rooms seeded successfully");
} catch (err) {
  console.error("Seeding failed:", err);
  process.exit(1);
} finally {
  await client.close();
}

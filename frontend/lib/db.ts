import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

const dbUrl =
  process.env.DATABASE_URL ||
  `file:${process.env.DATABASE_PATH || path.join(process.cwd(), "data", "hotel.db")}`;

if (dbUrl.startsWith("file:")) {
  const filePath = dbUrl.slice("file:".length);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

const client = createClient({
  url: dbUrl,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

// Turso (libsql remote) doesn't support PRAGMAs; only set for local SQLite files
if (dbUrl.startsWith("file:")) {
  await client.execute("PRAGMA journal_mode=WAL");
  await client.execute("PRAGMA busy_timeout=5000");
}

await client.executeMultiple(
  `CREATE TABLE IF NOT EXISTS room_tiers (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, sort_order INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY, tier_id TEXT NOT NULL REFERENCES room_tiers(id),
    name TEXT NOT NULL, description TEXT, base_price REAL NOT NULL,
    capacity INTEGER NOT NULL, size REAL, amenities TEXT, images TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY, share_token TEXT,
    room_id TEXT NOT NULL REFERENCES rooms(id),
    guest_name TEXT NOT NULL, guest_email TEXT NOT NULL, guest_phone TEXT,
    check_in TEXT NOT NULL, check_out TEXT NOT NULL, total_price REAL NOT NULL,
    status TEXT DEFAULT 'confirmed', notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, icon TEXT,
    image TEXT, sort_order INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS leisure_sites (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, images TEXT,
    sort_order INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY, value TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT,
    hashed_password TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now'))
  );`,
);

if (process.env.NEXT_PHASE !== "phase-production-build") {
  const rows = await client.execute(
    "SELECT COUNT(*) as count FROM room_tiers",
  );

  if (rows.rows[0].count === 0) {
    console.log("Database empty — seeding...");

    try {
      await client.executeMultiple(
        `INSERT OR IGNORE INTO room_tiers VALUES
          ('deluxe','Deluxe','Premium comfort and space. Perfect for business and leisure travelers.',1),
          ('supreme','Supreme','Elevated luxury with sophisticated interiors and premium amenities.',2),
          ('executive','Executive','Refined elegance with exclusive executive privileges.',3),
          ('presidential','Presidential','The pinnacle of luxury living with panoramic views and personalized butler service.',4);
        INSERT OR IGNORE INTO rooms VALUES
          ('dlx-201','deluxe','Deluxe King','A spacious room featuring a king-sized bed with premium bedding.',30000,2,35,
           '["King Bed","Free Wi-Fi","Air Conditioning","Smart TV","Mini Bar","Coffee Machine","Rain Shower","Safe"]',
           '["/images/rooms/deluxe-1.jpg","/images/rooms/deluxe-2.jpg","/images/rooms/deluxe-3.jpg"]',1,datetime('now'),datetime('now')),
          ('dlx-202','deluxe','Deluxe Double','Perfect for families or groups. Two double beds.',30000,4,40,
           '["Two Double Beds","Free Wi-Fi","Air Conditioning","Smart TV","Mini Bar","Bathtub","Workspace"]',
           '["/images/rooms/deluxe-double-1.jpg"]',1,datetime('now'),datetime('now')),
          ('sup-301','supreme','Supreme Room','A stylish room with sophisticated interiors and premium amenities.',35000,2,45,
           '["King Bed","Separate Living Area","Free Wi-Fi","Air Conditioning","Smart TV","Mini Bar","Soaking Tub","Bathrobes & Slippers","Turndown Service"]',
           '["/images/rooms/suite-1.jpg","/images/rooms/suite-2.jpg"]',1,datetime('now'),datetime('now')),
          ('exc-401','executive','Executive Suite','Refined elegance with a separate living area and exclusive executive privileges.',40000,2,55,
           '["Separate Living Area","King Bed","Free Wi-Fi","Air Conditioning","Smart TV","Mini Bar","Coffee Machine","Rain Shower","Workspace"]',
           '["/images/rooms/deluxe-1.jpg","/images/rooms/deluxe-2.jpg"]',1,datetime('now'),datetime('now')),
          ('pen-501','presidential','Presidential Suite','The ultimate in luxury living. Expansive open-plan living with panoramic views.',70000,4,120,
           '["Panoramic Views","Private Terrace","Outdoor Jacuzzi","Butler Service","Separate Dining Area","Full Kitchen","King Bed","En-suite with Steam Shower","Walk-in Closet","Welcome Champagne"]',
           '["/images/rooms/penthouse-1.jpg","/images/rooms/penthouse-2.jpg","/images/rooms/penthouse-3.jpg"]',1,datetime('now'),datetime('now'));
        INSERT OR IGNORE INTO services VALUES
          ('spa','Spa & Wellness','Rejuvenate your body and mind with our range of spa treatments.','spa','/images/services/spa.jpg',1,1),
          ('restaurant','Fine Dining','Experience culinary excellence at our on-site restaurant.','restaurant','/images/services/restaurant.jpg',2,1),
          ('pool','Infinity Pool','Take a dip in our stunning infinity pool overlooking the city.','pool','/images/services/pool.jpg',3,1),
          ('gym','Fitness Center','Stay active in our state-of-the-art fitness center.','fitness','/images/services/gym.jpg',4,1),
          ('concierge','Concierge Service','Our dedicated concierge team is available 24/7.','concierge','/images/services/concierge.jpg',5,1),
          ('business','Business Center','Fully equipped business center with meeting rooms.','business','/images/services/business.jpg',6,1);
        INSERT OR IGNORE INTO leisure_sites VALUES
          ('rooftop-bar','Rooftop Sky Bar','Enjoy handcrafted cocktails and panoramic views.','["/images/leisure/rooftop-1.jpg","/images/leisure/rooftop-2.jpg"]',1,1),
          ('garden','Zen Garden','A tranquil oasis in the heart of the city.','["/images/leisure/garden-1.jpg"]',2,1),
          ('lounge','Executive Lounge','An exclusive lounge for guests with premium amenities.','["/images/leisure/lounge-1.jpg","/images/leisure/lounge-2.jpg"]',3,1),
          ('poolside','Poolside Cabanas','Rent a private cabana by the pool.','["/images/leisure/cabana-1.jpg"]',4,1);
        INSERT OR IGNORE INTO site_settings VALUES
          ('hotel_name','GB Hotel and Suite'),
          ('hotel_tagline','Experience Luxury, Embrace Comfort'),
          ('hotel_description','Welcome to GB Hotel and Suite, where modern luxury meets timeless elegance.'),
          ('hotel_address','42 Ahmadu Bello Way, Victoria Island'),
          ('hotel_city','Lagos, Nigeria'),
          ('hotel_phone','+234 809 000 1234'),
          ('hotel_email','info@gbhotelandsuite.com'),
          ('check_in_time','15:00'),
          ('check_out_time','11:00'),
          ('currency','NGN');`,
      );

      const adminPassword = process.env.ADMIN_PASSWORD;
      if (adminPassword) {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@gbhotelandsuite.com";
        const { hash } = await import("bcryptjs");
        const hashedPassword = await hash(adminPassword, 12);
        await client.execute({
          sql: `INSERT OR IGNORE INTO admin_users (id, email, name, hashed_password) VALUES ('admin-1', ?, 'Admin', ?)`,
          args: [adminEmail, hashedPassword],
        });
      } else {
        console.log(
          "ADMIN_PASSWORD not set — admin user not created. Login page will be inaccessible.",
        );
      }

      console.log("Database seeded successfully.");
    } catch (err) {
      console.error("Seeding failed:", err);
    }
  }
}

export const db = drizzle(client, { schema });
import { createClient } from "@libsql/client";

const dbPath = process.env.DATABASE_PATH || "/data/hotel.db";
const client = createClient({ url: `file:${dbPath}` });

// Create tables
await client.execute(`
  CREATE TABLE IF NOT EXISTS room_tiers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0
  )
`);
await client.execute(`
  CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    tier_id TEXT NOT NULL REFERENCES room_tiers(id),
    name TEXT NOT NULL,
    description TEXT,
    base_price REAL NOT NULL,
    capacity INTEGER NOT NULL,
    size REAL,
    amenities TEXT,
    images TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);
await client.execute(`
  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    room_id TEXT NOT NULL REFERENCES rooms(id),
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT,
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    total_price REAL NOT NULL,
    status TEXT DEFAULT 'confirmed',
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);
await client.execute(`
  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    image TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1
  )
`);
await client.execute(`
  CREATE TABLE IF NOT EXISTS leisure_sites (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    images TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1
  )
`);
await client.execute(`
  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )
`);
await client.execute(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    hashed_password TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

// Check if already seeded
const rows = await client.execute(
  "SELECT COUNT(*) as count FROM admin_users",
);

if (rows.rows[0].count === 0) {
  console.log("Database empty — seeding...");

  // Room tiers
  await client.execute(`
    INSERT INTO room_tiers (id, name, description, sort_order) VALUES
      ('standard', 'Standard Room', 'Comfortable and affordable rooms for budget-conscious travelers.', 1),
      ('deluxe', 'Deluxe Room', 'Spacious rooms with premium amenities and superior comfort.', 2),
      ('suite', 'Suite', 'Luxurious suites with separate living areas and exclusive services.', 3),
      ('penthouse', 'Penthouse', 'The pinnacle of luxury living with panoramic views and personalized butler service.', 4)
  `);

  // Rooms
  await client.execute(`
    INSERT INTO rooms (id, tier_id, name, description, base_price, capacity, size, amenities, images, is_active) VALUES
      ('std-101', 'standard', 'Cozy Single', 'A comfortable single room with a city view, perfect for solo travelers. Features a plush single bed, work desk, and en-suite bathroom.', 120, 1, 22, '["Free Wi-Fi","Air Conditioning","Smart TV","Work Desk","En-suite Bathroom"]', '["/images/rooms/standard-1.jpg","/images/rooms/standard-2.jpg"]', 1),
      ('std-102', 'standard', 'Standard Twin', 'Ideal for friends or colleagues traveling together. Two comfortable twin beds, ample storage, and a modern bathroom.', 150, 2, 28, '["Free Wi-Fi","Air Conditioning","Smart TV","Mini Fridge","En-suite Bathroom"]', '["/images/rooms/standard-twin-1.jpg"]', 1),
      ('dlx-201', 'deluxe', 'Deluxe King', 'A spacious room featuring a king-sized bed with premium bedding, a seating area, and floor-to-ceiling windows overlooking the city skyline.', 220, 2, 35, '["King Bed","Free Wi-Fi","Air Conditioning","Smart TV","Mini Bar","Coffee Machine","Rain Shower","Safe"]', '["/images/rooms/deluxe-1.jpg","/images/rooms/deluxe-2.jpg","/images/rooms/deluxe-3.jpg"]', 1),
      ('dlx-202', 'deluxe', 'Deluxe Double', 'Perfect for families or groups. Two double beds, a cozy sitting area, and premium bathroom amenities.', 260, 4, 40, '["Two Double Beds","Free Wi-Fi","Air Conditioning","Smart TV","Mini Bar","Bathtub","Workspace"]', '["/images/rooms/deluxe-double-1.jpg"]', 1),
      ('ste-301', 'suite', 'Junior Suite', 'A stylish suite with a separate bedroom and living area. Features modern decor, premium finishes, and a luxurious bathroom with soaking tub.', 380, 2, 55, '["Separate Living Area","King Bed","Free Wi-Fi","Air Conditioning","Smart TV","Mini Bar","Soaking Tub","Bathrobes & Slippers","Turndown Service"]', '["/images/rooms/suite-1.jpg","/images/rooms/suite-2.jpg"]', 1),
      ('pen-401', 'penthouse', 'Presidential Penthouse', 'The ultimate in luxury living. Expansive open-plan living with 360-degree views, private terrace, outdoor jacuzzi, and dedicated butler service.', 950, 4, 120, '["Panoramic Views","Private Terrace","Outdoor Jacuzzi","Butler Service","Separate Dining Area","Full Kitchen","King Bed","En-suite with Steam Shower","Walk-in Closet","Welcome Champagne"]', '["/images/rooms/penthouse-1.jpg","/images/rooms/penthouse-2.jpg","/images/rooms/penthouse-3.jpg"]', 1)
  `);

  // Services
  await client.execute(`
    INSERT INTO services (id, name, description, icon, image, sort_order, is_active) VALUES
      ('spa', 'Spa & Wellness', 'Rejuvenate your body and mind with our range of spa treatments, massage therapies, and wellness programs.', 'spa', '/images/services/spa.jpg', 1, 1),
      ('restaurant', 'Fine Dining', 'Experience culinary excellence at our on-site restaurant. Our award-winning chefs craft exquisite dishes using the freshest local ingredients.', 'restaurant', '/images/services/restaurant.jpg', 2, 1),
      ('pool', 'Infinity Pool', 'Take a dip in our stunning infinity pool overlooking the city. Surrounded by lounge chairs and poolside service.', 'pool', '/images/services/pool.jpg', 3, 1),
      ('gym', 'Fitness Center', 'Stay active in our state-of-the-art fitness center. Equipped with the latest cardio and strength training machines.', 'fitness', '/images/services/gym.jpg', 4, 1),
      ('concierge', 'Concierge Service', 'Our dedicated concierge team is available 24/7 to assist with restaurant reservations, tour bookings, and transportation.', 'concierge', '/images/services/concierge.jpg', 5, 1),
      ('business', 'Business Center', 'Fully equipped business center with meeting rooms, high-speed internet, printing services, and administrative support.', 'business', '/images/services/business.jpg', 6, 1)
  `);

  // Leisure sites
  await client.execute(`
    INSERT INTO leisure_sites (id, name, description, images, sort_order, is_active) VALUES
      ('rooftop-bar', 'Rooftop Sky Bar', 'Enjoy handcrafted cocktails and panoramic views at our rooftop bar. Live music, tapas, and an unmatched ambiance.', '["/images/leisure/rooftop-1.jpg","/images/leisure/rooftop-2.jpg"]', 1, 1),
      ('garden', 'Zen Garden', 'A tranquil oasis in the heart of the city. Our meticulously maintained Japanese-inspired garden features koi ponds and meditation areas.', '["/images/leisure/garden-1.jpg"]', 2, 1),
      ('lounge', 'Executive Lounge', 'An exclusive lounge for guests with access to premium amenities. Complimentary refreshments and private check-in.', '["/images/leisure/lounge-1.jpg","/images/leisure/lounge-2.jpg"]', 3, 1),
      ('poolside', 'Poolside Cabanas', 'Rent a private cabana by the pool for the ultimate relaxation experience. Includes dedicated service and refreshments.', '["/images/leisure/cabana-1.jpg"]', 4, 1)
  `);

  // Site settings
  await client.execute(`
    INSERT INTO site_settings (key, value) VALUES
      ('hotel_name', 'Grand Vista Hotel'),
      ('hotel_tagline', 'Experience Luxury, Embrace Comfort'),
      ('hotel_description', 'Welcome to Grand Vista Hotel, where modern luxury meets timeless elegance.'),
      ('hotel_address', '123 Luxury Avenue, Downtown, City'),
      ('hotel_phone', '+1 (555) 123-4567'),
      ('hotel_email', 'info@grandvistahotel.com'),
      ('check_in_time', '15:00'),
      ('check_out_time', '11:00'),
      ('currency', 'USD')
  `);

  // Admin user — read credentials from env vars
  const adminEmail = process.env.ADMIN_EMAIL || "admin@grandvista.com";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("ADMIN_PASSWORD environment variable is required");
    process.exit(1);
  }

  const { hash } = await import("bcryptjs");
  const hashedPassword = await hash(adminPassword, 12);

  await client.execute({
    sql: `INSERT INTO admin_users (id, email, name, hashed_password) VALUES ('admin-1', ?, 'Admin', ?)`,
    args: [adminEmail, hashedPassword],
  });

  console.log("Database seeded successfully.");
} else {
  console.log("Database already seeded.");
}

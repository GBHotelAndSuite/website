import bcrypt from "bcryptjs";
import { db } from "./db";
import {
  roomTiers,
  rooms,
  services,
  leisureSites,
  siteSettings,
  adminUsers,
} from "./schema";

async function seed() {
  console.log("Seeding database...");

  // Room tiers
  const tiers = [
    {
      id: "standard",
      name: "Standard Room",
      description: "Comfortable and affordable rooms for budget-conscious travelers.",
      sortOrder: 1,
    },
    {
      id: "deluxe",
      name: "Deluxe Room",
      description: "Spacious rooms with premium amenities and superior comfort.",
      sortOrder: 2,
    },
    {
      id: "suite",
      name: "Suite",
      description: "Luxurious suites with separate living areas and exclusive services.",
      sortOrder: 3,
    },
    {
      id: "penthouse",
      name: "Penthouse",
      description: "The pinnacle of luxury living with panoramic views and personalized butler service.",
      sortOrder: 4,
    },
  ];

  for (const tier of tiers) {
    await db.insert(roomTiers).values(tier);
  }
  console.log("✓ Room tiers seeded");

  // Sample rooms
  const sampleRooms = [
    {
      id: "std-101",
      tierId: "standard",
      name: "Cozy Single",
      description: "A comfortable single room with a city view, perfect for solo travelers. Features a plush single bed, work desk, and en-suite bathroom.",
      basePrice: 120,
      capacity: 1,
      size: 22,
      amenities: ["Free Wi-Fi", "Air Conditioning", "Smart TV", "Work Desk", "En-suite Bathroom"],
      images: ["/images/rooms/standard-1.jpg", "/images/rooms/standard-2.jpg"],
    },
    {
      id: "std-102",
      tierId: "standard",
      name: "Standard Twin",
      description: "Ideal for friends or colleagues traveling together. Two comfortable twin beds, ample storage, and a modern bathroom.",
      basePrice: 150,
      capacity: 2,
      size: 28,
      amenities: ["Free Wi-Fi", "Air Conditioning", "Smart TV", "Mini Fridge", "En-suite Bathroom"],
      images: ["/images/rooms/standard-twin-1.jpg"],
    },
    {
      id: "dlx-201",
      tierId: "deluxe",
      name: "Deluxe King",
      description: "A spacious room featuring a king-sized bed with premium bedding, a seating area, and floor-to-ceiling windows overlooking the city skyline.",
      basePrice: 220,
      capacity: 2,
      size: 35,
      amenities: ["King Bed", "Free Wi-Fi", "Air Conditioning", "Smart TV", "Mini Bar", "Coffee Machine", "Rain Shower", "Safe"],
      images: ["/images/rooms/deluxe-1.jpg", "/images/rooms/deluxe-2.jpg", "/images/rooms/deluxe-3.jpg"],
    },
    {
      id: "dlx-202",
      tierId: "deluxe",
      name: "Deluxe Double",
      description: "Perfect for families or groups. Two double beds, a cozy sitting area, and premium bathroom amenities.",
      basePrice: 260,
      capacity: 4,
      size: 40,
      amenities: ["Two Double Beds", "Free Wi-Fi", "Air Conditioning", "Smart TV", "Mini Bar", "Bathtub", "Workspace"],
      images: ["/images/rooms/deluxe-double-1.jpg"],
    },
    {
      id: "ste-301",
      tierId: "suite",
      name: "Junior Suite",
      description: "A stylish suite with a separate bedroom and living area. Features modern decor, premium finishes, and a luxurious bathroom with soaking tub.",
      basePrice: 380,
      capacity: 2,
      size: 55,
      amenities: ["Separate Living Area", "King Bed", "Free Wi-Fi", "Air Conditioning", "Smart TV", "Mini Bar", "Soaking Tub", "Bathrobes & Slippers", "Turndown Service"],
      images: ["/images/rooms/suite-1.jpg", "/images/rooms/suite-2.jpg"],
    },
    {
      id: "pen-401",
      tierId: "penthouse",
      name: "Presidential Penthouse",
      description: "The ultimate in luxury living. Expansive open-plan living with 360-degree views, private terrace, outdoor jacuzzi, and dedicated butler service.",
      basePrice: 950,
      capacity: 4,
      size: 120,
      amenities: ["Panoramic Views", "Private Terrace", "Outdoor Jacuzzi", "Butler Service", "Separate Dining Area", "Full Kitchen", "King Bed", "En-suite with Steam Shower", "Walk-in Closet", "Welcome Champagne"],
      images: ["/images/rooms/penthouse-1.jpg", "/images/rooms/penthouse-2.jpg", "/images/rooms/penthouse-3.jpg"],
    },
  ];

  for (const room of sampleRooms) {
    await db.insert(rooms).values(room);
  }
  console.log("✓ Rooms seeded");

  // Services
  const serviceList = [
    {
      id: "spa",
      name: "Spa & Wellness",
      description: "Rejuvenate your body and mind with our range of spa treatments, massage therapies, and wellness programs. Our expert therapists use premium products to deliver a truly restorative experience.",
      icon: "spa",
      image: "/images/services/spa.jpg",
      sortOrder: 1,
    },
    {
      id: "restaurant",
      name: "Fine Dining",
      description: "Experience culinary excellence at our on-site restaurant. Our award-winning chefs craft exquisite dishes using the freshest local ingredients, paired with an extensive wine selection.",
      icon: "restaurant",
      image: "/images/services/restaurant.jpg",
      sortOrder: 2,
    },
    {
      id: "pool",
      name: "Infinity Pool",
      description: "Take a dip in our stunning infinity pool overlooking the city. Surrounded by lounge chairs and poolside service, it's the perfect spot to unwind and soak up the sun.",
      icon: "pool",
      image: "/images/services/pool.jpg",
      sortOrder: 3,
    },
    {
      id: "gym",
      name: "Fitness Center",
      description: "Stay active in our state-of-the-art fitness center. Equipped with the latest cardio and strength training machines, free weights, and dedicated yoga studio.",
      icon: "fitness",
      image: "/images/services/gym.jpg",
      sortOrder: 4,
    },
    {
      id: "concierge",
      name: "Concierge Service",
      description: "Our dedicated concierge team is available 24/7 to assist with restaurant reservations, tour bookings, transportation, and any special requests to make your stay memorable.",
      icon: "concierge",
      image: "/images/services/concierge.jpg",
      sortOrder: 5,
    },
    {
      id: "business",
      name: "Business Center",
      description: "Fully equipped business center with meeting rooms, high-speed internet, printing services, and administrative support for our corporate guests.",
      icon: "business",
      image: "/images/services/business.jpg",
      sortOrder: 6,
    },
  ];

  for (const service of serviceList) {
    await db.insert(services).values(service);
  }
  console.log("✓ Services seeded");

  // Leisure sites
  const leisure = [
    {
      id: "rooftop-bar",
      name: "Rooftop Sky Bar",
      description: "Enjoy handcrafted cocktails and panoramic views at our rooftop bar. Live music, tapas, and an unmatched ambiance make it the perfect evening destination.",
      images: ["/images/leisure/rooftop-1.jpg", "/images/leisure/rooftop-2.jpg"],
      sortOrder: 1,
    },
    {
      id: "garden",
      name: "Zen Garden",
      description: "A tranquil oasis in the heart of the city. Our meticulously maintained Japanese-inspired garden features koi ponds, meditation areas, and winding paths.",
      images: ["/images/leisure/garden-1.jpg"],
      sortOrder: 2,
    },
    {
      id: "lounge",
      name: "Executive Lounge",
      description: "An exclusive lounge for guests with access to premium amenities. Complimentary refreshments, private check-in, and a quiet space to relax or work.",
      images: ["/images/leisure/lounge-1.jpg", "/images/leisure/lounge-2.jpg"],
      sortOrder: 3,
    },
    {
      id: "poolside",
      name: "Poolside Cabanas",
      description: "Rent a private cabana by the pool for the ultimate relaxation experience. Includes dedicated service, refreshments, and entertainment system.",
      images: ["/images/leisure/cabana-1.jpg"],
      sortOrder: 4,
    },
  ];

  for (const site of leisure) {
    await db.insert(leisureSites).values(site);
  }
  console.log("✓ Leisure sites seeded");

  // Site settings
  const settings = [
    { key: "hotel_name", value: "GB Hotel and Suite" },
    { key: "hotel_tagline", value: "Experience Luxury, Embrace Comfort" },
    { key: "hotel_description", value: "Welcome to GB Hotel and Suite, where modern luxury meets timeless elegance. Nestled in the heart of the city, we offer an unforgettable experience with world-class amenities, exquisite dining, and exceptional service." },
    { key: "hotel_address", value: "42 Ahmadu Bello Way, Victoria Island" },
    { key: "hotel_city", value: "Lagos, Nigeria" },
    { key: "hotel_phone", value: "+234 809 000 1234" },
    { key: "hotel_email", value: "info@gbhotelandsuite.com" },
    { key: "check_in_time", value: "15:00" },
    { key: "check_out_time", value: "11:00" },
    { key: "currency", value: "NGN" },
  ];

  for (const setting of settings) {
    await db.insert(siteSettings).values(setting);
  }
  console.log("✓ Site settings seeded");

  // Admin user — read credentials from env vars
  const adminEmail = process.env.ADMIN_EMAIL || "admin@gbhotelandsuite.com";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("ADMIN_PASSWORD environment variable is required");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await db.insert(adminUsers).values({
    id: "admin-1",
    email: adminEmail,
    name: "Admin",
    hashedPassword,
  });

  console.log(`✓ Admin user seeded (${adminEmail} / ${adminPassword})`);
  console.log("Seeding complete!");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

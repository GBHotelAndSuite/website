import { sql } from "drizzle-orm";
import { sqliteTable, text, real, int } from "drizzle-orm/sqlite-core";

export const roomTiers = sqliteTable("room_tiers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  sortOrder: int("sort_order").default(0),
});

export const rooms = sqliteTable("rooms", {
  id: text("id").primaryKey(),
  tierId: text("tier_id")
    .notNull()
    .references(() => roomTiers.id),
  name: text("name").notNull(),
  description: text("description"),
  basePrice: real("base_price").notNull(),
  capacity: int("capacity").notNull(),
  size: real("size"),
  amenities: text("amenities", { mode: "json" }).$type<string[]>(),
  images: text("images", { mode: "json" }).$type<string[]>(),
  isActive: int("is_active").default(1),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export const bookings = sqliteTable("bookings", {
  id: text("id").primaryKey(),
  roomId: text("room_id")
    .notNull()
    .references(() => rooms.id),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone"),
  checkIn: text("check_in").notNull(),
  checkOut: text("check_out").notNull(),
  totalPrice: real("total_price").notNull(),
  status: text("status").default("confirmed"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const services = sqliteTable("services", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  image: text("image"),
  sortOrder: int("sort_order").default(0),
  isActive: int("is_active").default(1),
});

export const leisureSites = sqliteTable("leisure_sites", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  images: text("images", { mode: "json" }).$type<string[]>(),
  sortOrder: int("sort_order").default(0),
  isActive: int("is_active").default(1),
});

export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const adminUsers = sqliteTable("admin_users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  hashedPassword: text("hashed_password").notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

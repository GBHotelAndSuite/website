# GB Hotel and Suite

A modern hotel website and booking platform built with Next.js. Features a public-facing website with room browsing, online booking, photo gallery, and 360° virtual tours, alongside a full admin CMS for managing rooms, bookings, and site content.

## Tech Stack

- **Framework:** Next.js 16 (App Router, standalone output)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Drizzle ORM + Turso (libSQL) — also supports local SQLite
- **Auth:** NextAuth v5 (Credentials provider)
- **Email:** Nodemailer (SMTP)
- **Animations:** Framer Motion
- **360° Tours:** react-pannellum

## Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, or bun

### Environment Variables

Create a `.env.local` file with the following:

```env
# Database (Turso or local SQLite)
DATABASE_URL=libsql://your-turso-db.turso.io
DATABASE_AUTH_TOKEN=your-turso-token

# Auth
AUTH_SECRET=your-random-secret
ADMIN_PASSWORD=your-admin-password

# Email (optional — emails are skipped if not configured)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=GB Hotel and Suite <you@gmail.com>
```

### Development

```bash
npm install
npm run dev
```

The database is auto-created and seeded on first run. Visit [http://localhost:3000](http://localhost:3000).

### Production

```bash
npm run build
npm start
```

### Docker

```bash
docker build -t gb-hotel .
docker run -p 3000:3000 --env-file .env.local gb-hotel
```

## Features

### Public Website

- **Homepage** — Hero slideshow (images + video), room tier previews, services showcase, booking CTA
- **Rooms** — Browse rooms filterable by tier (Deluxe, Supreme, Executive, Presidential) with image slideshows
- **Booking** — Multi-step form with real-time availability checking, double-booking prevention, and price calculation
- **Gallery** — Masonry photo grid with lightbox viewer, category filtering
- **Virtual Tours** — 360° panoramic room tours via react-pannellum
- **Services & Leisure** — Hotel amenities and leisure site listings

### Admin CMS

- **Dashboard** — Overview stats (rooms, bookings, services, leisure sites)
- **Rooms** — Create, edit, and manage room listings across all tiers
- **Bookings** — View all bookings, update status (confirmed → checked in → checked out), cancel bookings
- **Users** — Manage admin accounts (create, edit, delete)
- **Settings** — Edit hotel info, contact details, check-in/out times, pricing rules

### Email Notifications

- Booking confirmation sent to guests
- New booking notification sent to hotel admin
- Status change emails to both guest and admin
- Gracefully skipped when SMTP is not configured

## Project Structure

```
app/
  (public)/          # Public pages (NavBar + Footer layout)
    rooms/           # Room listing and detail pages
    booking/         # Booking form and confirmation
    gallery/         # Photo gallery with lightbox
    virtual-tour/    # 360° panoramic tours
    services/        # Hotel services
    leisure/         # Leisure sites
  (admin-auth)/      # Login page
  admin/             # Admin CMS (protected)
  api/               # API routes (availability, auth, upload)

lib/
  actions/           # Server actions (auth, admin CRUD, bookings)
  email.ts           # Nodemailer email functions
  db.ts              # Database connection, auto-migration, seeding
  schema.ts          # Drizzle ORM schema (7 tables)
  auth.ts            # NextAuth configuration
  gallery-images.ts  # Dynamic gallery from filesystem

public/
  rooms/             # Room tier images (deluxe/, supreme/, executive/, presidential/)
  hero/              # Homepage hero images
  uploads/           # Uploaded images
```

## Database

The app uses 7 tables: `room_tiers`, `rooms`, `bookings`, `services`, `leisure_sites`, `site_settings`, and `admin_users`.

On startup, the database is auto-migrated (`CREATE TABLE IF NOT EXISTS`) and seeded with default data if empty — including 4 room tiers, 24 rooms, 6 services, 4 leisure sites, and site settings.

### Room Tiers (default pricing)

| Tier | Starting Price |
|------|---------------|
| Deluxe | ₦30,000/night |
| Supreme | ₦35,000/night |
| Executive | ₦40,000/night |
| Presidential | ₦70,000/night |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (auto-bootstraps DB) |
| `npm run build` | Production build (auto-bootstraps DB) |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run bootstrap` | Manually create tables and seed data |

## License

Private — GB Hotel and Suite

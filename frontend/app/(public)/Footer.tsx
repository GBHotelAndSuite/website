import Link from "next/link";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/schema";

const DEFAULTS: Record<string, string> = {
  hotel_name: "GB Hotel and Suite",
  hotel_tagline: "Experience luxury, embrace comfort.",
  hotel_address: "49/50 Anglican Road Ota, Sango Ota, Ogun State.",
  hotel_city: "Lagos, Nigeria",
  hotel_phone: "+234 7010994474",
  hotel_email: "info@gbhotelandsuite.com",
  check_in_time: "15:00",
  check_out_time: "11:00",
};

function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return hhmm;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

export default async function Footer() {
  let rows: { key: string; value: string }[] = [];

  try {
    rows = await db.select().from(siteSettings);
  } catch {
    console.warn("Footer: failed to fetch site_settings, using defaults");
  }

  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }

  const s = (key: string) => map[key] ?? DEFAULTS[key] ?? "";

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-heading">
              {s("hotel_name")}
            </h3>
            <p className="text-sm leading-relaxed text-muted">
              {s("hotel_tagline")}
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-heading">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/rooms" className="transition-colors hover:text-heading">Rooms</Link></li>
              <li><Link href="/services" className="transition-colors hover:text-heading">Services</Link></li>
              <li><Link href="/leisure" className="transition-colors hover:text-heading">Leisure</Link></li>
              <li><Link href="/booking" className="transition-colors hover:text-heading">Book Now</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-heading">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>{s("hotel_address")}</li>
              <li>{s("hotel_city")}</li>
              <li>{s("hotel_phone")}</li>
              <li>{s("hotel_email")}</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-heading">
              Hours
            </h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>Check-in: {formatTime(s("check_in_time"))}</li>
              <li>Check-out: {formatTime(s("check_out_time"))}</li>
              <li>Reception: 24/7</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-line pt-6 text-center text-sm text-subtle">
          &copy; {new Date().getFullYear()} {s("hotel_name")}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

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
        <div className="mt-10 border-t border-line pt-6 flex flex-col items-center gap-4">
          <div className="flex gap-5">
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted transition-colors hover:text-heading">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.088 4.088 0 0 1 1.47.957c.453.453.724.887.957 1.47.164.46.35 1.26.403 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.088 4.088 0 0 1-.957 1.47 4.088 4.088 0 0 1-1.47.957c-.46.164-1.26.35-2.43.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.088 4.088 0 0 1-1.47-.957 4.088 4.088 0 0 1-.957-1.47c-.164-.46-.35-1.26-.403-2.43C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43A4.088 4.088 0 0 1 3.593 3.25a4.088 4.088 0 0 1 1.47-.957c.46-.164 1.26-.35 2.43-.403C8.76 2.175 9.14 2.163 12 2.163Zm0 1.802c-3.15 0-3.504.013-4.744.07-1.147.052-1.77.244-2.184.405-.55.217-.94.477-1.35.89-.412.41-.672.8-.89 1.35-.161.414-.353 1.037-.405 2.184-.057 1.24-.07 1.594-.07 4.744s.013 3.504.07 4.744c.052 1.147.244 1.77.405 2.184.217.55.477.94.89 1.35.41.412.8.672 1.35.89.414.161 1.037.353 2.184.405 1.24.057 1.594.07 4.744.07s3.504-.013 4.744-.07c1.147-.052 1.77-.244 2.184-.405.55-.217.94-.477 1.35-.89.412-.41.672-.8.89-1.35.161-.414.353-1.037.405-2.184.057-1.24.07-1.594.07-4.744s-.013-3.504-.07-4.744c-.052-1.147-.244-1.77-.405-2.184a3.635 3.635 0 0 0-.89-1.35 3.635 3.635 0 0 0-1.35-.89c-.414-.161-1.037-.353-2.184-.405-1.24-.057-1.594-.07-4.744-.07Zm0 3.07a4.965 4.965 0 1 1 0 9.93 4.965 4.965 0 0 1 0-9.93Zm0 1.802a3.163 3.163 0 1 0 0 6.326 3.163 3.163 0 0 0 0-6.326Zm6.406-3.163a1.16 1.16 0 1 1-2.32 0 1.16 1.16 0 0 1 2.32 0Z"/></svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-muted transition-colors hover:text-heading">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-muted transition-colors hover:text-heading">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z"/></svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="text-muted transition-colors hover:text-heading">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/></svg>
            </a>
          </div>
          <p className="text-sm text-subtle">
            &copy; {new Date().getFullYear()} {s("hotel_name")}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import NavBar from "./NavBar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-heading">
                Grand Vista
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                Experience luxury, embrace comfort. Your perfect stay awaits.
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
                <li>123 Luxury Avenue</li>
                <li>Downtown, City</li>
                <li>+1 (555) 123-4567</li>
                <li>info@grandvistahotel.com</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-heading">
                Hours
              </h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>Check-in: 3:00 PM</li>
                <li>Check-out: 11:00 AM</li>
                <li>Reception: 24/7</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-line pt-6 text-center text-sm text-subtle">
            &copy; {new Date().getFullYear()} Grand Vista Hotel. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}

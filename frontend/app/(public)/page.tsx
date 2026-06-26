import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center -mt-28 pt-20">
        <Image
          src="/hero-bg.avif"
          alt=""
          fill
          className="object-cover"
          preload
        />
        <div className="absolute inset-0 bg-linear-to-br from-heading/80 to-black/70" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1
            style={{
              fontFamily: "var(--font-playfair-display)",
              color: "white",
            }}
            className="mb-4 text-5xl font-bold tracking-wide sm:text-6xl lg:text-7xl"
          >
            GB Hotel and Suite
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-inverse-muted">
            Welcome to GB Hotel and Suite, where modern luxury meets timeless
            elegance. Unforgettable experiences, world-class amenities, and
            exceptional service await.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/rooms"
              className="rounded-full bg-white px-8 py-3 font-medium text-heading transition-colors hover:bg-fill"
            >
              Explore Rooms
            </Link>
            <Link
              href="/virtual-tour"
              className="rounded-full border border-white/30 px-8 py-3 font-medium text-white transition-colors hover:bg-white/10"
            >
              Virtual Tour
            </Link>
            <Link
              href="/booking"
              className="rounded-full border border-white/30 px-8 py-3 font-medium text-white transition-colors hover:bg-white/10"
            >
              Book Your Stay
            </Link>
          </div>
        </div>
      </section>

      {/* Room Tiers Preview */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-white   sm:text-4xl">
              Our Rooms
            </h2>
            <p className="mx-auto max-w-2xl text-white">
              From comfortable standards to luxurious penthouses, find the
              perfect space for your stay.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                tier: "deluxe",
                name: "Deluxe",
                desc: "Premium comfort and space",
                price: "From ₦30,000/night",
              },
              {
                tier: "supreme",
                name: "Supreme",
                desc: "Elevated luxury and style",
                price: "From ₦35,000/night",
              },
              {
                tier: "executive",
                name: "Executive",
                desc: "Refined executive comfort",
                price: "From ₦40,000/night",
              },
              {
                tier: "presidential",
                name: "Presidential",
                desc: "Ultimate luxury living",
                price: "From ₦70,000/night",
              },
            ].map((tier) => (
              <Link
                key={tier.tier}
                href={`/rooms?tier=${tier.tier}`}
                className="group rounded-xl border border-line p-6 transition-all hover:border-accent hover:shadow-lg"
              >
                <h3 className="mb-1 text-lg font-semibold text-heading">
                  {tier.name}
                </h3>
                <p className="mb-4 text-sm text-muted">{tier.desc}</p>
                <p className="text-sm font-medium text-heading">{tier.price}</p>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/rooms"
              className="inline-flex rounded-full bg-accent px-8 py-3 font-medium text-white transition-colors hover:bg-accent-dark"
            >
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-heading sm:text-4xl">
              Services & Amenities
            </h2>
            <p className="mx-auto max-w-2xl text-muted">
              Everything you need for a perfect stay, all under one roof.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Spa & Wellness",
                desc: "Massage, facials, and holistic treatments",
              },
              { name: "Fine Dining", desc: "Award-winning restaurant and bar" },
              { name: "Infinity Pool", desc: "Panoramic city views" },
              { name: "Fitness Center", desc: "State-of-the-art equipment" },
              { name: "Concierge", desc: "24/7 personalized assistance" },
              { name: "Business Center", desc: "Meeting rooms and support" },
            ].map((service) => (
              <div
                key={service.name}
                className="rounded-xl border border-line bg-white p-6"
              >
                <h3 className="mb-2 font-semibold text-heading">
                  {service.name}
                </h3>
                <p className="text-sm text-muted">{service.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex rounded-full border border-line px-8 py-3 font-medium text-heading transition-colors hover:bg-fill"
            >
              Explore All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-heading sm:text-4xl">
            Ready to Experience GB Hotel and Suite?
          </h2>
          <p className="mb-8 text-lg text-muted">
            Book your stay today and discover what makes us special.
          </p>
          <Link
            href="/booking"
            className="inline-flex rounded-full bg-accent px-10 py-4 text-lg font-medium text-white transition-colors hover:bg-accent-dark"
          >
            Book Your Stay
          </Link>
        </div>
      </section>
    </div>
  );
}

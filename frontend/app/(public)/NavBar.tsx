"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const LOGO_SIZE = { width: 180, height: 48 };

export default function NavBar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const opaque = !isHome || scrolled || menuOpen;

  const linkClass = (active = false, block = false) =>
    `relative transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full ${
      block ? "block w-full" : ""
    } ${active ? "after:w-full" : ""} ${
      opaque
        ? active
          ? "text-heading"
          : "text-muted hover:text-heading"
        : active
          ? "text-white"
          : "text-white/80 hover:text-white"
    }`;

  const desktopLinks = (
    <>
      <Link href="/rooms" className={linkClass(pathname === "/rooms")}>
        Rooms
      </Link>
      <Link href="/services" className={linkClass(pathname === "/services")}>
        Services
      </Link>
      <Link href="/leisure" className={linkClass(pathname === "/leisure")}>
        Leisure
      </Link>
      <Link
        href="/virtual-tour"
        className={linkClass(pathname === "/virtual-tour")}
      >
        Virtual Tour
      </Link>
      <Link
        href="/booking"
        className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
          opaque
            ? "bg-accent text-white hover:bg-accent-dark"
            : "bg-white text-heading hover:bg-white/90"
        }`}
      >
        Book Now
      </Link>
    </>
  );

  const mobileLinks = (
    <>
      <Link href="/rooms" className={linkClass(pathname === "/rooms", true)}>
        Rooms
      </Link>
      <Link
        href="/services"
        className={linkClass(pathname === "/services", true)}
      >
        Services
      </Link>
      <Link
        href="/leisure"
        className={linkClass(pathname === "/leisure", true)}
      >
        Leisure
      </Link>
      <Link
        href="/virtual-tour"
        className={linkClass(pathname === "/virtual-tour", true)}
      >
        Virtual Tour
      </Link>
      <Link
        href="/booking"
        className={`rounded-full px-5 py-2 text-sm font-medium transition-colors w-full text-center ${
          opaque
            ? "bg-accent text-white hover:bg-accent-dark"
            : "bg-white text-heading hover:bg-white/90"
        }`}
      >
        Book Now
      </Link>
    </>
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        opaque
          ? "border-b border-line bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/">
          <Image
            src="/GB Hotel Logo.png"
            alt="GB Hotel and Suite"
            width={LOGO_SIZE.width}
            height={LOGO_SIZE.height}
            className="h-auto w-[140px] sm:w-[180px]"
            priority
          />
        </Link>
        
        <nav className="hidden items-center gap-8 text-sm font-medium sm:flex">
          {desktopLinks}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className={`sm:hidden p-2 rounded-md transition-colors ${
            opaque ? "text-heading" : "text-white"
          }`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div
          className={`border-t px-4 py-4 flex flex-col gap-3 text-sm font-medium sm:hidden ${
            opaque ? "border-line bg-white" : "border-white/20 bg-black/80"
          }`}
        >
          {mobileLinks}
        </div>
      )}
    </header>
  );
}

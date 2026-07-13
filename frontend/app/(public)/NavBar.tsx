"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const LOGO_SIZE = { width: 80, height: 40 };

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
		// eslint-disable-next-line
		setMenuOpen(false);
	}, [pathname]);

	const opaque = !isHome || scrolled || menuOpen;

	const linkClass = (active = false, block = false) =>
		`relative transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full ${
			block ? "block w-full" : ""
		} ${active && !block ? "after:w-full" : ""} ${active && block ? "font-bold" : ""} ${
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
			<Link
				href="/rooms"
				className={`
					${linkClass(pathname === "/rooms")}
				`}
			>
				Rooms
			</Link>
			<Link
				href="/services"
				className={`
					${linkClass(pathname === "/services")}
				`}
			>
				Services
			</Link>
			{/* <Link href="/leisure" className={linkClass(pathname === "/leisure")}>
        Leisure
      </Link> */}
			<Link
				href="/gallery"
				className={`
					${linkClass(pathname === "/gallery")}
				`}
			>
				Gallery
			</Link>
			<Link
				href="/virtual-tour"
				className={`
					${linkClass(pathname === "/virtual-tour")}
				`}
			>
				Virtual Tour
			</Link>
			<Link
				href="/booking"
				className={`
					px-5 py-2
					text-sm font-medium
					rounded-full
					transition-colors
					${
					opaque
					? "bg-accent text-white hover:bg-accent-dark"
					: "bg-white text-heading hover:bg-white/90"
					}
				`}
			>
				Book Now
			</Link>
		</>
	);

	const mobileLinks = [
		{ href: "/rooms", label: "Rooms", active: pathname === "/rooms" },
		{ href: "/services", label: "Services", active: pathname === "/services" },
		{ href: "/gallery", label: "Gallery", active: pathname === "/gallery" },
		{
			href: "/virtual-tour",
			label: "Virtual Tour",
			active: pathname === "/virtual-tour",
		},
	];

	return (
		<header
			className={`
				sticky top-0
				z-50
				pt-[env(safe-area-inset-top)]
				transition-colors
				${
				opaque
				? "border-b border-line bg-white/95 backdrop-blur-sm shadow-sm"
				: "bg-transparent"
				}
			`}
		>
			<div
				className="
					items-center justify-between
					flex
					max-w-7xl
					py-2 mx-auto px-4
					sm:px-6
					lg:px-8
				"
			>
				<Link href="/">
					<Image
						src="/GB Hotel Logo.png"
						alt="GB Hotel and Suite"
						width={LOGO_SIZE.width}
						height={LOGO_SIZE.height}
						priority
						className="
							h-auto w-[100px]
							sm:w-[140px]
						"
					/>
				</Link>

				<nav
					className="
						items-center gap-8
						hidden
						text-sm font-medium
						sm:flex
					"
				>
					{desktopLinks}
				</nav>

				<button
					type="button"
					onClick={() => setMenuOpen((o) => !o)}
					aria-label={menuOpen ? "Close menu" : "Open menu"}
					className={`
						p-2
						rounded-md
						transition-colors
						sm:hidden
						${opaque ? "text-heading" : "text-white"}
					`}
				>
					<svg
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						className="
							h-6 w-6
						"
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
					className={`
						absolute inset-x-0 top-full gap-3
						z-50 flex flex-col
						px-4 py-4
						text-sm font-medium
						border-t
						shadow-lg
						sm:hidden
						${opaque ? "border-line bg-white" : "border-white/20 bg-black/80"}
					`}
				>
					{mobileLinks.map((link, i) => (
						<Link
							key={link.href}
							href={link.href}
							style={{
								opacity: 0,
								animation: `fade-in-down 0.3s ease-out ${i * 60}ms forwards`,
							}}
							className={`
								${linkClass(link.active, true)}
							`}
						>
							{link.label}
						</Link>
					))}
					<Link
						href="/booking"
						style={{
							opacity: 0,
							animation: `fade-in-down 0.3s ease-out ${mobileLinks.length * 60}ms forwards`,
						}}
						className={`
							w-full
							px-5 py-2
							text-sm font-medium text-center
							rounded-full
							transition-colors
							${
							opaque
							? "bg-accent text-white hover:bg-accent-dark"
							: "bg-white text-heading hover:bg-white/90"
							}
						`}
					>
						Book Now
					</Link>
				</div>
			)}
		</header>
	);
}

import Link from "next/link";
import AnimateInView from "@/components/AnimateInView";
import TypingText from "@/components/TypingText";
import HeroSlideshow, { type HeroSlide } from "./HeroSlideshow";
import HeroBookingWidget from "./HeroBookingWidget";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/schema";
import { sql } from "drizzle-orm";

const HERO_SLIDES: HeroSlide[] = [
	{ type: "image", src: "/hero/2.JPG" },
	{ type: "image", src: "/hero/nightview.jpg" },
	{ type: "video", src: "/hero/drone.mp4", poster: "/hero/hero-bg.avif" },
	{ type: "video", src: "/hero/nightview-video.mp4" },
];

export default async function HomePage() {
	const settingsRows = await db
		.select()
		.from(siteSettings)
		.where(sql`${siteSettings.key} IN ('check_in_time', 'check_out_time')`)
		.all();
	const settings: Record<string, string> = {};
	for (const row of settingsRows) {
		settings[row.key] = row.value;
	}

	return (
		<div
			className="
				flex flex-col
			"
		>
			{/* Hero */}
			<section
				className="
					relative -mt-[calc(93px+env(safe-area-inset-top))]
					flex flex-col
					h-screen
					lg:pt-[calc(330px+env(safe-area-inset-top))] lg:px-16
				"
			>
				<HeroSlideshow slides={HERO_SLIDES} />
				<div
					className="
						absolute inset-0
						bg-linear-to-br from-heading/80 to-black/30
					"
				/>
				<div
					className="
						relative items-center justify-center
						z-10 flex flex-row
						mt-34
						lg:items-start lg:justify-between lg:mt-0
						xl:px-40
					"
				>
					<div
						className="
							flex flex-col
						"
					>
						<div
							className="
								max-w-3xl
								text-center
								lg:text-left
							"
						>
							<AnimateInView animation="fade-in-up">
								<h1
									style={{
										fontFamily: "var(--font-cormorant-garamond)",
										color: "white",
									}}
									className="
										mb-4
										text-5xl font-bold tracking-wide
										sm:text-6xl
										lg:text-7xl
									"
								>
									GB Hotel and Suite
								</h1>
							</AnimateInView>
							<AnimateInView animation="fade-in-up" delay={300}>
								<TypingText
									text="Welcome to GB Hotel and Suite, where modern luxury meets timeless elegance. Unforgettable experiences, world-class amenities, and exceptional service await."
									speed={35}
									delay={500}
									style={{
										fontFamily: "var(--font-cormorant-garamond)",
									}}
									className="
										max-w-xl
										mb-8 mx-3
										text-xl leading-relaxed text-white
										lg:mx-0
									"
								/>
							</AnimateInView>
						</div>
						{/* Buttons Div */}
						<div
							className="
								gap-8 items-center justify-center
								flex flex-col
								mt-auto pb-8 pt-4
								sm:gap-4 sm:justify-center
								lg:justify-start lg:flex-row lg:mt-0 lg:pb-0
							"
						>
							<AnimateInView animation="fade-in-up" delay={300}>
								<Link
									href="/rooms"
									className="
										hover:bg-fill
										px-5 py-2.5
										text-sm font-medium text-heading
										bg-white
										rounded-full
										transition-colors
										sm:px-8 sm:py-3 sm:text-base
									"
								>
									Explore Rooms
								</Link>
							</AnimateInView>
							<AnimateInView animation="fade-in-up" delay={400}>
								<Link
									href="/virtual-tour"
									className="
										hover:bg-white/10
										px-5 py-2.5
										text-sm font-medium text-white
										rounded-full border border-white/30
										transition-colors
										sm:px-8 sm:py-3 sm:text-base
									"
								>
									Virtual Tour
								</Link>
							</AnimateInView>
							<AnimateInView animation="fade-in-up" delay={450}>
								<Link
									href="/booking"
									className="
										hover:bg-accent-dark
										px-5 py-2.5
										text-sm font-medium text-white
										bg-accent
										rounded-full
										transition-colors
										sm:px-8 sm:py-3 sm:text-base
										lg:hidden
									"
								>
									Book Now
								</Link>
							</AnimateInView>
						</div>
					</div>
					<div
						className="
							self-center
							hidden
							lg:flex
						"
					>
						<AnimateInView delay={500} animation="fade-in-up">
							<HeroBookingWidget />
						</AnimateInView>
					</div>
				</div>
			</section>

			{/* Room Tiers Preview */}
			<section
				className="
					py-20
				"
			>
				<div
					className="
						max-w-7xl
						mx-auto px-4
						sm:px-6
						lg:px-8
					"
				>
					<AnimateInView animation="fade-in-up">
						<div
							className="
								mb-12
								text-center
							"
						>
							<h2
								style={{
									fontFamily: "var(--font-cormorant-garamond)",
								}}
								className="
									mb-3
									text-5xl font-bold tracking-tight text-white
									sm:text-4xl
								"
							>
								Our Rooms
							</h2>
							<p
								style={{
									fontFamily: "var(--font-cormorant-garamond)",
								}}
								className="
									max-w-2xl
									mx-auto
									text-black text-2xl
								"
							>
								From comfortable standards to luxurious penthouses, find the
								perfect space for your stay.
							</p>
						</div>
					</AnimateInView>
					<div
						className="
							gap-6
							grid
							sm:grid-cols-2
							lg:grid-cols-4
						"
					>
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
						].map((tier, i) => (
							<AnimateInView
								key={tier.tier}
								animation="fade-in-up"
								delay={i * 100}
							>
								<Link
									href={`/rooms?tier=${tier.tier}`}
									className="
										group hover:border-accent hover:shadow-lg
										block
										p-6
										rounded-xl border border-line
										transition-all
									"
								>
									<h3
										className="
											mb-1
											text-lg font-semibold text-heading
										"
									>
										{tier.name}
									</h3>
									<p
										className="
											mb-4
											text-sm text-muted
										"
									>
										{tier.desc}
									</p>
									<p
										className="
											text-sm font-medium text-heading
										"
									>
										{tier.price}
									</p>
								</Link>
							</AnimateInView>
						))}
					</div>
					<AnimateInView animation="fade-in-up" delay={500}>
						<div
							className="
								mt-10
								text-center
							"
						>
							<Link
								href="/rooms"
								className="
									hover:bg-accent-dark
									inline-flex
									px-8 py-3
									font-medium text-white
									bg-accent
									rounded-full
									transition-colors
								"
							>
								View All Rooms
							</Link>
						</div>
					</AnimateInView>
				</div>
			</section>

			{/* Services Preview */}
			<section
				className="
					py-20
					bg-surface
				"
			>
				<div
					className="
						max-w-7xl
						mx-auto px-4
						sm:px-6
						lg:px-8
					"
				>
					<AnimateInView animation="fade-in-up">
						<div
							className="
								mb-12
								text-center
							"
						>
							<h2
								style={{
									fontFamily: "var(--font-cormorant-garamond)",
								}}
								className="
									mb-3
									text-3xl font-bold tracking-tight text-heading
									sm:text-4xl
								"
							>
								Services & Amenities
							</h2>
							<p
								style={{
									fontFamily: "var(--font-cormorant-garamond)",
								}}
								className="
									max-w-2xl
									mx-auto
									text-xl text-muted
								"
							>
								Everything you need for a perfect stay, all under one roof.
							</p>
						</div>
					</AnimateInView>
					<div
						className="
							gap-6
							grid
							sm:grid-cols-2
							lg:grid-cols-3
						"
					>
						{[
							{ name: "24/7 Power Supply", desc: "Uninterrupted comfort around the clock" },
							{ name: "Fitness Center", desc: "State-of-the-art equipment" },
							{ name: "Concierge", desc: "24/7 personalized assistance" },
						].map((service, i) => (
							<AnimateInView
								key={service.name}
								animation="fade-in-up"
								delay={i * 100}
							>
								<div
									className="
										p-6
										bg-white
										rounded-xl border border-line
									"
								>
									<h3
										className="
											mb-2
											font-semibold text-heading
										"
									>
										{service.name}
									</h3>
									<p
										className="
											text-sm text-muted
										"
									>
										{service.desc}
									</p>
								</div>
							</AnimateInView>
						))}
					</div>
					<AnimateInView animation="fade-in-up" delay={700}>
						<div
							className="
								mt-10
								text-center
							"
						>
							<Link
								href="/services"
								className="
									hover:bg-fill
									inline-flex
									px-8 py-3
									font-medium text-heading
									rounded-full border border-line
									transition-colors
								"
							>
								Explore All Services
							</Link>
						</div>
					</AnimateInView>
				</div>
			</section>

			{/* Call to Action */}
			<section
				className="
					py-20
				"
			>
				<div
					className="
						max-w-3xl
						mx-auto px-4
						text-center
						sm:px-6
					"
				>
					<AnimateInView animation="fade-in-up">
						<h2
							style={{
								fontFamily: "var(--font-cormorant-garamond)",
							}}
							className="
								mb-4
								text-3xl font-bold tracking-tight text-heading
								sm:text-4xl
							"
						>
							Ready to Experience GB Hotel and Suite?
						</h2>
						<p
							style={{
								fontFamily: "var(--font-cormorant-garamond)",
							}}
							className="
								mb-8
								text-xl text-muted
							"
						>
							Book your stay today and discover what makes us special.
						</p>
						<Link
							href="/booking"
							className="
								hover:bg-accent-dark
								inline-flex
								px-10 py-4
								text-lg font-medium text-white
								bg-accent
								rounded-full
								transition-colors
							"
						>
							Book Your Stay
						</Link>
					</AnimateInView>
				</div>
			</section>
		</div>
	);
}

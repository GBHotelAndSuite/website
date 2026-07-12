"use client";

import { motion } from "framer-motion";
import ParallaxSection from "@/components/ParallaxSection";

interface Service {
	id: string;
	name: string;
	description: string;
	image?: string;
	gradient: string;
}

// TODO: When switching to DB, map DB records to this array and remove the hardcoded data
const HARDCODED_SERVICES: Service[] = [
	{
		id: "bar",
		name: "Bar & Lounge",
		description:
			"Sip handcrafted cocktails and fine wines in our sophisticated bar and lounge. Live music, ambient lighting, and an extensive drinks menu await.",
		image: "/bar/bar.JPG",
		gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
	},
	{
		id: "fitness-center",
		name: "Fitness Center",
		description:
			"State-of-the-art equipment and personal training services to keep your fitness routine on track. Open 24/7 for your convenience.",
		image: "/gym-area/gym-area.JPG",
		gradient: "linear-gradient(135deg, #2d3436 0%, #636e72 100%)",
	},
	{
		id: "spa-wellness",
		name: "Spa & Wellness",
		description:
			"Indulge in luxurious massage, facials, and holistic treatments designed to restore your body and mind. Our skilled therapists use premium products and ancient techniques for an unforgettable experience.",
		gradient: "linear-gradient(135deg, #8B6914 0%, #D4A574 50%, #C4956A 100%)",
	},
	{
		id: "fine-dining",
		name: "Fine Dining",
		description:
			"Savor award-winning cuisine crafted by our world-class chefs. From locally sourced ingredients to international flavors, every meal is a culinary journey in an elegant setting.",
		gradient: "linear-gradient(135deg, #4A0E0E 0%, #8B2500 50%, #A0522D 100%)",
	},
	{
		id: "infinity-pool",
		name: "Infinity Pool",
		description:
			"Take a dip in our stunning infinity pool with panoramic city views. Relax on sun loungers, enjoy poolside service, and let the world melt away.",
		gradient: "linear-gradient(135deg, #006994 0%, #00CED1 50%, #20B2AA 100%)",
	},
	{
		id: "concierge",
		name: "Concierge",
		description:
			"24/7 personalized assistance for restaurant reservations, exclusive tours, transportation, and anything your heart desires. We make the impossible possible.",
		gradient: "linear-gradient(135deg, #1B1464 0%, #2C3E50 50%, #34495E 100%)",
	},
	{
		id: "business-center",
		name: "Business Center",
		description:
			"Fully equipped meeting rooms, high-speed internet, and professional support services. Conduct business in style with our premium corporate facilities.",
		gradient: "linear-gradient(135deg, #2C3E50 0%, #4A6741 50%, #27AE60 100%)",
	},
];

export default function ServicesParallax() {
	return (
		<div>
			{/* Hero */}
			<section
				className="
					relative items-center justify-center
					flex overflow-hidden
					h-screen
				"
			>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src="/building/3S9A8839.JPG"
					alt=""
					className="
						absolute inset-0
						object-cover
						h-full w-full
					"
				/>
				<div
					className="
						absolute inset-0
						bg-black/30
					"
				/>
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					className="
						relative
						z-10
						px-6
						text-center
					"
				>
					<motion.span
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="
							uppercase
							inline-block
							mb-4 px-4 py-1.5
							text-xs font-semibold tracking-widest text-white/70
							rounded-full border border-white/20
						"
					>
						GB Hotel and Suite
					</motion.span>
					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.3 }}
						style={{
							fontFamily: "var(--font-cormorant-garamond)",
							color: "white",
						}}
						className="
							mb-4
							text-5xl font-bold tracking-tight text-white
							sm:text-6xl
							lg:text-7xl
						"
					>
						Services & Amenities
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.45 }}
						className="
							max-w-2xl
							mx-auto
							text-lg leading-relaxed text-white/70
							sm:text-xl
						"
					>
						Everything you need for a memorable stay, all under one roof.
					</motion.p>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 1, delay: 1.2 }}
						className="
							mt-12
						"
					>
						<svg
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
							className="
								h-6 w-6
								mx-auto
								text-white/50
								animate-bounce
							"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M19 14l-7 7m0 0l-7-7m7 7V3"
							/>
						</svg>
					</motion.div>
				</motion.div>
			</section>

			{/* Service Sections */}
			{HARDCODED_SERVICES.map((service, i) => (
				<ParallaxSection
					key={service.id}
					image={service.image}
					gradient={service.gradient}
					title={service.name}
					description={service.description}
					reverse={i % 2 !== 0}
					index={i}
				/>
			))}
		</div>
	);
}

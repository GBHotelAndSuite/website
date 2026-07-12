import Link from "next/link";
import { db } from "@/lib/db";
import { rooms, roomTiers } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { getGalleryCategories } from "@/lib/gallery-images";
import TierSlideshow from "./TierSlideshow";

export default async function RoomsPage({
	searchParams,
}: {
	searchParams: Promise<{ tier?: string }>;
}) {
	const { tier } = await searchParams;

	const tiers = await db
		.select()
		.from(roomTiers)
		.orderBy(asc(roomTiers.sortOrder))
		.all();

	const allRooms = await db
		.select({
			id: rooms.id,
			name: rooms.name,
			description: rooms.description,
			basePrice: rooms.basePrice,
			capacity: rooms.capacity,
			tierId: rooms.tierId,
			tierName: roomTiers.name,
		})
		.from(rooms)
		.innerJoin(roomTiers, eq(rooms.tierId, roomTiers.id))
		.where(eq(rooms.isActive, 1))
		.orderBy(asc(roomTiers.sortOrder))
		.all();

	const filteredRooms = tier
		? allRooms.filter((r) => r.tierId === tier)
		: allRooms;

	const activeTier = tier ? tiers.find((t) => t.id === tier) : null;
	const galleryCategories = getGalleryCategories();
	const tierGallery = tier
		? galleryCategories.find((c) => c.slug === tier)
		: null;

	return (
		<div
			className="
				py-16
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
				<div
					className="
						justify-center items-center
						flex flex-col
						mb-10
					"
				>
					<h1
						style={{
							fontFamily: "var(--font-cormorant-garamond)",
						}}
						className="
							text-4xl font-bold tracking-tight text-heading
						"
					>
						Our Rooms
					</h1>
					<p
						className="
							mt-2
							text-center text-lg text-muted
						"
					>
						Choose from our selection of thoughtfully designed rooms and suites.
					</p>
				</div>

				{/* Tier filter */}
				<div
					className="
						gap-2 justify-center
						flex flex-wrap
						mb-10
					"
				>
					<Link
						href="/rooms"
						className={`
							px-4 py-2
							text-sm font-medium
							rounded-full
							transition-colors
							${!tier ? "bg-accent text-white" : "bg-fill text-body hover:bg-fill"}
						`}
					>
						All
					</Link>
					{tiers.map((t) => (
						<Link
							key={t.id}
							href={`/rooms?tier=${t.id}`}
							className={`
								px-4 py-2
								text-sm font-medium
								rounded-full
								transition-colors
								${tier === t.id ? "bg-accent text-white" : "bg-fill text-body hover:bg-fill"}
							`}
						>
							{t.name}
						</Link>
					))}
				</div>

				{/* Tier slideshow */}
				{tierGallery && tierGallery.images.length > 0 && activeTier && (
					<TierSlideshow
						images={tierGallery.images}
						tierName={activeTier.name}
						tierDescription={activeTier.description}
					/>
				)}

				{/* Room grid */}
				<div
					className="
						gap-6
						grid
						sm:grid-cols-2
						lg:grid-cols-3
					"
				>
					{filteredRooms.map((room) => (
						<Link
							key={room.id}
							href={`/booking?room=${room.id}`}
							className="
								group hover:border-accent hover:shadow-lg
								p-6
								rounded-xl border border-line
								transition-all
							"
						>
							<div
								className="
									items-center gap-2
									flex
									mb-3
								"
							>
								<span
									className="
										px-2.5 py-0.5
										text-xs font-medium text-body
										bg-fill
										rounded-full
									"
								>
									{room.tierName}
								</span>
								<span
									className="
										text-xs text-subtle
									"
								>
									Up to {room.capacity} guest{room.capacity > 1 ? "s" : ""}
								</span>
							</div>
							<h3
								className="
									group-hover:underline
									mb-1.5
									text-lg font-semibold text-heading
								"
							>
								{room.name}
							</h3>
							<p
								className="
									line-clamp-2
									mb-4
									text-sm leading-relaxed text-muted
								"
							>
								{room.description}
							</p>
							<div
								className="
									items-center justify-between
									flex
								"
							>
								<p
									className="
										text-sm font-medium text-heading
									"
								>
									From ₦{room.basePrice.toLocaleString()}
									<span
										className="
											font-normal text-subtle
										"
									>
										{" "}
										/ night
									</span>
								</p>
								<span
									className="
										group-hover:bg-accent-dark
										px-4 py-1.5
										text-xs font-medium text-white
										bg-accent
										rounded-full
										transition-colors
									"
								>
									Book Now
								</span>
							</div>
						</Link>
					))}
				</div>

				{filteredRooms.length === 0 && (
					<p
						className="
							py-20
							text-center text-subtle
						"
					>
						No rooms found.
					</p>
				)}
			</div>
		</div>
	);
}

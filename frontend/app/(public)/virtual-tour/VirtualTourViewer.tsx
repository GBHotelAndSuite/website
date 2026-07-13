"use client";

import { useState, useEffect } from "react";
import ReactPannellum from "react-pannellum";

interface TourLocation {
	id: string;
	name: string;
	category: "rooms" | "common";
	image: string;
}

const LOCATIONS: TourLocation[] = [
	{
		id: "deluxe",
		name: "Deluxe Room",
		category: "rooms",
		image: "/360/rooms/deluxe/panorama.jpg",
	},
	{
		id: "supreme",
		name: "Supreme Room",
		category: "rooms",
		image: "/360/rooms/supreme/panorama.jpg",
	},
	// {
	//   id: "executive",
	//   name: "Executive Room",
	//   category: "rooms",
	//   image: "/360/rooms/executive/panorama.jpg",
	// },
	{
		id: "presidential-living",
		name: "Presidential — Living Room",
		category: "rooms",
		image: "/360/rooms/presidential/living-room/panorama.jpg",
	},
	{
		id: "presidential-bed",
		name: "Presidential — Bedroom",
		category: "rooms",
		image: "/360/rooms/presidential/bedroom/panorama.jpg",
	},
	{
		id: "reception",
		name: "Reception",
		category: "common",
		image: "/360/reception/panorama.jpg",
	},
	{
		id: "bar",
		name: "Bar",
		category: "common",
		image: "/360/bar/panorama.jpg",
	},
	{
		id: "gym",
		name: "Fitness Center",
		category: "common",
		image: "/360/gym/panorama.jpg",
	},
	{
		id: "car-park",
		name: "Car Park",
		category: "common",
		image: "/360/car-park/panorama.jpg",
	},
];

function LocationButton({
	location,
	isActive,
	onClick,
}: {
	location: TourLocation;
	isActive: boolean;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className={`
				backdrop-blur-sm
				px-4 py-1.5
				whitespace-nowrap text-sm font-medium
				rounded-full
				transition-colors
				${
				isActive
				? "bg-white text-heading"
				: "bg-black/40 text-white/80 hover:bg-black/60 hover:text-white"
				}
			`}
		>
			{location.name}
		</button>
	);
}

export default function VirtualTourViewer() {
	const [active, setActive] = useState<string>(LOCATIONS[1].id);
	const [navOpen, setNavOpen] = useState(false);
	const [hfov, setHfov] = useState(110);
	const current = LOCATIONS.find((l) => l.id === active) ?? LOCATIONS[1];

	useEffect(() => {
		if (window.innerWidth <= 1024) {
			setHfov(75);
			console.log(`Setting hfov to 75 for mobile, ${hfov}`);
		}
	}, []);

	const roomLocations = LOCATIONS.filter((l) => l.category === "rooms");
	const commonLocations = LOCATIONS.filter((l) => l.category === "common");

	return (
		<div
			className="
				relative
				flex flex-col
				h-full
			"
		>
			<div
				className="
					absolute inset-x-0 top-0
					z-10
					p-4 pl-16
				"
			>
				<button
					onClick={() => setNavOpen(!navOpen)}
					className="
						items-center gap-2 uppercase backdrop-blur-sm hover:text-white
						flex
						mb-2 px-3 py-1.5
						text-xs font-semibold tracking-wider text-white/80
						bg-black/50
						rounded-full
						transition-colors
					"
				>
					<span>Locations</span>
					<svg
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						className={`
							h-3 w-3
							transition-transform
							${navOpen ? "" : "-rotate-90"}
						`}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</button>
				{navOpen && (
					<div
						className="
							space-y-2
						"
					>
						<div>
							<p
								className="
									uppercase
									mb-1.5
									text-xs font-semibold tracking-wider text-white/60
								"
							>
								Room Tours
							</p>
							<div
								className="
									gap-2
									flex flex-wrap
								"
							>
								{roomLocations.map((loc) => (
									<LocationButton
										key={loc.id}
										location={loc}
										isActive={active === loc.id}
										onClick={() => setActive(loc.id)}
									/>
								))}
							</div>
						</div>
						<div>
							<p
								className="
									uppercase
									mb-1.5
									text-xs font-semibold tracking-wider text-white/60
								"
							>
								Common Areas
							</p>
							<div
								className="
									gap-2
									flex flex-wrap
								"
							>
								{commonLocations.map((loc) => (
									<LocationButton
										key={loc.id}
										location={loc}
										isActive={active === loc.id}
										onClick={() => setActive(loc.id)}
									/>
								))}
							</div>
						</div>
					</div>
				)}
			</div>

			<div
				className="
					relative
					flex-1
				"
			>
				<ReactPannellum
					key={current.id}
					id={current.id}
					sceneId={current.id}
					imageSource={current.image}
					style={{ width: "100%", height: "100%", background: "#000000" }}
					config={{
						autoLoad: true,
						autoRotate: -2,
						showZoomCtrl: true,
						hfov: 85,
						showFullscreenCtrl: true,
						mouseZoom: false,
					}}
					className="
						h-full w-full
					"
				/>
				<p
					className="
						absolute bottom-4 left-1/2 -translate-x-1/2
						px-4 py-1.5
						whitespace-nowrap text-xs text-white/80
						bg-black/50
						rounded-full
					"
				>
					Drag to look around
				</p>
			</div>
		</div>
	);
}

"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import type { GalleryCategory, GalleryImage } from "@/lib/gallery-images";
import Lightbox from "./Lightbox";

interface Props {
	categories: GalleryCategory[];
}

const BENTO = [
	{ cols: 2, rows: 1 },
	{ cols: 1, rows: 2 },
	{ cols: 1, rows: 1 },
	{ cols: 1, rows: 1 },
	{ cols: 1, rows: 2 },
	{ cols: 2, rows: 1 },
	{ cols: 1, rows: 1 },
	{ cols: 1, rows: 1 },
];

export default function GalleryClient({ categories }: Props) {
	const [activeTab, setActiveTab] = useState<string>("all");
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

	const allImages = useMemo(
		() => categories.flatMap((c) => c.images),
		[categories],
	);

	const currentImages: GalleryImage[] =
		activeTab === "all"
			? allImages
			: (categories.find((c) => c.slug === activeTab)?.images ?? []);

	const openLightbox = useCallback(
		(index: number) => setLightboxIndex(index),
		[],
	);

	const closeLightbox = useCallback(() => setLightboxIndex(null), []);

	const goToPrev = useCallback(() => {
		setLightboxIndex((i) =>
			i !== null ? (i - 1 + currentImages.length) % currentImages.length : null,
		);
	}, [currentImages.length]);

	const goToNext = useCallback(() => {
		setLightboxIndex((i) =>
			i !== null ? (i + 1) % currentImages.length : null,
		);
	}, [currentImages.length]);

	return (
		<>
			{/* Header */}
			<div
				className="
					mb-12
					text-center
				"
			>
				<h1
					style={{
						fontFamily: "var(--font-cormorant-garamond)",
					}}
					className="
						mb-3
						text-4xl font-bold tracking-tight text-heading
					"
				>
					Gallery
				</h1>
				<p
					className="
						max-w-2xl
						mx-auto
						text-lg text-muted
					"
				>
					Explore GB Hotel and Suite through our photo collection.
				</p>
			</div>

			{/* Tabs */}
			<div
				className="
					justify-center gap-2
					flex flex-wrap
					mb-10
				"
			>
				<TabButton
					active={activeTab === "all"}
					onClick={() => setActiveTab("all")}
				>
					All
				</TabButton>
				{categories.map((cat) => (
					<TabButton
						key={cat.slug}
						active={activeTab === cat.slug}
						onClick={() => setActiveTab(cat.slug)}
					>
						{cat.label}
					</TabButton>
				))}
			</div>

			{/* Grid */}
			{currentImages.length > 0 ? (
				<div
					className="
						grid grid-cols-2 gap-3
						[grid-auto-rows:160px]
						sm:[grid-auto-rows:180px]
						lg:grid-cols-3 lg:gap-4 lg:[grid-auto-rows:200px]
						xl:grid-cols-4
						[grid-auto-flow:dense]
					"
				>
				{currentImages.map((img, i) => {
					const bento = BENTO[i % BENTO.length];
					const isVideo = img.type === "video";
					return (
						<button
							key={img.src}
							onClick={() => openLightbox(i)}
							style={{
								gridColumn: `span ${bento.cols}`,
								gridRow: `span ${bento.rows}`,
							}}
							className={`
								group overflow-hidden
								rounded-2xl border border-line
								focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
								transition-all duration-300
								hover:shadow-lg
								${isVideo ? "" : "[&_img]:duration-500 [&_img]:group-hover:scale-110"}
							`}
						>
							{isVideo ? (
								<div className="relative h-full w-full">
									<GalleryVideo src={img.src} />
									<div className="absolute bottom-2 right-2 rounded-full bg-black/50 p-1.5">
										<svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
											<path d="M8 5v14l11-7z" />
										</svg>
									</div>
								</div>
							) : (
								/* eslint-disable-next-line @next/next/no-img-element */
								<img
									src={img.src}
									alt={img.alt}
									className="
										h-full w-full
										object-cover
									"
									loading="lazy"
								/>
							)}
						</button>
					);
				})}
				</div>
			) : (
				<p
					className="
						py-20
						text-center text-subtle
					"
				>
					No images in this category yet.
				</p>
			)}

			{/* Lightbox */}
			{lightboxIndex !== null && (
				<Lightbox
					images={currentImages}
					currentIndex={lightboxIndex}
					onClose={closeLightbox}
					onPrev={goToPrev}
					onNext={goToNext}
				/>
			)}
		</>
	);
}

function TabButton({
	active,
	onClick,
	children,
}: {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			onClick={onClick}
			className={`
				px-5 py-2
				text-sm font-medium
				rounded-full
				transition-colors
				${
				active
				? "bg-accent text-white"
				: "border border-line text-muted hover:border-accent hover:text-heading"
				}
			`}
		>
			{children}
		</button>
	);
}

function GalleryVideo({ src }: { src: string }) {
	const ref = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					el.play().catch(() => {});
				} else {
					el.pause();
					el.currentTime = 0;
				}
			},
			{ threshold: 0.2 },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		/* eslint-disable-next-line jsx-a11y/media-has-caption */
		<video
			ref={ref}
			src={src}
			muted
			loop
			playsInline
			preload="metadata"
			className="h-full w-full object-cover"
		/>
	);
}

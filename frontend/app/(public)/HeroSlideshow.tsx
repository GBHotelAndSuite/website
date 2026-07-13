"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

export interface HeroSlide {
	type: "image" | "video";
	src: string;
	poster?: string;
}

const IMAGE_INTERVAL = 4000;

export default function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
	const [index, setIndex] = useState(0);
	const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
	const videoRef = useRef<HTMLVideoElement>(null);
	const pausedRef = useRef(false);

	const advance = useCallback(() => {
		setIndex((i) => (i + 1) % slides.length);
	}, [slides.length]);

	const clearTimer = useCallback(() => {
		if (timerRef.current) clearInterval(timerRef.current);
	}, []);

	const startTimer = useCallback(() => {
		clearTimer();
		if (slides.length < 2 || pausedRef.current) return;

		const current = slides[index];
		if (current?.type === "video") return;

		timerRef.current = setInterval(advance, IMAGE_INTERVAL);
	}, [index, slides, advance, clearTimer]);

	useEffect(() => {
		startTimer();
		return clearTimer;
	}, [startTimer, clearTimer]);

	useEffect(() => {
		const current = slides[index];
		if (current?.type === "video" && videoRef.current) {
			videoRef.current.currentTime = 0;
			videoRef.current.play().catch(() => {});
		}
	}, [index, slides]);

	function handleVideoEnded() {
		if (slides.length > 1) advance();
	}

	function pause() {
		pausedRef.current = true;
		clearTimer();
	}

	function resume() {
		pausedRef.current = false;
		startTimer();
	}

	if (!slides.length) return null;

	return (
		<div
			onMouseEnter={pause}
			onMouseLeave={resume}
			className="
				absolute inset-0
			"
		>
			{slides.map((slide, i) => {
				const isActive = i === index;

				if (slide.type === "video") {
					return (
						<video
							key={slide.src}
							ref={isActive ? videoRef : undefined}
							src={slide.src}
							poster={slide.poster}
							muted
							playsInline
							preload="auto"
							onEnded={handleVideoEnded}
							className={`
								absolute inset-0
								object-cover
								h-full w-full
								${isActive ? "opacity-100" : "opacity-0 pointer-events-none"}
							`}
						/>
					);
				}

				return (
					<Image
						key={slide.src}
						src={slide.src}
						alt=""
						fill
						sizes="100vw"
						priority={i === 0}
						className={`
							duration-700
							object-cover
							transition-opacity
							${isActive ? "opacity-100" : "opacity-0"}
						`}
					/>
				);
			})}

			{slides.length > 1 && (
				<div
					className="
						absolute bottom-20 right-6 gap-1.5
						z-10 flex
						sm:right-8
					"
				>
					{slides.map((_, i) => (
						<button
							key={i}
							onClick={() => setIndex(i)}
							aria-label={`Go to slide ${i + 1}`}
							className={`
								h-1.5
								rounded-full
								transition-all
								${
								i === index
								? "w-6 bg-white"
								: "w-1.5 bg-white/50 hover:bg-white/70"
								}
							`}
						/>
					))}
				</div>
			)}
		</div>
	);
}

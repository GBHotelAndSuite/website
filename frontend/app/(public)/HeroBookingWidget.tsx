"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HeroBookingWidget() {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [checkIn, setCheckIn] = useState("");
	const [checkOut, setCheckOut] = useState("");
	const [error, setError] = useState("");
	const [showError, setShowError] = useState(false);
	const [exiting, setExiting] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	const today = new Date().toISOString().split("T")[0];

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	function displayError(msg: string) {
		if (timerRef.current) clearTimeout(timerRef.current);
		setExiting(false);
		setError(msg);
		setShowError(true);

		timerRef.current = setTimeout(() => {
			setExiting(true);
			timerRef.current = setTimeout(() => {
				setShowError(false);
				setError("");
				setExiting(false);
			}, 400);
		}, 3000);
	}

	function clearError() {
		if (timerRef.current) clearTimeout(timerRef.current);
		setExiting(true);
		setTimeout(() => {
			setShowError(false);
			setError("");
			setExiting(false);
		}, 400);
	}

	function handleNavigate() {
		if (!checkIn || !checkOut) {
			displayError("Please select both dates");
			return;
		}

		if (checkIn >= checkOut) {
			displayError("Check-out must be after check-in");
			return;
		}

		router.push(`/booking?checkIn=${checkIn}&checkOut=${checkOut}`);
	}

	return (
		<div
			className={`
				relative self-center backdrop-blur-sm duration-500 ease-in-out
				z-20 overflow-hidden
				rounded-md border-t border-white/10
				transition-all
				${isOpen ? "max-w-5xl mx-4 mb-4 sm:mx-6 bg-accent w-full" : "w-auto mx-0 mb-0 bg-accent"}
			`}
		>
			{!isOpen ? (
				<button
					type="button"
					onClick={() => setIsOpen(true)}
					className="
						hover:bg-accent-dark
						px-8 py-3
						whitespace-nowrap text-sm font-medium text-white
						bg-accent
						rounded-full
						transition-colors
						sm:text-base
					"
				>
					Book Now
				</button>
			) : (
				<div
					className="
						relative items-center gap-3
						flex flex-col
						max-w-5xl
						mx-auto px-4 py-3
						sm:justify-center sm:gap-4 sm:flex-row sm:px-6
					"
				>
					{showError && (
						<p
							className={`
								absolute -top-10 left-1/2 -translate-x-1/2 backdrop-blur-sm
								px-4 py-1.5
								whitespace-nowrap text-xs font-bold text-inverse-muted
								bg-heading/90
								rounded-lg
								${
								exiting
								? "animate-[fade-out-down_0.4s_ease-in_forwards]"
								: "animate-[fade-in-up_0.3s_ease-out_forwards]"
								}
							`}
						>
							{error}
						</p>
					)}
					<div
						className="
							gap-2
							flex flex-col
							w-full
							sm:items-center sm:flex-row sm:w-auto
						"
					>
						<label
							htmlFor="hero-checkin"
							className="
								sr-only
							"
						>
							Check-in
						</label>
						<input
							id="hero-checkin"
							type="date"
							value={checkIn}
							min={today}
							onChange={(e) => {
								setCheckIn(e.target.value);
								clearError();
							}}
							className="
								focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent
								px-3 py-2
								text-sm text-white placeholder-white/50
								bg-white/10
								rounded-lg border border-white/20
							"
						/>
						<label
							htmlFor="hero-checkout"
							className="
								sr-only
							"
						>
							Check-out
						</label>
						<input
							id="hero-checkout"
							type="date"
							value={checkOut}
							min={checkIn || today}
							onChange={(e) => {
								setCheckOut(e.target.value);
								clearError();
							}}
							className="
								focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent
								px-3 py-2
								text-sm text-white placeholder-white/50
								bg-white/10
								rounded-lg border border-white/20
							"
						/>
					</div>
					<button
						type="button"
						onClick={handleNavigate}
						className="
							hover:bg-accent-dark
							w-full
							px-6 py-2
							text-sm font-medium text-white
							bg-heading/80
							rounded-full
							transition-colors
							sm:w-auto
						"
					>
						Check Availability
					</button>
				</div>
			)}
		</div>
	);
}

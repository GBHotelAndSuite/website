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
				relative self-center backdrop-blur-sm shrink-0 duration-500 ease-in-out
				z-20 overflow-hidden
				h-12
				mx-auto
				bg-accent
				rounded-full border-white/35 border-4
				transition-[width,margin]
				sm:h-14
				${isOpen ? "w-[min(34rem,90vw)] mx-4 sm:mx-6" : "w-[132px] sm:w-[150px] mx-0"}
			`}
		>
			{/* ---- Layer 1: Book Now button ---- */}
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				aria-hidden={isOpen}
				tabIndex={isOpen ? -1 : 0}
				className={`
					absolute inset-0 items-center justify-center before:absolute before:inset-0 before:bg-accent-dark before:origin-left before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100 duration-300
					flex overflow-hidden
					text-sm font-medium text-white
					transition-opacity
					sm:text-base
					${isOpen ? "opacity-0 pointer-events-none" : "opacity-100 delay-150"}
				`}
			>
				<span
					className="
						relative
						z-10
					"
				>
					Book Now
				</span>
			</button>

			{/* ---- Layer 2: date picker widget ---- */}
			<div
				aria-hidden={!isOpen}
				className={`
					absolute inset-0 items-center justify-center gap-1.5 duration-300
					flex
					px-3
					transition-opacity
					sm:gap-3 sm:px-6
					${isOpen ? "opacity-100 delay-150" : "opacity-0 pointer-events-none"}
				`}
			>
				{showError && (
					<p
						className={`
							absolute -top-9 left-1/2 -translate-x-1/2 backdrop-blur-sm
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
						flex-1
						min-w-0
						px-2 py-1.5
						text-xs text-white placeholder-white/50
						bg-white/10
						rounded-full border border-white/20
						sm:flex-none sm:px-3 sm:py-2 sm:text-sm
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
						flex-1
						min-w-0
						px-2 py-1.5
						text-xs text-white placeholder-white/50
						bg-white/10
						rounded-full border border-white/20
						sm:flex-none sm:px-3 sm:py-2 sm:text-sm
					"
				/>

				<button
					type="button"
					onClick={handleNavigate}
					className="
						hover:bg-accent-dark shrink-0
						px-3 py-1.5
						text-xs font-medium text-white
						bg-heading/80
						rounded-full
						transition-colors
						sm:px-6 sm:py-2 sm:text-sm
					"
				>
					<span
						className="
							hidden
							sm:inline
						"
					>
						Check Availability
					</span>
					<span
						className="
							sm:hidden
						"
					>
						Go
					</span>
				</button>

				<button
					type="button"
					onClick={() => setIsOpen(false)}
					aria-label="Close"
					className="
						hover:text-white hover:bg-white/10 shrink-0
						p-1.5
						text-white/60
						rounded-full
						transition-colors
					"
				>
					<svg
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						className="
							h-4 w-4
						"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
}

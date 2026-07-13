"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createBooking } from "@/lib/actions/bookings";
import { calculateNights, formatTime } from "@/lib/utils";

interface Room {
	id: string;
	name: string;
	basePrice: number;
	capacity: number;
	tierName: string;
	tierId: string;
}

interface Tier {
	id: string;
	name: string;
}

export default function BookingForm({
	checkInTime,
	checkOutTime,
}: {
	checkInTime: string;
	checkOutTime: string;
}) {
	const searchParams = useSearchParams();
	const preselectedRoom = searchParams.get("room");
	const preselectedCheckIn = searchParams.get("checkIn") || "";
	const preselectedCheckOut = searchParams.get("checkOut") || "";

	const [checkIn, setCheckIn] = useState(preselectedCheckIn);
	const [checkOut, setCheckOut] = useState(preselectedCheckOut);
	const [selectedRoom, setSelectedRoom] = useState(preselectedRoom || "");
	const [selectedTier, setSelectedTier] = useState("");
	const [guestName, setGuestName] = useState("");
	const [guestEmail, setGuestEmail] = useState("");
	const [guestPhone, setGuestPhone] = useState("");
	const [notes, setNotes] = useState("");
	const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
	const [checking, setChecking] = useState(false);
	const [checked, setChecked] = useState(false);
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (preselectedCheckIn && preselectedCheckOut) {
			checkAvailability();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function checkAvailability() {
		if (!checkIn || !checkOut) return;
		if (checkIn >= checkOut) {
			setError("Check-out must be after check-in");
			return;
		}

		setChecking(true);
		setError("");

		try {
			const res = await fetch(
				`/api/availability?checkIn=${checkIn}&checkOut=${checkOut}`,
			);
			const data = await res.json();

			if (!res.ok) {
				setError(data.error || "Failed to check availability");
				setAvailableRooms([]);
			} else {
				setAvailableRooms(data.available);
				if (
					selectedRoom &&
					!data.available.find((r: Room) => r.id === selectedRoom)
				) {
					setSelectedRoom("");
					setSelectedTier("");
				}
			}
			setChecked(true);
		} catch {
			setError("Failed to check availability");
			setAvailableRooms([]);
		} finally {
			setChecking(false);
		}
	}

	const selectedRoomData = availableRooms.find((r) => r.id === selectedRoom);
	const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
	const totalPrice = selectedRoomData ? selectedRoomData.basePrice * nights : 0;

	const tiers: Tier[] = Array.from(
		new Map(
			availableRooms.map((r) => [r.tierId, { id: r.tierId, name: r.tierName }]),
		).values(),
	);
	const tierRooms = selectedTier
		? availableRooms.filter((r) => r.tierId === selectedTier)
		: [];

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitting(true);

		const form = new FormData();
		form.set("roomId", selectedRoom);
		form.set("guestName", guestName);
		form.set("guestEmail", guestEmail);
		form.set("guestPhone", guestPhone);
		form.set("checkIn", checkIn);
		form.set("checkOut", checkOut);
		form.set("notes", notes);

		try {
			await createBooking(form);
		} catch (err: unknown) {
			console.error("Error creating booking:", err);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div
			className="
				py-16
			"
		>
			<div
				className="
					max-w-3xl
					mx-auto px-4
					sm:px-6
					lg:px-8
				"
			>
				<h1
					style={{
						fontFamily: "var(--font-cormorant-garamond)",
					}}
					className="
						mb-2
						text-3xl font-bold tracking-tight text-heading
					"
				>
					Book Your Stay
				</h1>
				<p
					className="
						mb-10
						text-muted
					"
				>
					Select your dates and room to get started.
				</p>

				<form
					onSubmit={handleSubmit}
					className="
						space-y-8
					"
				>
					{/* Step 1: Dates */}
					<section
						className="
							p-6
							rounded-xl border border-line
						"
					>
						<h2
							className="
								mb-4
								text-lg font-semibold text-heading
							"
						>
							1. Select Dates
						</h2>
						<div
							className="
								gap-4
								grid
								sm:grid-cols-2
							"
						>
							<div
								className="
									pr-7
									lg:pr-0
								"
							>
								<label
									htmlFor="checkIn"
									className="
										block
										mb-1
										text-sm font-medium text-heading
									"
								>
									Check-in
								</label>
								<input
									id="checkIn"
									type="date"
									value={checkIn}
									onChange={(e) => {
										setCheckIn(e.target.value);
										setChecked(false);
										setSelectedTier("");
										setSelectedRoom("");
									}}
									min={new Date().toISOString().split("T")[0]}
									required
									className="
										focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent
										w-full
										px-3 py-2
										text-sm
										rounded-lg border border-line
									"
								/>
							</div>
							<div
								className="
									pr-7
									lg:pr-0
								"
							>
								<label
									htmlFor="checkOut"
									className="
										block
										mb-1
										text-sm font-medium text-heading
									"
								>
									Check-out
								</label>
								<input
									id="checkOut"
									type="date"
									value={checkOut}
									onChange={(e) => {
										setCheckOut(e.target.value);
										setChecked(false);
										setSelectedTier("");
										setSelectedRoom("");
									}}
									min={checkIn || new Date().toISOString().split("T")[0]}
									required
									className="
										focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent
										w-full
										px-3 py-2
										text-sm
										rounded-lg border border-line
									"
								/>
							</div>
						</div>
						<div
							className="
								justify-center
								flex
								w-full
								lg:justify-start
							"
						>
							<button
								type="button"
								onClick={checkAvailability}
								disabled={!checkIn || !checkOut || checking}
								className="
									hover:bg-accent-dark disabled:opacity-50
									mt-4 px-6 py-2
									text-sm font-medium text-white
									bg-accent
									rounded-full
									transition-colors
									lg:justify-self-start
								"
							>
								{checking ? "Checking..." : "Check Availability"}
							</button>
						</div>
					</section>

					{/* Step 2: Tier selection */}
					{checked && (
						<section
							className="
								p-6
								rounded-xl border border-line
							"
						>
							<h2
								className="
									mb-4
									text-lg font-semibold text-heading
								"
							>
								2. Choose a Room Tier
							</h2>
							{error && (
								<p
									className="
										mb-4
										text-sm text-red-500
									"
								>
									{error}
								</p>
							)}
							{tiers.length === 0 && !error && (
								<p
									className="
										text-sm text-muted
									"
								>
									No rooms available for the selected dates. Try different
									dates.
								</p>
							)}
							<div
								className="
									gap-3
									grid
									sm:grid-cols-2
								"
							>
								{tiers.map((tier) => {
									const count = availableRooms.filter(
										(r) => r.tierId === tier.id,
									).length;
									return (
										<label
											key={tier.id}
											className={`
												items-center gap-4
												flex
												p-4
												rounded-lg border
												cursor-pointer transition-colors
												${
												selectedTier === tier.id
												? "border-accent bg-surface"
												: "border-line hover:border-muted"
												}
											`}
										>
											<input
												type="radio"
												name="tierSelect"
												value={tier.id}
												checked={selectedTier === tier.id}
												onChange={() => {
													setSelectedTier(tier.id);
													setSelectedRoom("");
												}}
												className="
													accent-accent
												"
											/>
											<div
												className="
													flex-1
												"
											>
												<p
													className="
														font-medium text-heading
													"
												>
													{tier.name}
												</p>
												<p
													className="
														text-sm text-muted
													"
												>
													{count} {count === 1 ? "room" : "rooms"} available
												</p>
											</div>
										</label>
									);
								})}
							</div>
						</section>
					)}

					{/* Step 3: Room selection */}
					{selectedTier && (
						<section
							className="
								p-6
								rounded-xl border border-line
							"
						>
							<h2
								className="
									mb-4
									text-lg font-semibold text-heading
								"
							>
								3. Choose a Room
							</h2>
							<div
								className="
									gap-3
									grid
								"
							>
								{tierRooms.map((room) => (
									<label
										key={room.id}
										className={`
											items-center gap-4
											flex
											p-4
											rounded-lg border
											cursor-pointer transition-colors
											${
											selectedRoom === room.id
											? "border-accent bg-surface"
											: "border-line hover:border-muted"
											}
										`}
									>
										<input
											type="radio"
											name="roomSelect"
											value={room.id}
											checked={selectedRoom === room.id}
											onChange={() => setSelectedRoom(room.id)}
											className="
												accent-accent
											"
										/>
										<div
											className="
												flex-1
											"
										>
											<p
												className="
													font-medium text-heading
												"
											>
												{room.name}
											</p>
											<p
												className="
													text-sm text-muted
												"
											>
												Up to {room.capacity} guests
											</p>
										</div>
										<p
											className="
												font-medium text-heading
											"
										>
											₦{room.basePrice.toLocaleString()}
											<span
												className="
													text-sm font-normal text-subtle
												"
											>
												/night
											</span>
										</p>
									</label>
								))}
							</div>
						</section>
					)}

					{/* Step 3: Guest details */}
					{selectedRoom && (
						<section
							className="
								p-6
								rounded-xl border border-line
							"
						>
							<h2
								className="
									mb-4
									text-lg font-semibold text-heading
								"
							>
								4. Your Details
							</h2>
							<div
								className="
									gap-4
									grid
									sm:grid-cols-2
								"
							>
								<div
									className="
										sm:col-span-2
									"
								>
									<label
										htmlFor="guestName"
										className="
											block
											mb-1
											text-sm font-medium text-heading
										"
									>
										Full Name
									</label>
									<input
										id="guestName"
										name="guestName"
										type="text"
										value={guestName}
										onChange={(e) => setGuestName(e.target.value)}
										required
										className="
											focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent
											w-full
											px-3 py-2
											text-sm
											rounded-lg border border-line
										"
									/>
								</div>
								<div>
									<label
										htmlFor="guestEmail"
										className="
											block
											mb-1
											text-sm font-medium text-heading
										"
									>
										Email
									</label>
									<input
										id="guestEmail"
										name="guestEmail"
										type="email"
										value={guestEmail}
										onChange={(e) => setGuestEmail(e.target.value)}
										required
										className="
											focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent
											w-full
											px-3 py-2
											text-sm
											rounded-lg border border-line
										"
									/>
								</div>
								<div>
									<label
										htmlFor="guestPhone"
										className="
											block
											mb-1
											text-sm font-medium text-heading
										"
									>
										Phone (optional)
									</label>
									<input
										id="guestPhone"
										name="guestPhone"
										type="tel"
										value={guestPhone}
										onChange={(e) => setGuestPhone(e.target.value)}
										className="
											focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent
											w-full
											px-3 py-2
											text-sm
											rounded-lg border border-line
										"
									/>
								</div>
								<div
									className="
										sm:col-span-2
									"
								>
									<label
										htmlFor="notes"
										className="
											block
											mb-1
											text-sm font-medium text-heading
										"
									>
										Special Requests (optional)
									</label>
									<textarea
										id="notes"
										name="notes"
										value={notes}
										onChange={(e) => setNotes(e.target.value)}
										rows={3}
										className="
											focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent
											w-full
											px-3 py-2
											text-sm
											rounded-lg border border-line
										"
									/>
								</div>
							</div>
						</section>
					)}

					{/* Summary & Submit */}
					{selectedRoom && selectedRoomData && (
						<section
							className="
								p-6
								bg-surface
								rounded-xl border border-line
							"
						>
							<h2
								className="
									mb-3
									text-lg font-semibold text-heading
								"
							>
								Booking Summary
							</h2>
							<div
								className="
									mb-4 space-y-2
									text-sm text-body
								"
							>
								<p>
									<span
										className="
											font-medium text-heading
										"
									>
										Room:
									</span>{" "}
									{selectedRoomData.name}
								</p>
								<p>
									<span
										className="
											font-medium text-heading
										"
									>
										Check-in:
									</span>{" "}
									{checkIn}{" "}
									<span
										className="
											text-subtle
										"
									>
										(from {formatTime(checkInTime)})
									</span>
								</p>
								<p>
									<span
										className="
											font-medium text-heading
										"
									>
										Check-out:
									</span>{" "}
									{checkOut}{" "}
									<span
										className="
											text-subtle
										"
									>
										(by {formatTime(checkOutTime)})
									</span>
								</p>
								<p>
									<span
										className="
											font-medium text-heading
										"
									>
										Nights:
									</span>{" "}
									{nights}
								</p>
								<p
									className="
										text-base font-bold text-heading
									"
								>
									Total: ₦{totalPrice.toLocaleString()}
								</p>
							</div>
							<button
								type="submit"
								disabled={submitting}
								className="
									hover:bg-accent-dark disabled:opacity-50
									w-full
									px-6 py-3
									text-sm font-medium text-white
									bg-accent
									rounded-full
									transition-colors
								"
							>
								{submitting ? "Booking…" : "Confirm Booking"}
							</button>
							<p
								className="
									mt-2
									text-xs text-subtle
								"
							>
								This is a booking request. You will be contacted to confirm your
								reservation.
							</p>
						</section>
					)}
				</form>
			</div>
		</div>
	);
}

import { db } from "@/lib/db";
import { siteSettings } from "@/lib/schema";
import { updateSiteSettings } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

const SETTINGS_SCHEMA: {
	key: string;
	label: string;
	type: "text" | "time" | "number";
	group: string;
}[] = [
	{ key: "hotel_name", label: "Hotel Name", type: "text", group: "Hotel Info" },
	{ key: "hotel_tagline", label: "Tagline", type: "text", group: "Hotel Info" },
	{ key: "hotel_description", label: "Description", type: "text", group: "Hotel Info" },
	{ key: "hotel_address", label: "Address", type: "text", group: "Hotel Info" },
	{ key: "hotel_city", label: "City", type: "text", group: "Hotel Info" },
	{ key: "hotel_phone", label: "Phone", type: "text", group: "Contact" },
	{ key: "hotel_email", label: "Email", type: "text", group: "Contact" },
	{ key: "check_in_time", label: "Check-in Time", type: "time", group: "Booking" },
	{ key: "check_out_time", label: "Check-out Time", type: "time", group: "Booking" },
	{ key: "currency", label: "Currency", type: "text", group: "Booking" },
	{ key: "min_stay_nights", label: "Minimum Stay (Nights)", type: "number", group: "Booking Rules" },
	{ key: "max_advance_days", label: "Max Advance Booking (Days)", type: "number", group: "Booking Rules" },
];

export default async function AdminSettingsPage() {
	const rows = await db.select().from(siteSettings).all();
	const map: Record<string, string> = {};
	for (const row of rows) {
		map[row.key] = row.value;
	}

	const groups = Array.from(new Set(SETTINGS_SCHEMA.map((s) => s.group)));

	return (
		<div>
			<h1 className="mb-6 text-2xl font-bold tracking-tight text-heading">
				Site Settings
			</h1>

			<form action={updateSiteSettings} className="space-y-8">
				{groups.map((group) => (
					<div
						key={group}
						className="rounded-xl border border-line bg-white p-6"
					>
						<h2 className="mb-4 text-lg font-semibold text-heading">
							{group}
						</h2>
						<div className="grid gap-4 sm:grid-cols-2">
							{SETTINGS_SCHEMA.filter((s) => s.group === group).map((setting) => (
								<div key={setting.key}>
									<label
										htmlFor={setting.key}
										className="mb-1 block text-sm font-medium text-heading"
									>
										{setting.label}
									</label>
									<input
										id={setting.key}
										name={setting.key}
										type={setting.type}
										defaultValue={map[setting.key] ?? ""}
										className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
									/>
								</div>
							))}
						</div>
					</div>
				))}

				<div>
					<button
						type="submit"
						className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
					>
						Save Settings
					</button>
				</div>
			</form>
		</div>
	);
}

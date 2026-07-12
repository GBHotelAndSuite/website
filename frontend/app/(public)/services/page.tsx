import { db } from "@/lib/db";
import { services } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
	const allServices = await db
		.select()
		.from(services)
		.where(eq(services.isActive, 1))
		.orderBy(asc(services.sortOrder))
		.all();

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
						Services & Amenities
					</h1>
					<p
						className="
							max-w-2xl
							mx-auto
							text-lg text-muted
						"
					>
						Everything you need for a memorable stay, all under one roof.
					</p>
				</div>

				<div
					className="
						gap-8
						grid
						sm:grid-cols-2
						lg:grid-cols-3
					"
				>
					{allServices.map((service) => (
						<div
							key={service.id}
							className="
								group hover:shadow-lg
								overflow-hidden
								rounded-xl border border-line
								transition-all
							"
						>
							<div
								className="
									aspect-video
									bg-fill
								"
							/>
							<div
								className="
									p-5
								"
							>
								<h3
									className="
										mb-2
										text-lg font-semibold text-heading
									"
								>
									{service.name}
								</h3>
								<p
									className="
										text-sm leading-relaxed text-muted
									"
								>
									{service.description}
								</p>
							</div>
						</div>
					))}
				</div>

				{allServices.length === 0 && (
					<p
						className="
							py-20
							text-center text-subtle
						"
					>
						No services listed yet.
					</p>
				)}
			</div>
		</div>
	);
}

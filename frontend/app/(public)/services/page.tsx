// import { db } from "@/lib/db";
// import { services } from "@/lib/schema";
// import { eq, asc } from "drizzle-orm";
import ServicesParallax from "./ServicesParallax";

// export const dynamic = "force-dynamic";

export default async function ServicesPage() {
	// TODO: Switch back to DB fetching when ready
	// const allServices = await db
	// 	.select()
	// 	.from(services)
	// 	.where(eq(services.isActive, 1))
	// 	.orderBy(asc(services.sortOrder))
	// 	.all();

	return <ServicesParallax />;
}

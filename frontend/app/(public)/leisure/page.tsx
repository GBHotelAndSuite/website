import { db } from "@/lib/db";
import { leisureSites } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";

export default async function LeisurePage() {
  const sites = await db
    .select()
    .from(leisureSites)
    .where(eq(leisureSites.isActive, 1))
    .orderBy(asc(leisureSites.sortOrder))
    .all();

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-heading">
            Leisure & Experiences
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted">
            Unwind and explore our curated leisure facilities and experiences.
          </p>
        </div>

        <div className="space-y-16">
          {sites.map((site, i) => (
            <div
              key={site.id}
              className={`grid gap-8 items-center ${
                i % 2 === 0 ? "lg:grid-cols-2" : "lg:grid-cols-2"
              }`}
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="aspect-[4/3] rounded-xl bg-fill" />
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <h2 className="mb-3 text-2xl font-bold tracking-tight text-heading">
                  {site.name}
                </h2>
                <p className="leading-relaxed text-body">
                  {site.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {sites.length === 0 && (
          <p className="py-20 text-center text-subtle">
            No leisure sites listed yet.
          </p>
        )}
      </div>
    </div>
  );
}

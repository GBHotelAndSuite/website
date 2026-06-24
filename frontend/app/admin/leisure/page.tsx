import Link from "next/link";
import { db } from "@/lib/db";
import { leisureSites } from "@/lib/schema";
import { asc } from "drizzle-orm";
import {
  createLeisureSite,
  deleteLeisureSite,
  updateLeisureSite,
} from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminLeisurePage() {
  const allSites = await db
    .select()
    .from(leisureSites)
    .orderBy(asc(leisureSites.sortOrder))
    .all();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-heading">
          Leisure Sites
        </h1>
        <Link
          href="/admin/leisure/new"
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
        >
          Add Site
        </Link>
      </div>

      <div className="grid gap-4">
        {allSites.map((site) => (
          <div
            key={site.id}
            className="rounded-xl border border-line p-5"
          >
            <form
              action={async (formData) => {
                "use server";
                await updateLeisureSite(site.id, formData);
              }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <input
                name="name"
                type="text"
                defaultValue={site.name}
                required
                className="rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <div className="flex items-center gap-2">
                <input
                  name="isActive"
                  type="checkbox"
                  defaultChecked={site.isActive === 1}
                  className="h-4 w-4 accent-accent"
                />
                <span className="text-sm text-muted">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    "use server";
                    await deleteLeisureSite(site.id);
                  }}
                  className="text-sm text-red-500 transition-colors hover:text-red-700"
                >
                  Delete
                </button>
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={site.description || ""}
                  placeholder="Description"
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </form>
          </div>
        ))}
      </div>

      <details className="mt-8">
        <summary className="cursor-pointer text-sm font-medium text-heading hover:text-heading">
          Add new leisure site
        </summary>
        <form
          action={async (formData) => {
            "use server";
            await createLeisureSite(formData);
          }}
          className="mt-4 grid max-w-2xl gap-4"
        >
          <input
            name="id"
            type="text"
            placeholder="Site ID (e.g., tennis-court)"
            required
            className="rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <input
            name="name"
            type="text"
            placeholder="Site name"
            required
            className="rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <textarea
            name="description"
            rows={2}
            placeholder="Description"
            className="rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            type="submit"
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
          >
            Create Site
          </button>
        </form>
      </details>
    </div>
  );
}

import Link from "next/link";
import { db } from "@/lib/db";
import { services } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { createService, deleteService, updateService } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const allServices = await db
    .select()
    .from(services)
    .orderBy(asc(services.sortOrder))
    .all();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-heading">
          Services
        </h1>
        <Link
          href="/admin/services/new"
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
        >
          Add Service
        </Link>
      </div>

      <div className="grid gap-4">
        {allServices.map((service) => (
          <div
            key={service.id}
            className="rounded-xl border border-line p-5"
          >
            <form
              action={async (formData) => {
                "use server";
                await updateService(service.id, formData);
              }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <input
                name="name"
                type="text"
                defaultValue={service.name}
                required
                className="rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <input
                name="icon"
                type="text"
                defaultValue={service.icon || ""}
                placeholder="Icon name"
                className="rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <div className="flex items-center gap-2">
                <input
                  name="isActive"
                  type="checkbox"
                  defaultChecked={service.isActive === 1}
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
                    await deleteService(service.id);
                  }}
                  className="text-sm text-red-500 transition-colors hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </form>
            <textarea
              form={`desc-${service.id}`}
              name="description"
              rows={2}
              defaultValue={service.description || ""}
              placeholder="Description"
              className="mt-3 w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        ))}
      </div>

      {/* New service form */}
      <details className="mt-8">
        <summary className="cursor-pointer text-sm font-medium text-heading hover:text-heading">
          Add new service
        </summary>
        <form
          action={async (formData) => {
            "use server";
            await createService(formData);
          }}
          className="mt-4 grid max-w-2xl gap-4"
        >
          <input
            name="id"
            type="text"
            placeholder="Service ID (e.g., sauna)"
            required
            className="rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <input
            name="name"
            type="text"
            placeholder="Service name"
            required
            className="rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <textarea
            name="description"
            rows={2}
            placeholder="Description"
            className="rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <input
            name="icon"
            type="text"
            placeholder="Icon name"
            className="rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            type="submit"
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
          >
            Create Service
          </button>
        </form>
      </details>
    </div>
  );
}

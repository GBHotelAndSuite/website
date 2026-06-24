import { db } from "@/lib/db";
import { adminUsers } from "@/lib/schema";
import {
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      name: adminUsers.name,
      createdAt: adminUsers.createdAt,
    })
    .from(adminUsers)
    .all();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-heading">
        Admin Users
      </h1>

      <div className="mb-8 rounded-xl border border-line bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-heading">
          Add New Admin
        </h2>
        <form action={createAdminUser} className="max-w-sm space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-heading">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-heading">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-heading">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
          >
            Create Admin
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface">
            <tr>
              <th className="px-4 py-3 font-medium text-muted">Name</th>
              <th className="px-4 py-3 font-medium text-muted">Email</th>
              <th className="px-4 py-3 font-medium text-muted">Created</th>
              <th className="px-4 py-3 font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 text-heading">{user.name ?? "—"}</td>
                <td className="px-4 py-3 text-body">{user.email}</td>
                <td className="px-4 py-3 text-muted">{user.createdAt}</td>
                <td className="px-4 py-3">
                  <details className="group">
                    <summary className="cursor-pointer text-sm text-accent transition-colors hover:text-accent-dark">
                      Manage
                    </summary>
                    <div className="mt-2 space-y-2 border-t border-line pt-2">
                      <form action={updateAdminUser} className="flex items-center gap-2">
                        <input type="hidden" name="id" value={user.id} />
                        <input
                          type="text"
                          name="name"
                          placeholder="New name"
                          defaultValue={user.name ?? ""}
                          className="rounded border border-line px-2 py-1 text-xs focus:border-accent focus:outline-none"
                        />
                        <input
                          type="password"
                          name="password"
                          placeholder="New password"
                          className="rounded border border-line px-2 py-1 text-xs focus:border-accent focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="rounded bg-accent px-2 py-1 text-xs font-medium text-white hover:bg-accent-dark"
                        >
                          Save
                        </button>
                      </form>
                      <form action={deleteAdminUser.bind(null, user.id)}>
                        <button
                          type="submit"
                          className="text-xs text-red-500 transition-colors hover:text-red-700"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

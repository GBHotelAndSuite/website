"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authenticate } from "@/lib/actions/auth";

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(authenticate, null);

  useEffect(() => {
    if (state?.ok) {
      router.push("/admin/dashboard");
    }
  }, [state, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="w-full max-w-sm rounded-xl border border-line bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-heading">
          Admin Login
        </h1>
        <p className="mb-6 text-sm text-muted">
          Sign in to manage the hotel website.
        </p>

        <form action={formAction} className="space-y-4">
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
              placeholder="admin@grandvista.com"
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
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
          >
            {pending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

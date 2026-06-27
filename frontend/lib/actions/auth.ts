"use server";

import { signIn, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function signOutAction() {
  await signOut({ redirect: false });
  redirect("/");
}

export async function authenticate(_prev: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  const user = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .get();

  if (!user) {
    return { ok: false, error: "Invalid email or password." };
  }

  const isValid = await bcrypt.compare(password, user.hashedPassword);
  if (!isValid) {
    return { ok: false, error: "Invalid email or password." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { ok: true, error: null };
  } catch {
    return { ok: false, error: "Something went wrong. Try again." };
  }
}

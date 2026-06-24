"use server";

import { signIn, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function signOutAction() {
  await signOut({ redirect: false });
  redirect("/");
}

export async function authenticate(_prev: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { ok: false, error: "Invalid email or password." };
    }

    return { ok: true, error: null };
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("CredentialsSignin")) {
      return { ok: false, error: "Invalid email or password." };
    }
    return { ok: false, error: "Something went wrong. Try again." };
  }
}

import { Suspense } from "react";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/schema";
import { sql } from "drizzle-orm";
import BookingForm from "./BookingForm";

export default async function BookingPage() {
  const settingsRows = await db
    .select()
    .from(siteSettings)
    .where(
      sql`${siteSettings.key} IN ('check_in_time', 'check_out_time')`
    )
    .all();
  const settings: Record<string, string> = {};
  for (const row of settingsRows) {
    settings[row.key] = row.value;
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-subtle">Loading booking form...</p>
        </div>
      }
    >
      <BookingForm
        checkInTime={settings.check_in_time || "15:00"}
        checkOutTime={settings.check_out_time || "11:00"}
      />
    </Suspense>
  );
}

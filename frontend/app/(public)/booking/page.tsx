import { Suspense } from "react";
import BookingForm from "./BookingForm";

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-subtle">Loading booking form...</p>
        </div>
      }
    >
      <BookingForm />
    </Suspense>
  );
}

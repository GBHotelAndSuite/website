import type { Metadata } from "next";
import VirtualTourViewer from "./VirtualTourViewer";

export const metadata: Metadata = {
  title: "Virtual Tour",
  description:
    "Explore Grand Vista Hotel with our immersive 360° panoramic virtual tour.",
};

export default function VirtualTourPage() {
  return (
    <section className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="border-b border-line bg-surface px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-heading">
          Virtual Tour
        </h1>
        <p className="mt-1 text-sm text-muted">
          Drag to explore each space at Grand Vista Hotel.
        </p>
      </div>
      <div className="flex-1">
        <VirtualTourViewer />
      </div>
    </section>
  );
}

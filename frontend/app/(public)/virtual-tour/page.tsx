import type { Metadata } from "next";
import VirtualTourViewer from "./VirtualTourViewer";

export const metadata: Metadata = {
  title: "Virtual Tour",
  description:
    "Explore GB Hotel and Suite with our immersive 360° panoramic virtual tour.",
};

export default function VirtualTourPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1
            style={{
              fontFamily: "var(--font-cormorant-garamond)",
            }}
            className="mb-3 text-4xl font-bold tracking-tight text-heading"
          >
            Virtual Tour
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted">
            Drag to explore rooms and spaces at GB Hotel and Suite.
          </p>
        </div>
        <div className="h-[75vh] min-h-[500px]">
          <VirtualTourViewer />
        </div>
      </div>
    </div>
  );
}

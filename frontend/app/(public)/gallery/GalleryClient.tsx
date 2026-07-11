"use client";

import { useState, useMemo, useCallback } from "react";
import type { GalleryCategory, GalleryImage } from "@/lib/gallery-images";
import Lightbox from "./Lightbox";

interface Props {
  categories: GalleryCategory[];
}

export default function GalleryClient({ categories }: Props) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allImages = useMemo(
    () => categories.flatMap((c) => c.images),
    [categories],
  );

  const currentImages: GalleryImage[] =
    activeTab === "all"
      ? allImages
      : categories.find((c) => c.slug === activeTab)?.images ?? [];

  const openLightbox = useCallback(
    (index: number) => setLightboxIndex(index),
    [],
  );

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goToPrev = useCallback(() => {
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + currentImages.length) % currentImages.length : null,
    );
  }, [currentImages.length]);

  const goToNext = useCallback(() => {
    setLightboxIndex((i) =>
      i !== null ? (i + 1) % currentImages.length : null,
    );
  }, [currentImages.length]);

  return (
    <>
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-heading">
          Gallery
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted">
          Explore GB Hotel and Suite through our photo collection.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        <TabButton
          active={activeTab === "all"}
          onClick={() => setActiveTab("all")}
        >
          All
        </TabButton>
        {categories.map((cat) => (
          <TabButton
            key={cat.slug}
            active={activeTab === cat.slug}
            onClick={() => setActiveTab(cat.slug)}
          >
            {cat.label}
          </TabButton>
        ))}
      </div>

      {/* Grid */}
      {currentImages.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentImages.map((img, i) => (
            <button
              key={img.src}
              onClick={() => openLightbox(i)}
              className="group overflow-hidden rounded-xl border border-line bg-fill transition-all hover:border-accent hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-subtle">
          No images in this category yet.
        </p>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={currentImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-accent text-white"
          : "border border-line text-muted hover:border-accent hover:text-heading"
      }`}
    >
      {children}
    </button>
  );
}

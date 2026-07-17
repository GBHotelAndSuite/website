"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/gallery-images";
import Lightbox from "../gallery/Lightbox";

interface Props {
  images: GalleryImage[];
  tierName: string;
  tierDescription: string | null;
}

export default function TierSlideshow({
  images,
  tierName,
  tierDescription,
}: Props) {
  const [index, setIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (images.length < 2) return;

    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);

    return () => clearInterval(timerRef.current);
  }, [images.length]);

  function pause() {
    clearInterval(timerRef.current);
  }

  function resume() {
    clearInterval(timerRef.current);
    if (images.length < 2) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);
  }

  if (!images.length) return null;

  return (
    <div
      className="relative mb-12 overflow-hidden rounded-xl"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <button
        onClick={() => setLightboxIndex(index)}
        className="group relative block aspect-[21/9] w-full cursor-pointer bg-fill"
        aria-label="Open image in lightbox"
      >
        {images.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            fill
            className={`object-cover transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            sizes="100vw"
            priority={i === 0}
          />
        ))}
        <div className="absolute right-3 top-3 z-10 rounded-full bg-black/40 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
          </svg>
        </div>
      </button>
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-heading/70 via-heading/20 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <h2
          style={{ color: "white" }}
          className="mb-1 text-2xl font-bold text-white sm:text-3xl"
        >
          {tierName}
        </h2>
        {tierDescription && (
          <p className="text-sm text-white/80 sm:text-base">
            {tierDescription}
          </p>
        )}
      </div>
      {images.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-1.5 sm:bottom-6 sm:right-8">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-white"
                  : "w-1.5 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => (i! - 1 + images.length) % images.length)}
          onNext={() => setLightboxIndex((i) => (i! + 1) % images.length)}
        />
      )}
    </div>
  );
}

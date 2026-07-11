"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/gallery-images";

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
      <div className="relative aspect-[21/9] bg-fill">
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
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-heading/70 via-heading/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
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
    </div>
  );
}

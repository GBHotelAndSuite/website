"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

export interface HeroSlide {
  type: "image" | "video";
  src: string;
}

const IMAGE_INTERVAL = 6000;

export default function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausedRef = useRef(false);

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (slides.length < 2 || pausedRef.current) return;

    const current = slides[index];
    if (current?.type === "video") return;

    timerRef.current = setInterval(advance, IMAGE_INTERVAL);
  }, [index, slides, advance, clearTimer]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  useEffect(() => {
    const current = slides[index];
    if (current?.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [index, slides]);

  function handleVideoEnded() {
    if (slides.length > 1) advance();
  }

  function pause() {
    pausedRef.current = true;
    clearTimer();
  }

  function resume() {
    pausedRef.current = false;
    startTimer();
  }

  if (!slides.length) return null;

  return (
    <div className="absolute inset-0" onMouseEnter={pause} onMouseLeave={resume}>
      {slides.map((slide, i) => {
        const isActive = i === index;

        if (slide.type === "video") {
          return (
            <video
              key={slide.src}
              ref={isActive ? videoRef : undefined}
              src={slide.src}
              muted
              playsInline
              onEnded={handleVideoEnded}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                isActive ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />
          );
        }

        return (
          <Image
            key={slide.src}
            src={slide.src}
            alt=""
            fill
            className={`object-cover transition-opacity duration-700 ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
            sizes="100vw"
            priority={i === 0}
          />
        );
      })}

      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 z-10 flex gap-1.5 sm:right-8">
          {slides.map((_, i) => (
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

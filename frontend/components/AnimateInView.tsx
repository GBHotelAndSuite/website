"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

type Animation = "fade-in" | "fade-in-up" | "scale-in";

interface Props {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  once?: boolean;
  className?: string;
  as?: "div" | "section" | "span";
}

const animationClass: Record<Animation, string> = {
  "fade-in": "animate-fade-in",
  "fade-in-up": "animate-fade-in-up",
  "scale-in": "animate-scale-in",
};

export default function AnimateInView({
  children,
  animation = "fade-in-up",
  delay = 0,
  once = true,
  className = "",
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref as never}
      className={`${className} opacity-0${visible ? ` ${animationClass[animation]}` : ""}`}
      style={delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

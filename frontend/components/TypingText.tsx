"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function TypingText({
  text,
  speed = 40,
  delay = 400,
  className = "",
  style,
}: Props) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    const interval = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(interval);
      } else {
        setDisplayed(text.slice(0, indexRef.current));
      }
    }, speed);

    return () => clearInterval(interval);
  }, [started, text, speed]);

  return (
    <p className={className} style={style}>
      {displayed}
      {!done && started && <span className="animate-blink-cursor">|</span>}
    </p>
  );
}

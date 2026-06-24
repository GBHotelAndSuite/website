"use client";

import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, useTexture } from "@react-three/drei";
import { Vector3 } from "three";

const LOCATIONS = [
  { id: "lobby", name: "Grand Lobby", image: "/panorama-lobby.jpg" },
  { id: "pool", name: "Infinity Pool", image: "/panorama-pool.jpg" },
  { id: "suite", name: "Penthouse Suite", image: "/panorama-suite.jpg" },
  { id: "dining", name: "Fine Dining", image: "/panorama-dining.jpg" },
] as const;

function Panorama({ image }: { image: string }) {
  const texture = useTexture(image);
  return (
    <Sphere args={[500, 64, 64]} scale={[-1, 1, 1]}>
      <meshBasicMaterial map={texture} side={1} />
    </Sphere>
  );
}

function Scene({ image }: { image: string }) {
  return (
    <>
      <Suspense fallback={null}>
        <Panorama image={image} />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        target={new Vector3(0, 0, 0)}
      />
    </>
  );
}

export default function VirtualTourViewer() {
  const [active, setActive] = useState<string>(LOCATIONS[0].id);
  const current = LOCATIONS.find((l) => l.id === active) ?? LOCATIONS[0];

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap gap-2 border-b border-line bg-surface px-4 py-3">
        {LOCATIONS.map((loc) => (
          <button
            key={loc.id}
            onClick={() => setActive(loc.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active === loc.id
                ? "bg-accent text-white"
                : "bg-white text-muted hover:text-heading"
            }`}
          >
            {loc.name}
          </button>
        ))}
      </div>

      <div className="relative flex-1">
        <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
          <Scene image={current.image} />
        </Canvas>
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/50 px-4 py-1.5 text-xs text-white/80">
          Drag to look around
        </p>
      </div>
    </div>
  );
}

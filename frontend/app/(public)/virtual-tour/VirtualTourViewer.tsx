"use client";

import { useState } from "react";
import ReactPannellum from "react-pannellum";

interface TourLocation {
  id: string;
  name: string;
  category: "rooms" | "common";
  image: string;
}

const LOCATIONS: TourLocation[] = [
  {
    id: "deluxe",
    name: "Deluxe Room",
    category: "rooms",
    image: "/360/rooms/deluxe/panorama.jpg",
  },
  {
    id: "supreme",
    name: "Supreme Room",
    category: "rooms",
    image: "/360/rooms/supreme/panorama.jpg",
  },
  {
    id: "executive",
    name: "Executive Room",
    category: "rooms",
    image: "/360/rooms/executive/panorama.jpg",
  },
  {
    id: "presidential-living",
    name: "Presidential — Living Room",
    category: "rooms",
    image: "/360/rooms/presidential/living-room/panorama.jpg",
  },
  {
    id: "presidential-bed",
    name: "Presidential — Bedroom",
    category: "rooms",
    image: "/360/rooms/presidential/bedroom/panorama.jpg",
  },
  {
    id: "reception",
    name: "Reception",
    category: "common",
    image: "/360/reception/panorama.jpg",
  },
  {
    id: "bar",
    name: "Bar",
    category: "common",
    image: "/360/bar/panorama.jpg",
  },
  {
    id: "gym",
    name: "Fitness Center",
    category: "common",
    image: "/360/gym/panorama.jpg",
  },
  {
    id: "car-park",
    name: "Car Park",
    category: "common",
    image: "/360/car-park/panorama.jpg",
  },
];

function LocationButton({
  location,
  isActive,
  onClick,
}: {
  location: TourLocation;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        isActive
          ? "bg-accent text-white"
          : "bg-white text-muted hover:text-heading"
      }`}
    >
      {location.name}
    </button>
  );
}

export default function VirtualTourViewer() {
  const [active, setActive] = useState<string>(LOCATIONS[0].id);
  const current = LOCATIONS.find((l) => l.id === active) ?? LOCATIONS[0];

  const roomLocations = LOCATIONS.filter((l) => l.category === "rooms");
  const commonLocations = LOCATIONS.filter((l) => l.category === "common");

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-2 border-b border-line bg-surface px-4 py-3">
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-subtle">
            Room Tours
          </p>
          <div className="flex flex-wrap gap-2">
            {roomLocations.map((loc) => (
              <LocationButton
                key={loc.id}
                location={loc}
                isActive={active === loc.id}
                onClick={() => setActive(loc.id)}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-subtle">
            Common Areas
          </p>
          <div className="flex flex-wrap gap-2">
            {commonLocations.map((loc) => (
              <LocationButton
                key={loc.id}
                location={loc}
                isActive={active === loc.id}
                onClick={() => setActive(loc.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex-1">
        <ReactPannellum
          key={current.id}
          id={current.id}
          sceneId={current.id}
          imageSource={current.image}
          className="h-full w-full"
          style={{ width: "100%", height: "100%", background: "#000000" }}
          config={{
            autoLoad: true,
            autoRotate: -2,
            showZoomCtrl: true,
            showFullscreenCtrl: true,
            mouseZoom: false,
          }}
        />
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/50 px-4 py-1.5 text-xs text-white/80">
          Drag to look around
        </p>
      </div>
    </div>
  );
}

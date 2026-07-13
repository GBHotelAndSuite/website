import { readdirSync, existsSync } from "fs";
import { join } from "path";
import { cache } from "react";

export interface GalleryImage {
  src: string;
  alt: string;
  type: "image" | "video";
}

export interface GalleryCategory {
  slug: string;
  label: string;
  images: GalleryImage[];
}

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const VIDEO_EXTS = new Set([".mp4", ".webm"]);

const CATEGORIES: { slug: string; label: string; dir: string }[] = [
  { slug: "bar", label: "Bar", dir: "bar" },
  { slug: "building", label: "Building", dir: "building" },
  { slug: "gym-area", label: "Gym Area", dir: "gym-area" },
  { slug: "reception", label: "Reception", dir: "reception" },
  { slug: "deluxe", label: "Deluxe", dir: "rooms/deluxe" },
  { slug: "supreme", label: "Supreme", dir: "rooms/supreme" },
  { slug: "executive", label: "Executive", dir: "rooms/executive" },
  { slug: "presidential", label: "Presidential", dir: "rooms/presidential" },
];

export const getGalleryCategories = cache((): GalleryCategory[] => {
  const publicDir = join(process.cwd(), "public");

  return CATEGORIES.map(({ slug, label, dir }) => {
    const fullPath = join(publicDir, dir);
    const images: GalleryImage[] = [];

    if (existsSync(fullPath)) {
      const files = readdirSync(fullPath);
      for (const file of files) {
        const ext = file.slice(file.lastIndexOf(".")).toLowerCase();
        if (IMAGE_EXTS.has(ext)) {
          images.push({
            src: `/${dir}/${file}`,
            alt: `${label} — ${file.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")}`,
            type: "image",
          });
        } else if (VIDEO_EXTS.has(ext)) {
          images.push({
            src: `/${dir}/${file}`,
            alt: `${label} — ${file.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")}`,
            type: "video",
          });
        }
      }
    }

    images.sort((a, b) => a.src.localeCompare(b.src));
    return { slug, label, images };
  });
});

import { getGalleryCategories } from "@/lib/gallery-images";
import GalleryClient from "./GalleryClient";

export default async function GalleryPage() {
  const categories = getGalleryCategories();

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GalleryClient categories={categories} />
      </div>
    </div>
  );
}

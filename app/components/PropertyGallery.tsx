"use client";

import { useMemo, useState } from "react";

interface PropertyGalleryProps {
  title: string;
  images: string[];
  fallbackImage: string;
}

export default function PropertyGallery({
  title,
  images,
  fallbackImage,
}: PropertyGalleryProps) {
  const galleryImages = useMemo(() => {
    return Array.from(new Set([fallbackImage, ...images])).filter(Boolean);
  }, [fallbackImage, images]);

  const [activeImage, setActiveImage] = useState(galleryImages[0] ?? fallbackImage);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-sm group bg-white">
        <img
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={activeImage}
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-mosque text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            Premium
          </span>
          <span className="bg-white/90 backdrop-blur text-nordic text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            New
          </span>
        </div>
        <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-nordic px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur transition-all flex items-center gap-2">
          <span className="material-icons text-sm">grid_view</span>
          View All Photos
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto hide-scroll pb-2 snap-x">
        {galleryImages.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveImage(image)}
            className={`flex-none w-48 aspect-[4/3] rounded-lg overflow-hidden cursor-pointer snap-start border-2 transition-all ${
              activeImage === image
                ? "border-mosque ring-2 ring-mosque ring-offset-2 ring-offset-clear-day"
                : "border-transparent opacity-70 hover:opacity-100 hover:border-mosque/40"
            }`}
          >
            <img alt={`${title} ${index + 1}`} className="w-full h-full object-cover" src={image} />
          </button>
        ))}
      </div>
    </div>
  );
}
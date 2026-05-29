"use client";

import Link from "next/link";
import { useState } from "react";
import { Property } from "@/lib/queries/properties";

interface FeaturedCardProps {
  property: Property;
}

export default function FeaturedCard({ property }: FeaturedCardProps) {
  const [isFavorite, setIsFavorite] = useState(property.is_favorite || false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group relative rounded-xl overflow-hidden shadow-soft bg-white cursor-pointer flex flex-col h-full">
      <Link
        aria-label={`Ver detalle de ${property.title}`}
        className="absolute inset-0 z-20 rounded-xl"
        href={`/properties/${property.slug}`}
      />
      <div className="aspect-[4/3] w-full overflow-hidden relative z-0">
        <img
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={property.image_url}
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-nordic-dark">
          Featured
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className={`absolute top-4 right-4 z-30 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer ${
            isFavorite
              ? "bg-mosque text-white"
              : "bg-white/90 text-nordic-dark hover:bg-mosque hover:text-white"
          }`}
        >
          <span className="material-icons text-xl">
            {isFavorite ? "favorite" : "favorite_border"}
          </span>
        </button>
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
      </div>
      <div className="p-6 relative z-10 flex flex-col flex-grow justify-between">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-medium text-nordic-dark group-hover:text-mosque transition-colors">
              {property.title}
            </h3>
            <p className="text-nordic-muted text-sm flex items-center gap-1 mt-1">
              <span className="material-icons text-sm">place</span> {property.location}
            </p>
          </div>
          <span className="text-xl font-semibold text-mosque">
            {formatPrice(property.price)}
          </span>
        </div>
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-nordic-dark/5">
          <div className="flex items-center gap-2 text-nordic-muted text-sm">
            <span className="material-icons text-lg">king_bed</span> {property.beds} Beds
          </div>
          <div className="flex items-center gap-2 text-nordic-muted text-sm">
            <span className="material-icons text-lg">bathtub</span> {property.baths} Baths
          </div>
          <div className="flex items-center gap-2 text-nordic-muted text-sm">
            <span className="material-icons text-lg">square_foot</span> {property.area.toLocaleString()} m²
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Property } from "../data/mockProperties";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(property.isFavorite || false);

  const formatPrice = (price: number, type: "sale" | "rent") => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);

    return type === "rent" ? `${formatted}/mo` : formatted;
  };

  return (
    <article className="bg-white dark:bg-white/5 rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 group cursor-pointer h-full flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={property.imageUrl}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors cursor-pointer ${
            isFavorite
              ? "bg-mosque text-white"
              : "bg-white/90 dark:bg-black/50 text-nordic-dark dark:text-white hover:bg-mosque hover:text-white"
          }`}
        >
          <span className="material-icons text-lg">
            {isFavorite ? "favorite" : "favorite_border"}
          </span>
        </button>
        <div
          className={`absolute bottom-3 left-3 text-white text-xs font-bold px-2 py-1 rounded ${
            property.type === "sale" ? "bg-nordic-dark/90" : "bg-mosque/90"
          }`}
        >
          {property.type === "sale" ? "FOR SALE" : "FOR RENT"}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="font-bold text-lg text-nordic-dark dark:text-white">
              {formatPrice(property.price, property.type)}
            </h3>
          </div>
          <h4 className="text-nordic-dark dark:text-gray-200 font-medium truncate mb-1 group-hover:text-mosque transition-colors">
            {property.title}
          </h4>
          <p className="text-nordic-muted text-xs mb-4">{property.location}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">king_bed</span> {property.beds}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">bathtub</span> {property.baths}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">square_foot</span> {property.area}m²
          </div>
        </div>
      </div>
    </article>
  );
}

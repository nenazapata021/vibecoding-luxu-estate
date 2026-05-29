"use client";

import L from "leaflet";
import { useEffect, useRef } from "react";

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
}

export default function PropertyMap({ latitude, longitude, title }: PropertyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) {
      return;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView([latitude, longitude], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const marker = L.divIcon({
      className: "",
      html: `
        <div class="w-8 h-8 bg-mosque rounded-full border-4 border-white shadow-lg flex items-center justify-center">
          <span class="material-icons text-white text-sm">home</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    L.marker([latitude, longitude], { icon: marker }).addTo(map).bindPopup(title);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [latitude, longitude, title]);

  return <div ref={mapContainerRef} className="w-full h-full min-h-[280px] rounded-lg overflow-hidden" />;
}
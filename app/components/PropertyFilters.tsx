"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const categories = [
  { label: "Todos", value: "all" },
  { label: "Casa", value: "house" },
  { label: "Apartamento", value: "apartment" },
  { label: "Villa", value: "villa" },
  { label: "Penthouse", value: "penthouse" },
];

interface PropertyFiltersProps {
  initialCategory: string;
  initialType: string;
  initialSearch: string;
}

export default function PropertyFilters({
  initialCategory,
  initialType,
  initialSearch,
}: PropertyFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchInputVal, setSearchInputVal] = useState(initialSearch);
  const [showFiltersAlert, setShowFiltersAlert] = useState(false);

  // Construye la nueva URL manteniendo parámetros existentes
  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      // Al cambiar filtros, volver a la página 1
      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryChange = (value: string) => {
    const qs = createQueryString({ category: value });
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  const handleTypeChange = (value: string) => {
    const qs = createQueryString({ type: value });
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qs = createQueryString({ q: searchInputVal.trim() });
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  const activeCategory = initialCategory;
  const activeTxType = initialType;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Campo de búsqueda */}
      <form onSubmit={handleSearchSubmit} className="relative group max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">
            search
          </span>
        </div>
        <input
          className="block w-full pl-12 pr-32 py-4 rounded-xl border-none bg-white text-nordic-dark shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white transition-all text-lg focus:outline-none"
          placeholder="Busca por ciudad, barrio o dirección..."
          type="text"
          value={searchInputVal}
          onChange={(e) => setSearchInputVal(e.target.value)}
        />
        <button
          type="submit"
          className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20 cursor-pointer"
        >
          Buscar
        </button>
      </form>

      {/* Pestañas de categoría */}
      <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10"
                  : "bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 hover:bg-mosque/5"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
        <div className="w-px h-6 bg-nordic-dark/10 mx-2"></div>
        <button
          onClick={() => setShowFiltersAlert(true)}
          className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark font-medium text-sm hover:bg-black/5 transition-colors cursor-pointer"
        >
          <span className="material-icons text-base">tune</span> Filtros
        </button>
      </div>

      {showFiltersAlert && (
        <div className="bg-hint-of-green/40 border border-mosque/20 text-nordic-dark p-4 rounded-xl flex items-center justify-between text-sm max-w-xl mx-auto">
          <span>Los filtros avanzados están en desarrollo. ¡Usa la barra de búsqueda o las categorías!</span>
          <button
            onClick={() => setShowFiltersAlert(false)}
            className="material-icons text-lg hover:text-mosque cursor-pointer ml-2"
          >
            close
          </button>
        </div>
      )}

      {/* Tabs Comprar / Alquilar */}
      <div className="flex justify-center">
        <div className="flex bg-white p-1 rounded-lg shadow-card">
          {(["all", "sale", "rent"] as const).map((t) => {
            const labels = { all: "Todos", sale: "Comprar", rent: "Alquilar" };
            return (
              <button
                key={t}
                onClick={() => handleTypeChange(t)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  activeTxType === t
                    ? "bg-nordic-dark text-white shadow-sm"
                    : "text-nordic-muted hover:text-nordic-dark"
                }`}
              >
                {labels[t]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

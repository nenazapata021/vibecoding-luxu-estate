import { Suspense } from "react";
import Navbar from "./components/Navbar";
import FeaturedCard from "./components/FeaturedCard";
import PropertyCard from "./components/PropertyCard";
import PropertyFilters from "./components/PropertyFilters";
import Pagination from "./components/Pagination";
import {
  getProperties,
  getFeaturedProperties,
  getPropertiesCount,
  PER_PAGE,
} from "@/lib/queries/properties";

// Fuerza renderizado dinámico porque usa searchParams (request-time API)
export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    type?: string;
    q?: string;
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  // En Next.js 16, searchParams es una Promise — hay que hacer await
  const params = await searchParams;

  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const category = params.category ?? "all";
  const type = params.type ?? "all";
  const search = params.q ?? "";

  // Consultas paralelas al servidor (Supabase)
  const [properties, featuredProperties, totalCount] = await Promise.all([
    getProperties({ page, category, type, search }),
    getFeaturedProperties(),
    getPropertiesCount({ category, type, search }),
  ]);

  const totalPages = Math.ceil(totalCount / PER_PAGE);

  // Parámetros actuales para construir URLs de paginación
  const currentSearchParams: Record<string, string | undefined> = {
    category: category !== "all" ? category : undefined,
    type: type !== "all" ? type : undefined,
    q: search || undefined,
  };

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 flex-grow">
        {/* ── Hero + Filtros ── */}
        <section className="py-12 md:py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark leading-tight mb-2">
              Encuentra tu{" "}
              <span className="relative inline-block">
                <span className="relative z-10 font-medium text-nordic-dark">
                  santuario
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
              </span>
              .
            </h1>
            <p className="text-nordic-muted text-lg mt-3">
              {totalCount > 0
                ? `${totalCount} propiedad${totalCount !== 1 ? "es" : ""} disponible${totalCount !== 1 ? "s" : ""}`
                : "Sin resultados para tu búsqueda"}
            </p>
          </div>

          {/* Filtros del lado del cliente — actualizan la URL */}
          <Suspense fallback={<div className="h-32 animate-pulse bg-white/50 rounded-xl" />}>
            <PropertyFilters
              initialCategory={category}
              initialType={type}
              initialSearch={search}
            />
          </Suspense>
        </section>

        {/* ── Propiedades Destacadas ── */}
        {featuredProperties.length > 0 && (
          <section className="mb-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-light text-nordic-dark">
                  Colecciones Destacadas
                </h2>
                <p className="text-nordic-muted mt-1 text-sm">
                  Propiedades seleccionadas para el ojo más exigente.
                </p>
              </div>
              <a
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity"
                href="#"
              >
                Ver todas{" "}
                <span className="material-icons text-sm">arrow_forward</span>
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProperties.map((property) => (
                <FeaturedCard key={property.id} property={property} />
              ))}
            </div>
          </section>
        )}

        {/* ── Nuevas en el Mercado ── */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark">
                Nuevas en el Mercado
              </h2>
              <p className="text-nordic-muted mt-1 text-sm">
                Oportunidades frescas añadidas esta semana.
              </p>
            </div>
            {/* Indicador de página */}
            {totalPages > 1 && (
              <span className="text-sm text-nordic-muted">
                Página <strong className="text-nordic-dark">{page}</strong> de{" "}
                <strong className="text-nordic-dark">{totalPages}</strong>
              </span>
            )}
          </div>

          {/* Grid de propiedades */}
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-card">
              <span className="material-icons text-5xl text-nordic-muted mb-3 block">
                search_off
              </span>
              <p className="text-nordic-muted text-lg">
                No se encontraron propiedades con esos criterios.
              </p>
              <a
                href="/"
                className="mt-4 inline-block text-mosque font-medium hover:underline"
              >
                Limpiar filtros
              </a>
            </div>
          )}

          {/* Paginación del servidor */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            searchParams={currentSearchParams}
          />
        </section>
      </main>
    </>
  );
}

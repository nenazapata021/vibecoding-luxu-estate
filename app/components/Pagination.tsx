import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}

function buildHref(
  page: number,
  searchParams: Record<string, string | undefined>
): string {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (key !== "page" && value) params.set(key, value);
  });
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

export default function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Paginación de propiedades"
      className="flex items-center justify-center gap-2 mt-12"
    >
      {/* Botón anterior */}
      {hasPrev ? (
        <Link
          href={buildHref(currentPage - 1, searchParams)}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-nordic-dark/10 text-nordic-dark text-sm font-medium hover:border-mosque hover:text-mosque transition-all shadow-card"
        >
          <span className="material-icons text-sm">chevron_left</span>
          Anterior
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-nordic-dark/5 text-nordic-muted text-sm font-medium cursor-not-allowed opacity-50">
          <span className="material-icons text-sm">chevron_left</span>
          Anterior
        </span>
      )}

      {/* Números de página */}
      <div className="flex items-center gap-1">
        {pages.map((page) => {
          const isActive = page === currentPage;
          return isActive ? (
            <span
              key={page}
              aria-current="page"
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-nordic-dark text-white text-sm font-bold shadow-lg"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={buildHref(page, searchParams)}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-nordic-dark/10 text-nordic-dark text-sm font-medium hover:border-mosque hover:text-mosque transition-all shadow-card"
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Botón siguiente */}
      {hasNext ? (
        <Link
          href={buildHref(currentPage + 1, searchParams)}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-nordic-dark/10 text-nordic-dark text-sm font-medium hover:border-mosque hover:text-mosque transition-all shadow-card"
        >
          Siguiente
          <span className="material-icons text-sm">chevron_right</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-nordic-dark/5 text-nordic-muted text-sm font-medium cursor-not-allowed opacity-50">
          Siguiente
          <span className="material-icons text-sm">chevron_right</span>
        </span>
      )}
    </nav>
  );
}

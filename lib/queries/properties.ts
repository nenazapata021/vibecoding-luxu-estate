import { createServerClient } from "@/lib/supabase/server";

export const PER_PAGE = 8;

// Tipos que coinciden con las tablas de Supabase
export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  type: "sale" | "rent";
  beds: number;
  baths: number;
  area: number;
  category: "house" | "apartment" | "villa" | "penthouse";
  image_url: string;
  is_favorite: boolean;
}

export interface FeaturedProperty {
  id: string;
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  area: number;
  tag: string;
  image_url: string;
  is_favorite: boolean;
}

interface GetPropertiesOptions {
  page?: number;
  category?: string;
  type?: string;
  search?: string;
  perPage?: number;
}

// Obtener propiedades con paginación y filtros del lado del servidor
export async function getProperties({
  page = 1,
  category = "all",
  type = "all",
  search = "",
  perPage = PER_PAGE,
}: GetPropertiesOptions = {}): Promise<Property[]> {
  const supabase = createServerClient();

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  if (type && type !== "all") {
    query = query.eq("type", type);
  }

  if (search && search.trim() !== "") {
    query = query.or(
      `title.ilike.%${search}%,location.ilike.%${search}%,category.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error al obtener propiedades:", error.message);
    return [];
  }

  return (data as Property[]) ?? [];
}

// Contar el total de propiedades (para calcular páginas)
export async function getPropertiesCount({
  category = "all",
  type = "all",
  search = "",
}: Omit<GetPropertiesOptions, "page" | "perPage"> = {}): Promise<number> {
  const supabase = createServerClient();

  let query = supabase
    .from("properties")
    .select("*", { count: "exact", head: true });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  if (type && type !== "all") {
    query = query.eq("type", type);
  }

  if (search && search.trim() !== "") {
    query = query.or(
      `title.ilike.%${search}%,location.ilike.%${search}%,category.ilike.%${search}%`
    );
  }

  const { count, error } = await query;

  if (error) {
    console.error("Error al contar propiedades:", error.message);
    return 0;
  }

  return count ?? 0;
}

// Obtener propiedades destacadas
export async function getFeaturedProperties(): Promise<FeaturedProperty[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("featured_properties")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(2);

  if (error) {
    console.error("Error al obtener propiedades destacadas:", error.message);
    return [];
  }

  return (data as FeaturedProperty[]) ?? [];
}

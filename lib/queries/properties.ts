import { createServerClient } from "@/lib/supabase/server";

export const PER_PAGE = 8;

// Tipos que coinciden con las tablas de Supabase
export interface Property {
  id: string;
  slug: string;
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
  is_featured: boolean;
  latitude: number;
  longitude: number;
}

export interface PropertyImage {
  id: number;
  property_id: string;
  image_url: string;
  sort_order: number;
}

export interface PropertyWithImages extends Property {
  property_images: PropertyImage[];
}

interface GetPropertiesOptions {
  page?: number;
  category?: string;
  type?: string;
  search?: string;
  perPage?: number;
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function matchesSlug(property: Property, slug: string) {
  return property.slug === slug || toSlug(property.title) === slug || property.id === slug;
}

function normalizeProperty(property: Partial<Property> & { title: string }): Property {
  return {
    id: property.id ?? property.title,
    slug: property.slug ?? toSlug(property.title),
    title: property.title,
    location: property.location ?? "",
    price: property.price ?? 0,
    type: property.type ?? "sale",
    beds: property.beds ?? 0,
    baths: property.baths ?? 0,
    area: property.area ?? 0,
    category: property.category ?? "house",
    image_url: property.image_url ?? "",
    is_favorite: property.is_favorite ?? false,
    is_featured: property.is_featured ?? false,
    latitude: property.latitude ?? 0,
    longitude: property.longitude ?? 0,
  };
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

  return (data ?? []).map((property) => normalizeProperty(property as Property));
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
export async function getFeaturedProperties(): Promise<Property[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(2);

  if (error) {
    console.error("Error al obtener propiedades destacadas:", error.message);
    return [];
  }

  return (data ?? []).map((property) => normalizeProperty(property as Property));
}

export async function getPropertyBySlug(
  slug: string
): Promise<PropertyWithImages | null> {
  const supabase = createServerClient();

  const selectWithImages = `
        *,
        property_images (
          id,
          property_id,
          image_url,
          sort_order
        )
      `;

  const { data: propertyData, error: propertyError } = await supabase
    .from("properties")
    .select(selectWithImages)
    .eq("slug", slug)
    .maybeSingle();

  if (propertyData) {
    const property = propertyData as Partial<PropertyWithImages> & { title: string };

    return {
      ...normalizeProperty(property),
      property_images: ((property.property_images ?? []) as PropertyImage[]).sort(
        (left, right) => left.sort_order - right.sort_order
      ),
    };
  }

  if (propertyError) {
    console.warn(
      "Fallback por slug no disponible, usando búsqueda amplia:",
      propertyError.message
    );
  }

  const { data: fallbackData, error: fallbackError } = await supabase
    .from("properties")
    .select("*");

  if (fallbackError) {
    console.error("Error al obtener propiedades para fallback de slug:", fallbackError.message);
    return null;
  }

  const matchedProperty = (fallbackData ?? [])
    .map((property) => normalizeProperty(property as Property))
    .find((property) => matchesSlug(property, slug));

  if (!matchedProperty) {
    return null;
  }

  return {
    ...matchedProperty,
    property_images: [],
  };
}

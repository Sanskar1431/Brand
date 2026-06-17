import { products } from "./data";
import { Product } from "./schema";

export interface FetchProductsOptions {
  category?: "tshirt" | "jogger";
  color?: string;
  size?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
  sortBy?: "price-asc" | "price-desc" | "name" | "newest";
  limit?: number;
  page?: number;
}

export async function fetchProducts(options: FetchProductsOptions = {}): Promise<{
  products: Product[];
  total: number;
  hasMore: boolean;
}> {
  // Simulate network delay for premium loader feel
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = [...products];

  // Category filter
  if (options.category) {
    filtered = filtered.filter((p) => p.category === options.category);
  }

  // Color filter (case insensitive)
  if (options.color) {
    filtered = filtered.filter((p) =>
      p.colors.some((c) => c.name.toLowerCase() === options.color!.toLowerCase())
    );
  }

  // Size filter
  if (options.size) {
    filtered = filtered.filter((p) => p.sizes.includes(options.size as any));
  }

  // Price range filters
  if (options.priceMin !== undefined) {
    filtered = filtered.filter((p) => p.price >= options.priceMin!);
  }
  if (options.priceMax !== undefined) {
    filtered = filtered.filter((p) => p.price <= options.priceMax!);
  }

  // Fuzzy text search
  if (options.search) {
    const query = options.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.fabric.toLowerCase().includes(query)
    );
  }

  // Sorting
  if (options.sortBy) {
    switch (options.sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        // Keep order or sort by ID
        break;
    }
  }

  const total = filtered.length;
  const page = options.page || 1;
  const limit = options.limit || 24;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);
  const hasMore = startIndex + limit < total;

  return {
    products: paginated,
    total,
    hasMore,
  };
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 150));
  const product = products.find((p) => p.slug === slug);
  return product || null;
}

export async function fetchSignatureProducts(): Promise<Product[]> {
  // Return the signature products marked isSignature = true
  return products.filter((p) => p.isSignature);
}

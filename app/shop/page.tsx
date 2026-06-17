import { fetchProducts } from "@/lib/products/fetchProducts";
import ShopCatalog from "@/components/ui/ShopCatalog";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All — PRINCE Luxury Streetwear",
  description: "Browse the full catalog of PRINCE luxury streetwear including signature heavyweight tees and fleece French terry joggers.",
};

export default async function ShopPage() {
  // Fetch initial batch (we fetch 100 items for instant client-side performance, Section 7.1)
  const data = await fetchProducts({ limit: 100 });

  return <ShopCatalog initialProducts={data.products} />;
}

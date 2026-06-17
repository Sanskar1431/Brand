import { fetchProducts } from "@/lib/products/fetchProducts";
import ShopCatalog from "@/components/ui/ShopCatalog";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { category: "tshirt" },
    { category: "jogger" },
  ];
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const cat = resolvedParams.category;
  const title = cat === "tshirt" ? "Signature Tees" : cat === "jogger" ? "Premium Joggers" : "Catalog";
  return {
    title: `${title} — PRINCE Luxury Streetwear`,
    description: `Shop the exclusive selection of PRINCE luxury ${cat}s, engineered with heavyweight fabric and architectural fit.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const cat = resolvedParams.category;

  if (cat !== "tshirt" && cat !== "jogger") {
    notFound();
  }

  const data = await fetchProducts({
    category: cat as "tshirt" | "jogger",
    limit: 100,
  });

  return <ShopCatalog initialProducts={data.products} categoryFilter={cat as "tshirt" | "jogger"} />;
}

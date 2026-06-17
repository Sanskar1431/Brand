import { fetchProductBySlug, fetchProducts } from "@/lib/products/fetchProducts";
import ProductDetailClient from "@/components/ui/ProductDetailClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { products } from "@/lib/products/data";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// SSG Static Paths for all 100 products (Section 7.2)
export async function generateStaticParams() {
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await fetchProductBySlug(resolvedParams.slug);
  if (!product) return {};

  return {
    title: `${product.name} — PRINCE Luxury Streetwear`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images.hero }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await fetchProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Fetch related products (Complete the Look, Section 7.2.3)
  const relatedData = await fetchProducts({
    category: product.category,
    limit: 5, // fetch 5, filter out current product
  });
  
  const relatedFiltered = relatedData.products.filter((p) => p.id !== product.id).slice(0, 4);

  // Structured Data (Section 7.2 / 9)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images.hero,
    "description": product.description,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "url": `https://prince-streetwear.vercel.app/product/${product.slug}`,
      "priceCurrency": product.currency,
      "price": (product.price / 100).toFixed(2),
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2027-12-31",
    },
  };

  return (
    <>
      {/* JSON-LD Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedFiltered} />
    </>
  );
}

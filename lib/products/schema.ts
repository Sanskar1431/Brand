export interface ProductColor {
  name: string;
  hex: string;
  swatchImage: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "tshirt" | "jogger";
  price: number; // in smallest currency unit (paise/cents)
  currency: "INR" | "USD";
  colors: ProductColor[];
  sizes: ("S" | "M" | "L" | "XL")[];
  images: {
    hero: string; // primary campaign-style shot
    gallery: string[]; // 3-5 additional angles
    flatLay?: string;
  };
  fabric: string;
  fit: "oversized" | "regular" | "slim";
  description: string; // long-form, editorial tone
  craftsmanship: string[]; // bullet list — stitching, fabric weight, etc.
  isSignature: boolean; // flags Oversized Tee / Premium Joggers hero pieces
  stock: Record<string, number>; // keyed by 'color-size'
}

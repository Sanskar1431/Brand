const fs = require("fs");
const path = require("path");

const colors = [
  { name: "Obsidian Black", hex: "#121214", swatchImage: "/images/swatches/obsidian-black.png" },
  { name: "Royal Purple", hex: "#6B46C1", swatchImage: "/images/swatches/royal-purple.png" },
  { name: "Gunmetal Grey", hex: "#2C2E33", swatchImage: "/images/swatches/gunmetal-grey.png" },
  { name: "Pure Black", hex: "#0A0A0A", swatchImage: "/images/swatches/pure-black.png" },
  { name: "Soft White", hex: "#F5F4F2", swatchImage: "/images/swatches/soft-white.png" }
];

const sizes = ["S", "M", "L", "XL"];

const tshirtFabrics = [
  "280GSM 100% heavyweight combed cotton",
  "320GSM ultra-dense organic cotton jersey",
  "240GSM cotton-bamboo luxury blend"
];

const joggerFabrics = [
  "450GSM loopback French terry cotton",
  "400GSM organic cotton fleece",
  "380GSM double-knit interlock cotton"
];

const tshirtFits = ["oversized", "regular", "slim"];
const joggerFits = ["oversized", "regular", "slim"];

const tshirtCraftsmanship = [
  "Double-needle stitched collar and hems",
  "Reinforced shoulder-to-shoulder taping",
  "Preshrunk fabric to prevent washing shrinkage",
  "High-density silk screen print detail"
];

const joggerCraftsmanship = [
  "Elastic waistband with custom metal-tipped drawcords",
  "Side seam pockets with hidden YKK zippers",
  "Ribbed cuffs with double-stitch detailing",
  "Gusseted crotch panel for maximum comfort"
];

const products = [];

// Generate 50 T-shirts
for (let i = 1; i <= 50; i++) {
  const isSignature = i === 1 || i === 2; // Make first two tees signature pieces
  const name = isSignature 
    ? (i === 1 ? "Oversized Signature Tee" : "Cinematic Heavyweight Tee")
    : `PRINCE Series-${i} Tee`;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  
  // Pick a subset of colors for this tee
  const productColors = colors.slice(0, 3 + (i % 3)); // 3 to 5 colors
  
  // Build stock
  const stock = {};
  productColors.forEach(c => {
    sizes.forEach(s => {
      stock[`${c.name}-${s}`] = Math.floor(Math.random() * 40) + 10; // 10 to 50 items
    });
  });

  const fabric = tshirtFabrics[i % tshirtFabrics.length];
  const fit = tshirtFits[i % tshirtFits.length];
  const price = isSignature ? 450000 : 250000 + (i * 2000); // INR in paise (₹4500.00 or ₹2500.00 - ₹3480.00)

  products.push({
    id: `tee-${i}`,
    slug,
    name,
    category: "tshirt",
    price,
    currency: "INR",
    colors: productColors,
    sizes,
    images: {
      hero: `/images/products/${slug}/hero.png`,
      gallery: [
        `/images/products/${slug}/angle-1.png`,
        `/images/products/${slug}/angle-2.png`,
        `/images/products/${slug}/angle-3.png`
      ],
      flatLay: `/images/products/${slug}/flat.png`
    },
    fabric,
    fit,
    description: `A minimalist masterclass in premium luxury streetwear. Engineered with ${fabric} and designed with a distinct ${fit} silhouette, this piece elevates your daily rotation with the signature PRINCE aesthetic. Custom craftsmanship details include specialized stitching and a refined finish.`,
    craftsmanship: tshirtCraftsmanship,
    isSignature,
    stock
  });
}

// Generate 50 Joggers
for (let i = 1; i <= 50; i++) {
  const isSignature = i === 1 || i === 2; // Make first two joggers signature pieces
  const name = isSignature 
    ? (i === 1 ? "Premium Cargo Jogger" : "French Terry Sweatpant")
    : `PRINCE Series-${i} Jogger`;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  
  // Pick colors
  const productColors = colors.slice(1, 4 + (i % 2)); // 3 to 4 colors
  
  // Build stock
  const stock = {};
  productColors.forEach(c => {
    sizes.forEach(s => {
      stock[`${c.name}-${s}`] = Math.floor(Math.random() * 30) + 5; // 5 to 35 items
    });
  });

  const fabric = joggerFabrics[i % joggerFabrics.length];
  const fit = joggerFits[i % joggerFits.length];
  const price = isSignature ? 650000 : 350000 + (i * 2000); // INR in paise (₹6500.00 or ₹3500.00 - ₹4480.00)

  products.push({
    id: `jogger-${i}`,
    slug,
    name,
    category: "jogger",
    price,
    currency: "INR",
    colors: productColors,
    sizes,
    images: {
      hero: `/images/products/${slug}/hero.png`,
      gallery: [
        `/images/products/${slug}/angle-1.png`,
        `/images/products/${slug}/angle-2.png`,
        `/images/products/${slug}/angle-3.png`
      ],
      flatLay: `/images/products/${slug}/flat.png`
    },
    fabric,
    fit,
    description: `Redefining comfort and luxury structure. Cut from the finest ${fabric} and tailored to a clean ${fit} fit. Designed to hold its shape over time while providing effortless utility. Accented with custom hardware and signature minimal branding.`,
    craftsmanship: joggerCraftsmanship,
    isSignature,
    stock
  });
}

// Write file
const outputDir = path.join(__dirname, "..", "lib", "products");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const fileContent = `import { Product } from "./schema";

export const products: Product[] = ${JSON.stringify(products, null, 2)};
`;

fs.writeFileSync(path.join(outputDir, "data.ts"), fileContent, "utf-8");
console.log("Successfully generated 100 products inside lib/products/data.ts");

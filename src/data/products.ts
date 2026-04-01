/**
 * Product data — separated from components for easy migration.
 * In Next.js, this can become a server-side data fetch or CMS integration.
 */
import pantheonImage from "@/assets/pantheon.jpg";
import eclipseImage from "@/assets/eclipse.jpg";
import haloImage from "@/assets/halo.jpg";
import obliqueImage from "@/assets/oblique.jpg";
import lintelImage from "@/assets/lintel.jpg";
import shadowlineImage from "@/assets/shadowline.jpg";

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: string;
  priceNumeric: number;
  currency: string;
  image: string;
  isNew?: boolean;
  description?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Pantheon",
    slug: "pantheon",
    category: "Earrings",
    price: "€2,850",
    priceNumeric: 2850,
    currency: "EUR",
    image: pantheonImage,
    isNew: true,
  },
  {
    id: 2,
    name: "Eclipse",
    slug: "eclipse",
    category: "Bracelets",
    price: "€3,200",
    priceNumeric: 3200,
    currency: "EUR",
    image: eclipseImage,
  },
  {
    id: 3,
    name: "Halo",
    slug: "halo",
    category: "Earrings",
    price: "€1,950",
    priceNumeric: 1950,
    currency: "EUR",
    image: haloImage,
    isNew: true,
  },
  {
    id: 4,
    name: "Oblique",
    slug: "oblique",
    category: "Earrings",
    price: "€1,650",
    priceNumeric: 1650,
    currency: "EUR",
    image: obliqueImage,
  },
  {
    id: 5,
    name: "Lintel",
    slug: "lintel",
    category: "Earrings",
    price: "€2,250",
    priceNumeric: 2250,
    currency: "EUR",
    image: lintelImage,
  },
  {
    id: 6,
    name: "Shadowline",
    slug: "shadowline",
    category: "Bracelets",
    price: "€3,950",
    priceNumeric: 3950,
    currency: "EUR",
    image: shadowlineImage,
  },
];

export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getProductById = (id: number) =>
  products.find((p) => p.id === id);

export const getProductsByCategory = (category: string) =>
  products.filter((p) => p.category.toLowerCase() === category.toLowerCase());

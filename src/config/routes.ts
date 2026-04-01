/**
 * Route & SEO configuration — single source of truth.
 * When migrating to Next.js, use this to generate metadata exports per page.
 */

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  jsonLdType?: string;
}

export const routes: Record<string, RouteMeta> = {
  home: {
    path: "/",
    title: "Linea - Minimalist Jewelry Crafted for the Modern Individual",
    description:
      "Discover minimalist jewelry crafted with timeless elegance. Shop rings, earrings, bracelets, and necklaces from Linea.",
    jsonLdType: "JewelryStore",
  },
  category: {
    path: "/category/:category",
    title: "{category} - Linea Jewelry",
    description: "Shop our {category} collection. Minimalist jewelry crafted with timeless elegance.",
  },
  product: {
    path: "/product/:productId",
    title: "{productName} - Linea Jewelry",
    description: "Discover the {productName} from Linea. Minimalist jewelry crafted with timeless elegance.",
    jsonLdType: "Product",
  },
  checkout: {
    path: "/checkout",
    title: "Checkout - Linea Jewelry",
    description: "Complete your purchase at Linea Jewelry.",
  },
  ourStory: {
    path: "/about/our-story",
    title: "Our Story - Linea Jewelry",
    description: "Learn about the story behind Linea Jewelry.",
  },
  sustainability: {
    path: "/about/sustainability",
    title: "Sustainability - Linea Jewelry",
    description: "Discover Linea's commitment to sustainable jewelry.",
  },
  sizeGuide: {
    path: "/about/size-guide",
    title: "Size Guide - Linea Jewelry",
    description: "Find your perfect fit with our comprehensive size guide.",
  },
  customerCare: {
    path: "/about/customer-care",
    title: "Customer Care - Linea Jewelry",
    description: "Get help with orders, shipping, returns, and more.",
  },
  storeLocator: {
    path: "/about/store-locator",
    title: "Store Locator - Linea Jewelry",
    description: "Find a Linea Jewelry store near you.",
  },
  privacyPolicy: {
    path: "/privacy-policy",
    title: "Privacy Policy - Linea Jewelry",
    description: "Read Linea Jewelry's privacy policy.",
  },
  termsOfService: {
    path: "/terms-of-service",
    title: "Terms of Service - Linea Jewelry",
    description: "Read Linea Jewelry's terms of service.",
  },
};

/** Helper to interpolate route meta with dynamic params */
export function getRouteMeta(
  key: string,
  params: Record<string, string> = {}
): RouteMeta {
  const route = routes[key];
  if (!route) return routes.home;

  let title = route.title;
  let description = route.description;

  Object.entries(params).forEach(([k, v]) => {
    const capitalized = v.charAt(0).toUpperCase() + v.slice(1);
    title = title.replace(`{${k}}`, capitalized);
    description = description.replace(`{${k}}`, capitalized.toLowerCase());
  });

  return { ...route, title, description };
}

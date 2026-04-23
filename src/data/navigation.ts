/**
 * Navigation data — separated for easy migration.
 * All product/category links route through /explore/...
 */

export interface NavImage {
  src: string;
  alt: string;
  label: string;
}

export interface NavItem {
  name: string;
  href: string;
  submenuItems: string[];
  images: NavImage[];
}

export const navItems: NavItem[] = [
  {
    name: "Shop",
    href: "/explore",
    submenuItems: ["Rings", "Necklaces", "Earrings", "Bracelets", "Watches"],
    images: [
      { src: "/rings-collection.png", alt: "Rings Collection", label: "Rings" },
      { src: "/earrings-collection.png", alt: "Earrings Collection", label: "Earrings" },
    ],
  },
  {
    name: "New in",
    href: "/explore/new-in",
    submenuItems: [
      "This Week's Arrivals",
      "Spring Collection",
      "Featured Designers",
      "Limited Edition",
      "Pre-Orders",
    ],
    images: [
      { src: "/arcus-bracelet.png", alt: "Arcus Bracelet", label: "Arcus Bracelet" },
      { src: "/span-bracelet.png", alt: "Span Bracelet", label: "Span Bracelet" },
    ],
  },
  {
    name: "About",
    href: "/about/our-story",
    submenuItems: [
      "Our Story",
      "Sustainability",
      "Size Guide",
      "Customer Care",
      "Store Locator",
    ],
    images: [
      { src: "/founders.png", alt: "Company Founders", label: "Read our story" },
    ],
  },
];

export const popularSearches = [
  "Gold Rings",
  "Silver Necklaces",
  "Pearl Earrings",
  "Designer Bracelets",
  "Wedding Rings",
  "Vintage Collection",
];

export const footerLinks = {
  shop: [
    { label: "New In", href: "/explore/new-in" },
    { label: "Rings", href: "/explore/rings" },
    { label: "Earrings", href: "/explore/earrings" },
    { label: "Bracelets", href: "/explore/bracelets" },
    { label: "Necklaces", href: "/explore/necklaces" },
  ],
  support: [
    { label: "Size Guide", href: "/about/size-guide" },
    { label: "Care Instructions", href: "/about/customer-care" },
    { label: "Returns & Exchanges", href: "/refund-exchange-policy" },
    { label: "Shipping", href: "/about/customer-care" },
    { label: "Contact", href: "/about/customer-care" },
  ],
  connect: [
    { label: "Instagram", href: "https://instagram.com", external: true },
    { label: "Pinterest", href: "https://pinterest.com", external: true },
    { label: "Newsletter", href: "#newsletter" },
  ],
};

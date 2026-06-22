/**
 * Admin table configurations — single source of truth for the generic CRUD UI.
 * Each entry maps a URL key to a real DB table and declares editable fields.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "json"
  | "image"
  | "markdown";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hideInList?: boolean;
  /** Render hint placeholder for forms */
  placeholder?: string;
}

export interface TableConfig {
  /** URL slug under /admin/<key> */
  key: string;
  /** Display label in the sidebar */
  label: string;
  /** Real DB table name */
  table: string;
  /** PK column (defaults to "id"). For Subscribers we use email. */
  pk: string;
  /** Columns shown in the list view (first 3-4 most useful) */
  listColumns: string[];
  /** All editable fields */
  fields: FieldDef[];
  /** Sort column for list view */
  orderBy?: string;
  orderAsc?: boolean;
  /** Disable creating new rows (for singletons like Site config) */
  noCreate?: boolean;
  /** Disable delete (e.g. for Subscribers we still allow; only for singletons) */
  noDelete?: boolean;
}

export const ADMIN_TABLES: TableConfig[] = [
  {
    key: "products",
    label: "Products",
    table: "Products",
    pk: "id",
    listColumns: ["id", "title", "category", "stock"],
    orderBy: "id",
    orderAsc: true,
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "category", label: "Category", type: "text", required: true },
      { key: "image", label: "Image URL", type: "image" },
      { key: "description", label: "Description", type: "textarea" },
      {
        key: "price",
        label: "Price (JSON)",
        type: "json",
        placeholder: '[{"type":"personal","amount":900,"duration":1}]',
      },
      { key: "stock", label: "In stock", type: "boolean" },
    ],
  },
  {
    key: "category",
    label: "Categories",
    table: "Category",
    pk: "id",
    listColumns: ["id", "name"],
    orderBy: "id",
    orderAsc: true,
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "images", label: "Image URL", type: "image" },
    ],
  },
  {
    key: "top-products",
    label: "Top Products",
    table: "Top Products",
    pk: "id",
    listColumns: ["id", "post_id", "top"],
    orderBy: "top",
    orderAsc: true,
    fields: [
      { key: "post_id", label: "Product ID", type: "number", required: true },
      { key: "top", label: "Rank (lower = higher)", type: "number" },
    ],
  },
  {
    key: "sliders",
    label: "Hero Sliders",
    table: "Sliders",
    pk: "id",
    listColumns: ["id", "images"],
    orderBy: "id",
    orderAsc: true,
    fields: [{ key: "images", label: "Image / Video URL", type: "image", required: true }],
  },
  {
    key: "banner",
    label: "Promo Banner",
    table: "Banner",
    pk: "id",
    listColumns: ["id", "title", "image"],
    orderBy: "id",
    orderAsc: true,
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "image", label: "Image URL", type: "image" },
    ],
  },
  {
    key: "site-config",
    label: "Site Config",
    table: "Site config",
    pk: "id",
    listColumns: ["id", "name", "title"],
    noCreate: true,
    noDelete: true,
    fields: [
      { key: "name", label: "Site name", type: "text" },
      { key: "title", label: "SEO title", type: "text" },
      { key: "slong", label: "Short tagline", type: "text" },
      { key: "description", label: "SEO description", type: "textarea" },
      { key: "logo", label: "Logo URL", type: "image" },
      { key: "og-image", label: "OG image URL", type: "image" },
      { key: "show_review", label: "Show reviews", type: "boolean" },
    ],
  },
  {
    key: "about",
    label: "About Pages",
    table: "All-About",
    pk: "id",
    listColumns: ["id", "AboutName"],
    orderBy: "id",
    orderAsc: true,
    fields: [
      { key: "AboutName", label: "Page name", type: "text", required: true },
      { key: "AboutMD", label: "Content (markdown)", type: "markdown" },
    ],
  },
  {
    key: "policies",
    label: "Policies",
    table: "All-Policy",
    pk: "id",
    listColumns: ["id", "PolicyName"],
    orderBy: "id",
    orderAsc: true,
    fields: [
      { key: "PolicyName", label: "Policy name", type: "text", required: true },
      { key: "PolicyMD", label: "Content (markdown)", type: "markdown" },
    ],
  },
  {
    key: "faq",
    label: "FAQ",
    table: "FAQ",
    pk: "id",
    listColumns: ["id", "question"],
    orderBy: "id",
    orderAsc: true,
    fields: [
      { key: "question", label: "Question", type: "text", required: true },
      { key: "answer", label: "Answer", type: "textarea", required: true },
    ],
  },
  {
    key: "contacts",
    label: "Contacts",
    table: "Connects",
    pk: "id",
    listColumns: ["id", "name", "link"],
    orderBy: "id",
    orderAsc: true,
    fields: [
      { key: "name", label: "Name (e.g. WhatsApp, Email)", type: "text", required: true },
      { key: "link", label: "Link / value", type: "text", required: true },
    ],
  },
  {
    key: "channels",
    label: "Channels",
    table: "Channels",
    pk: "id",
    listColumns: ["id", "name", "link"],
    orderBy: "id",
    orderAsc: true,
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "link", label: "Link", type: "text", required: true },
    ],
  },
  {
    key: "groups",
    label: "Groups",
    table: "Groups",
    pk: "id",
    listColumns: ["id", "name", "link"],
    orderBy: "id",
    orderAsc: true,
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "link", label: "Link", type: "text", required: true },
    ],
  },
  {
    key: "socials",
    label: "Social Platforms",
    table: "Social Platforms",
    pk: "id",
    listColumns: ["id", "Name", "Link"],
    orderBy: "id",
    orderAsc: true,
    fields: [
      { key: "Name", label: "Name", type: "text", required: true },
      { key: "Link", label: "Link", type: "text", required: true },
    ],
  },
  {
    key: "reviews",
    label: "Reviews",
    table: "Reviews",
    pk: "id",
    listColumns: ["id", "FullName", "star", "product_id"],
    orderBy: "id",
    orderAsc: false,
    fields: [
      { key: "FullName", label: "Customer name", type: "text", required: true },
      { key: "star", label: "Stars (1-5)", type: "number", required: true },
      { key: "description", label: "Review text", type: "textarea" },
      { key: "profile", label: "Profile image URL", type: "image" },
      { key: "product_id", label: "Product ID", type: "number" },
    ],
  },
  {
    key: "subscribers",
    label: "Subscribers",
    table: "Subscribers",
    pk: "email",
    listColumns: ["email", "ip", "created_at"],
    orderBy: "created_at",
    orderAsc: false,
    noCreate: true,
    fields: [
      { key: "email", label: "Email", type: "text", required: true },
      { key: "ip", label: "IP", type: "text" },
    ],
  },
];

export const getTableConfig = (key: string) =>
  ADMIN_TABLES.find((t) => t.key === key);

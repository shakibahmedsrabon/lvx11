const WHATSAPP_NUMBER = "8801570210107";
const SITE_URL = "https://lvx11.lovable.app";

export const buildWhatsAppUrl = (items: { name: string; price: string; quantity?: number; slug?: string }[]) => {
  let message = "Hi! I'd like to order the following from LINEA Jewelry:\n\n";
  items.forEach((item) => {
    const qty = item.quantity && item.quantity > 1 ? ` (×${item.quantity})` : "";
    const productUrl = item.slug ? `${SITE_URL}/product/${item.slug}` : "";
    message += `• ${item.name} - ${item.price}${qty}${productUrl ? `\n  ${productUrl}` : ""}\n`;
  });
  message += `\nSent from: ${SITE_URL}${typeof window !== "undefined" ? window.location.pathname : ""}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

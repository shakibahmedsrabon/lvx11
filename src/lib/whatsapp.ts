const WHATSAPP_NUMBER = "8801570210107";
const SITE_URL = "https://lvx11.lovable.app";

export const buildWhatsAppUrl = (items: { name: string; price: string; quantity?: number }[]) => {
  let message = "Hi! I'd like to order the following from LINEA Jewelry:\n\n";
  items.forEach((item) => {
    const qty = item.quantity && item.quantity > 1 ? ` (×${item.quantity})` : "";
    message += `• ${item.name} - ${item.price}${qty}\n`;
  });
  message += `\nWebsite: ${SITE_URL}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

/**
 * WhatsApp checkout message builder.
 *
 * Generates a professional receipt-style message with:
 * - Product name, duration (months), unit price, qty, line total
 * - Grand total at the bottom
 */

const WHATSAPP_NUMBER = "8801570210107";
const SITE_URL = "https://lvx11.lovable.app";

interface WhatsAppItem {
  name: string;
  price: string;
  quantity?: number;
  slug?: string;
  /** Selected duration in months */
  duration?: number;
  /** Numeric unit price for total calculation */
  unitPrice?: number;
}

export const buildWhatsAppUrl = (items: WhatsAppItem[]) => {
  let message = "Hi! I'd like to order the following from LINEA Jewelry:\n\n";

  let grandTotal = 0;

  items.forEach((item, idx) => {
    const qty = item.quantity || 1;
    const dur = item.duration || 1;
    const durLabel = dur === 1 ? "1 month" : `${dur} months`;
    const lineTotal = (item.unitPrice || 0) * qty;
    grandTotal += lineTotal;

    const productUrl = item.slug ? `${SITE_URL}/product/${item.slug}` : "";
    message += `${idx + 1}. ${item.name}\n`;
    message += `   Duration: ${durLabel} · ${item.price}/ea\n`;
    if (qty > 1) message += `   Qty: ${qty}\n`;
    message += `   Subtotal: ৳${lineTotal.toLocaleString()}\n`;
    if (productUrl) message += `   ${productUrl}\n`;
    message += "\n";
  });

  if (grandTotal > 0) {
    message += `──────────────\n`;
    message += `Total: ৳${grandTotal.toLocaleString()}\n\n`;
  }

  message += `Sent from: ${SITE_URL}${typeof window !== "undefined" ? window.location.pathname : ""}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

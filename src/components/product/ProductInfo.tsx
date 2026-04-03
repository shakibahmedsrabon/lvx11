/**
 * ProductInfo — displays product details with duration-based pricing.
 *
 * Pricing logic:
 * - Each product has a `prices` map: { months: price } (e.g. {1:400, 2:700, 3:800, 6:1200, 12:1200})
 * - Available durations come ONLY from the JSON keys (not incremental)
 * - Default = first (lowest) duration
 * - User selects from available duration options
 * - Displayed price = prices[selectedDuration]
 */

import { useState } from "react";
import AppLink from "@/lib/navigation/AppLink";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Minus, Plus, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Product, formatPrice } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  /** Index into product.availableDurations — default is 0 (first/shortest duration) */
  const [durationIndex, setDurationIndex] = useState(0);
  const { addToCart, toggleFavorite, isFavorite, getItemQuantity } = useCart();
  const { toast } = useToast();

  const selectedDuration = product.availableDurations[durationIndex];
  const currentPrice = product.prices[selectedDuration] || 0;
  const displayPrice = formatPrice(currentPrice);

  /** Move to previous available duration */
  const prevDuration = () => {
    setDurationIndex((i) => Math.max(0, i - 1));
  };
  /** Move to next available duration */
  const nextDuration = () => {
    setDurationIndex((i) => Math.min(product.availableDurations.length - 1, i + 1));
  };

  const cartProduct = {
    id: product.id,
    name: product.title,
    price: displayPrice,
    unitPrice: currentPrice,
    duration: selectedDuration,
    image: product.image,
    category: product.category,
  };

  const vibrate = (pattern: number | number[]) => {
    if (navigator.vibrate) navigator.vibrate(pattern);
  };

  const incrementQuantity = () => { vibrate(50); setQuantity((prev) => prev + 1); };
  const decrementQuantity = () => { vibrate(50); setQuantity((prev) => Math.max(1, prev - 1)); };

  const handleAddToCart = () => {
    vibrate([40, 20, 40]);
    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct);
    }
    toast({
      title: "Added to bag",
      description: `${product.title} (${selectedDuration} mo × ${quantity}) added.`,
    });
    setQuantity(1);
  };

  const handleToggleFavorite = () => {
    vibrate([30, 20, 50]);
    toggleFavorite(cartProduct);
    toast({
      title: isFavorite(product.id) ? "Removed from favorites" : "Added to favorites",
      description: `${product.title} has been ${isFavorite(product.id) ? "removed from" : "added to"} your favorites.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb — desktop only */}
      <div className="hidden lg:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <AppLink href="/">Home</AppLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <AppLink href={`/category/${product.category.toLowerCase()}`}>{product.category}</AppLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Product title + price */}
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-light text-muted-foreground mb-1">{product.category}</p>
            <h1 className="text-2xl md:text-3xl font-light text-foreground">{product.title}</h1>
          </div>
          <p className="text-xl font-light text-foreground">{displayPrice}</p>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="space-y-4 py-4 border-b border-border">
          <p className="text-sm font-light text-muted-foreground">{product.description}</p>
        </div>
      )}

      {/* Duration selector — pill-style buttons for available durations */}
      {product.availableDurations.length > 1 && (
        <div className="py-4 border-b border-border">
          <span className="text-sm font-light text-foreground mb-3 block">Duration</span>
          <div className="flex flex-wrap gap-2">
            {product.availableDurations.map((dur, idx) => (
              <button
                key={dur}
                onClick={() => { vibrate(30); setDurationIndex(idx); }}
                className={cn(
                  "px-4 py-2 text-sm border transition-colors",
                  idx === durationIndex
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-foreground hover:border-foreground"
                )}
              >
                {dur} {dur === 1 ? "month" : "months"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Out of stock notice */}
      {!product.stock && (
        <div className="py-2">
          <p className="text-sm font-medium text-destructive">Out of Stock</p>
        </div>
      )}

      {/* Quantity selector + Add to cart + Favorite */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-light text-foreground">Quantity</span>
          <div className="flex items-center border border-border">
            <Button
              variant="ghost" size="sm" onClick={decrementQuantity}
              className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="h-10 flex items-center px-4 text-sm font-light min-w-12 justify-center border-l border-r border-border">
              {quantity}
            </span>
            <Button
              variant="ghost" size="sm" onClick={incrementQuantity}
              className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <button
            onClick={handleAddToCart}
            className="p-2 text-foreground hover:text-muted-foreground transition-colors relative"
            aria-label="Add to bag"
            disabled={!product.stock}
          >
            <div className="relative w-5 h-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <Plus className="absolute -bottom-0.5 -right-1 w-2.5 h-2.5 text-foreground" strokeWidth={3} />
            </div>
            {getItemQuantity(product.id) > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-foreground text-background text-[0.6rem] font-medium rounded-full flex items-center justify-center">
                {getItemQuantity(product.id) > 9 ? '9+' : getItemQuantity(product.id)}
              </span>
            )}
          </button>
          <button
            onClick={handleToggleFavorite}
            className="p-2 text-foreground hover:text-muted-foreground transition-colors"
            aria-label={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className="w-5 h-5" fill={isFavorite(product.id) ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Buy Now — sends selected duration + price via WhatsApp */}
        <Button
          className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-light rounded-none tracking-wide"
          disabled={!product.stock}
          onClick={() => {
            const url = buildWhatsAppUrl([{
              name: `${product.title} (${selectedDuration} ${selectedDuration === 1 ? "month" : "months"})`,
              price: displayPrice,
              quantity,
              slug: product.slug,
            }]);
            window.open(url, "_blank");
          }}
        >
          {product.stock ? "Buy Now" : "Out of Stock"}
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;

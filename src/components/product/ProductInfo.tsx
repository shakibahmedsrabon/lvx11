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
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Minus, Plus, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/data/products";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, toggleFavorite, isFavorite, getItemQuantity } = useCart();
  const { toast } = useToast();

  const cartProduct = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category,
  };

  const vibrate = (pattern: number | number[]) => {
    if (navigator.vibrate) navigator.vibrate(pattern);
  };

  const incrementQuantity = () => { vibrate(50); setQuantity(prev => prev + 1); };
  const decrementQuantity = () => { vibrate(50); setQuantity(prev => Math.max(1, prev - 1)); };

  const handleAddToCart = () => {
    vibrate([100, 30, 100]);
    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct);
    }
    toast({
      title: "Added to bag",
      description: `${product.name} (×${quantity}) has been added to your bag.`,
    });
    setQuantity(1);
  };

  const handleToggleFavorite = () => {
    vibrate([50, 30, 100]);
    toggleFavorite(cartProduct);
    toast({
      title: isFavorite(product.id) ? "Removed from favorites" : "Added to favorites",
      description: `${product.name} has been ${isFavorite(product.id) ? "removed from" : "added to"} your favorites.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb - Show only on desktop */}
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
                <AppLink href="/category/earrings">Earrings</AppLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Pantheon</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Product title and price */}
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-light text-muted-foreground mb-1">{product.category}</p>
            <h1 className="text-2xl md:text-3xl font-light text-foreground">{product.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-xl font-light text-foreground">{product.price}</p>
          </div>
        </div>
      </div>

      {/* Product details */}
      <div className="space-y-4 py-4 border-b border-border">
        <div className="space-y-2">
          <h3 className="text-sm font-light text-foreground">Material</h3>
          <p className="text-sm font-light text-muted-foreground">18k Gold Plated Sterling Silver</p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-light text-foreground">Dimensions</h3>
          <p className="text-sm font-light text-muted-foreground">2.5cm x 1.2cm</p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-light text-foreground">Weight</h3>
          <p className="text-sm font-light text-muted-foreground">4.2g per earring</p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-light text-foreground">Editor's notes</h3>
          <p className="text-sm font-light text-muted-foreground italic">"A modern interpretation of classical architecture, these earrings bridge timeless elegance with contemporary minimalism."</p>
        </div>
      </div>

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-light text-foreground">Quantity</span>
          <div className="flex items-center border border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={decrementQuantity}
              className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="h-10 flex items-center px-4 text-sm font-light min-w-12 justify-center border-l border-r border-border">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={incrementQuantity}
              className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <button
            onClick={handleAddToCart}
            className="p-2 text-foreground hover:text-muted-foreground transition-colors relative"
            aria-label="Add to bag"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {getItemQuantity(product.id) > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-foreground text-background text-[0.6rem] font-medium rounded-full flex items-center justify-center">
                {getItemQuantity(product.id)}
              </span>
            )}
          </button>
          <button
            onClick={handleToggleFavorite}
            className="p-2 text-foreground hover:text-muted-foreground transition-colors"
            aria-label={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className="w-5 h-5" 
              fill={isFavorite(product.id) ? "currentColor" : "none"}
            />
          </button>
        </div>

        <Button 
          className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-light rounded-none tracking-wide"
          onClick={() => {
            const url = buildWhatsAppUrl([{ name: product.name, price: product.price, quantity, slug: product.slug }]);
            window.open(url, "_blank");
          }}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;

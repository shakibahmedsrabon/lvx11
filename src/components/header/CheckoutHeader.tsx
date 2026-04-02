import AppLink from "@/lib/navigation/AppLink";
import { ChevronLeft } from "lucide-react";
import { useSiteConfig } from "@/hooks/useSiteConfig";

const CheckoutHeader = () => {
  const { config: siteConfig } = useSiteConfig();
  return (
    <header className="w-full bg-background border-b border-muted-foreground/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="relative flex items-center justify-between">
          {/* Left side - Continue Shopping */}
          <AppLink 
            href="/" 
            className="flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm font-light hidden sm:inline">Continue Shopping</span>
          </AppLink>

          {/* Center - Logo - Absolutely positioned to ensure perfect centering */}
          <AppLink href="/" className="absolute left-1/2 transform -translate-x-1/2">
            {siteConfig?.logo && (
              <img 
                src={siteConfig.logo} 
                alt={siteConfig?.name || ""} 
                className="h-6 w-auto"
              />
            )}
          </AppLink>

          {/* Right side - Support */}
          <div className="text-sm font-light text-foreground">
            Support
          </div>
        </div>
      </div>
    </header>
  );
};

export default CheckoutHeader;
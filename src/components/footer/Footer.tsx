import { useState, useEffect } from "react";
import AppLink from "@/lib/navigation/AppLink";
import { siteConfig } from "@/config/site";
import { footerLinks } from "@/data/navigation";
import { supabase } from "@/integrations/supabase/client";

interface Contact {
  id: number;
  name: string | null;
  link: string | null;
}

const Footer = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const { data, error } = await (supabase as any).from('Contacts').select('*');
      if (!error && data) setContacts(data);
    };
    fetchContacts();
  }, []);

  return (
    <footer className="w-full bg-background text-foreground pt-8 pb-2 px-6 border-t border-border mt-48">
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
          <div>
            <img
              src={siteConfig.logoFull}
              alt={siteConfig.name}
              className="mb-4 h-6 w-auto"
              loading="lazy"
            />
            <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md mb-6">
              {siteConfig.tagline}
            </p>

            <address className="not-italic space-y-2 text-sm font-light text-muted-foreground">
              <div>
                <p className="font-normal text-foreground mb-1">Visit Us</p>
                <p>{siteConfig.contact.address.street}</p>
                <p>{siteConfig.contact.address.city}, {siteConfig.contact.address.state} {siteConfig.contact.address.zip}</p>
              </div>
              <div>
                <p className="font-normal text-foreground mb-1 mt-3">Contact</p>
                <p><a href={`tel:${siteConfig.contact.phone}`} className="hover:text-foreground transition-colors">{siteConfig.contact.phone}</a></p>
                <p><a href={`mailto:${siteConfig.contact.email}`} className="hover:text-foreground transition-colors">{siteConfig.contact.email}</a></p>
              </div>
            </address>
          </div>

          <nav aria-label="Footer navigation" className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm font-normal mb-4">Shop</h4>
              <ul className="space-y-2">
                {footerLinks.shop.map((link) => (
                  <li key={link.href}>
                    <AppLink href={link.href} className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-normal mb-4">Support</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link, i) => (
                  <li key={`${link.href}-${i}`}>
                    <AppLink href={link.href} className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-normal mb-4">Connect</h4>
              <ul className="space-y-2">
                {footerLinks.connect.map((link) => (
                  <li key={link.href}>
                    <AppLink
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>

      <div className="border-t border-border -mx-6 px-6 pt-2">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm font-light text-foreground mb-1 md:mb-0">
            © 2024 Linea. All rights reserved. Template made by{" "}
            <a href="https://www.liljeros.co" target="_blank" rel="noopener noreferrer" className="hover:text-muted-foreground transition-colors underline">
              Rickard Liljeros
            </a>
          </p>
          <div className="flex space-x-6">
            <AppLink href="/privacy-policy" className="text-sm font-light text-foreground hover:text-muted-foreground transition-colors">
              Privacy Policy
            </AppLink>
            <AppLink href="/terms-of-service" className="text-sm font-light text-foreground hover:text-muted-foreground transition-colors">
              Terms of Service
            </AppLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

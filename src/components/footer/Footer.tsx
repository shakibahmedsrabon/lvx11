import { useState, useEffect } from "react";
import AppLink from "@/lib/navigation/AppLink";
import { footerLinks } from "@/data/navigation";
import { supabase } from "@/integrations/supabase/client";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import NewsletterSubscribe from "./NewsletterSubscribe";

interface Contact {
  id: number;
  name: string | null;
  link: string | null;
}

interface Channel {
  id: number;
  name: string | null;
  link: string | null;
}

const cleanContactDisplay = (value: string): string => {
  return value
    .replace(/^mailto:/i, '')
    .replace(/^tel:\+?/i, '')
    .replace(/^\+/, '')
    .trim();
};

const Footer = () => {
  const { config: siteConfig } = useSiteConfig();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const { data, error } = await (supabase as any).from('Connects').select('*');
      if (!error && data) setContacts(data);
    };
    const fetchChannels = async () => {
      const { data, error } = await (supabase as any).from('Channels').select('*');
      if (!error && data) setChannels(data);
    };
    fetchContacts();
    fetchChannels();
  }, []);

  return (
    <footer className="w-full bg-background text-foreground pt-8 pb-2 px-6 border-t border-border mt-48">
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
          <div>
            {siteConfig?.logoFull && (
              <img
                src={siteConfig.logoFull}
                alt={siteConfig?.name || ""}
                className="mb-4 h-6 w-auto"
                loading="lazy"
              />
            )}
            {siteConfig?.slong && (
              <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md mb-6">
                {siteConfig.slong}
              </p>
            )}

            <NewsletterSubscribe />

            {contacts.length > 0 ? (
              <div className="space-y-2 text-sm font-light text-muted-foreground">
                <p className="font-normal text-foreground mb-1">Contact</p>
                {contacts.map((contact) => {
                  const displayName = contact.name 
                    ? cleanContactDisplay(contact.name) 
                    : contact.link 
                      ? cleanContactDisplay(contact.link) 
                      : '';
                  return (
                    <div key={contact.id}>
                      {contact.link ? (
                        <a href={contact.link} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors cursor-pointer">
                          {displayName}
                        </a>
                      ) : (
                        <span>{displayName}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2 text-sm font-light text-muted-foreground">
                <p className="font-normal text-foreground mb-1">Contact</p>
                <p>No contact info available</p>
              </div>
            )}
          </div>

          <nav aria-label="Footer navigation" className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div>
              <h4 className="text-sm font-normal mb-4">Support</h4>
              <ul className="space-y-2">
                {contacts
                  .filter((c) => {
                    const link = c.link?.toLowerCase() || '';
                    return link.startsWith('tel:') || link.includes('wa.me');
                  })
                  .map((contact) => (
                    <li key={contact.id}>
                      <a
                        href={contact.link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {contact.name}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-normal mb-4">Channels</h4>
              <ul className="space-y-2">
                {channels.length > 0 ? channels.map((channel) => (
                  <li key={channel.id}>
                    <a
                      href={channel.link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {channel.name}
                    </a>
                  </li>
                )) : footerLinks.connect.map((link) => (
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

      <div className="border-t border-border -mx-6 px-6 pt-4 pb-4">
        <div className="flex flex-col items-center text-center gap-3 md:flex-row md:justify-between md:text-left">
          <p className="text-xs font-light text-muted-foreground">
            © 2025–{new Date().getFullYear()} {siteConfig?.name || ''}. All Rights Reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <AppLink href="/privacy-policy" className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </AppLink>
            <AppLink href="/terms-of-service" className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </AppLink>
            <AppLink href="/refund-exchange-policy" className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors">
              Refund & Exchange
            </AppLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

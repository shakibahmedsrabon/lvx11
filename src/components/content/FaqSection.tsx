import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AppLink from "@/lib/navigation/AppLink";

interface FAQ {
  id: number;
  question: string | null;
  answer: string | null;
}

const FaqSection = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (supabase as any)
      .from("FAQ")
      .select("*")
      .order("id", { ascending: true })
      .limit(5)
      .then(({ data, error }: any) => {
        if (!error && data) setFaqs(data);
        setLoading(false);
      });
  }, []);

  if (loading || faqs.length === 0) return null;

  return (
    <section className="w-full px-6 mb-16" aria-label="Frequently asked questions">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-sm font-light text-foreground tracking-wide uppercase">
            Frequently Asked
          </h2>
          <AppLink
            href="/about/faq"
            className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </AppLink>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={`faq-${faq.id}`}
              className="border border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left hover:no-underline text-sm font-light">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm font-light text-muted-foreground whitespace-pre-line">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;

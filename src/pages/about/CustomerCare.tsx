import { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import AboutSidebar from "../../components/about/AboutSidebar";
import { supabase } from "@/integrations/supabase/client";

interface Contact {
  id: number;
  name: string | null;
  link: string | null;
}

interface FAQ {
  id: number;
  question: string | null;
  answer: string | null;
}

const CustomerCare = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [faqsLoading, setFaqsLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      const { data, error } = await (supabase as any).from('Contacts').select('*');
      if (!error && data) setContacts(data);
      setLoading(false);
    };
    const fetchFaqs = async () => {
      const { data, error } = await (supabase as any).from('FAQ').select('*');
      if (!error && data) setFaqs(data);
      setFaqsLoading(false);
    };
    fetchContacts();
    fetchFaqs();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>
        
        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
        <PageHeader 
          title="Customer Care" 
          subtitle="We're here to help you with all your jewelry needs"
        />
        
        <ContentSection title="Contact Information">
          {loading ? (
            <p className="text-muted-foreground">Loading contacts...</p>
          ) : contacts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {contacts.map((contact) => (
                <div key={contact.id} className="space-y-2">
                  {contact.link ? (
                    <a
                      href={contact.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-light text-foreground hover:text-muted-foreground transition-colors cursor-pointer"
                    >
                      {contact.name || contact.link}
                    </a>
                  ) : (
                    <h3 className="text-lg font-light text-foreground">{contact.name}</h3>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No contacts available.</p>
          )}
        </ContentSection>

        <ContentSection title="Frequently Asked Questions">
          {faqsLoading ? (
            <p className="text-muted-foreground">Loading FAQs...</p>
          ) : faqs.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="border border-border rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted-foreground">No FAQs available.</p>
          )}
        </ContentSection>

        <ContentSection title="Contact Form">
          <div>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-light text-foreground">First Name</label>
                  <Input className="rounded-none" placeholder="Enter your first name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-light text-foreground">Last Name</label>
                  <Input className="rounded-none" placeholder="Enter your last name" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-light text-foreground">Email</label>
                <Input type="email" className="rounded-none" placeholder="Enter your email" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-light text-foreground">Order Number (Optional)</label>
                <Input className="rounded-none" placeholder="Enter your order number if applicable" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-light text-foreground">How can we help you?</label>
                <Textarea 
                  className="rounded-none min-h-[120px]" 
                  placeholder="Please describe your inquiry in detail"
                />
              </div>
              
              <Button type="submit" className="w-full rounded-none">
                Send Message
              </Button>
            </form>
          </div>
        </ContentSection>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default CustomerCare;
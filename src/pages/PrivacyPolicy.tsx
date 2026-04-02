import { useEffect, useState } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { supabase } from "@/integrations/supabase/client";

interface PrivacyData {
  id: number;
  created_at: string;
  privacy: string | null;
  policy: string | null;
}

const PrivacyPolicy = () => {
  const [data, setData] = useState<PrivacyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Privacy Policy - Linea Jewelry";
    
    const fetchData = async () => {
      const { data: result, error } = await (supabase as any)
        .from('Privacy and Policy')
        .select('*');
      
      if (error) {
        console.error('Error fetching privacy data:', error);
      } else {
        setData((result as any) || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-6">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-light text-foreground mb-4">Privacy Policy</h1>
          </header>

          {loading ? (
            <p className="text-muted-foreground text-center">Loading...</p>
          ) : data.length === 0 ? (
            <p className="text-muted-foreground text-center">No content available.</p>
          ) : (
            <div className="prose prose-lg max-w-none space-y-8">
              {data.map((item) => (
                <div key={item.id} className="space-y-8">
                  {item.privacy && (
                    <section>
                      <h2 className="text-2xl font-light text-foreground mb-4">Privacy</h2>
                      <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {item.privacy}
                      </div>
                    </section>
                  )}
                  {item.policy && (
                    <section>
                      <h2 className="text-2xl font-light text-foreground mb-4">Policy</h2>
                      <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {item.policy}
                      </div>
                    </section>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
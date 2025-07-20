import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { SEOHead } from '@/components/seo/seo-head';
import QuoteWizard from '@/components/QuoteWizard';

export default function Quotation() {
  return (
    <>
      <SEOHead 
        title="Get Your Boiler Quote - Britannia Forge"
        description="Get an instant, accurate boiler replacement quote with our intelligent pricing system. Professional Gas Safe installation across the UK."
        canonical="https://britanniaforge.co.uk/quotation"
      />
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <QuoteWizard />
        </main>
        <Footer />
      </div>
    </>
  );
}
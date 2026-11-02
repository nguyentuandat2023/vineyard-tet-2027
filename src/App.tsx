import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BrandIntro } from './components/BrandIntro';
import { ProductCollection } from './components/ProductCollection';
import { CorporateGifting } from './components/CorporateGifting';
import { Customization } from './components/Customization';
import { BulkOrder } from './components/BulkOrder';
import { OrderingProcess } from './components/OrderingProcess';
import { ProductGallery } from './components/ProductGallery';
import { FAQ } from './components/FAQ';
import { LeadForm } from './components/LeadForm';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { PolicyModal } from './components/PolicyModal';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>();
  const [selectedTier, setSelectedTier] = useState<string | undefined>();
  const [selectedNote, setSelectedNote] = useState<string | undefined>();
  const [policyType, setPolicyType] = useState<'privacy' | 'terms' | null>(null);

  const scrollToQuote = (product?: string, tier?: string, note?: string) => {
    if (product) setSelectedProduct(product);
    if (tier) setSelectedTier(tier);
    if (note) setSelectedNote(note);

    const el = document.getElementById('quote-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCollection = () => {
    const el = document.getElementById('collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3EC] text-[#282321] selection:bg-[#B52C32] selection:text-white">
      {/* SECTION 01 – HEADER */}
      <Header onOpenQuote={() => scrollToQuote()} />

      <main className="flex-1">
        {/* SECTION 02 – HERO BANNER */}
        <Hero
          onOpenQuote={() => scrollToQuote()}
          onExploreCollection={scrollToCollection}
        />

        {/* SECTION 03 – BRAND INTRODUCTION */}
        <BrandIntro />

        {/* SECTION 04 – PRODUCT COLLECTION */}
        <ProductCollection
          onSelectProductForQuote={(prodName) => scrollToQuote(prodName)}
        />

        {/* SECTION 05 – CORPORATE GIFTING */}
        <CorporateGifting
          onOpenQuote={() => scrollToQuote()}
        />

        {/* SECTION 06 – CUSTOMIZATION */}
        <Customization
          onOpenQuote={(note) => scrollToQuote(undefined, undefined, note)}
        />

        {/* SECTION 07 – BULK ORDER */}
        <BulkOrder
          onSelectTier={(tier) => scrollToQuote(undefined, tier)}
        />

        {/* SECTION 08 – ORDERING PROCESS */}
        <OrderingProcess
          onOpenQuote={() => scrollToQuote()}
        />

        {/* SECTION 09 – PRODUCT GALLERY */}
        <ProductGallery />

        {/* SECTION 10 – FAQ */}
        <FAQ />

        {/* SECTION 11 – LEAD FORM */}
        <LeadForm
          preselectedProduct={selectedProduct}
          preselectedTier={selectedTier}
          preselectedNote={selectedNote}
        />
      </main>

      {/* SECTION 12 – FOOTER */}
      <Footer
        onOpenPolicy={(type) => setPolicyType(type)}
        onScrollToTop={scrollToTop}
      />

      {/* FLOATING ACTION HUBS (Hotline, Zalo, Back-to-top, Mobile sticky bar) */}
      <FloatingActions
        onOpenQuote={() => scrollToQuote()}
        onScrollToTop={scrollToTop}
      />

      {/* POLICY MODALS */}
      <PolicyModal
        type={policyType}
        onClose={() => setPolicyType(null)}
      />
    </div>
  );
}

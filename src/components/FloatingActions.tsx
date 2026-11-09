import React, { useState, useEffect } from 'react';
import { Phone, ChevronUp, MessageCircle, FileText } from 'lucide-react';
import { BRAND_INFO } from '../data/products';
import { trackPhoneClick, trackZaloClick, trackCtaClick } from '../utils/analytics';

interface FloatingActionsProps {
  onOpenQuote: () => void;
  onScrollToTop: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  onOpenQuote,
  onScrollToTop,
}) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Floating Side Action Bubbles - Only visible on Desktop & Tablet (lg+) to avoid mobile collision */}
      <div className="hidden lg:flex fixed bottom-8 right-6 z-40 flex-col items-end gap-3 pointer-events-auto">
        {/* Zalo Button */}
        <a
          href={BRAND_INFO.zaloLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackZaloClick(BRAND_INFO.zalo, 'Desktop Floating Button')}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0068FF] text-white shadow-xl hover:bg-[#0054d1] transition-all transform hover:scale-105 active:scale-95"
          aria-label="Tư vấn quà Tết qua Zalo"
        >
          <MessageCircle className="w-4 h-4 text-white" />
          <span className="text-xs font-semibold whitespace-nowrap">
            Zalo: {BRAND_INFO.zalo}
          </span>
        </a>

        {/* Hotline Call Button */}
        <a
          href={`tel:${BRAND_INFO.hotlineRaw}`}
          onClick={() => trackPhoneClick(BRAND_INFO.hotlineRaw, 'Desktop Floating Button')}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#B52C32] text-white shadow-xl hover:bg-[#8e1d23] transition-all transform hover:scale-105 active:scale-95"
          aria-label="Gọi điện thoại trực tiếp tư vấn báo giá"
        >
          <Phone className="w-4 h-4 text-[#E8D5A7]" />
          <span className="text-xs font-semibold whitespace-nowrap">
            Hotline: {BRAND_INFO.hotline}
          </span>
        </a>

        {/* Back to top button */}
        {showBackToTop && (
          <button
            onClick={onScrollToTop}
            className="p-3 rounded-full bg-stone-900/90 text-stone-200 hover:bg-black hover:text-white shadow-lg transition-all transform hover:scale-105"
            aria-label="Cuộn lên đầu trang"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mobile Sticky Bottom Bar (Exclusively on mobile/tablet < lg) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F7F3EC]/95 backdrop-blur-md border-t border-[#C49B43]/30 px-3 py-2 shadow-2xl flex items-center justify-between gap-2">
        <a
          href={`tel:${BRAND_INFO.hotlineRaw}`}
          onClick={() => trackPhoneClick(BRAND_INFO.hotlineRaw, 'Mobile Sticky Bar')}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-[#68151F] bg-white border border-[#68151F]/30 shadow-xs"
        >
          <Phone className="w-3.5 h-3.5 text-[#B52C32]" />
          <span>Hotline</span>
        </a>

        <a
          href={BRAND_INFO.zaloLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackZaloClick(BRAND_INFO.zalo, 'Mobile Sticky Bar')}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0068FF] shadow-xs"
        >
          <MessageCircle className="w-3.5 h-3.5 text-white" />
          <span>Zalo</span>
        </a>

        <button
          onClick={() => {
            trackCtaClick('Nhận Báo Giá', 'Mobile Sticky Bar Button');
            onOpenQuote();
          }}
          className="flex-1.5 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#B52C32] shadow-sm"
        >
          <FileText className="w-3.5 h-3.5 text-[#E8D5A7]" />
          <span>Báo Giá</span>
        </button>
      </div>
    </>
  );
};

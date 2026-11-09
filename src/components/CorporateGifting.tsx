import React from 'react';
import { Users, Sparkles, Boxes, Truck, ArrowRight } from 'lucide-react';
import { CORPORATE_PILLARS } from '../data/products';

interface CorporateGiftingProps {
  onOpenQuote: () => void;
}

export const CorporateGifting: React.FC<CorporateGiftingProps> = ({ onOpenQuote }) => {
  const iconMap: Record<string, React.ReactNode> = {
    Crown: <Users className="w-6 h-6 text-[#C49B43]" />,
    Sparkles: <Sparkles className="w-6 h-6 text-[#C49B43]" />,
    Boxes: <Boxes className="w-6 h-6 text-[#C49B43]" />,
    Truck: <Truck className="w-6 h-6 text-[#C49B43]" />,
  };

  return (
    <section id="corporate" className="py-20 bg-[#68151F] text-white relative overflow-hidden scroll-mt-24 lg:scroll-mt-28">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4A0C14] via-[#68151F] to-[#36070C] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/30 border border-[#C49B43]/30 text-[#E8D5A7] text-xs font-semibold tracking-widest uppercase mb-3">
            <span>Corporate Solutions · Tết 2027</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 font-display text-white">
            GIẢI PHÁP QUÀ TẶNG DOANH NGHIỆP
          </h2>

          <p className="text-[#E8D5A7] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-display">
            Đồng hành cùng doanh nghiệp trong việc lựa chọn những món quà chỉn chu, sang trọng và ý nghĩa dành cho đối tác, khách hàng.
          </p>
        </div>

        {/* Corporate High-End Visual Feature */}
        <div className="mb-14 rounded-2xl overflow-hidden border border-[#C49B43]/30 shadow-2xl bg-black/40">
          <img
            src="/assets/aistudio/Qu__T_ng_Doanh_Nghi_p___ng_C_p_1eca349a.png"
            alt="Giải pháp quà tặng doanh nghiệp đẳng cấp - Vineyard.vn"
            className="w-full h-auto object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORPORATE_PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="bg-black/25 backdrop-blur-sm rounded-2xl p-6 border border-[#C49B43]/30 hover:border-[#C49B43]/70 hover:bg-black/35 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-[#68151F] border border-[#C49B43]/40">
                    {iconMap[pillar.icon] || <Sparkles className="w-6 h-6 text-[#C49B43]" />}
                  </div>
                  <span className="font-mono text-sm font-bold text-[#E8D5A7]/60">
                    {pillar.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 font-display">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#E8D5A7]">
                <span className="font-medium">Tiêu chuẩn B2B</span>
                <span className="text-[#C49B43]">✓ Đã chứng nhận</span>
              </div>
            </div>
          ))}
        </div>

        {/* Section Action */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenQuote}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold text-white bg-[#B52C32] hover:bg-[#8e1d23] transition-colors shadow-lg active:scale-98"
          >
            <span>Tư Vấn Giải Pháp Cho Doanh Nghiệp</span>
            <ArrowRight className="w-4 h-4 text-[#E8D5A7]" />
          </button>
        </div>
      </div>
    </section>
  );
};

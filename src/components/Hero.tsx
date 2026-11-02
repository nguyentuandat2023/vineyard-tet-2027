import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Building2, Truck } from 'lucide-react';

interface HeroProps {
  onOpenQuote: () => void;
  onExploreCollection: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuote, onExploreCollection }) => {
  return (
    <section id="hero" className="relative bg-[#68151F] text-[#F7F3EC] overflow-hidden pt-6 pb-16 lg:py-20">
      {/* Background radial gradient glow & subtle texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#8E1F2A]/60 via-[#68151F] to-[#36070C] pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C49B43_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Brand message, CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Subtle editorial kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3B0B11]/80 border border-[#C49B43]/40 text-[#E8D5A7] text-xs font-medium tracking-widest uppercase mb-5 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C49B43]" />
              <span>Vineyard Royal Signature · Tết Hamper 2027</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] mb-5 font-display text-balance">
              QUÀ TẾT DOANH NGHIỆP <span className="text-gold-gradient italic">2027</span>
            </h1>

            <p className="text-xl sm:text-2xl text-[#E8D5A7] font-medium tracking-wide mb-4 font-display">
              Trao tinh hoa – Gắn kết thịnh vượng.
            </p>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
              Những bộ quà HAMPER cao cấp được tuyển chọn công phu dành riêng cho doanh nghiệp, đối tác chiến lược và khách hàng tri ân. Kết hợp giữa tinh hoa rượu vang nhập khẩu và nghệ thuật bao bì thủ công hoàng gia.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <button
                onClick={onOpenQuote}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wider text-white bg-[#B52C32] hover:bg-[#972228] transition-all duration-200 shadow-lg shadow-[#36070C]/50 hover:shadow-xl hover:shadow-[#B52C32]/30 active:scale-98"
              >
                <span>Nhận Báo Giá Ngay</span>
                <ArrowRight className="w-4 h-4 text-[#E8D5A7]" />
              </button>

              <button
                onClick={onExploreCollection}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-sm font-medium tracking-wider text-[#E8D5A7] border border-[#C49B43]/50 hover:bg-[#C49B43]/15 transition-all duration-200 active:scale-98"
              >
                <span>Khám Phá Bộ Sưu Tập</span>
              </button>
            </div>

            {/* 4 Micro Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-6 border-t border-[#C49B43]/25">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-[#C49B43] shrink-0" />
                <span className="text-xs text-stone-300 font-medium leading-snug">Quà tặng Đối tác & Khách hàng</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#C49B43] shrink-0" />
                <span className="text-xs text-stone-300 font-medium leading-snug">In logo & Khắc tên riêng</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#C49B43] shrink-0" />
                <span className="text-xs text-stone-300 font-medium leading-snug">Giao hàng toàn quốc</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#C49B43] shrink-0" />
                <span className="text-xs text-stone-300 font-medium leading-snug">Chính sách đơn hàng lớn</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto rounded-2xl overflow-hidden shadow-2xl border border-[#C49B43]/40 bg-[#36070C]/60 group">
              <img
                src="/assets/aistudio/B__Qu__T_t_Vineyard_Sang_Tr_ng_f1329eb4.png"
                alt="Bộ sưu tập Quà Tết Hamper 2027 Vineyard.vn dành cho doanh nghiệp"
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-xs text-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-[#C49B43] font-semibold block">5 Thiết Kế Hamper Độc Bản</span>
                  <span className="text-[11px] text-stone-300">Rượu vang Ý, Brandy Pháp XO & Scotch Whisky</span>
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider bg-[#B52C32] px-2 py-0.5 rounded text-white">B2B 2027</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall } from 'lucide-react';
import { FAQ_LIST, BRAND_INFO } from '../data/products';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-[#F7F3EC] border-b border-[#E8D5A7]/40 scroll-mt-24 lg:scroll-mt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#C49B43]/30 text-[#68151F] text-xs font-semibold tracking-widest uppercase mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#C49B43]" />
            <span>Giải Đáp Thắc Mắc</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#282321] tracking-tight mb-4 font-display">
            CÂU HỎI THƯỜNG GẶP
          </h2>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Các thông tin cơ bản về năng lực cung cấp, chính sách chiết khấu và quy trình đặt quà Tết cho doanh nghiệp.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQ_LIST.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleItem(idx)}
                  className="w-full text-left px-6 py-4.5 flex items-center justify-between gap-4 focus:outline-none focus-visible:bg-stone-50"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-[#282321] font-display">
                    {idx + 1}. {item.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-[#68151F] text-white rotate-180' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-stone-100 animate-in fade-in duration-150">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct Contact note */}
        <div className="mt-10 p-5 rounded-2xl bg-white border border-[#C49B43]/30 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="text-xs font-bold text-[#68151F] uppercase tracking-wide">
              Doanh nghiệp có yêu cầu riêng biệt hoặc cần tư vấn trực tiếp?
            </div>
            <div className="text-xs text-stone-600 mt-0.5">
              Đội ngũ tư vấn B2B sẵn sàng phản hồi nhanh qua Hotline & Zalo: <strong>{BRAND_INFO.hotline}</strong>
            </div>
          </div>
          <a
            href={`tel:${BRAND_INFO.hotlineRaw}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-[#68151F] hover:bg-[#8e1d23] transition-colors shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#C49B43]" />
            <span>Gọi Tư Vấn Ngay</span>
          </a>
        </div>
      </div>
    </section>
  );
};

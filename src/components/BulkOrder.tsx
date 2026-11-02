import React from 'react';
import { Layers, Check, ArrowRight } from 'lucide-react';
import { BULK_TIERS } from '../data/products';

interface BulkOrderProps {
  onSelectTier: (tier: string) => void;
}

export const BulkOrder: React.FC<BulkOrderProps> = ({ onSelectTier }) => {
  return (
    <section id="bulk-order" className="py-20 bg-white border-b border-[#E8D5A7]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F3EC] border border-[#C49B43]/30 text-[#68151F] text-xs font-semibold tracking-widest uppercase mb-3">
            <Layers className="w-3.5 h-3.5 text-[#C49B43]" />
            <span>Chính Sách Khách Hàng Doanh Nghiệp</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#282321] tracking-tight mb-4 font-display">
            GIẢI PHÁP QUÀ TẶNG SỐ LƯỢNG LỚN
          </h2>

          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Chính sách tư vấn và chiết khấu theo số lượng đặt hàng, tối ưu hóa ngân sách và mang lại sự an tâm tuyệt đối cho doanh nghiệp.
          </p>
        </div>

        {/* 4 Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BULK_TIERS.map((tierItem) => (
            <div
              key={tierItem.tier}
              className="bg-[#F7F3EC] rounded-2xl p-6 border border-[#C49B43]/30 hover:border-[#B52C32] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="border-b border-stone-200/70 pb-4 mb-4">
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block mb-1">
                    {tierItem.sub}
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#68151F] font-display">
                    {tierItem.tier}
                  </div>
                </div>

                <div className="text-xs font-medium text-[#282321] mb-4 bg-white/70 p-2.5 rounded-lg border border-stone-200/60 leading-snug">
                  <span className="text-stone-500 block text-[10px] uppercase font-bold mb-0.5">Đối tượng:</span>
                  {tierItem.target}
                </div>

                <div className="space-y-2 mb-6">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#B52C32]">
                    Đặc quyền áp dụng:
                  </div>
                  <ul className="space-y-2">
                    {tierItem.benefits.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2 text-xs text-stone-700 leading-snug">
                        <Check className="w-3.5 h-3.5 text-[#B52C32] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200/70">
                <button
                  onClick={() => onSelectTier(tierItem.tier)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#68151F] border border-[#68151F]/30 hover:bg-[#68151F] hover:text-white transition-colors"
                >
                  <span>Báo Giá Gói Này</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Global CTA Notice */}
        <div className="mt-12 text-center">
          <p className="text-xs text-stone-500 max-w-xl mx-auto mb-4">
            * Mức chiết khấu cụ thể sẽ được tư vấn viên gửi kèm bảng báo giá chi tiết có dấu mộc sau khi xác nhận số lượng thực tế.
          </p>
          <button
            onClick={() => onSelectTier('Chưa xác định')}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold text-white bg-[#B52C32] hover:bg-[#8e1d23] transition-colors shadow-md active:scale-98"
          >
            <span>Nhận Báo Giá Doanh Nghiệp</span>
            <ArrowRight className="w-4 h-4 text-[#E8D5A7]" />
          </button>
        </div>
      </div>
    </section>
  );
};

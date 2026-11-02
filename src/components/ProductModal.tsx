import React from 'react';
import { X, Check, Wine, Package, Award, ArrowRight } from 'lucide-react';
import { ProductHamper } from '../data/products';

interface ProductModalProps {
  product: ProductHamper | null;
  onClose: () => void;
  onRequestQuote: (productName: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onRequestQuote,
}) => {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div
        className="relative bg-[#F7F3EC] w-full max-w-4xl max-h-[92vh] rounded-2xl overflow-hidden shadow-2xl border border-[#C49B43]/40 flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#68151F] text-white px-6 py-4 flex items-center justify-between border-b border-[#C49B43]/30">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-[#E8D5A7] font-medium font-sans">
              Chi tiết sản phẩm · {product.theme}
            </span>
            <span className="hidden sm:inline-block text-[#C49B43]">|</span>
            <span className="hidden sm:inline-block text-xs text-stone-300 font-sans">{product.badge}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Đóng bảng chi tiết"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* High-res Image on Left */}
            <div className="md:col-span-5 bg-white rounded-xl p-4 border border-[#C49B43]/20 shadow-sm flex flex-col items-center overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-h-[360px] object-contain drop-shadow-md"
                referrerPolicy="no-referrer"
              />
              <div className="mt-3 text-center">
                <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
                  Ảnh sản phẩm thực tế từ bao bì chính hãng
                </span>
              </div>
            </div>

            {/* Product Breakdown on Right */}
            <div className="md:col-span-7 flex flex-col">
              <div className="text-xs font-semibold uppercase tracking-widest text-[#B52C32] mb-1">
                {product.theme}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#282321] tracking-tight mb-2 font-display">
                {product.name}
              </h3>
              <p className="text-sm font-medium text-[#68151F] mb-4">
                {product.subTitle}
              </p>
              <p className="text-sm text-stone-700 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Highlights */}
              <div className="mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-[#282321] mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#C49B43]" />
                  <span>Đặc Điểm Nổi Bật</span>
                </div>
                <ul className="space-y-1.5">
                  {product.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                      <Check className="w-3.5 h-3.5 text-[#B52C32] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Composition */}
              <div className="mb-6 bg-white/70 p-4 rounded-xl border border-stone-200">
                <div className="text-xs font-bold uppercase tracking-wider text-[#68151F] mb-2 flex items-center gap-1.5">
                  <Wine className="w-4 h-4 text-[#B52C32]" />
                  <span>Thành Phần Bộ Quà (Xác Nhận)</span>
                </div>
                <ul className="space-y-1.5">
                  {product.components.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-stone-800">
                      <span className="text-[#C49B43] font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Audience */}
              <div className="mb-6 text-xs text-stone-600 bg-[#E8D5A7]/20 p-3 rounded-lg border border-[#C49B43]/30">
                <strong className="text-[#68151F] block mb-0.5">Phù hợp trao tặng:</strong>
                {product.recommendedFor}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-white px-6 py-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-stone-500 text-center sm:text-left">
            <span>* Giá bán & mức chiết khấu được tính toán dựa trên số lượng đặt hàng thực tế của doanh nghiệp.</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-5 py-2.5 rounded-full text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                onClose();
                onRequestQuote(product.name);
              }}
              className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-[#B52C32] hover:bg-[#8e1d23] shadow transition-colors"
            >
              <span>Yêu Cầu Báo Giá</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

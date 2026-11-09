import React, { useState } from 'react';
import { Eye, ArrowRight, Check, Sparkles } from 'lucide-react';
import { PRODUCTS, ProductHamper } from '../data/products';
import { ProductModal } from './ProductModal';
import { trackProductView, trackCtaClick } from '../utils/analytics';

interface ProductCollectionProps {
  onSelectProductForQuote: (productName: string) => void;
}

export const ProductCollection: React.FC<ProductCollectionProps> = ({
  onSelectProductForQuote,
}) => {
  const [activeProduct, setActiveProduct] = useState<ProductHamper | null>(null);
  const [filterTheme, setFilterTheme] = useState<string>('all');

  const themes = [
    { id: 'all', label: 'Tất cả 5 Mẫu Hamper' },
    { id: 'vang', label: 'Rượu Vang & Hộp Quà Lễ Hội' },
    { id: 'whisky', label: 'Scotch Whisky & Brandy XO' }
  ];

  const filteredProducts = PRODUCTS.filter((p) => {
    if (filterTheme === 'all') return true;
    if (filterTheme === 'vang') return p.id.includes('prosperity') || p.id.includes('celebration');
    if (filterTheme === 'whisky') return p.id.includes('label-5') || p.id.includes('marquis');
    return true;
  });

  const getColSpan = (idx: number, count: number) => {
    if (count === 5) {
      return idx < 3 ? 'lg:col-span-2' : 'lg:col-span-3';
    }
    if (count === 4) return 'lg:col-span-3';
    if (count === 3) return 'lg:col-span-2';
    if (count === 2) return 'lg:col-span-3';
    return 'lg:col-span-6';
  };

  return (
    <section id="collection" className="py-20 bg-white border-b border-[#E8D5A7]/40 scroll-mt-24 lg:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F3EC] border border-[#C49B43]/30 text-[#68151F] text-xs font-semibold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C49B43]" />
            <span>Tuyển tập Quà Tết Doanh Nghiệp 2027</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#282321] tracking-tight mb-4 font-display">
            BỘ SƯU TẬP QUÀ TẾT HAMPER
          </h2>

          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            5 tuyệt tác quà Tết hội tụ nghệ thuật bao bì hoàng gia dập nổi 3D đa tầng và các dòng rượu vang, rượu mạnh nhập khẩu danh tiếng.
          </p>

          {/* Theme Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setFilterTheme(t.id)}
                className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
                  filterTheme === t.id
                    ? 'bg-[#68151F] text-white shadow-sm'
                    : 'bg-[#F7F3EC] text-stone-700 hover:bg-stone-200/70 border border-stone-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5 Product Grid with balanced multi-row columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {filteredProducts.map((product, index) => (
            <article
              key={product.id}
              className={`bg-[#F7F3EC] rounded-2xl overflow-hidden border border-[#C49B43]/25 shadow-sm hover:shadow-xl hover:border-[#C49B43]/60 transition-all duration-300 flex flex-col group ${getColSpan(index, filteredProducts.length)}`}
            >
              {/* Product Visual Container */}
              <div className="relative bg-gradient-to-b from-white to-[#F7F3EC] p-6 flex items-center justify-center min-h-[300px] sm:min-h-[340px] border-b border-stone-200/60 overflow-hidden">
                {/* Index & Badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-stone-500 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded shadow-xs">
                    0{index + 1}
                  </span>
                  <span className="text-[11px] font-medium text-[#68151F] bg-[#E8D5A7]/50 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-[#C49B43]/30">
                    {product.badge}
                  </span>
                </div>

                {/* Main Product Image with subtle hover zoom */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-[260px] w-auto object-contain transform group-hover:scale-104 transition-transform duration-500 drop-shadow-md"
                  referrerPolicy="no-referrer"
                />

                {/* Quick inspect overlay button */}
                <button
                  onClick={() => {
                    trackProductView(product.id, product.name);
                    setActiveProduct(product);
                  }}
                  className="absolute bottom-3 right-3 bg-white/95 text-stone-800 p-2.5 rounded-full shadow hover:bg-[#68151F] hover:text-white transition-colors opacity-90 group-hover:opacity-100"
                  title="Xem chi tiết hộp quà"
                  aria-label={`Xem chi tiết ${product.name}`}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Product Info Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#B52C32] font-semibold mb-1">
                    {product.theme}
                  </div>
                  <h3 className="text-xl font-bold text-[#282321] tracking-tight mb-1 font-display group-hover:text-[#68151F] transition-colors">
                    {product.name}
                  </h3>
                  <div className="text-xs font-medium text-stone-500 mb-3">
                    {product.subTitle}
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                    {product.description}
                  </p>

                  {/* Confirmed Composition summary */}
                  <div className="bg-white/80 rounded-xl p-3 border border-stone-200/80 mb-5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Thành phần chính:
                    </div>
                    <ul className="space-y-1">
                      {product.components.slice(0, 3).map((comp, cIdx) => (
                        <li key={cIdx} className="text-[11px] text-stone-700 flex items-start gap-1.5 leading-snug">
                          <Check className="w-3 h-3 text-[#B52C32] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{comp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-2 border-t border-stone-200/70 flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      trackCtaClick(`Yêu Cầu Báo Giá: ${product.name}`, 'Product Card Button');
                      onSelectProductForQuote(product.name);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#B52C32] hover:bg-[#8e1d23] transition-colors shadow-xs active:scale-98"
                  >
                    <span>Yêu Cầu Báo Giá</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      trackProductView(product.id, product.name);
                      setActiveProduct(product);
                    }}
                    className="py-2.5 px-3 rounded-xl text-xs font-medium text-stone-700 hover:text-black bg-stone-200/70 hover:bg-stone-200 transition-colors"
                  >
                    Chi Tiết
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Banner Showcase Notice */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-[#68151F] text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-[#C49B43]/40 shadow-lg">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#E8D5A7] font-semibold mb-1">
              Chính Sách Báo Giá Doanh Nghiệp
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
              Cần Báo Giá Số Lượng Lớn Cho Đơn Vị Của Bạn?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
              Vineyard.vn áp dụng chính sách chiết khấu bậc thang theo số lượng đặt hàng từ 50, 100 đến trên 1.000 hộp quà Tết kèm dịch vụ in logo ép kim miễn phí theo chính sách.
            </p>
          </div>
          <button
            onClick={() => onSelectProductForQuote('Tất cả mẫu hộp quà')}
            className="shrink-0 px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold text-white bg-[#B52C32] hover:bg-[#8e1d23] transition-colors shadow-md"
          >
            Nhận Báo Giá B2B Tổng Thể
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onRequestQuote={onSelectProductForQuote}
      />
    </section>
  );
};

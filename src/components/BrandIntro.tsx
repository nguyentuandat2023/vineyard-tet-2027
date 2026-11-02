import React from 'react';
import { Wine, Award, CheckCircle2 } from 'lucide-react';
import { BRAND_INFO } from '../data/products';

export const BrandIntro: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-[#F7F3EC] border-b border-[#E8D5A7]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Showcase on Left */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#C49B43]/30 bg-stone-900 group">
              <img
                src="/assets/aistudio/Ngh__thu_t_trao_t_ng_T_t_th_nh_v__ng_c67ba392.png"
                alt="Nghệ thuật trao tặng Tết thịnh vượng - Vineyard.vn"
                className="w-full h-auto object-cover group-hover:scale-101 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[#E8D5A7] text-xs uppercase tracking-widest block font-medium mb-1">
                  Vineyard Corporate Signature
                </span>
                <p className="text-sm text-stone-200">
                  Gắn kết đối tác · Kiến tạo thịnh vượng · Đẳng cấp thương hiệu
                </p>
              </div>
            </div>

            {/* Inset Sub-badge for Parent Group */}
            <div className="mt-4 p-4 rounded-xl bg-white border border-[#C49B43]/20 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={BRAND_INFO.logoBinhMinh}
                  alt="Binh Minh Group"
                  className="h-10 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-[11px] text-stone-500 uppercase tracking-wider">Đơn vị chủ quản</div>
                  <div className="text-xs font-bold text-[#68151F]">{BRAND_INFO.parentCompany}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-stone-500 uppercase tracking-wider">Bảo chứng</div>
                <div className="text-xs font-semibold text-[#B52C32]">Chính Ngạch 100%</div>
              </div>
            </div>
          </div>

          {/* Editorial Content on Right */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#B52C32] mb-3">
              <Award className="w-4 h-4 text-[#C49B43]" />
              <span>Định vị thương hiệu</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#282321] tracking-tight mb-5 font-display text-balance">
              VINEYARD – <span className="text-[#68151F] italic">THE ART OF GIFTING</span>
            </h2>

            <p className="text-lg text-[#68151F] font-medium leading-snug mb-5 font-display">
              Món quà không chỉ thể hiện sự trân trọng mà còn là cầu nối tạo nên những mối quan hệ bền vững trong kinh doanh.
            </p>

            <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed mb-8">
              <p>
                Với vị thế là đơn vị trực thuộc <strong className="text-[#282321]">{BRAND_INFO.parentCompany}</strong>, <strong className="text-[#282321]">Vineyard.vn</strong> định vị là giải pháp quà tặng rượu vang và hộp quà HAMPER cao cấp hàng đầu dành cho doanh nghiệp trong các dịp lễ Tết, hội nghị và tri ân đối tác.
              </p>
              <p>
                Mỗi bộ quà Tết được xây dựng dựa trên sự cân bằng hoàn mỹ giữa tính thẩm mỹ hoàng gia, chất lượng sản phẩm nhập khẩu nguyên chai có đầy đủ hóa đơn chứng từ, và tính thực tiễn cao cho nhu cầu quảng bá dấu ấn doanh nghiệp.
              </p>
            </div>

            {/* 3 Core Brand Commitments */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200">
              <div className="p-3.5 rounded-lg bg-white/80 border border-stone-200/80">
                <Wine className="w-5 h-5 text-[#B52C32] mb-2" />
                <h3 className="text-xs font-bold text-[#282321] uppercase tracking-wide mb-1">Rượu Vang & Rượu Mạnh</h3>
                <p className="text-[11px] text-stone-600 leading-snug">Nhập khẩu chính ngạch, xuất xứ nguồn gốc minh bạch.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-white/80 border border-stone-200/80">
                <CheckCircle2 className="w-5 h-5 text-[#C49B43] mb-2" />
                <h3 className="text-xs font-bold text-[#282321] uppercase tracking-wide mb-1">Thiết Kế Độc Quyền</h3>
                <p className="text-[11px] text-stone-600 leading-snug">Hộp quà cứng cáp dập nổi 3D, hoa văn hoàng gia.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-white/80 border border-stone-200/80">
                <Award className="w-5 h-5 text-[#68151F] mb-2" />
                <h3 className="text-xs font-bold text-[#282321] uppercase tracking-wide mb-1">Dịch Vụ B2B Trọn Gói</h3>
                <p className="text-[11px] text-stone-600 leading-snug">Tư vấn ngân sách, in logo, giao hàng phân bổ.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

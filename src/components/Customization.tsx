import React, { useState } from 'react';
import { Sparkles, Stamp, FileText, Gift, ArrowRight } from 'lucide-react';

interface CustomizationProps {
  onOpenQuote: (notePrefill?: string) => void;
}

export const Customization: React.FC<CustomizationProps> = ({ onOpenQuote }) => {
  const [companyName, setCompanyName] = useState('TẬP ĐOÀN BẢO AN PHÁT');
  const [foilColor, setFoilColor] = useState<'gold' | 'silver' | 'rose'>('gold');
  const [greetingText, setGreetingText] = useState('Kính chúc Quý Khách Hàng & Đối Tác Năm Mới An Khang Thịnh Vượng');

  return (
    <section id="customization" className="py-20 bg-[#F7F3EC] border-b border-[#E8D5A7]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#C49B43]/30 text-[#68151F] text-xs font-semibold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C49B43]" />
            <span>Bespoke Corporate Identity</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#282321] tracking-tight mb-4 font-display">
            CÁ NHÂN HÓA QUÀ TẶNG – DẤU ẤN RIÊNG CỦA DOANH NGHIỆP
          </h2>

          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Nâng tầm giá trị gắn kết thông qua các giải pháp ép kim logo, thiết kế thiệp chúc mừng riêng và phụ kiện nhận diện thương hiệu chuẩn xác.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: 4 Services Explained */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#68151F]/10 text-[#68151F] shrink-0 mt-0.5">
                <Stamp className="w-5 h-5 text-[#B52C32]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#282321] mb-1 font-display">
                  In & Ép Kim Logo Doanh Nghiệp
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Ứng dụng kỹ thuật ép kim foil vàng, bạc hoặc dập nổi logo doanh nghiệp sắc nét trên nắp hộp, nơ ruy băng hoặc tag da cao cấp.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#68151F]/10 text-[#68151F] shrink-0 mt-0.5">
                <FileText className="w-5 h-5 text-[#B52C32]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#282321] mb-1 font-display">
                  Thiệp Chúc Mừng Thiết Kế Riêng
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Tùy chỉnh nội dung lời chúc, chữ ký ban lãnh đạo và thông điệp tri ân trên giấy mỹ thuật cao cấp dập nhũ đồng bộ với bộ quà.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#68151F]/10 text-[#68151F] shrink-0 mt-0.5">
                <Gift className="w-5 h-5 text-[#B52C32]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#282321] mb-1 font-display">
                  Tư Vấn Thiết Kế Theo Ngân Sách
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Linh hoạt tư vấn phương án phối hộp, chọn loại rượu và bánh mứt phù hợp với từng hạn mức tài chính của công ty.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#68151F]/10 text-[#68151F] shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-[#B52C32]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#282321] mb-1 font-display">
                  Tư Vấn Giải Pháp Đóng Gói Phù Hợp
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Đảm bảo tiêu chuẩn vận chuyển xa, bảo vệ tuyệt đối chai rượu bên trong khi phân bổ đi các tỉnh thành khắp cả nước.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Corporate Mockup Preview */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#68151F] to-[#36070C] p-6 sm:p-8 rounded-3xl border border-[#C49B43]/40 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#C49B43]/30 mb-6">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#E8D5A7] font-semibold block">
                  Trải Nghiệm Minh Họa Cá Nhân Hóa
                </span>
                <h4 className="text-lg font-bold font-display text-white">
                  Mô Phỏng Nhận Diện Trên Hộp Quà
                </h4>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#C49B43]/20 text-[#E8D5A7] rounded border border-[#C49B43]/40">
                Interactive B2B
              </span>
            </div>

            {/* Live Visual Card */}
            <div className="relative bg-[#420A10] rounded-2xl p-6 sm:p-8 border border-[#C49B43]/50 shadow-inner mb-6 overflow-hidden">
              {/* Box texture & ribbon */}
              <div className="absolute top-0 right-10 w-8 h-full bg-[#B52C32]/40 border-x border-[#C49B43]/30 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center text-center py-4">
                <div className="w-12 h-12 rounded-full border border-[#C49B43]/60 flex items-center justify-center mb-3 bg-[#68151F]">
                  <Stamp className="w-6 h-6 text-[#C49B43]" />
                </div>

                {/* Company Stamped Name */}
                <div
                  className={`text-lg sm:text-xl font-bold tracking-widest font-display uppercase px-4 py-1.5 rounded border border-[#C49B43]/30 mb-4 ${
                    foilColor === 'gold'
                      ? 'text-[#F3E7C4] shadow-sm'
                      : foilColor === 'silver'
                      ? 'text-stone-200'
                      : 'text-rose-200'
                  }`}
                  style={{
                    textShadow:
                      foilColor === 'gold'
                        ? '0 0 10px rgba(196,155,67,0.5)'
                        : '0 0 10px rgba(255,255,255,0.4)',
                  }}
                >
                  {companyName || 'TÊN DOANH NGHIỆP CỦA BẠN'}
                </div>

                <div className="text-[11px] uppercase tracking-wider text-[#E8D5A7]/80 mb-3">
                  TẾT ĐINH MÙI 2027 · KÍNH CHÚC THỊNH VƯỢNG
                </div>

                {/* Greeting Card inside box */}
                <div className="bg-[#F7F3EC] text-[#282321] rounded-xl p-4 w-full max-w-md shadow-md text-left border border-[#C49B43]/30">
                  <div className="flex items-center justify-between text-[10px] text-stone-500 uppercase tracking-wider mb-1">
                    <span>Thiệp Tri Ân Doanh Nghiệp</span>
                    <span className="font-semibold text-[#B52C32]">Vineyard Royal</span>
                  </div>
                  <p className="text-xs text-stone-800 italic font-display leading-relaxed">
                    "{greetingText}"
                  </p>
                  <div className="mt-2 text-right text-[11px] font-semibold text-[#68151F]">
                    — Ban Giám Đốc {companyName || 'Quý Doanh Nghiệp'}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Nhập tên doanh nghiệp muốn mô phỏng:
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="VD: CÔNG TY CP ĐẦU TƯ Á CHÂU..."
                  className="w-full bg-black/40 border border-[#C49B43]/40 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#C49B43]"
                  maxLength={40}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Hiệu ứng ép kim:
                  </label>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setFoilColor('gold')}
                      className={`flex-1 py-1.5 text-[11px] rounded-lg font-medium transition-colors ${
                        foilColor === 'gold'
                          ? 'bg-[#C49B43] text-black font-semibold'
                          : 'bg-black/30 text-stone-300 border border-white/10'
                      }`}
                    >
                      Kim Vàng
                    </button>
                    <button
                      onClick={() => setFoilColor('silver')}
                      className={`flex-1 py-1.5 text-[11px] rounded-lg font-medium transition-colors ${
                        foilColor === 'silver'
                          ? 'bg-stone-300 text-black font-semibold'
                          : 'bg-black/30 text-stone-300 border border-white/10'
                      }`}
                    >
                      Kim Bạc
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Áp dụng vào báo giá:
                  </label>
                  <button
                    onClick={() => onOpenQuote(`Yêu cầu in logo: ${companyName} (Ép kim ${foilColor})`)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#B52C32] hover:bg-[#8e1d23] transition-colors"
                  >
                    <span>Yêu Cầu In Logo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

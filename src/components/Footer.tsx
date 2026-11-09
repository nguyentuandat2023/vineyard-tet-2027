import React from 'react';
import { Phone, Mail, Globe, MapPin, Building, ChevronUp } from 'lucide-react';
import { BRAND_INFO } from '../data/products';

interface FooterProps {
  onOpenPolicy: (type: 'privacy' | 'terms') => void;
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPolicy, onScrollToTop }) => {
  return (
    <footer className="bg-[#420A10] text-[#F7F3EC] border-t border-[#C49B43]/30 pt-16 pb-28 lg:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#C49B43]/20">
          {/* Col 1: Brand & Parent Company */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={BRAND_INFO.logoVineyard}
                alt="Vineyard.vn"
                className="h-12 w-auto object-contain bg-white/90 p-1 rounded"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-xl font-bold font-display tracking-wider text-white block">
                  {BRAND_INFO.name}
                </span>
                <span className="text-xs uppercase tracking-widest text-[#E8D5A7] font-semibold">
                  {BRAND_INFO.slogan}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed max-w-md">
              Thương hiệu cung cấp giải pháp quà tặng rượu vang và hộp quà HAMPER cao cấp, chuyên biệt dành cho các cơ quan, tổ chức, doanh nghiệp tri ân khách hàng và đối tác nhân dịp Tết Nguyên Đán 2027.
            </p>

            <div className="pt-2 flex items-center gap-3 bg-black/30 p-3 rounded-xl border border-white/10 max-w-md">
              <img
                src={BRAND_INFO.logoBinhMinh}
                alt="Binh Minh Group"
                className="h-9 w-auto object-contain bg-white/90 p-0.5 rounded"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="text-[10px] text-stone-400 uppercase tracking-wider">Đơn vị chủ quản</div>
                <div className="text-xs font-bold text-[#E8D5A7]">{BRAND_INFO.parentCompany}</div>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#C49B43] font-bold">
              Liên Kết Nhanh
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <a href="#collection" className="hover:text-white transition-colors">
                  Bộ sưu tập 5 mẫu HAMPER
                </a>
              </li>
              <li>
                <a href="#corporate" className="hover:text-white transition-colors">
                  Giải pháp quà tặng doanh nghiệp
                </a>
              </li>
              <li>
                <a href="#customization" className="hover:text-white transition-colors">
                  Dịch vụ in logo & cá nhân hóa
                </a>
              </li>
              <li>
                <a href="#bulk-order" className="hover:text-white transition-colors">
                  Chính sách chiết khấu số lượng lớn
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-white transition-colors">
                  Quy trình đặt quà 5 bước
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Câu hỏi thường gặp (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Headquarters */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#C49B43] font-bold">
              Thông Tin Liên Hệ B2B
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C49B43] shrink-0 mt-0.5" />
                <span>{BRAND_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C49B43] shrink-0" />
                <span>
                  Hotline / Zalo: <strong className="text-white font-medium">{BRAND_INFO.hotline}</strong>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C49B43] shrink-0" />
                <span>Email tiếp nhận báo giá: <a href={`mailto:${BRAND_INFO.email}`} className="text-white hover:underline">{BRAND_INFO.email}</a></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#C49B43] shrink-0" />
                <span>Website chính thức: <a href={BRAND_INFO.website} target="_blank" rel="noopener noreferrer" className="text-white hover:underline">{BRAND_INFO.website}</a></span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © 2027 {BRAND_INFO.name} · Thuộc {BRAND_INFO.parentCompany}. Mọi quyền được bảo lưu.
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={() => onOpenPolicy('privacy')}
              className="hover:text-white underline-offset-4 hover:underline cursor-pointer"
            >
              Chính sách bảo mật
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-white underline-offset-4 hover:underline cursor-pointer"
            >
              Điều khoản sử dụng
            </button>
            <span>·</span>
            <a
              href="/admin"
              className="text-[#E8D5A7] hover:text-white font-medium flex items-center gap-1 cursor-pointer"
              title="Cổng Quản Trị Hệ Thống"
            >
              <span>Quản Trị B2B</span>
            </a>
            <span>·</span>
            <button
              onClick={onScrollToTop}
              className="inline-flex items-center gap-1 text-[#E8D5A7] hover:text-white ml-2 cursor-pointer"
              title="Về đầu trang"
            >
              <span>Đầu trang</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

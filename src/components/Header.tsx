import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ArrowRight } from 'lucide-react';
import { BRAND_INFO } from '../data/products';

interface HeaderProps {
  onOpenQuote: (productName?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuote }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Trang chủ', href: '#hero' },
    { label: 'Bộ sưu tập HAMPER', href: '#collection' },
    { label: 'Quà tặng doanh nghiệp', href: '#corporate' },
    { label: 'Dịch vụ in logo', href: '#customization' },
    { label: 'Về Vineyard', href: '#about' },
    { label: 'Quy trình & FAQ', href: '#process' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top micro-bar for corporate trust */}
      <div className="bg-[#68151F] text-[#E8D5A7] text-xs py-1.5 px-4 hidden md:block border-b border-[#C49B43]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-wider">BINH MINH GROUP – FOODS & DRINKS</span>
            <span className="text-[#C49B43]/50">|</span>
            <span className="text-stone-300">Nhà cung cấp Quà Tết Doanh Nghiệp & Rượu Vang Nhập Khẩu Chính Hãng</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href={`tel:${BRAND_INFO.hotlineRaw}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#C49B43]" />
              <span>Hotline B2B: <strong className="text-white font-medium">{BRAND_INFO.hotline}</strong></span>
            </a>
            <span className="text-stone-300">Email: {BRAND_INFO.email}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F7F3EC]/95 backdrop-blur-md shadow-md py-3 border-b border-[#C49B43]/20'
            : 'bg-[#F7F3EC] py-4 border-b border-[#E8D5A7]/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
          {/* Brand Logo Lockup */}
          <a
            href="#hero"
            className="flex items-center gap-3 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B52C32] rounded-md"
            aria-label="Trang chủ Vineyard.vn"
          >
            <div className="h-12 w-auto flex items-center">
              <img
                src={BRAND_INFO.logoVineyard}
                alt="Vineyard.vn - The King of Wines"
                className="h-12 w-auto object-contain mix-blend-multiply"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="hidden sm:block border-l border-[#C49B43]/40 pl-3">
              <div className="text-xs uppercase tracking-widest text-[#B52C32] font-semibold">Tết Hamper 2027</div>
              <div className="text-[10px] text-stone-500 tracking-wider">GIẢI PHÁP QUÀ DOANH NGHIỆP</div>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#282321]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="whitespace-nowrap hover:text-[#B52C32] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#B52C32] hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenQuote()}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold text-white bg-[#B52C32] hover:bg-[#8e1d23] shadow-sm hover:shadow transition-all duration-200 active:scale-95"
            >
              <span>Nhận Báo Giá</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#282321] hover:text-[#B52C32] focus:outline-none"
              aria-label={mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#F7F3EC] border-b border-[#C49B43]/30 px-6 py-6 shadow-xl animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col gap-4 text-base font-medium text-[#282321]">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="py-1 border-b border-stone-200/60 hover:text-[#B52C32]"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuote();
                  }}
                  className="w-full text-center py-3 rounded-full text-sm font-semibold uppercase tracking-wider text-white bg-[#B52C32] hover:bg-[#8e1d23] transition-colors"
                >
                  Nhận Báo Giá Doanh Nghiệp
                </button>
                <a
                  href={`tel:${BRAND_INFO.hotlineRaw}`}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold text-[#68151F] border border-[#68151F]/30 hover:bg-[#68151F]/5"
                >
                  <Phone className="w-4 h-4 text-[#B52C32]" />
                  <span>Hotline: {BRAND_INFO.hotline}</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

import React from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, Gem } from 'lucide-react';

export const ProductGallery: React.FC = () => {
  const craftPoints = [
    {
      title: 'Họa tiết dập nổi 3D',
      desc: 'Công nghệ khuôn dập nổi đa tầng tạo chiều sâu sống động cho hình tượng song ngư, chim hạc và mặt trời hoàng gia.'
    },
    {
      title: 'Logo ép kim ánh vàng',
      desc: 'Kỹ thuật ép nhũ nhiệt cao cấp bắt sáng lung linh dưới mọi góc nhìn, tôn vinh đẳng cấp quà tặng.'
    },
    {
      title: 'Quai xách da tán đinh',
      desc: 'Được thiết kế tinh xảo, chắc chắn, tiện lợi và trang nhã khi xách tay trao tặng đối tác.'
    },
    {
      title: 'Khay định hình bọc nhung',
      desc: 'Bên trong được bọc lót nhung đỏ êm ái, giữ cố định chai rượu và các hộp bánh hạt khi vận chuyển xa.'
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-white border-b border-[#E8D5A7]/40 scroll-mt-24 lg:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F3EC] border border-[#C49B43]/30 text-[#68151F] text-xs font-semibold tracking-widest uppercase mb-3">
            <Gem className="w-3.5 h-3.5 text-[#C49B43]" />
            <span>Artisan Craftsmanship</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#282321] tracking-tight mb-4 font-display">
            CHI TIẾT TẠO NÊN GIÁ TRỊ
          </h2>

          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Mỗi hộp quà Tết Vineyard là sự kết tinh của kỹ thuật in ấn bao bì hiện đại, chất liệu tuyển chọn và sự chỉn chu trong từng chi tiết nhỏ nhất.
          </p>
        </div>

        {/* Master Detail Visual Asset */}
        <div className="rounded-3xl overflow-hidden border border-[#C49B43]/40 shadow-2xl bg-[#68151F] mb-12">
          <img
            src="/assets/aistudio/Chi_ti_t_h_p_qu__Label_5_sang_tr_ng_3671966c.png"
            alt="Chi tiết hộp quà Tết Hamper sang trọng Vineyard.vn"
            className="w-full h-auto object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* 4 Craft Details Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {craftPoints.map((cp, idx) => (
            <div
              key={idx}
              className="bg-[#F7F3EC] p-6 rounded-2xl border border-stone-200/90 hover:border-[#C49B43] transition-colors"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#68151F] uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-4 h-4 text-[#B52C32]" />
                <span>{cp.title}</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {cp.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

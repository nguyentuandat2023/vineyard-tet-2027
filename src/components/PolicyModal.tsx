import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { BRAND_INFO } from '../data/products';

interface PolicyModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-white w-full max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#68151F] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C49B43]" />
            <h3 className="text-base font-bold font-display">
              {type === 'privacy' ? 'Chính Sách Bảo Mật Thông Tin' : 'Điều Khoản Sử Dụng & Bán Hàng B2B'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-300 hover:text-white"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto text-xs sm:text-sm text-stone-700 space-y-4 leading-relaxed">
          {type === 'privacy' ? (
            <>
              <p>
                <strong>1. Thu thập thông tin:</strong> {BRAND_INFO.name} thuộc {BRAND_INFO.parentCompany} cam kết bảo mật tuyệt đối các thông tin do doanh nghiệp cung cấp bao gồm: Họ tên người đại diện, số điện thoại, tên đơn vị và nội dung yêu cầu báo giá.
              </p>
              <p>
                <strong>2. Mục đích sử dụng:</strong> Thông tin chỉ được sử dụng cho mục đích tư vấn sản phẩm quà tặng, gửi bảng báo giá chiết khấu thương mại, phát hành hợp đồng kinh tế và tổ chức giao nhận hàng hóa.
              </p>
              <p>
                <strong>3. Cam kết không chia sẻ:</strong> Chúng tôi tuyệt đối không cung cấp, chuyển nhượng hoặc thương mại hóa thông tin khách hàng cho bất kỳ bên thứ ba nào vì mục đích quảng cáo rác.
              </p>
              <p>
                <strong>4. Liên hệ bảo vệ dữ liệu:</strong> Mọi thắc mắc hoặc yêu cầu xóa dữ liệu, quý khách vui lòng liên hệ email: {BRAND_INFO.email}.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>1. Phạm vi áp dụng:</strong> Các điều khoản này áp dụng cho mọi giao dịch đặt mua hộp quà Tết HAMPER và rượu vang tại website {BRAND_INFO.website}.
              </p>
              <p>
                <strong>2. Xác nhận đơn hàng & Hợp đồng:</strong> Sau khi thống nhất chủng loại và số lượng, {BRAND_INFO.name} sẽ phát hành bảng báo giá chính thức có dấu mộc và tiến hành ký kết hợp đồng kinh tế, xuất hóa đơn tài chính (VAT) theo quy định hiện hành.
              </p>
              <p>
                <strong>3. Giao hàng & Kiểm nghiệm:</strong> Khách hàng có quyền kiểm tra tình trạng nguyên vẹn của niêm phong hộp quà, số lượng chai rượu và phụ kiện trước khi ký nhận bàn giao.
              </p>
              <p>
                <strong>4. Chính sách đổi trả:</strong> Trong trường hợp sản phẩm bị lỗi do bao bì, móp méo trong quá trình vận chuyển hoặc sai quy cách so với thỏa thuận, chúng tôi cam kết đổi mới trong vòng 24–48 giờ làm việc.
              </p>
            </>
          )}
        </div>

        <div className="bg-stone-50 px-6 py-3 border-t border-stone-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-[#68151F] text-white hover:bg-[#8e1d23]"
          >
            Đã Hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

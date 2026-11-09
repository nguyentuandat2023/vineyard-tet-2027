import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Phone, Building2, User, Mail, Gift, Layers, FileText, Download, RefreshCw } from 'lucide-react';
import { validateLeadForm, saveLead, sendLeadToSheet, LeadFormData, SavedLead } from '../utils/validation';
import { GOOGLE_SHEET_URL } from '../config';
import { PRODUCTS, BRAND_INFO } from '../data/products';
import { trackFormStart, trackGenerateLead, getPersistedUtmParams, trackCtaClick } from '../utils/analytics';

interface LeadFormProps {
  preselectedProduct?: string;
  preselectedTier?: string;
  preselectedNote?: string;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  preselectedProduct,
  preselectedTier,
  preselectedNote,
}) => {
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    companyName: '',
    phone: '',
    email: '',
    interestedProduct: 'HAMPER GOLDEN PROSPERITY',
    quantityRange: '100–499 hộp',
    purpose: ['Quà tặng đối tác'],
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<SavedLead | null>(null);
  const [hasStartedForm, setHasStartedForm] = useState(false);

  // Sync incoming preselected props
  useEffect(() => {
    if (preselectedProduct) {
      setFormData((prev) => ({ ...prev, interestedProduct: preselectedProduct }));
    }
  }, [preselectedProduct]);

  useEffect(() => {
    if (preselectedTier) {
      setFormData((prev) => ({ ...prev, quantityRange: preselectedTier }));
    }
  }, [preselectedTier]);

  useEffect(() => {
    if (preselectedNote) {
      setFormData((prev) => ({
        ...prev,
        notes: prev.notes ? `${prev.notes}\n${preselectedNote}` : preselectedNote
      }));
    }
  }, [preselectedNote]);

  const handleChange = (
    field: keyof LeadFormData,
    value: string | string[]
  ) => {
    if (!hasStartedForm) {
      setHasStartedForm(true);
      trackFormStart('B2B Lead Form Tết 2027');
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error on edit
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const togglePurpose = (item: string) => {
    if (!hasStartedForm) {
      setHasStartedForm(true);
      trackFormStart('B2B Lead Form Tết 2027');
    }
    const current = formData.purpose || [];
    const exists = current.includes(item);
    const updated = exists ? current.filter((i) => i !== item) : [...current, item];
    handleChange('purpose', updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateLeadForm(formData);

    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const utm = getPersistedUtmParams();

    try {
      const res = await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, utm })
      });
      const data = await res.json();
      if (data.success && data.lead) {
        setSubmittedLead(data.lead);
        saveLead(formData); // also save locally
        sendLeadToSheet(GOOGLE_SHEET_URL, data.lead).catch(() => {});
        trackGenerateLead({
          leadId: data.lead.id,
          productName: data.lead.interestedProduct,
          quantityRange: data.lead.quantityRange,
          purposes: data.lead.purpose
        });
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      console.warn('API submission failed, falling back to local storage:', err);
    }

    // Fallback if offline / server booting / static host
    const saved = saveLead(formData);
    sendLeadToSheet(GOOGLE_SHEET_URL, saved).catch(() => {});
    setSubmittedLead(saved);
    setIsSubmitting(false);

    trackGenerateLead({
      leadId: saved.id,
      productName: saved.interestedProduct,
      quantityRange: saved.quantityRange,
      purposes: saved.purpose
    });
  };

  const handleDownloadReceipt = () => {
    if (!submittedLead) return;
    const content = `VINEYARD.VN - YÊU CẦU BÁO GIÁ QUÀ TẾT DOANH NGHIỆP 2027
-----------------------------------------------------------
Mã phiếu yêu cầu: ${submittedLead.id}
Thời gian ghi nhận: ${new Date(submittedLead.createdAt).toLocaleString('vi-VN')}
Đơn vị tiếp nhận: ${BRAND_INFO.name} (${BRAND_INFO.parentCompany})
Hotline / Zalo: ${BRAND_INFO.hotline}
Email: ${BRAND_INFO.email}

THÔNG TIN DOANH NGHIỆP ĐẶT HÀNG:
- Người liên hệ: ${submittedLead.fullName}
- Đơn vị / Công ty: ${submittedLead.companyName}
- Số điện thoại: ${submittedLead.phone}
- Email: ${submittedLead.email || 'Không cung cấp'}

NỘI DUNG YÊU CẦU:
- Sản phẩm quan tâm: ${submittedLead.interestedProduct}
- Số lượng dự kiến: ${submittedLead.quantityRange}
- Mục đích trao tặng: ${submittedLead.purpose.join(', ') || 'Chưa chọn'}
- Ghi chú thêm: ${submittedLead.notes || 'Không có'}

TRẠNG THÁI: Đã tiếp nhận - Chuyên viên B2B sẽ phản hồi báo giá trong 30-60 phút.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bao-Gia-Vineyard-${submittedLead.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const productOptions = [
    ...PRODUCTS.map((p) => p.name),
    'Tất cả các mẫu hộp quà',
    'Tư vấn phối set quà riêng theo ngân sách'
  ];

  const quantityOptions = [
    '50–99 hộp',
    '100–499 hộp',
    '500–999 hộp',
    'Từ 1.000 hộp',
    'Chưa xác định'
  ];

  const purposeOptions = [
    'Quà tặng đối tác',
    'Quà tặng khách hàng',
    'Quà tặng nhân viên',
    'Quà tặng sự kiện',
    'Khác'
  ];

  return (
    <section id="quote-form" className="py-20 bg-white relative overflow-hidden scroll-mt-24 lg:scroll-mt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F3EC] border border-[#C49B43]/30 text-[#68151F] text-xs font-semibold tracking-widest uppercase mb-3">
            <Send className="w-3.5 h-3.5 text-[#C49B43]" />
            <span>Kênh Tiếp Nhận Trực Tiếp B2B</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#282321] tracking-tight mb-4 font-display">
            NHẬN BÁO GIÁ QUÀ TẶNG DOANH NGHIỆP
          </h2>

          <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Để lại thông tin, đội ngũ chuyên viên Vineyard.vn sẽ tiếp nhận yêu cầu và gửi bảng báo giá chiết khấu tối ưu trong vòng 30–60 phút.
          </p>
        </div>

        {/* State A: Submission Success View */}
        {submittedLead ? (
          <div className="bg-[#F7F3EC] rounded-3xl p-8 sm:p-10 border border-[#C49B43]/40 shadow-xl animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-full bg-[#68151F] text-[#E8D5A7] flex items-center justify-center mx-auto mb-5 shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-[#C49B43]" />
            </div>

            <div className="text-center mb-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B52C32] bg-white px-3 py-1 rounded-full border border-stone-200">
                Mã yêu cầu: {submittedLead.id}
              </span>
              <h3 className="text-2xl font-bold text-[#282321] mt-3 mb-2 font-display">
                Đã Tiếp Nhận Thành Công Yêu Cầu Báo Giá!
              </h3>
              <p className="text-sm text-stone-600 max-w-lg mx-auto">
                Cảm ơn <strong>{submittedLead.fullName}</strong> từ <strong>{submittedLead.companyName}</strong>. Chuyên viên quản lý khách hàng doanh nghiệp của Vineyard.vn sẽ liên hệ lại qua số <strong>{submittedLead.phone}</strong> sớm nhất.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 mb-6 text-xs sm:text-sm space-y-2.5">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Sản phẩm quan tâm:</span>
                <span className="font-semibold text-[#68151F]">{submittedLead.interestedProduct}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Số lượng dự kiến:</span>
                <span className="font-semibold text-stone-800">{submittedLead.quantityRange}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Mục đích quà tặng:</span>
                <span className="font-semibold text-stone-800">{submittedLead.purpose.join(', ') || 'Nhiều mục đích'}</span>
              </div>
              {submittedLead.email && (
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Email gửi báo giá:</span>
                  <span className="font-semibold text-stone-800">{submittedLead.email}</span>
                </div>
              )}
              {submittedLead.notes && (
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Ghi chú:</span>
                  <span className="font-normal text-stone-700 italic max-w-xs text-right">{submittedLead.notes}</span>
                </div>
              )}
            </div>

            {/* Actions for the customer */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleDownloadReceipt}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-[#68151F] border border-[#68151F]/30 hover:bg-[#68151F]/5 transition-colors"
              >
                <Download className="w-4 h-4 text-[#B52C32]" />
                <span>Tải Bản Lưu Yêu Cầu (.TXT)</span>
              </button>

              <a
                href={BRAND_INFO.zaloLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-[#0068FF] hover:bg-[#0052cc] transition-colors shadow-sm"
              >
                <span>Nhắn Zalo Nhận Báo Giá Ngay</span>
              </a>

              <button
                onClick={() => setSubmittedLead(null)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-medium text-stone-600 hover:text-black transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Gửi Thêm Yêu Cầu Khác</span>
              </button>
            </div>
          </div>
        ) : (
          /* State B: Lead Input Form */
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-[#F7F3EC] rounded-3xl p-6 sm:p-10 border border-[#C49B43]/30 shadow-lg space-y-6"
          >
            {/* Row 1: Full name & Company name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#282321] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#B52C32]" />
                  <span>Họ và tên người liên hệ <strong className="text-red-600">*</strong></span>
                </label>
                <input
                  id="leadFullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="VD: Nguyễn Văn An"
                  className={`w-full bg-white rounded-xl px-4 py-3 text-sm text-[#282321] placeholder-stone-400 border transition-all ${
                    errors.fullName ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-stone-300 focus:border-[#68151F]'
                  }`}
                  required
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="leadCompanyName" className="block text-xs font-bold text-[#282321] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#B52C32]" />
                  <span>Tên doanh nghiệp / Đơn vị <strong className="text-red-600">*</strong></span>
                </label>
                <input
                  id="leadCompanyName"
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder="VD: Công ty Cổ phần Đại Nam..."
                  className={`w-full bg-white rounded-xl px-4 py-3 text-sm text-[#282321] placeholder-stone-400 border transition-all ${
                    errors.companyName ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-stone-300 focus:border-[#68151F]'
                  }`}
                  required
                />
                {errors.companyName && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.companyName}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="leadPhone" className="block text-xs font-bold text-[#282321] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#B52C32]" />
                  <span>Số điện thoại (Zalo nhận báo giá) <strong className="text-red-600">*</strong></span>
                </label>
                <input
                  id="leadPhone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="VD: 091 100 22 33"
                  className={`w-full bg-white rounded-xl px-4 py-3 text-sm text-[#282321] placeholder-stone-400 border transition-all ${
                    errors.phone ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-stone-300 focus:border-[#68151F]'
                  }`}
                  required
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="leadEmail" className="block text-xs font-bold text-[#282321] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-stone-500" />
                  <span>Email doanh nghiệp (Tùy chọn)</span>
                </label>
                <input
                  id="leadEmail"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="VD: lienhe@doanhnghiep.com"
                  className={`w-full bg-white rounded-xl px-4 py-3 text-sm text-[#282321] placeholder-stone-400 border transition-all ${
                    errors.email ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-stone-300 focus:border-[#68151F]'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: Product Interest & Quantity Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#282321] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-[#B52C32]" />
                  <span>Sản phẩm quan tâm <strong className="text-red-600">*</strong></span>
                </label>
                <select
                  value={formData.interestedProduct}
                  onChange={(e) => handleChange('interestedProduct', e.target.value)}
                  className="w-full bg-white rounded-xl px-4 py-3 text-sm text-[#282321] border border-stone-300 focus:border-[#68151F] focus:outline-none"
                >
                  {productOptions.map((prod) => (
                    <option key={prod} value={prod}>
                      {prod}
                    </option>
                  ))}
                </select>
                {errors.interestedProduct && (
                  <p className="mt-1 text-xs text-red-600">{errors.interestedProduct}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282321] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#B52C32]" />
                  <span>Số lượng dự kiến <strong className="text-red-600">*</strong></span>
                </label>
                <select
                  value={formData.quantityRange}
                  onChange={(e) => handleChange('quantityRange', e.target.value)}
                  className="w-full bg-white rounded-xl px-4 py-3 text-sm text-[#282321] border border-stone-300 focus:border-[#68151F] focus:outline-none"
                >
                  {quantityOptions.map((qty) => (
                    <option key={qty} value={qty}>
                      {qty}
                    </option>
                  ))}
                </select>
                {errors.quantityRange && (
                  <p className="mt-1 text-xs text-red-600">{errors.quantityRange}</p>
                )}
              </div>
            </div>

            {/* Row 4: Purpose Multi-select */}
            <div>
              <label className="block text-xs font-bold text-[#282321] uppercase tracking-wide mb-2">
                Nhu cầu trao tặng (chọn một hoặc nhiều):
              </label>
              <div className="flex flex-wrap gap-2.5">
                {purposeOptions.map((p) => {
                  const isChecked = formData.purpose?.includes(p);
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => togglePurpose(p)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                        isChecked
                          ? 'bg-[#68151F] text-white shadow-xs'
                          : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {isChecked ? `✓ ${p}` : p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 5: Notes */}
            <div>
              <label className="block text-xs font-bold text-[#282321] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-stone-500" />
                <span>Ghi chú thêm (Yêu cầu in logo, ngày giao mong muốn...)</span>
              </label>
              <textarea
                id="leadNotes"
                name="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
                placeholder="VD: Cần in logo doanh nghiệp ép kim vàng, dự kiến giao trước ngày 20 tháng Chạp tại TP.HCM..."
                className="w-full bg-white rounded-xl px-4 py-2.5 text-sm text-[#282321] placeholder-stone-400 border border-stone-300 focus:border-[#68151F] focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-wider text-white bg-[#B52C32] hover:bg-[#8e1d23] transition-all duration-200 shadow-md active:scale-98 disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang Xử Lý Yêu Cầu...</span>
                  </>
                ) : (
                  <>
                    <span>Gửi Yêu Cầu Báo Giá</span>
                    <Send className="w-4 h-4 text-[#E8D5A7]" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-stone-500 mt-3">
                * Cam kết bảo mật thông tin doanh nghiệp. Không làm phiền ngoài mục đích tư vấn báo giá quà tặng.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

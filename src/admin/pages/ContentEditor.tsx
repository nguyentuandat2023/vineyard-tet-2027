import React, { useState, useEffect } from 'react';
import {
  FileText, Save, RotateCcw, Eye, Smartphone, Monitor, CheckCircle2,
  AlertCircle, Sparkles, Building2, HelpCircle, Layers, ArrowUpRight
} from 'lucide-react';
import { apiClient } from '../apiClient';

export const ContentEditor: React.FC = () => {
  const [content, setContent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'brand' | 'pillars' | 'bulk' | 'faq'>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(false);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await apiClient.request('/api/admin/content');
      setContent(res.content);
    } catch (err) {
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await apiClient.request('/api/admin/content', {
        method: 'PUT',
        body: JSON.stringify(content)
      });
      setMessage({ type: 'success', text: 'Nội dung đã được lưu và cập nhật trực tiếp lên Landing Page!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Lỗi khi lưu nội dung.' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Bạn có chắc chắn muốn khôi phục lại toàn bộ nội dung mặc định ban đầu?')) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await apiClient.request('/api/admin/content/reset', { method: 'POST' });
      setContent(res.content);
      setMessage({ type: 'success', text: 'Đã khôi phục nội dung mặc định ban đầu thành công!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Lỗi khôi phục nội dung.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-[#B52C32] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-stone-500">Đang tải cấu hình nội dung CMS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold font-serif text-stone-900">
            Quản Lý Nội Dung Landing Page (CMS)
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Chỉnh sửa tiêu đề, thông điệp thương hiệu, trụ cột năng lực B2B và chính sách chiết khấu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              showPreview ? 'bg-[#D4AF37] text-stone-900' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{showPreview ? 'Ẩn Xem Trước' : 'Bật Xem Trước'}</span>
          </button>

          <button
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-stone-500" />
            <span>Khôi Phục Mặc Định</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#B52C32] hover:bg-[#9B2228] text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Đang lưu...' : 'Lưu & Xuất Bản Trực Tiếp'}</span>
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-xs ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Grid: Left editor + Right live preview */}
      <div className={`grid grid-cols-1 ${showPreview ? 'lg:grid-cols-2' : ''} gap-6`}>
        {/* Editor Form */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
          {/* Sub tabs */}
          <div className="flex items-center gap-1.5 border-b border-stone-200 pb-3 overflow-x-auto text-xs">
            {[
              { id: 'hero', label: '01. Hero Banner', icon: Sparkles },
              { id: 'brand', label: '02. Thương Hiệu', icon: Building2 },
              { id: 'pillars', label: '03. 4 Trụ Cột B2B', icon: Layers },
              { id: 'bulk', label: '04. Bảng Chiết Khấu', icon: FileText },
              { id: 'faq', label: '05. Câu Hỏi FAQ', icon: HelpCircle }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#B52C32] text-white font-semibold shadow-xs'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: HERO */}
          {activeTab === 'hero' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Huy hiệu trên cùng (Hero Badge)</label>
                <input
                  type="text"
                  value={content.hero.badge || ''}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, badge: e.target.value }
                  })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Tiêu đề chính (Headline)</label>
                <input
                  type="text"
                  value={content.hero.headline || ''}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, headline: e.target.value }
                  })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-serif font-bold text-sm outline-none focus:border-[#B52C32]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Tiêu đề phụ (Sub-Headline)</label>
                <input
                  type="text"
                  value={content.hero.subHeadline || ''}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, subHeadline: e.target.value }
                  })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Mô tả giới thiệu</label>
                <textarea
                  rows={3}
                  value={content.hero.description || ''}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, description: e.target.value }
                  })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: BRAND */}
          {activeTab === 'brand' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Tên Thương Hiệu</label>
                <input
                  type="text"
                  value={content.brand.name || ''}
                  onChange={(e) => setContent({
                    ...content,
                    brand: { ...content.brand, name: e.target.value }
                  })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Slogan Thương Hiệu</label>
                <input
                  type="text"
                  value={content.brand.slogan || ''}
                  onChange={(e) => setContent({
                    ...content,
                    brand: { ...content.brand, slogan: e.target.value }
                  })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Tập Đoàn Chủ Quản</label>
                <input
                  type="text"
                  value={content.brand.parentCompany || ''}
                  onChange={(e) => setContent({
                    ...content,
                    brand: { ...content.brand, parentCompany: e.target.value }
                  })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Hotline tư vấn</label>
                  <input
                    type="text"
                    value={content.brand.hotline || ''}
                    onChange={(e) => setContent({
                      ...content,
                      brand: { ...content.brand, hotline: e.target.value }
                    })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Email nhận báo giá</label>
                  <input
                    type="email"
                    value={content.brand.email || ''}
                    onChange={(e) => setContent({
                      ...content,
                      brand: { ...content.brand, email: e.target.value }
                    })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Địa chỉ văn phòng</label>
                <input
                  type="text"
                  value={content.brand.address || ''}
                  onChange={(e) => setContent({
                    ...content,
                    brand: { ...content.brand, address: e.target.value }
                  })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                />
              </div>
            </div>
          )}

          {/* TAB 3: PILLARS */}
          {activeTab === 'pillars' && (
            <div className="space-y-4 text-xs">
              <p className="text-stone-500">Chỉnh sửa 4 trụ cột cam kết năng lực quà tặng doanh nghiệp:</p>
              {content.pillars.map((pillar: any, index: number) => (
                <div key={pillar.id} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#B52C32]">{pillar.step}.</span>
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => {
                        const updated = [...content.pillars];
                        updated[index].title = e.target.value;
                        setContent({ ...content, pillars: updated });
                      }}
                      className="flex-1 bg-white border border-stone-200 rounded-lg px-2.5 py-1 font-bold text-stone-800"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={pillar.description}
                    onChange={(e) => {
                      const updated = [...content.pillars];
                      updated[index].description = e.target.value;
                      setContent({ ...content, pillars: updated });
                    }}
                    className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-stone-700"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: BULK TIERS */}
          {activeTab === 'bulk' && (
            <div className="space-y-4 text-xs">
              <p className="text-stone-500">Chỉnh sửa 4 nấc thang số lượng đặt hàng & quyền lợi đi kèm:</p>
              {content.bulkTiers.map((tier: any, index: number) => (
                <div key={index} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-stone-900">
                    <input
                      type="text"
                      value={tier.tier}
                      onChange={(e) => {
                        const updated = [...content.bulkTiers];
                        updated[index].tier = e.target.value;
                        setContent({ ...content, bulkTiers: updated });
                      }}
                      className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 w-32 font-bold text-[#B52C32]"
                    />
                    <input
                      type="text"
                      value={tier.sub}
                      onChange={(e) => {
                        const updated = [...content.bulkTiers];
                        updated[index].sub = e.target.value;
                        setContent({ ...content, bulkTiers: updated });
                      }}
                      className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 flex-1 font-medium"
                    />
                  </div>
                  <input
                    type="text"
                    value={tier.target}
                    onChange={(e) => {
                      const updated = [...content.bulkTiers];
                      updated[index].target = e.target.value;
                      setContent({ ...content, bulkTiers: updated });
                    }}
                    className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-stone-600 italic"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-4 text-xs">
              <p className="text-stone-500">Chỉnh sửa danh sách 6 câu hỏi thường gặp của khách hàng doanh nghiệp:</p>
              {content.faqList.map((faq: any, index: number) => (
                <div key={index} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <input
                    type="text"
                    value={faq.q}
                    onChange={(e) => {
                      const updated = [...content.faqList];
                      updated[index].q = e.target.value;
                      setContent({ ...content, faqList: updated });
                    }}
                    className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1 font-bold text-stone-800"
                  />
                  <textarea
                    rows={2}
                    value={faq.a}
                    onChange={(e) => {
                      const updated = [...content.faqList];
                      updated[index].a = e.target.value;
                      setContent({ ...content, faqList: updated });
                    }}
                    className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-stone-700"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Preview Panel */}
        {showPreview && (
          <div className="bg-stone-900 p-4 rounded-2xl shadow-xl flex flex-col h-[700px]">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 text-xs text-stone-400">
              <span className="font-semibold text-stone-200">Xem Trước Trực Quan</span>
              <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-lg">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-1.5 rounded cursor-pointer ${previewMode === 'desktop' ? 'bg-stone-700 text-white' : 'text-stone-400'}`}
                  title="Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-1.5 rounded cursor-pointer ${previewMode === 'mobile' ? 'bg-stone-700 text-white' : 'text-stone-400'}`}
                  title="Mobile View"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
              <div className={`h-full bg-white transition-all duration-300 rounded-xl overflow-hidden shadow-2xl border border-stone-800 ${
                previewMode === 'mobile' ? 'w-[375px]' : 'w-full'
              }`}>
                <iframe
                  src="/"
                  title="Live Preview"
                  className="w-full h-full border-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

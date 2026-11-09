import React, { useState, useEffect } from 'react';
import {
  Globe, Search, Share2, Save, CheckCircle2, Code2, Eye,
  RefreshCw, Check
} from 'lucide-react';
import { apiClient } from '../apiClient';

export const SeoManagement: React.FC = () => {
  const [seo, setSeo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const fetchSeo = async () => {
    setLoading(true);
    try {
      const res = await apiClient.request('/api/admin/seo');
      setSeo(res.seo);
    } catch (err) {
      console.error('Error fetching SEO:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeo();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.request('/api/admin/seo', {
        method: 'PUT',
        body: JSON.stringify(seo)
      });
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Lỗi lưu SEO');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !seo) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-[#B52C32] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold font-serif text-stone-900">
            Quản Trị SEO & Thẻ Chia Sẻ Mạng Xã Hội (OpenGraph)
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Tối ưu thẻ meta hiển thị kết quả tìm kiếm Google, xem trước hiển thị khi gửi link qua Zalo/Facebook và cấu trúc Schema JSON-LD
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#B52C32] hover:bg-[#9B2228] text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Đang lưu...' : 'Lưu Cấu Hình SEO'}</span>
        </button>
      </div>

      {savedMessage && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Cấu hình SEO đã được lưu thành công!</span>
        </div>
      )}

      {/* Grid: Editor + Preview Snippets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Form */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4 text-xs">
          <h2 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">
            Thẻ Tiêu Đề & Mô Tả Meta
          </h2>

          <div>
            <label className="block text-stone-700 font-bold mb-1">
              Tiêu Đề Trang (Meta Title) <span className="text-stone-400 font-normal">({seo.title?.length || 0}/60 ký tự)</span>
            </label>
            <input
              type="text"
              value={seo.title}
              onChange={(e) => setSeo({ ...seo, title: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">
              Mô Tả Meta (Meta Description) <span className="text-stone-400 font-normal">({seo.metaDescription?.length || 0}/160 ký tự)</span>
            </label>
            <textarea
              rows={3}
              value={seo.metaDescription}
              onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">Từ Khóa Chính (Keywords)</label>
            <input
              type="text"
              value={seo.keywords}
              onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">Đường Dẫn Chuẩn (Canonical URL)</label>
            <input
              type="text"
              value={seo.canonical}
              onChange={(e) => setSeo({ ...seo, canonical: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">Đường Dẫn Ảnh Chia Sẻ (OpenGraph Image)</label>
            <input
              type="text"
              value={seo.ogImage}
              onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-mono text-[11px] outline-none focus:border-[#B52C32]"
            />
          </div>
        </div>

        {/* Live SERP and Social Card Previews */}
        <div className="space-y-6">
          {/* Google SERP Preview */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 border-b border-stone-100 pb-2">
              <Search className="w-3.5 h-3.5 text-blue-600" />
              <span>Xem Trước Kết Quả Tìm Kiếm Google (Google SERP)</span>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-1">
              <div className="text-[11px] text-stone-500 truncate flex items-center gap-1">
                <span>https://vineyard.vn</span>
                <span>› qua-tet-doanh-nghiep</span>
              </div>
              <h3 className="text-base text-blue-800 font-medium hover:underline cursor-pointer line-clamp-1">
                {seo.title}
              </h3>
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                {seo.metaDescription}
              </p>
            </div>
          </div>

          {/* Social Share Card Preview (Facebook / Zalo) */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 border-b border-stone-100 pb-2">
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Xem Trước Khi Chia Sẻ Qua Zalo / Facebook</span>
            </div>

            <div className="bg-stone-50 rounded-xl border border-stone-200/80 overflow-hidden shadow-xs">
              <div className="h-36 bg-stone-800 overflow-hidden flex items-center justify-center">
                <img
                  src={seo.ogImage}
                  alt="OpenGraph"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 bg-white space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400">VINEYARD.VN</span>
                <h4 className="font-bold text-xs text-stone-900 line-clamp-1">{seo.title}</h4>
                <p className="text-[11px] text-stone-500 line-clamp-2">{seo.metaDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

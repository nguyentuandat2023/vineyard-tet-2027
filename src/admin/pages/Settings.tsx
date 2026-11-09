import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon, Save, Building2, Tag, Shield, Globe,
  CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import { apiClient } from '../apiClient';
import { SystemSettings } from '../types';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await apiClient.request('/api/admin/settings');
      setSettings(res.settings);
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await apiClient.request('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Lỗi lưu cài đặt');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
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
            Cài Đặt Hệ Thống & Cấu Hình Tracking MarTech
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Thông tin pháp nhân doanh nghiệp, mã định danh GTM / GA4 / Pixel và chính sách bảo mật hệ thống
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#B52C32] hover:bg-[#9B2228] text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Đang lưu...' : 'Lưu Toàn Bộ Cấu Hình'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Cấu hình hệ thống đã được lưu và cập nhật ngay lập tức!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Section 1: Business Information */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-2 font-bold text-stone-900 text-sm">
            <Building2 className="w-4 h-4 text-[#B52C32]" />
            <span>Thông Tin Pháp Nhân Doanh Nghiệp</span>
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">Tên Công Ty / Tập Đoàn Chủ Quản</label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Mã Số Thuế (MST)</label>
              <input
                type="text"
                value={settings.taxCode}
                onChange={(e) => setSettings({ ...settings, taxCode: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-bold mb-1">Email Nhận Báo Giá</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Hotline CSKH B2B</label>
              <input
                type="text"
                value={settings.hotline}
                onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-bold mb-1">Số Zalo B2B</label>
              <input
                type="text"
                value={settings.zalo}
                onChange={(e) => setSettings({ ...settings, zalo: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">Địa Chỉ Văn Phòng Trụ Sở</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
            />
          </div>
        </div>

        {/* Section 2: Marketing & Security */}
        <div className="space-y-6">
          {/* Tracking IDs */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-2 font-bold text-stone-900 text-sm">
              <Tag className="w-4 h-4 text-indigo-600" />
              <span>Mã Tracking & Thẻ Quảng Cáo</span>
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Google Tag Manager Container ID</label>
              <input
                type="text"
                value={settings.gtmId}
                onChange={(e) => setSettings({ ...settings, gtmId: e.target.value })}
                placeholder="GTM-XXXXXXX"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono text-stone-800 outline-none focus:border-[#B52C32]"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Google Analytics 4 Measurement ID</label>
              <input
                type="text"
                value={settings.ga4Id}
                onChange={(e) => setSettings({ ...settings, ga4Id: e.target.value })}
                placeholder="G-XXXXXXXXXX"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono text-stone-800 outline-none focus:border-[#B52C32]"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Meta Pixel ID (Facebook Ads)</label>
              <input
                type="text"
                value={settings.metaPixelId}
                onChange={(e) => setSettings({ ...settings, metaPixelId: e.target.value })}
                placeholder="109283746501928"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono text-stone-800 outline-none focus:border-[#B52C32]"
              />
            </div>
          </div>

          {/* System & Security */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-2 font-bold text-stone-900 text-sm">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Bảo Mật & Vận Hành Hệ Thống</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Thời Gian Phiên Đăng Nhập</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={settings.sessionTimeoutMinutes}
                    onChange={(e) => setSettings({ ...settings, sessionTimeoutMinutes: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                  />
                  <span className="text-stone-500 text-[11px] shrink-0">phút</span>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Múi Giờ Hệ Thống</label>
                <input
                  type="text"
                  readOnly
                  value={settings.timezone}
                  className="w-full bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-stone-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Cảnh Báo Pháp Lý (Nghị định 24/2020/NĐ-CP)</label>
              <textarea
                rows={2}
                value={settings.complianceText}
                onChange={(e) => setSettings({ ...settings, complianceText: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-700 outline-none focus:border-[#B52C32]"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

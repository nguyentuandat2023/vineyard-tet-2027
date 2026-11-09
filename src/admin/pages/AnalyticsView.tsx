import React, { useState, useEffect } from 'react';
import {
  BarChart2, TrendingUp, ShieldCheck, CheckCircle2, Monitor, Smartphone,
  Activity, ArrowDown, RefreshCw, Layers
} from 'lucide-react';
import { apiClient } from '../apiClient';

export const AnalyticsView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await apiClient.request('/api/admin/analytics');
      setData(res);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-[#B52C32] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-stone-500">Đang đồng bộ luồng dữ liệu Google Analytics 4...</p>
        </div>
      </div>
    );
  }

  const { trackingIds = {}, consentModeV2 = {}, funnel = [], eventCounts = {}, recentEvents = [] } = data || {};

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold font-serif text-stone-900">
            Phân Tích Chuyển Đổi & Đo Lường GA4
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Báo cáo phễu chuyển đổi khách hàng doanh nghiệp, hiệu quả tương tác và tuân thủ Google Consent Mode v2
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-1.5 px-3 py-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-700 text-xs font-semibold transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
          <span>Làm Mới</span>
        </button>
      </div>

      {/* Integration Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-semibold block">Google Analytics 4 ID</span>
            <span className="font-mono font-bold text-sm text-stone-900 mt-0.5 block">{trackingIds.ga4}</span>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Đã kết nối
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-semibold block">Google Tag Manager ID</span>
            <span className="font-mono font-bold text-sm text-stone-900 mt-0.5 block">{trackingIds.gtm}</span>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Hoạt động
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-semibold block">Google Consent Mode v2</span>
            <span className="font-bold text-xs text-stone-800 mt-0.5 block">Granted (Toàn quyền)</span>
          </div>
          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Chuẩn EU/VN
          </span>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
        <div>
          <h2 className="font-bold text-stone-900 text-sm">Phễu Chuyển Đổi Khách Hàng Doanh Nghiệp (B2B Conversion Funnel)</h2>
          <p className="text-xs text-stone-500 mt-0.5">Hành trình người dùng từ lúc truy cập trang đến khi gửi form báo giá thành công</p>
        </div>

        <div className="space-y-3 pt-2">
          {funnel.map((item: any, idx: number) => {
            const maxVal = funnel[0]?.count || 1;
            const pct = Math.round((item.count / maxVal) * 100);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800">{item.step}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-stone-900">{item.count}</span>
                    <span className="text-stone-400 text-[11px]">({pct}% so với bước 1)</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      idx === 0 ? 'bg-indigo-500' :
                      idx === 1 ? 'bg-blue-500' :
                      idx === 2 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.max(pct, 5)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time events stream */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-stone-900 text-sm">Nhật Ký Tương Tác Thời Gian Thực (DataLayer & Analytics Events)</h2>
            <p className="text-xs text-stone-500 mt-0.5">Các sự kiện được bắn tự động từ Landing Page sang hệ thống quản trị</p>
          </div>
          <Activity className="w-4 h-4 text-emerald-500" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-2.5 px-3">Thời Gian</th>
                <th className="py-2.5 px-3">Tên Sự Kiện (Event)</th>
                <th className="py-2.5 px-3">Dữ Liệu Đính Kèm (Parameters)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono text-stone-700">
              {recentEvents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-stone-400 font-sans">
                    Đang lắng nghe sự kiện tương tác từ người truy cập website...
                  </td>
                </tr>
              ) : (
                recentEvents.map((evt: any) => (
                  <tr key={evt.id} className="hover:bg-stone-50">
                    <td className="py-2 px-3 text-stone-400 text-[11px]">
                      {new Date(evt.createdAt).toLocaleTimeString('vi-VN')}
                    </td>
                    <td className="py-2 px-3 font-semibold text-[#B52C32]">{evt.event}</td>
                    <td className="py-2 px-3 text-[11px] text-stone-600 truncate max-w-md">
                      {JSON.stringify(evt.data)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

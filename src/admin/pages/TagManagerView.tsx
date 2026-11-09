import React, { useState, useEffect } from 'react';
import {
  Tag, CheckCircle2, ShieldCheck, Play, ArrowRight, Activity,
  Sparkles, RefreshCw, Check
} from 'lucide-react';
import { apiClient } from '../apiClient';

export const TagManagerView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<string | null>(null);

  const fetchGtm = async () => {
    setLoading(true);
    try {
      const res = await apiClient.request('/api/admin/tag-manager');
      setData(res.gtmContainer);
    } catch (err) {
      console.error('Error fetching GTM:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGtm();
  }, []);

  const handleTestTrigger = async (eventName: string) => {
    try {
      await fetch('/api/public/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: eventName,
          data: { test: true, triggeredBy: 'Admin Simulator', timestamp: Date.now() }
        })
      });
      setTestResult(`Đã bắn thành công sự kiện "${eventName}" vào DataLayer & Database!`);
      setTimeout(() => setTestResult(null), 3000);
    } catch (err) {
      alert('Lỗi kích hoạt sự kiện kiểm thử');
    }
  };

  if (loading || !data) {
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
            Quản Lý Thẻ & DataLayer (Google Tag Manager)
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Giám sát cấu hình container, các trigger sự kiện chuyển đổi và kích hoạt kiểm thử DataLayer trực tiếp
          </p>
        </div>

        <div className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Container Live: {data.id}</span>
        </div>
      </div>

      {testResult && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{testResult}</span>
        </div>
      )}

      {/* Triggers Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-stone-900 text-sm">Danh Sách Triggers & Biến DataLayer Đã Thiết Lập</h2>
            <p className="text-xs text-stone-500 mt-0.5">Các thẻ này sẽ tự động chuyển tiếp dữ liệu đến Google Ads, GA4 và Meta Pixel</p>
          </div>
          <Tag className="w-4 h-4 text-[#B52C32]" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Tên Thẻ / Trigger</th>
                <th className="py-3 px-4">Loại Kích Hoạt</th>
                <th className="py-3 px-4">Sự Kiện DataLayer</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Kích Hoạt Thử (Test)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {data.triggers.map((trig: any, idx: number) => (
                <tr key={idx} className="hover:bg-stone-50 transition">
                  <td className="py-3 px-4 font-bold text-stone-900">{trig.name}</td>
                  <td className="py-3 px-4 text-stone-600">{trig.type}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-indigo-700">{trig.event}</td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Hoạt động
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleTestTrigger(trig.event)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-[#B52C32] hover:text-white rounded-lg text-stone-700 font-semibold text-[11px] transition cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                      <span>Test Trigger</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Snippet Verification */}
      <div className="bg-stone-900 text-stone-200 p-5 rounded-2xl space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-stone-400 border-b border-stone-800 pb-2">
          <span className="font-sans font-bold text-stone-100">Đoạn Mã Đo Lường Tiêu Chuẩn Trong index.html:</span>
          <span className="text-[11px] text-emerald-400">Đã chèn tự động trên toàn bộ trang</span>
        </div>
        <pre className="text-[11px] text-stone-300 overflow-x-auto leading-relaxed">
{`<!-- Google Consent Mode v2 & DataLayer Initialization -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    'ad_storage': 'granted',
    'ad_user_data': 'granted',
    'ad_personalization': 'granted',
    'analytics_storage': 'granted'
  });
</script>`}
        </pre>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  BarChart3, Printer, Download, RefreshCw, FileText, CheckCircle2,
  PieChart, TrendingUp, Layers
} from 'lucide-react';
import { apiClient } from '../apiClient';

export const Reports: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await apiClient.request('/api/admin/reports');
      setData(res.reports);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const token = apiClient.getToken();
    window.open(`/api/admin/customers/export-csv${token ? `?token=${token}` : ''}`, '_blank');
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-[#B52C32] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { sourceStats = {}, tierStats = {}, productStats = {}, totalOrders = 0, totalRevenue = 0 } = data || {};

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs print:hidden">
        <div>
          <h1 className="text-xl font-bold font-serif text-stone-900">
            Báo Cáo & Thống Kê Tổng Hợp Quà Tết 2027
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Tổng hợp dữ liệu nguồn tiếp cận, phân khúc sản lượng đặt hàng và cơ cấu sản phẩm được ưa chuộng
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-stone-500" />
            <span>In Báo Cáo</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#B52C32] hover:bg-[#9B2228] text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Tải Toàn Bộ CSV</span>
          </button>
        </div>
      </div>

      {/* Printable Report View */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-6 print:border-none print:shadow-none">
        {/* Report Meta Header */}
        <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest block">VINEYARD.VN – BÌNH MINH GROUP</span>
            <h2 className="text-lg font-bold font-serif text-stone-900">BẢNG TỔNG HỢP NHU CẦU QUÀ TẾT DOANH NGHIỆP 2027</h2>
          </div>
          <div className="text-right text-xs text-stone-500">
            <div>Ngày kết xuất: <strong>{new Date().toLocaleDateString('vi-VN')}</strong></div>
            <div>Trạng thái: <strong>Dữ liệu thời gian thực</strong></div>
          </div>
        </div>

        {/* 3 Columns Grid for 3 Core Reports */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Section 1: By Marketing Source */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
            <h3 className="font-bold text-stone-900 text-xs flex items-center gap-1.5 border-b border-stone-200 pb-2">
              <TrendingUp className="w-3.5 h-3.5 text-[#B52C32]" />
              Theo Kênh Tiếp Thị (Source)
            </h3>
            <div className="space-y-2">
              {Object.entries(sourceStats).map(([src, count]: [string, any], idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-stone-100">
                  <span className="text-stone-700 font-medium">{src}</span>
                  <span className="font-bold text-[#B52C32]">{count} leads</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: By Quantity Tier */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
            <h3 className="font-bold text-stone-900 text-xs flex items-center gap-1.5 border-b border-stone-200 pb-2">
              <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
              Theo Quy Mô Đặt Hàng (Tiers)
            </h3>
            <div className="space-y-2">
              {Object.entries(tierStats).map(([tier, count]: [string, any], idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-stone-100">
                  <span className="text-stone-700 font-medium">{tier}</span>
                  <span className="font-bold text-emerald-700">{count} đơn vị</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: By Hamper Type */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
            <h3 className="font-bold text-stone-900 text-xs flex items-center gap-1.5 border-b border-stone-200 pb-2">
              <PieChart className="w-3.5 h-3.5 text-indigo-600" />
              Sản Phẩm Được Quan Tâm Nhất
            </h3>
            <div className="space-y-2">
              {Object.entries(productStats).map(([prod, count]: [string, any], idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-stone-100">
                  <span className="text-stone-700 font-medium truncate max-w-[130px]">{prod}</span>
                  <span className="font-bold text-stone-900">{count} lượt</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Business Summary Notes */}
        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 text-xs text-stone-700 space-y-1.5">
          <strong className="block text-amber-900">Đánh giá chung từ Ban Điều Hành:</strong>
          <p className="leading-relaxed">
            Nhu cầu quà Tết phân khúc 100-499 hộp và trên 500 hộp chiếm tỷ trọng cao trong tuần qua. Mẫu <em>HAMPER GOLDEN PROSPERITY</em> và <em>HAMPER ORIENTAL CELEBRATION</em> có tỷ lệ quan tâm cao nhất. Kênh Google Ads và Zalo B2B đạt chi phí trên mỗi khách hàng tiềm năng tối ưu nhất.
          </p>
        </div>
      </div>
    </div>
  );
};

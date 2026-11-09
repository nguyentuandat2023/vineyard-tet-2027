import React, { useState, useEffect } from 'react';
import {
  Users, TrendingUp, PhoneCall, MessageCircle, DollarSign,
  Package, Award, ArrowUpRight, Clock, ShieldCheck, RefreshCw,
  FileCheck, Layers, ChevronRight
} from 'lucide-react';
import { apiClient } from '../apiClient';

interface DashboardProps {
  onNavigate: (module: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | 'all'>('all');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await apiClient.request('/api/admin/dashboard-stats');
      setData(res.stats);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#B52C32] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-stone-500">Đang tải chỉ số điều hành...</p>
        </div>
      </div>
    );
  }

  const {
    totalLeads = 0,
    newLeads = 0,
    closedDeals = 0,
    totalOrderValue = 0,
    totalDepositReceived = 0,
    hotlineClicks = 0,
    zaloClicks = 0,
    quoteCtaClicks = 0,
    conversionRate = '0',
    statusCounts = {},
    productInterestMap = {},
    recentLeads = [],
    recentActivities = []
  } = data || {};

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl font-bold font-serif text-stone-900">
              Bảng Điều Hành Doanh Nghiệp – Tết 2027
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Theo dõi thời gian thực các yêu cầu báo giá B2B, tương tác khách hàng & hiệu quả chuyển đổi
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range switcher */}
          <div className="bg-stone-100 p-1 rounded-xl flex items-center text-xs font-medium text-stone-600">
            {(['today', '7d', '30d', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  timeRange === r ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'hover:text-stone-900'
                }`}
              >
                {r === 'today' ? 'Hôm nay' : r === '7d' ? '7 ngày' : r === '30d' ? '30 ngày' : 'Tất cả'}
              </button>
            ))}
          </div>

          <button
            onClick={fetchStats}
            title="Làm mới dữ liệu"
            className="p-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-600 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Leads */}
        <div
          onClick={() => onNavigate('customers')}
          className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-[#D4AF37] transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Tổng Yêu Cầu Báo Giá</span>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#B52C32] flex items-center justify-center group-hover:bg-[#B52C32] group-hover:text-white transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-stone-900">{totalLeads}</span>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              +{newLeads} mới
            </span>
          </div>
          <div className="mt-2 text-[11px] text-stone-400 flex items-center justify-between">
            <span>Tỷ lệ chốt hợp đồng: <strong className="text-stone-700">{conversionRate}%</strong></span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* Card 2: Pipeline Contract Value */}
        <div
          onClick={() => onNavigate('orders')}
          className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-[#D4AF37] transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Giá Trị Đơn Đã Ký</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-serif text-stone-900">
              {(totalOrderValue / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} Tr
            </span>
          </div>
          <div className="mt-2 text-[11px] text-stone-400 flex items-center justify-between">
            <span>Tiền cọc nhận: <strong className="text-emerald-600">{(totalDepositReceived / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} Tr</strong></span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* Card 3: Hotlines & Zalo Interactions */}
        <div
          onClick={() => onNavigate('analytics')}
          className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-[#D4AF37] transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Tương Tác Nhanh B2B</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
              <PhoneCall className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <div>
              <span className="text-xs text-stone-400 block">Gọi Hotline</span>
              <span className="text-lg font-bold text-stone-900">{hotlineClicks}</span>
            </div>
            <div className="border-l border-stone-200 pl-3">
              <span className="text-xs text-stone-400 block">Chat Zalo</span>
              <span className="text-lg font-bold text-stone-900">{zaloClicks}</span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-stone-400 flex items-center justify-between">
            <span>Click nút CTA Báo Giá: <strong className="text-stone-700">{quoteCtaClicks}</strong></span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* Card 4: Deals Closed */}
        <div
          onClick={() => onNavigate('orders')}
          className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-[#D4AF37] transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Hợp Đồng Thành Công</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-stone-900">{closedDeals}</span>
            <span className="text-xs text-stone-500 font-medium">doanh nghiệp chốt</span>
          </div>
          <div className="mt-2 text-[11px] text-stone-400 flex items-center justify-between">
            <span>Đang thương thảo: <strong className="text-amber-600">{statusCounts['ĐANG THƯƠNG THẢO'] || 0}</strong></span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition" />
          </div>
        </div>
      </div>

      {/* Middle Row: Status Funnel & Top Hamper Interests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Status Breakdown */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-stone-900 text-sm">Phân Bổ Trạng Thái Tiếp Nhận Khách Hàng</h2>
              <p className="text-xs text-stone-500">Tiến độ chăm sóc khách hàng qua từng giai đoạn phễu B2B</p>
            </div>
            <button
              onClick={() => onNavigate('customers')}
              className="text-xs text-[#B52C32] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Xem CRM</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Mới tiếp nhận', count: statusCounts['MỚI'] || 0, color: 'bg-blue-500' },
              { label: 'Đang liên hệ tư vấn', count: statusCounts['ĐANG LIÊN HỆ'] || 0, color: 'bg-indigo-500' },
              { label: 'Đã gửi bảng báo giá & mẫu', count: statusCounts['ĐÃ BÁO GIÁ'] || 0, color: 'bg-amber-500' },
              { label: 'Đang thương thảo hợp đồng', count: statusCounts['ĐANG THƯƠNG THẢO'] || 0, color: 'bg-purple-500' },
              { label: 'Chốt hợp đồng thành công', count: statusCounts['THÀNH CÔNG'] || 0, color: 'bg-emerald-500' },
              { label: 'Hủy / Chưa phù hợp', count: statusCounts['HỦY'] || 0, color: 'bg-stone-400' }
            ].map((item, idx) => {
              const pct = totalLeads > 0 ? Math.round((item.count / totalLeads) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-700">{item.label}</span>
                    <span className="font-semibold text-stone-900">{item.count} leads ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Hamper Interest Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-stone-900 text-sm">Hộp Quà Được Quan Tâm Nhất</h2>
              <Package className="w-4 h-4 text-[#D4AF37]" />
            </div>

            <div className="space-y-3">
              {Object.entries(productInterestMap).map(([prodName, count]: [string, any], idx) => {
                const total = Number(totalLeads) || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={idx} className="p-2.5 rounded-xl border border-stone-100 hover:bg-stone-50 transition">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-stone-800 line-clamp-1">{prodName}</span>
                      <span className="font-bold text-[#B52C32] shrink-0 ml-2">{count} lượt</span>
                    </div>
                    <div className="mt-1.5 w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B52C32] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-500">Xem danh mục 5 mẫu:</span>
            <button
              onClick={() => onNavigate('products')}
              className="text-[#B52C32] font-semibold hover:underline cursor-pointer"
            >
              Quản lý sản phẩm →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Leads Table & Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-stone-900 text-sm">Yêu Cầu Báo Giá Gần Đây</h2>
            <button
              onClick={() => onNavigate('customers')}
              className="text-xs text-[#B52C32] font-semibold hover:underline cursor-pointer"
            >
              Xem tất cả ({totalLeads}) →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider border-y border-stone-100">
                <tr>
                  <th className="py-2.5 px-3">Khách hàng / Công ty</th>
                  <th className="py-2.5 px-3">Số điện thoại</th>
                  <th className="py-2.5 px-3">Sản phẩm quan tâm</th>
                  <th className="py-2.5 px-3">Số lượng</th>
                  <th className="py-2.5 px-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {recentLeads.map((c: any) => (
                  <tr
                    key={c.id}
                    onClick={() => onNavigate('customers')}
                    className="hover:bg-stone-50/80 cursor-pointer transition"
                  >
                    <td className="py-3 px-3">
                      <div className="font-semibold text-stone-900">{c.fullName}</div>
                      <div className="text-[11px] text-stone-500 truncate max-w-[180px]">{c.companyName}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-stone-600">{c.phone}</td>
                    <td className="py-3 px-3 text-stone-800 font-medium truncate max-w-[160px]">{c.interestedProduct}</td>
                    <td className="py-3 px-3">
                      <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                        {c.quantityRange}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        c.status === 'MỚI' ? 'bg-blue-100 text-blue-700' :
                        c.status === 'ĐÃ BÁO GIÁ' ? 'bg-amber-100 text-amber-800' :
                        c.status === 'ĐANG THƯƠNG THẢO' ? 'bg-purple-100 text-purple-700' :
                        c.status === 'THÀNH CÔNG' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-stone-100 text-stone-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Activity Feed */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-stone-900 text-sm">Nhật Ký Thao Tác</h2>
            <Clock className="w-4 h-4 text-stone-400" />
          </div>

          <div className="space-y-3.5">
            {recentActivities.map((act: any) => (
              <div key={act.id} className="flex items-start gap-2.5 text-xs">
                <div className="w-2 h-2 rounded-full bg-[#B52C32] mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="font-semibold text-stone-900">{act.action}</span>
                    <span className="text-[10px] text-stone-400">
                      {new Date(act.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 line-clamp-2 mt-0.5">{act.details}</p>
                  <span className="text-[10px] text-stone-400">bởi {act.adminName}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-center">
            <button
              onClick={() => onNavigate('activity-logs')}
              className="text-xs text-[#B52C32] font-semibold hover:underline cursor-pointer"
            >
              Xem toàn bộ nhật ký kiểm toán →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

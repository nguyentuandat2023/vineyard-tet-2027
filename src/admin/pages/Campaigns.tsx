import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Plus, Link as LinkIcon, Copy, Check, DollarSign,
  Users, BarChart3, Trash2, ArrowUpRight, Sparkles, Filter, X
} from 'lucide-react';
import { apiClient } from '../apiClient';
import { CampaignRecord } from '../types';

export const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // UTM Generator Form state
  const [baseUrl, setBaseUrl] = useState('https://vineyard.vn/');
  const [utmSource, setUtmSource] = useState('google');
  const [utmMedium, setUtmMedium] = useState('cpc');
  const [utmCampaign, setUtmCampaign] = useState('tet-2027-corporate-gifts');
  const [utmTerm, setUtmTerm] = useState('hop qua tet doanh nghiep');
  const [utmContent, setUtmContent] = useState('banner_luxury_hamper');
  const [copied, setCopied] = useState(false);

  // New campaign modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    channel: 'Google Ads' as CampaignRecord['channel'],
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: '',
    budget: 20000000,
    impressions: 15000,
    clicks: 1200,
    status: 'Đang chạy' as CampaignRecord['status'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2027-01-25'
  });

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await apiClient.request('/api/admin/campaigns');
      setCampaigns(res.campaigns);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Compute live generated URL
  const generatedUrl = (() => {
    try {
      const url = new URL(baseUrl);
      if (utmSource) url.searchParams.set('utm_source', utmSource);
      if (utmMedium) url.searchParams.set('utm_medium', utmMedium);
      if (utmCampaign) url.searchParams.set('utm_campaign', utmCampaign);
      if (utmTerm) url.searchParams.set('utm_term', utmTerm);
      if (utmContent) url.searchParams.set('utm_content', utmContent);
      return url.toString();
    } catch {
      return baseUrl;
    }
  })();

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.request('/api/admin/campaigns', {
        method: 'POST',
        body: JSON.stringify(newCampaign)
      });
      setShowAddModal(false);
      fetchCampaigns();
    } catch (err: any) {
      alert(err.message || 'Lỗi thêm chiến dịch');
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa chiến dịch này?')) return;
    try {
      await apiClient.request(`/api/admin/campaigns/${id}`, { method: 'DELETE' });
      fetchCampaigns();
    } catch (err: any) {
      alert(err.message || 'Lỗi xóa chiến dịch');
    }
  };

  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const totalLeads = campaigns.reduce((sum, c) => sum + (c.leadsCount || 0), 0);
  const avgCpl = totalLeads > 0 ? Math.round(totalBudget / totalLeads) : 0;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold font-serif text-stone-900">
            Chiến Dịch Marketing & Trình Tạo Link UTM
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Đo lường chi phí trên mỗi khách hàng tiềm năng (CPL), hiệu quả kênh quảng cáo và gắn thẻ chuẩn GA4
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#B52C32] hover:bg-[#9B2228] text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Chiến Dịch Mới</span>
        </button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 uppercase font-semibold">Tổng Ngân Sách Tiếp Thị</span>
          <div className="text-xl font-bold font-serif text-stone-900 mt-1">
            {(totalBudget / 1000000).toLocaleString('vi-VN')} Triệu VNĐ
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">{campaigns.length} chiến dịch đang theo dõi</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 uppercase font-semibold">Khách Hàng Mang Về (Leads)</span>
          <div className="text-xl font-bold font-serif text-emerald-600 mt-1">
            {totalLeads} Leads Doanh Nghiệp
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">Thu thập tự động qua Landing Page</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 uppercase font-semibold">Chi Phí Bình Quân / Lead (CPL)</span>
          <div className="text-xl font-bold font-serif text-[#B52C32] mt-1">
            {avgCpl.toLocaleString('vi-VN')} VNĐ
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">Tối ưu hơn 35% so với năm 2026</span>
        </div>
      </div>

      {/* UTM BUILDER COMPONENT */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <LinkIcon className="w-4 h-4 text-[#B52C32]" />
          <h2 className="font-bold text-stone-900 text-sm">Công Cụ Tạo Link Gắn Thẻ UTM (Campaign URL Builder)</h2>
        </div>

        <p className="text-xs text-stone-500">
          Sử dụng liên kết này khi chạy quảng cáo Facebook Ads, Google Ads hoặc gửi tin nhắn Zalo để hệ thống tự động ghi nhận nguồn và tính CPL chính xác:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-stone-700 font-semibold mb-1">Nguồn (utm_source) *</label>
            <input
              type="text"
              value={utmSource}
              onChange={(e) => setUtmSource(e.target.value)}
              placeholder="google, facebook, zalo, email"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Phương Tiện (utm_medium) *</label>
            <input
              type="text"
              value={utmMedium}
              onChange={(e) => setUtmMedium(e.target.value)}
              placeholder="cpc, feed_video, direct_msg, email"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Tên Chiến Dịch (utm_campaign) *</label>
            <input
              type="text"
              value={utmCampaign}
              onChange={(e) => setUtmCampaign(e.target.value)}
              placeholder="tet-2027-corporate-gifts"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
            />
          </div>
        </div>

        {/* Live URL Output Box */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="font-mono text-xs text-stone-800 break-all select-all flex-1">
            {generatedUrl}
          </div>

          <button
            onClick={handleCopyUrl}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition cursor-pointer ${
              copied ? 'bg-emerald-600 text-white' : 'bg-[#B52C32] hover:bg-[#9B2228] text-white'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã Sao Chép!' : 'Sao Chép Link'}</span>
          </button>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Tên Chiến Dịch</th>
                <th className="py-3 px-4">Kênh Quảng Cáo</th>
                <th className="py-3 px-4">Mã UTM Campaign</th>
                <th className="py-3 px-4">Ngân Sách</th>
                <th className="py-3 px-4">Lượt Xem / Click</th>
                <th className="py-3 px-4">Leads Mang Về</th>
                <th className="py-3 px-4">Chi Phí / Lead (CPL)</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Xóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-stone-400">Đang tải dữ liệu chiến dịch...</td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-stone-400">Chưa có chiến dịch nào được cấu hình.</td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-stone-900">{c.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {c.channel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-indigo-700 font-semibold">{c.utmCampaign}</td>
                    <td className="py-3.5 px-4 font-semibold text-stone-900">{c.budget.toLocaleString('vi-VN')} đ</td>
                    <td className="py-3.5 px-4 text-stone-600">
                      <div>{c.impressions.toLocaleString('vi-VN')} views</div>
                      <div className="text-[10px] text-stone-400">{c.clicks.toLocaleString('vi-VN')} clicks ({c.ctr}%)</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">{c.leadsCount || 0} Leads</td>
                    <td className="py-3.5 px-4 font-bold text-[#B52C32]">
                      {c.costPerLead ? `${c.costPerLead.toLocaleString('vi-VN')} đ` : 'Chưa có lead'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Đang chạy' ? 'bg-emerald-100 text-emerald-800' :
                        c.status === 'Tạm dừng' ? 'bg-amber-100 text-amber-800' :
                        'bg-stone-100 text-stone-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteCampaign(c.id)}
                        className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition cursor-pointer"
                        title="Xóa chiến dịch"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Campaign Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-stone-900 text-sm">Thêm Chiến Dịch Tiếp Thị Mới</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-stone-200 rounded-lg text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Tên Chiến Dịch *</label>
                <input
                  type="text"
                  required
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  placeholder="Ví dụ: Google Ads Tìm Kiếm Tết Doanh Nghiệp"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Kênh Tiếp Thị</label>
                  <select
                    value={newCampaign.channel}
                    onChange={(e: any) => setNewCampaign({ ...newCampaign, channel: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none cursor-pointer"
                  >
                    <option value="Google Ads">Google Ads</option>
                    <option value="Facebook Ads">Facebook Ads</option>
                    <option value="Zalo B2B">Zalo B2B</option>
                    <option value="Email Direct">Email Direct</option>
                    <option value="SEO Organic">SEO Organic</option>
                    <option value="Event B2B">Event B2B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Mã UTM Campaign</label>
                  <input
                    type="text"
                    required
                    value={newCampaign.utmCampaign}
                    onChange={(e) => setNewCampaign({ ...newCampaign, utmCampaign: e.target.value })}
                    placeholder="tet-2027-search"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Ngân Sách Dự Kiến (VNĐ)</label>
                  <input
                    type="number"
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign({ ...newCampaign, budget: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Trạng Thái</label>
                  <select
                    value={newCampaign.status}
                    onChange={(e: any) => setNewCampaign({ ...newCampaign, status: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none cursor-pointer"
                  >
                    <option value="Đang chạy">Đang chạy</option>
                    <option value="Tạm dừng">Tạm dừng</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold rounded-xl transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#B52C32] hover:bg-[#9B2228] text-white font-semibold rounded-xl transition cursor-pointer shadow-xs"
                >
                  Lưu Chiến Dịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

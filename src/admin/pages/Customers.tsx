import React, { useState, useEffect } from 'react';
import {
  Users, Search, Filter, Download, Plus, Mail, Phone, Building2,
  Calendar, CheckCircle, Clock, Trash2, Edit3, MessageSquare,
  Sparkles, ExternalLink, RefreshCw, X, Tag, FileText, ArrowRight
} from 'lucide-react';
import { apiClient } from '../apiClient';
import { LeadCustomer } from '../types';

interface CustomersProps {
  onNavigateToOrder?: (lead: LeadCustomer) => void;
}

export const Customers: React.FC<CustomersProps> = ({ onNavigateToOrder }) => {
  const [customers, setCustomers] = useState<LeadCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Selected lead for detail modal
  const [selectedLead, setSelectedLead] = useState<LeadCustomer | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  // Manual create lead modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    fullName: '',
    companyName: '',
    phone: '',
    email: '',
    interestedProduct: 'HAMPER GOLDEN PROSPERITY',
    quantityRange: '100–499 hộp',
    status: 'MỚI',
    notes: '',
    assignedTo: 'Nguyễn Tuấn Đạt'
  });

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (searchTerm) query.append('search', searchTerm);
      if (statusFilter !== 'ALL') query.append('status', statusFilter);
      query.append('sort', sortOrder);

      const res = await apiClient.request(`/api/admin/customers?${query.toString()}`);
      setCustomers(res.customers);
      if (selectedLead) {
        const updated = res.customers.find((c: LeadCustomer) => c.id === selectedLead.id);
        if (updated) setSelectedLead(updated);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm, statusFilter, sortOrder]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await apiClient.request(`/api/admin/customers/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      fetchCustomers();
    } catch (err: any) {
      alert(err.message || 'Lỗi cập nhật trạng thái');
    }
  };

  const handleAddNote = async (id: string) => {
    if (!newNoteText.trim()) return;
    setSubmittingNote(true);
    try {
      await apiClient.request(`/api/admin/customers/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ newNote: newNoteText.trim() })
      });
      setNewNoteText('');
      fetchCustomers();
    } catch (err: any) {
      alert(err.message || 'Lỗi thêm ghi chú');
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hồ sơ khách hàng này?')) return;
    try {
      await apiClient.request(`/api/admin/customers/${id}`, { method: 'DELETE' });
      setSelectedLead(null);
      fetchCustomers();
    } catch (err: any) {
      alert(err.message || 'Lỗi xóa hồ sơ');
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.request('/api/admin/customers', {
        method: 'POST',
        body: JSON.stringify(createForm)
      });
      setShowCreateModal(false);
      setCreateForm({
        fullName: '',
        companyName: '',
        phone: '',
        email: '',
        interestedProduct: 'HAMPER GOLDEN PROSPERITY',
        quantityRange: '100–499 hộp',
        status: 'MỚI',
        notes: '',
        assignedTo: 'Nguyễn Tuấn Đạt'
      });
      fetchCustomers();
    } catch (err: any) {
      alert(err.message || 'Lỗi tạo khách hàng');
    }
  };

  const handleExportCsv = () => {
    const token = apiClient.getToken();
    window.open(`/api/admin/customers/export-csv${token ? `?token=${token}` : ''}`, '_blank');
  };

  const statusList = ['ALL', 'MỚI', 'ĐANG LIÊN HỆ', 'ĐÃ BÁO GIÁ', 'ĐANG THƯƠNG THẢO', 'THÀNH CÔNG', 'HỦY'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold font-serif text-stone-900">
            Quản Lý Khách Hàng Tiềm Năng (CRM B2B)
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Theo dõi, xử lý yêu cầu báo giá doanh nghiệp & lịch sử tương tác tư vấn quà Tết 2027
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-stone-500" />
            <span>Xuất CSV</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#B52C32] hover:bg-[#9B2228] text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Lead Thủ Công</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên khách hàng, tên công ty, số điện thoại, sản phẩm..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-800 placeholder-stone-400 outline-none focus:border-[#B52C32] focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={sortOrder}
              onChange={(e: any) => setSortOrder(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 outline-none cursor-pointer"
            >
              <option value="newest">Mới nhất trước</option>
              <option value="oldest">Cũ nhất trước</option>
            </select>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          {statusList.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#B52C32] text-white shadow-xs font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st === 'ALL' ? 'Tất cả trạng thái' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Mã Lead</th>
                <th className="py-3 px-4">Khách Hàng / Doanh Nghiệp</th>
                <th className="py-3 px-4">Liên Hệ</th>
                <th className="py-3 px-4">Sản Phẩm & Quy Mô</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4">Phụ Trách</th>
                <th className="py-3 px-4">Nguồn Tiếp Cận</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {loading && customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-stone-300" />
                    Đang tải danh sách khách hàng...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    Không tìm thấy khách hàng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-amber-50/40 transition cursor-pointer"
                    onClick={() => setSelectedLead(c)}
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-stone-800">
                      {c.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{c.fullName}</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-stone-400" />
                        <span className="truncate max-w-[180px]">{c.companyName}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-mono text-stone-900 font-medium">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{c.phone}</span>
                      </div>
                      {c.email && (
                        <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-stone-400" />
                          <span className="truncate max-w-[160px]">{c.email}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-800 line-clamp-1">{c.interestedProduct}</div>
                      <div className="mt-1">
                        <span className="inline-block bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                          {c.quantityRange}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={c.status}
                        onChange={(e) => handleUpdateStatus(c.id, e.target.value)}
                        className={`text-[10px] font-bold rounded-lg px-2 py-1 border outline-none cursor-pointer ${
                          c.status === 'MỚI' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          c.status === 'ĐANG LIÊN HỆ' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          c.status === 'ĐÃ BÁO GIÁ' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                          c.status === 'ĐANG THƯƠNG THẢO' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          c.status === 'THÀNH CÔNG' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                          'bg-stone-100 text-stone-600 border-stone-200'
                        }`}
                      >
                        <option value="MỚI">MỚI TIẾP NHẬN</option>
                        <option value="ĐANG LIÊN HỆ">ĐANG LIÊN HỆ</option>
                        <option value="ĐÃ BÁO GIÁ">ĐÃ BÁO GIÁ</option>
                        <option value="ĐANG THƯƠNG THẢO">ĐANG THƯƠNG THẢO</option>
                        <option value="THÀNH CÔNG">THÀNH CÔNG</option>
                        <option value="HỦY">HỦY BỎ</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-stone-600 text-[11px]">
                      {c.assignedTo || 'Chưa phân công'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] text-stone-500 block truncate max-w-[130px]" title={c.source}>
                        {c.source}
                      </span>
                      {c.utmCampaign && (
                        <span className="text-[10px] text-indigo-600 font-mono bg-indigo-50 px-1.5 py-0.5 rounded">
                          {c.utmCampaign}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedLead(c)}
                        className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-600 transition cursor-pointer"
                        title="Chi tiết hồ sơ"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-end p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-white h-full sm:h-auto sm:max-h-[90vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-[#B52C32] text-white px-2 py-0.5 rounded">
                    {selectedLead.id}
                  </span>
                  <h3 className="font-bold text-base text-stone-900">{selectedLead.fullName}</h3>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{selectedLead.companyName}</p>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 hover:bg-stone-200 rounded-xl text-stone-500 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Quick Status Bar */}
              <div className="bg-amber-50/60 border border-amber-200/80 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-stone-500 block">Trạng thái hiện tại:</span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleUpdateStatus(selectedLead.id, e.target.value)}
                    className="font-bold text-xs bg-white border border-amber-300 rounded-lg px-2.5 py-1 text-stone-800 outline-none cursor-pointer mt-1"
                  >
                    <option value="MỚI">MỚI TIẾP NHẬN</option>
                    <option value="ĐANG LIÊN HỆ">ĐANG LIÊN HỆ TƯ VẤN</option>
                    <option value="ĐÃ BÁO GIÁ">ĐÃ BÁO GIÁ & MẪU</option>
                    <option value="ĐANG THƯƠNG THẢO">ĐANG THƯƠNG THẢO HỢP ĐỒNG</option>
                    <option value="THÀNH CÔNG">CHỐT HỢP ĐỒNG THÀNH CÔNG</option>
                    <option value="HỦY">HỦY BỎ</option>
                  </select>
                </div>

                {onNavigateToOrder && (
                  <button
                    onClick={() => {
                      onNavigateToOrder(selectedLead);
                      setSelectedLead(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Lập Đơn Hàng / Hợp Đồng B2B</span>
                  </button>
                )}
              </div>

              {/* Contact and Requirement Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-2.5">
                  <h4 className="font-bold text-stone-900 border-b border-stone-200 pb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#B52C32]" />
                    Thông Tin Khách Hàng
                  </h4>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Họ tên:</span>
                    <span className="font-semibold text-stone-800">{selectedLead.fullName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Công ty / Doanh nghiệp:</span>
                    <span className="font-medium text-stone-800">{selectedLead.companyName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Số điện thoại:</span>
                    <a href={`tel:${selectedLead.phone}`} className="font-mono text-emerald-700 font-semibold hover:underline">
                      {selectedLead.phone}
                    </a>
                  </div>
                  {selectedLead.email && (
                    <div>
                      <span className="text-stone-400 block text-[10px]">Email công vụ:</span>
                      <a href={`mailto:${selectedLead.email}`} className="text-stone-700 hover:underline">
                        {selectedLead.email}
                      </a>
                    </div>
                  )}
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-2.5">
                  <h4 className="font-bold text-stone-900 border-b border-stone-200 pb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Yêu Cầu Quà Tặng Tết
                  </h4>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Sản phẩm quan tâm:</span>
                    <span className="font-bold text-[#B52C32]">{selectedLead.interestedProduct}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Quy mô số lượng dự kiến:</span>
                    <span className="font-semibold text-stone-800 bg-white px-2 py-0.5 rounded border border-stone-200 inline-block mt-0.5">
                      {selectedLead.quantityRange}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Mục đích tặng quà:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedLead.purpose.map((p, idx) => (
                        <span key={idx} className="bg-white text-stone-700 px-2 py-0.5 rounded border border-stone-200 text-[10px]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Notes */}
              {selectedLead.notes && (
                <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-200">
                  <span className="text-stone-500 font-medium block mb-1">Ghi chú từ khách hàng:</span>
                  <p className="text-stone-800 italic whitespace-pre-wrap">{selectedLead.notes}</p>
                </div>
              )}

              {/* Marketing Attribution (UTM Parameters) */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-600" />
                  Nguồn Khách Hàng & Chiến Dịch Tiếp Thị (UTM Attribution)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="bg-white p-2 rounded border border-stone-200">
                    <span className="text-stone-400 block text-[10px]">Kênh (Source):</span>
                    <span className="font-medium text-stone-800">{selectedLead.utmSource || selectedLead.source}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-stone-200">
                    <span className="text-stone-400 block text-[10px]">Phương tiện (Medium):</span>
                    <span className="font-medium text-stone-800">{selectedLead.utmMedium || 'N/A'}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-stone-200">
                    <span className="text-stone-400 block text-[10px]">Chiến dịch (Campaign):</span>
                    <span className="font-medium text-stone-800">{selectedLead.utmCampaign || 'N/A'}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-stone-200">
                    <span className="text-stone-400 block text-[10px]">Thời gian nhận:</span>
                    <span className="font-medium text-stone-800">{new Date(selectedLead.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              </div>

              {/* Internal Notes Timeline */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-stone-600" />
                  Lịch Sử Chăm Sóc & Ghi Chú Nội Bộ
                </h4>

                {/* Add note input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Ghi chú cuộc gọi, hẹn gửi mẫu, yêu cầu chiết khấu..."
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 outline-none focus:bg-white focus:border-[#B52C32]"
                  />
                  <button
                    onClick={() => handleAddNote(selectedLead.id)}
                    disabled={submittingNote || !newNoteText.trim()}
                    className="px-4 py-2 bg-[#B52C32] hover:bg-[#9B2228] text-white font-semibold rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {submittingNote ? 'Đang lưu...' : 'Lưu Ghi Chú'}
                  </button>
                </div>

                {/* Notes List */}
                <div className="space-y-2 mt-2">
                  {selectedLead.internalNotes && selectedLead.internalNotes.length > 0 ? (
                    selectedLead.internalNotes.map((note) => (
                      <div key={note.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                        <div className="flex items-center justify-between text-stone-500 text-[10px] mb-1">
                          <span className="font-semibold text-stone-700">{note.author}</span>
                          <span>{new Date(note.createdAt).toLocaleString('vi-VN')}</span>
                        </div>
                        <p className="text-stone-800">{note.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-stone-400 italic text-center py-2">Chưa có ghi chú nội bộ.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
              <button
                onClick={() => handleDeleteLead(selectedLead.id)}
                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:underline cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa hồ sơ</span>
              </button>

              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold rounded-xl text-xs transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Lead Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-stone-900 text-sm">Thêm Khách Hàng B2B Thủ Công</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-stone-200 rounded-lg text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Họ và tên người đại diện *</label>
                <input
                  type="text"
                  required
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                  placeholder="Ví dụ: Ông Nguyễn Hoàng Nam"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Tên Công Ty / Doanh Nghiệp *</label>
                <input
                  type="text"
                  required
                  value={createForm.companyName}
                  onChange={(e) => setCreateForm({ ...createForm, companyName: e.target.value })}
                  placeholder="Ví dụ: Công ty Cổ phần Xây Dựng & Địa Ốc Hòa Bình"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    placeholder="0903123456"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Email công vụ</label>
                  <input
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="nam.nh@hoabinh.vn"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Sản phẩm quan tâm</label>
                  <select
                    value={createForm.interestedProduct}
                    onChange={(e) => setCreateForm({ ...createForm, interestedProduct: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 text-stone-800 outline-none cursor-pointer"
                  >
                    <option value="HAMPER GOLDEN PROSPERITY">HAMPER GOLDEN PROSPERITY</option>
                    <option value="HAMPER ORIENTAL CELEBRATION">HAMPER ORIENTAL CELEBRATION</option>
                    <option value="HAMPER MARQUIS XO">HAMPER MARQUIS XO</option>
                    <option value="HAMPER LABEL 5 RED">HAMPER LABEL 5 RED</option>
                    <option value="HAMPER LABEL 5 GREEN">HAMPER LABEL 5 GREEN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Số lượng dự kiến</label>
                  <select
                    value={createForm.quantityRange}
                    onChange={(e) => setCreateForm({ ...createForm, quantityRange: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 text-stone-800 outline-none cursor-pointer"
                  >
                    <option value="50–99 hộp">50–99 hộp</option>
                    <option value="100–499 hộp">100–499 hộp</option>
                    <option value="500+ hộp">500+ hộp</option>
                    <option value="1.000+ hộp">1.000+ hộp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Ghi chú trao đổi ban đầu</label>
                <textarea
                  rows={2}
                  value={createForm.notes}
                  onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                  placeholder="Khách gọi hotline hỏi chiết khấu cho 300 hộp..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold rounded-xl transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#B52C32] hover:bg-[#9B2228] text-white font-semibold rounded-xl transition cursor-pointer shadow-xs"
                >
                  Tạo Hồ Sơ Khách Hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

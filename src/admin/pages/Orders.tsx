import React, { useState, useEffect } from 'react';
import {
  FileText, Plus, Search, Filter, DollarSign, CheckCircle2,
  Clock, Truck, AlertCircle, Building2, Phone, Calendar, X, Edit3
} from 'lucide-react';
import { apiClient } from '../apiClient';
import { OrderRecord, LeadCustomer } from '../types';

interface OrdersProps {
  initialLeadForOrder?: LeadCustomer | null;
  onClearInitialLead?: () => void;
}

export const Orders: React.FC<OrdersProps> = ({ initialLeadForOrder, onClearInitialLead }) => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderRecord | null>(null);

  const [orderForm, setOrderForm] = useState({
    companyName: '',
    taxCode: '',
    contactPerson: '',
    phone: '',
    email: '',
    shippingAddress: '',
    productName: 'HAMPER GOLDEN PROSPERITY',
    quantity: 100,
    unitPrice: 1250000,
    depositAmount: 62500000,
    paymentStatus: 'ĐÃ CỌC 50%' as OrderRecord['paymentStatus'],
    deliveryStatus: 'ĐANG GIA CÔNG' as OrderRecord['deliveryStatus'],
    deliveryDate: '2027-01-20',
    notes: ''
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiClient.request('/api/admin/orders');
      setOrders(res.orders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Pre-fill if coming from Lead CRM
  useEffect(() => {
    if (initialLeadForOrder) {
      setOrderForm((prev) => ({
        ...prev,
        companyName: initialLeadForOrder.companyName,
        contactPerson: initialLeadForOrder.fullName,
        phone: initialLeadForOrder.phone,
        email: initialLeadForOrder.email || '',
        productName: initialLeadForOrder.interestedProduct,
        notes: `Tạo từ Lead ${initialLeadForOrder.id}. Ghi chú: ${initialLeadForOrder.notes || 'Không'}`
      }));
      setShowCreateModal(true);
      if (onClearInitialLead) onClearInitialLead();
    }
  }, [initialLeadForOrder]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.request('/api/admin/orders', {
        method: 'POST',
        body: JSON.stringify(orderForm)
      });
      setShowCreateModal(false);
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Lỗi lập đơn hàng');
    }
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    try {
      await apiClient.request(`/api/admin/orders/${editingOrder.id}`, {
        method: 'PUT',
        body: JSON.stringify(editingOrder)
      });
      setEditingOrder(null);
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Lỗi cập nhật đơn hàng');
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalValue || 0), 0);
  const totalDeposit = orders.reduce((sum, o) => sum + (o.depositAmount || 0), 0);
  const totalHampers = orders.reduce((sum, o) => sum + (o.quantity || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold font-serif text-stone-900">
            Quản Lý Hợp Đồng & Đơn Hàng B2B
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Theo dõi tiến độ ký kết hợp đồng, xuất hóa đơn VAT, đặt cọc và tiến độ giao hàng toàn quốc
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#B52C32] hover:bg-[#9B2228] text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Lập Hợp Đồng Mới</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 uppercase font-semibold">Tổng Giá Trị Đơn Hàng</span>
          <div className="text-xl font-bold font-serif text-stone-900 mt-1">
            {totalRevenue.toLocaleString('vi-VN')} VNĐ
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">{orders.length} hợp đồng B2B</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 uppercase font-semibold">Đã Thu Tiền Cọc</span>
          <div className="text-xl font-bold font-serif text-emerald-600 mt-1">
            {totalDeposit.toLocaleString('vi-VN')} VNĐ
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">
            Còn lại: {(totalRevenue - totalDeposit).toLocaleString('vi-VN')} VNĐ
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 uppercase font-semibold">Tổng Sản Lượng Hamper</span>
          <div className="text-xl font-bold font-serif text-amber-600 mt-1">
            {totalHampers.toLocaleString('vi-VN')} Hộp
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">Đã lên kế hoạch sản xuất</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Mã HĐ</th>
                <th className="py-3 px-4">Doanh Nghiệp / MST</th>
                <th className="py-3 px-4">Sản Phẩm & SL</th>
                <th className="py-3 px-4">Tổng Giá Trị</th>
                <th className="py-3 px-4">Thanh Toán</th>
                <th className="py-3 px-4">Tiến Độ Giao</th>
                <th className="py-3 px-4">Hạn Giao Hàng</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">Đang tải danh sách đơn hàng...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">Chưa có đơn hàng nào được tạo.</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{o.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900">{o.companyName}</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                        <span>MST: {o.taxCode || 'Chưa cập nhật'}</span>
                        <span>•</span>
                        <span>{o.contactPerson} ({o.phone})</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-800 line-clamp-1">{o.productName}</div>
                      <span className="text-[11px] font-bold text-[#B52C32]">{o.quantity} Hộp</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{o.totalValue.toLocaleString('vi-VN')} đ</div>
                      <div className="text-[10px] text-emerald-600">Đã cọc: {o.depositAmount.toLocaleString('vi-VN')} đ</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        o.paymentStatus === 'ĐÃ THANH TOÁN 100%' ? 'bg-emerald-100 text-emerald-800' :
                        o.paymentStatus === 'ĐÃ CỌC 50%' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        o.deliveryStatus === 'ĐÃ GIAO HÀNG' ? 'bg-emerald-100 text-emerald-800' :
                        o.deliveryStatus === 'ĐANG VẬN CHUYỂN' ? 'bg-blue-100 text-blue-800' :
                        o.deliveryStatus === 'ĐANG GIA CÔNG' ? 'bg-purple-100 text-purple-800' :
                        'bg-stone-100 text-stone-700'
                      }`}>
                        {o.deliveryStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-stone-600">{o.deliveryDate}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setEditingOrder(o)}
                        className="p-1.5 hover:bg-stone-200 rounded-lg text-stone-600 transition cursor-pointer"
                        title="Chỉnh sửa đơn hàng"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-stone-900 text-sm">Lập Hợp Đồng / Đơn Hàng B2B Mới</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-stone-200 rounded-lg text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-6 overflow-y-auto space-y-3.5 text-xs flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Tên Công Ty *</label>
                  <input
                    type="text"
                    required
                    value={orderForm.companyName}
                    onChange={(e) => setOrderForm({ ...orderForm, companyName: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Mã Số Thuế (MST)</label>
                  <input
                    type="text"
                    value={orderForm.taxCode}
                    onChange={(e) => setOrderForm({ ...orderForm, taxCode: e.target.value })}
                    placeholder="0312345678"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Người Đại Diện *</label>
                  <input
                    type="text"
                    required
                    value={orderForm.contactPerson}
                    onChange={(e) => setOrderForm({ ...orderForm, contactPerson: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Số Điện Thoại *</label>
                  <input
                    type="tel"
                    required
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-stone-700 font-bold mb-1">Sản Phẩm Đặt Hàng</label>
                  <select
                    value={orderForm.productName}
                    onChange={(e) => setOrderForm({ ...orderForm, productName: e.target.value })}
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
                  <label className="block text-stone-700 font-bold mb-1">Số Lượng (Hộp) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={orderForm.quantity}
                    onChange={(e) => {
                      const q = Number(e.target.value);
                      const total = q * orderForm.unitPrice;
                      setOrderForm({ ...orderForm, quantity: q, depositAmount: total * 0.5 });
                    }}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Đơn Giá Sau Chiết Khấu (VNĐ)</label>
                  <input
                    type="number"
                    value={orderForm.unitPrice}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      const total = orderForm.quantity * p;
                      setOrderForm({ ...orderForm, unitPrice: p, depositAmount: total * 0.5 });
                    }}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Tiền Đặt Cọc (VNĐ)</label>
                  <input
                    type="number"
                    value={orderForm.depositAmount}
                    onChange={(e) => setOrderForm({ ...orderForm, depositAmount: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Địa Chỉ Nhận Hàng</label>
                <input
                  type="text"
                  value={orderForm.shippingAddress}
                  onChange={(e) => setOrderForm({ ...orderForm, shippingAddress: e.target.value })}
                  placeholder="Địa chỉ kho hoặc trụ sở giao hàng"
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
                  Tạo Đơn Hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-stone-900 text-sm">Cập Nhật Trạng Thái Đơn {editingOrder.id}</h3>
              <button
                onClick={() => setEditingOrder(null)}
                className="p-1 hover:bg-stone-200 rounded-lg text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateOrder} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Trạng Thái Thanh Toán</label>
                <select
                  value={editingOrder.paymentStatus}
                  onChange={(e: any) => setEditingOrder({ ...editingOrder, paymentStatus: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none cursor-pointer"
                >
                  <option value="CHƯA ĐẶT CỌC">CHƯA ĐẶT CỌC</option>
                  <option value="ĐÃ CỌC 50%">ĐÃ CỌC 50%</option>
                  <option value="ĐÃ THANH TOÁN 100%">ĐÃ THANH TOÁN 100%</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Tiến Độ Sản Xuất & Vận Chuyển</label>
                <select
                  value={editingOrder.deliveryStatus}
                  onChange={(e: any) => setEditingOrder({ ...editingOrder, deliveryStatus: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none cursor-pointer"
                >
                  <option value="CHỜ SẢN XUẤT">CHỜ SẢN XUẤT</option>
                  <option value="ĐANG GIA CÔNG">ĐANG GIA CÔNG / ÉP KIM</option>
                  <option value="ĐANG VẬN CHUYỂN">ĐANG VẬN CHUYỂN</option>
                  <option value="ĐÃ GIAO HÀNG">ĐÃ GIAO HÀNG THÀNH CÔNG</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Tiền Đã Đặt Cọc (VNĐ)</label>
                <input
                  type="number"
                  value={editingOrder.depositAmount}
                  onChange={(e) => setEditingOrder({ ...editingOrder, depositAmount: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Ghi Chú Tiến Độ</label>
                <textarea
                  rows={2}
                  value={editingOrder.notes || ''}
                  onChange={(e) => setEditingOrder({ ...editingOrder, notes: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold rounded-xl transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#B52C32] hover:bg-[#9B2228] text-white font-semibold rounded-xl transition cursor-pointer shadow-xs"
                >
                  Lưu Tiến Độ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

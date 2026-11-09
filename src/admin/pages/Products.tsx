import React, { useState, useEffect } from 'react';
import {
  Package, Plus, Edit3, Trash2, CheckCircle2, AlertTriangle,
  Eye, RefreshCw, X, ShieldAlert, Sparkles, Tag
} from 'lucide-react';
import { apiClient } from '../apiClient';
import { ProductItem } from '../types';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await apiClient.request('/api/admin/products');
      setProducts(res.products);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleStock = async (prod: ProductItem) => {
    try {
      await apiClient.request(`/api/admin/products/${prod.id}`, {
        method: 'PUT',
        body: JSON.stringify({ inStock: !prod.inStock })
      });
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Lỗi cập nhật kho');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSaving(true);
    try {
      await apiClient.request(`/api/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        body: JSON.stringify(editingProduct)
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Lỗi lưu sản phẩm');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hộp quà này khỏi danh mục?')) return;
    try {
      await apiClient.request(`/api/admin/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Lỗi xóa sản phẩm');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold font-serif text-stone-900">
            Quản Lý Bộ Sưu Tập Hamper Quà Tết 2027
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Cấu hình danh mục 5 mẫu quà Tết, quy cách đóng gói, giá tham khảo và cảnh báo nồng độ cồn
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingProduct({
                id: `hamper-${Date.now().toString(36)}`,
                name: 'HAMPER TẾT 2027 MỚI',
                subTitle: 'Hộp quà cao cấp phiên bản giới hạn',
                theme: 'Hoàng Gia & Thịnh Vượng',
                badge: 'Bộ Sưu Tập Mới',
                image: '/assets/aistudio/1_81b8582e.png',
                bannerImage: '/assets/aistudio/B__Qu__T_t_Vineyard_Sang_Tr_ng_f1329eb4.png',
                description: 'Hộp quà cao cấp dập nổi ép kim với chất lượng rượu vang và rượu mạnh nhập khẩu chính ngạch.',
                highlights: ['Ép kim vàng 3D sang trọng', 'Rượu ngoại cao cấp chính hãng'],
                components: ['Rượu vang nhập khẩu', 'Hộp hạt cao cấp'],
                packagingDetails: ['Hộp cứng định lượng cao', 'Túi xách cao cấp đồng bộ'],
                recommendedFor: 'Tặng đối tác VIP, khách hàng doanh nghiệp',
                priceEstimate: 'Liên hệ báo giá',
                inStock: true,
                featured: false,
                sortOrder: products.length + 1,
                complianceWarning: 'Sản phẩm có chứa nồng độ cồn. Không bán cho người dưới 18 tuổi.'
              });
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#B52C32] hover:bg-[#9B2228] text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Mẫu Mới</span>
          </button>
        </div>
      </div>

      {/* Alcohol Compliance Notice Banner */}
      <div className="bg-amber-50/80 border border-amber-300/80 p-4 rounded-xl flex items-start gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block font-semibold">Tuân thủ pháp luật về kinh doanh và quảng cáo rượu:</strong>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Hệ thống tuân thủ nghiêm ngặt <strong>Nghị định 24/2020/NĐ-CP</strong> và Luật Phòng, chống tác hại của rượu, bia.
            Website chỉ đóng vai trò giới thiệu mẫu quà tặng và tiếp nhận yêu cầu báo giá B2B cho khách hàng doanh nghiệp,
            không thực hiện chức năng thanh toán điện tử trực tuyến và từ chối cung cấp cho người chưa đủ 18 tuổi.
          </p>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#D4AF37] transition group"
          >
            <div>
              {/* Product cutout header */}
              <div className="relative bg-gradient-to-b from-stone-100 to-stone-50 p-6 flex items-center justify-center h-52 overflow-hidden border-b border-stone-100">
                <img
                  src={p.image}
                  alt={p.name}
                  className="max-h-44 object-contain drop-shadow-xl group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-3 left-3 bg-[#B52C32] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                  {p.badge}
                </span>

                <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {p.inStock ? 'Sẵn Hàng' : 'Tạm Hết Hàng'}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-5 space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37]">
                    {p.theme}
                  </span>
                  <h3 className="font-bold text-stone-900 text-sm mt-0.5">{p.name}</h3>
                  <p className="text-xs text-stone-500 line-clamp-1">{p.subTitle}</p>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-xs flex items-center justify-between">
                  <span className="text-stone-500">Mức giá tham khảo:</span>
                  <span className="font-bold text-[#B52C32]">{p.priceEstimate || 'Liên hệ báo giá'}</span>
                </div>
              </div>
            </div>

            {/* Actions footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-stone-600 text-[11px]">
                <input
                  type="checkbox"
                  checked={p.inStock}
                  onChange={() => handleToggleStock(p)}
                  className="rounded text-[#B52C32] focus:ring-[#D4AF37]"
                />
                <span>Hiển thị trên Landing</span>
              </label>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEditingProduct(p)}
                  className="p-1.5 hover:bg-stone-200 rounded-lg text-stone-700 transition cursor-pointer"
                  title="Chỉnh sửa chi tiết"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition cursor-pointer"
                  title="Xóa mẫu này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-stone-900 text-sm">Chỉnh Sửa Thông Tin Hộp Quà</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 hover:bg-stone-200 rounded-lg text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Tên Hộp Quà *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Chủ Đề (Theme)</label>
                  <input
                    type="text"
                    value={editingProduct.theme}
                    onChange={(e) => setEditingProduct({ ...editingProduct, theme: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Tiêu Đề Phụ (Sub-title)</label>
                <input
                  type="text"
                  value={editingProduct.subTitle}
                  onChange={(e) => setEditingProduct({ ...editingProduct, subTitle: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Huy Hiệu (Badge)</label>
                  <input
                    type="text"
                    value={editingProduct.badge}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Mức Giá Dự Kiến</label>
                  <input
                    type="text"
                    value={editingProduct.priceEstimate || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceEstimate: e.target.value })}
                    placeholder="Từ 1.250.000 VNĐ"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Đường Dẫn Hình Ảnh Cắt Trong Suốt (Cutout PNG)</label>
                <input
                  type="text"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-mono text-[11px] outline-none focus:border-[#B52C32]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Mô Tả Sản Phẩm</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Thành Phần Trong Hộp (Cách nhau bằng dấu phẩy)</label>
                <textarea
                  rows={2}
                  value={editingProduct.components.join(', ')}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    components: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Khuyên Dùng Cho Đối Tượng</label>
                <input
                  type="text"
                  value={editingProduct.recommendedFor}
                  onChange={(e) => setEditingProduct({ ...editingProduct, recommendedFor: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold rounded-xl transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#B52C32] hover:bg-[#9B2228] text-white font-semibold rounded-xl transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

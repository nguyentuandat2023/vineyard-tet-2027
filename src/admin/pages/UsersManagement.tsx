import React, { useState, useEffect } from 'react';
import {
  Users, Plus, ShieldCheck, UserCheck, Key, Lock, AlertCircle,
  X, CheckCircle2, RefreshCw
} from 'lucide-react';
import { apiClient } from '../apiClient';
import { AdminUser } from '../types';

export const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'SALE' as AdminUser['role']
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.request('/api/admin/users');
      setUsers(res.users);
    } catch (err: any) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.request('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(createForm)
      });
      setShowAddModal(false);
      setCreateForm({ name: '', email: '', password: '', role: 'SALE' });
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Lỗi tạo tài khoản');
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await apiClient.request(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole })
      });
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Lỗi cập nhật vai trò');
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await apiClient.request(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Lỗi cập nhật trạng thái');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !newPassword) return;
    try {
      await apiClient.request(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        body: JSON.stringify({ newPassword })
      });
      alert(`Đã đặt lại mật khẩu cho tài khoản ${editingUser.email}!`);
      setEditingUser(null);
      setNewPassword('');
    } catch (err: any) {
      alert(err.message || 'Lỗi đặt lại mật khẩu');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold font-serif text-stone-900">
            Quản Lý Nhân Viên & Phân Quyền Truy Cập (RBAC)
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Quản trị danh sách nhân sự, phân bổ vai trò Super Admin, Sales, Editor và quản lý quyền bảo mật
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#B52C32] hover:bg-[#9B2228] text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Nhân Viên Mới</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Tên Quản Trị Viên</th>
                <th className="py-3 px-4">Email Đăng Nhập</th>
                <th className="py-3 px-4">Vai Trò Phân Quyền</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4">Lần Đăng Nhập Cuối</th>
                <th className="py-3 px-4 text-right">Bảo Mật</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">Đang tải danh sách tài khoản...</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50 transition">
                    <td className="py-3.5 px-4 font-bold text-stone-900">{u.name}</td>
                    <td className="py-3.5 px-4 font-mono text-stone-600">{u.email}</td>
                    <td className="py-3.5 px-4">
                      {u.role === 'SUPER_ADMIN' ? (
                        <span className="bg-red-100 text-[#B52C32] font-bold px-2 py-0.5 rounded-full text-[10px] border border-red-200">
                          SUPER_ADMIN (Toàn quyền)
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                          className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-[11px] font-semibold text-stone-800 outline-none cursor-pointer"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="EDITOR">EDITOR (Biên tập CMS)</option>
                          <option value="SALE">SALE (Chăm sóc Lead)</option>
                          <option value="VIEWER">VIEWER (Chỉ xem)</option>
                        </select>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={u.role === 'SUPER_ADMIN'}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition cursor-pointer ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                        }`}
                      >
                        {u.status === 'active' ? 'Đang hoạt động' : 'Tạm khóa'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleString('vi-VN') : 'Chưa đăng nhập'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setEditingUser(u)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 text-[11px] font-semibold transition cursor-pointer"
                      >
                        <Key className="w-3 h-3 text-stone-500" />
                        <span>Đổi Mật Khẩu</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-stone-900 text-sm">Thêm Nhân Sự Quản Trị Mới</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-stone-200 rounded-lg text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Họ Tên Nhân Viên *</label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="Ví dụ: Lê Thị Thanh Nhàn"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Email Đăng Nhập *</label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="nhan.lt@vineyard.vn"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Mật Khẩu Tạm Thời *</label>
                <input
                  type="password"
                  required
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  placeholder="Tối thiểu 8 ký tự"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Vai Trò</label>
                <select
                  value={createForm.role}
                  onChange={(e: any) => setCreateForm({ ...createForm, role: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none cursor-pointer"
                >
                  <option value="ADMIN">ADMIN (Quản trị chung)</option>
                  <option value="SALE">SALE (Chăm sóc khách hàng B2B)</option>
                  <option value="EDITOR">EDITOR (Biên tập nội dung Landing)</option>
                  <option value="VIEWER">VIEWER (Chỉ xem báo cáo)</option>
                </select>
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
                  Tạo Tài Khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-stone-900 text-sm">Đặt Lại Mật Khẩu</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 hover:bg-stone-200 rounded-lg text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="p-6 space-y-3.5 text-xs">
              <p className="text-stone-600">
                Đặt lại mật khẩu cho tài khoản <strong>{editingUser.email}</strong>:
              </p>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Mật Khẩu Mới</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 outline-none focus:border-[#B52C32]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold rounded-xl transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#B52C32] hover:bg-[#9B2228] text-white font-semibold rounded-xl transition cursor-pointer shadow-xs"
                >
                  Xác Nhận Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

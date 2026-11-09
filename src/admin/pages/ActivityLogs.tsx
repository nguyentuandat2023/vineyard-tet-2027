import React, { useState, useEffect } from 'react';
import {
  Clock, Search, Shield, RefreshCw, User, Terminal
} from 'lucide-react';
import { apiClient } from '../apiClient';
import { ActivityLog } from '../types';

export const ActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await apiClient.request('/api/admin/activity-logs');
      setLogs(res.logs);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.adminEmail.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());
    const matchModule = moduleFilter === 'ALL' || log.module === moduleFilter;
    return matchSearch && matchModule;
  });

  const modules = ['ALL', 'AUTH', 'CRM', 'CMS', 'CATALOG', 'ORDERS', 'CAMPAIGNS', 'USERS', 'SETTINGS', 'BACKUP'];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold font-serif text-stone-900">
            Nhật Ký Thao Tác & Kiểm Toán Hệ Thống (Audit Trail)
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Ghi vết toàn diện mọi hành vi đăng nhập, xuất dữ liệu, thay đổi trạng thái khách hàng và sửa nội dung website
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="flex items-center gap-1.5 px-3 py-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-700 text-xs font-semibold transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
          <span>Làm Mới</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo hành động, email quản trị viên hoặc nội dung chi tiết..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-800 placeholder-stone-400 outline-none focus:border-[#B52C32] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto text-xs pb-1 md:pb-0">
          <span className="text-stone-400 text-[11px] shrink-0 mr-1">Module:</span>
          {modules.map((m) => (
            <button
              key={m}
              onClick={() => setModuleFilter(m)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                moduleFilter === m
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Thời Gian</th>
                <th className="py-3 px-4">Quản Trị Viên</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Hành Động</th>
                <th className="py-3 px-4">Chi Tiết Thao Tác</th>
                <th className="py-3 px-4 font-mono">Địa Chỉ IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">Đang tải nhật ký kiểm toán...</td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">Không tìm thấy bản ghi nhật ký phù hợp.</td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50 transition">
                    <td className="py-3 px-4 font-mono text-stone-500 text-[11px] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-900">{log.adminName}</div>
                      <div className="text-[10px] text-stone-400 font-mono truncate max-w-[160px]">{log.adminEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[10px] font-bold">
                        {log.module}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900">{log.action}</td>
                    <td className="py-3 px-4 text-stone-600 max-w-sm truncate" title={log.details}>
                      {log.details}
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-400 text-[11px] whitespace-nowrap">
                      {log.ipAddress || '127.0.0.1'}
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

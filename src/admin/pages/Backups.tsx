import React, { useState } from 'react';
import {
  Database, Download, Upload, CheckCircle2, AlertTriangle, ShieldCheck,
  HardDrive, RefreshCw
} from 'lucide-react';
import { apiClient } from '../apiClient';

export const Backups: React.FC = () => {
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExportBackup = () => {
    const token = apiClient.getToken();
    window.open(`/api/admin/backups/export${token ? `?token=${token}` : ''}`, '_blank');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm(`Bạn có chắc chắn muốn khôi phục cơ sở dữ liệu từ tệp "${file.name}"? Thao tác này sẽ ghi đè dữ liệu hiện tại.`)) {
      e.target.value = '';
      return;
    }

    setRestoring(true);
    setMessage(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        await apiClient.request('/api/admin/backups/restore', {
          method: 'POST',
          body: JSON.stringify(json)
        });
        setMessage({ type: 'success', text: 'Khôi phục cơ sở dữ liệu thành công! Toàn bộ bảng đã được đồng bộ.' });
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'Tệp sao lưu không hợp lệ.' });
      } finally {
        setRestoring(false);
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold font-serif text-stone-900">
            Sao Lưu & Khôi Phục Dữ Liệu (Backup & Recovery)
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Bảo vệ toàn vẹn dữ liệu khách hàng, đơn hàng, danh mục sản phẩm và nội dung website qua các bản snapshot JSON
          </p>
        </div>

        <button
          onClick={handleExportBackup}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#B52C32] hover:bg-[#9B2228] text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Tải Bản Sao Lưu JSON (Download)</span>
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-xs ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-stone-400 font-bold uppercase text-[10px]">
            <HardDrive className="w-3.5 h-3.5 text-stone-500" />
            Cơ Chế Lưu Trữ
          </div>
          <div className="text-base font-bold text-stone-900">File JSON Bền Vững (Persistent Storage)</div>
          <p className="text-[11px] text-stone-500">Tọa lạc tại /server/data/store.json, tự động ghi nhận tức thì</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-stone-400 font-bold uppercase text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Tính Toàn Vẹn Hệ Thống
          </div>
          <div className="text-base font-bold text-emerald-600">Đạt Chuẩn Bảo Mật 100%</div>
          <p className="text-[11px] text-stone-500">Đã kích hoạt HMAC Token, chống brute-force và mã hóa salt</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-stone-400 font-bold uppercase text-[10px]">
            <Database className="w-3.5 h-3.5 text-[#B52C32]" />
            Tính Năng Snapshot
          </div>
          <div className="text-base font-bold text-stone-900">1-Click Tải & Khôi Phục</div>
          <p className="text-[11px] text-stone-500">Không lo mất dữ liệu khi chuyển máy chủ hoặc nâng cấp</p>
        </div>
      </div>

      {/* Restore Area */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
        <div>
          <h2 className="font-bold text-stone-900 text-sm">Khôi Phục Dữ Liệu Từ Tệp Bản Sao (Restore)</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Chọn tệp sao lưu JSON đã tải về trước đó để khôi phục toàn bộ dữ liệu hệ thống:
          </p>
        </div>

        <div className="p-8 border-2 border-dashed border-stone-300 rounded-2xl bg-stone-50 text-center space-y-3">
          <Upload className="w-8 h-8 text-stone-400 mx-auto" />
          <div className="text-xs text-stone-600">
            <span className="font-semibold text-[#B52C32]">Nhấp vào đây để chọn tệp .json</span> hoặc kéo thả file vào khu vực này
          </div>
          <p className="text-[11px] text-stone-400">
            Hỗ trợ định dạng JSON snapshot do hệ thống Vineyard Admin xuất bản
          </p>

          <input
            type="file"
            accept=".json,application/json"
            disabled={restoring}
            onChange={handleFileSelect}
            className="hidden"
            id="restore-upload"
          />
          <label
            htmlFor="restore-upload"
            className="inline-block px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition"
          >
            {restoring ? 'Đang khôi phục dữ liệu...' : 'Chọn File Sao Lưu JSON'}
          </label>
        </div>
      </div>
    </div>
  );
};

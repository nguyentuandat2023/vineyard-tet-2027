import React, { useState, useEffect } from 'react';
import {
  Bell, CheckCircle2, AlertCircle, ShoppingBag, ShieldAlert,
  Clock, CheckCheck, RefreshCw
} from 'lucide-react';
import { apiClient } from '../apiClient';
import { SystemNotification } from '../types';

interface NotificationsProps {
  onNavigate: (module: string) => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await apiClient.request('/api/admin/notifications');
      setNotifications(res.notifications);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiClient.request(`/api/admin/notifications/${id}/read`, { method: 'PUT' });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiClient.request('/api/admin/notifications/mark-all-read', { method: 'POST' });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold font-serif text-stone-900">
            Trung Tâm Thông Báo & Cảnh Báo Hệ Thống
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Cập nhật tức thời khi có khách hàng gửi báo giá mới, đơn hàng hoàn tất đặt cọc hoặc cảnh báo an ninh
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-stone-500" />
            <span>Đánh Dấu Tất Cả Đã Đọc</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden divide-y divide-stone-100">
        {loading ? (
          <div className="py-12 text-center text-stone-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-stone-300" />
            Đang tải thông báo...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center text-stone-400 text-xs">
            Không có thông báo mới nào.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                handleMarkAsRead(n.id);
                if (n.link) {
                  const target = n.link.replace('/admin/', '');
                  onNavigate(target);
                }
              }}
              className={`p-4 flex items-start gap-3.5 transition cursor-pointer ${
                n.read ? 'hover:bg-stone-50/80 opacity-75' : 'bg-red-50/20 hover:bg-red-50/40'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                n.type === 'lead' ? 'bg-red-100 text-[#B52C32]' :
                n.type === 'order' ? 'bg-emerald-100 text-emerald-700' :
                n.type === 'security' ? 'bg-amber-100 text-amber-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {n.type === 'lead' ? <Bell className="w-4 h-4" /> :
                 n.type === 'order' ? <ShoppingBag className="w-4 h-4" /> :
                 n.type === 'security' ? <ShieldAlert className="w-4 h-4" /> :
                 <CheckCircle2 className="w-4 h-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className={`text-xs ${n.read ? 'font-semibold text-stone-800' : 'font-bold text-stone-900'}`}>
                    {n.title}
                  </h3>
                  <span className="text-[10px] text-stone-400 shrink-0">
                    {new Date(n.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{n.message}</p>
              </div>

              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-[#B52C32] shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

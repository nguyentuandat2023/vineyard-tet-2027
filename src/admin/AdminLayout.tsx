import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, ShoppingBag, Package, FileText, Image as ImageIcon,
  TrendingUp, BarChart2, Tag, Globe, Printer, Bell, Shield, Settings as SettingsIcon,
  HardDrive, LogOut, ExternalLink, Menu, X, ChevronRight, Sparkles, UserCheck,
  Search, CheckCircle2, ChevronDown
} from 'lucide-react';
import { apiClient } from './apiClient';
import { LeadCustomer } from './types';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { ContentEditor } from './pages/ContentEditor';
import { Products } from './pages/Products';
import { Orders } from './pages/Orders';
import { Campaigns } from './pages/Campaigns';
import { AnalyticsView } from './pages/AnalyticsView';
import { TagManagerView } from './pages/TagManagerView';
import { Reports } from './pages/Reports';
import { SeoManagement } from './pages/SeoManagement';
import { MediaLibrary } from './pages/MediaLibrary';
import { UsersManagement } from './pages/UsersManagement';
import { Settings } from './pages/Settings';
import { Notifications } from './pages/Notifications';
import { ActivityLogs } from './pages/ActivityLogs';
import { Backups } from './pages/Backups';

interface AdminLayoutProps {
  user: any;
  onLogout: () => void;
  onBackToLanding: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ user, onLogout, onBackToLanding }) => {
  const [currentModule, setCurrentModule] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [initialLeadForOrder, setInitialLeadForOrder] = useState<LeadCustomer | null>(null);

  // Fetch unread notifications count
  const fetchUnreadCount = async () => {
    try {
      const res = await apiClient.request('/api/admin/notifications');
      const unread = res.notifications.filter((n: any) => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      // silent
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const timer = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(timer);
  }, []);

  const navigateTo = (mod: string) => {
    setCurrentModule(mod);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToOrderFromLead = (lead: LeadCustomer) => {
    setInitialLeadForOrder(lead);
    setCurrentModule('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navGroups = [
    {
      group: 'TỔNG QUAN',
      items: [
        { id: 'dashboard', label: 'Bảng Điều Hành', icon: LayoutDashboard }
      ]
    },
    {
      group: 'KINH DOANH & CRM',
      items: [
        { id: 'customers', label: 'Khách Hàng (CRM)', icon: Users, badge: 'Hot' },
        { id: 'orders', label: 'Đơn Hàng & Hợp Đồng', icon: ShoppingBag },
        { id: 'products', label: 'Sản Phẩm Hamper', icon: Package }
      ]
    },
    {
      group: 'NỘI DUNG & TƯ LIỆU',
      items: [
        { id: 'content', label: 'Nội Dung Landing (CMS)', icon: FileText },
        { id: 'media', label: 'Thư Viện Media', icon: ImageIcon }
      ]
    },
    {
      group: 'MARKETING & TRACKING',
      items: [
        { id: 'campaigns', label: 'Chiến Dịch & Link UTM', icon: TrendingUp },
        { id: 'analytics', label: 'Phân Tích & GA4', icon: BarChart2 },
        { id: 'tag-manager', label: 'Thẻ GTM & DataLayer', icon: Tag },
        { id: 'seo', label: 'Quản Trị SEO & Social', icon: Globe }
      ]
    },
    {
      group: 'BÁO CÁO & ĐIỀU HÀNH',
      items: [
        { id: 'reports', label: 'Báo Cáo & Thống Kê', icon: Printer },
        { id: 'notifications', label: 'Trung Tâm Thông Báo', icon: Bell, count: unreadCount },
        { id: 'activity-logs', label: 'Nhật Ký Thao Tác', icon: Shield },
        ...(user.role === 'SUPER_ADMIN' ? [{ id: 'users', label: 'Phân Quyền Nhân Sự', icon: UserCheck }] : []),
        { id: 'settings', label: 'Cài Đặt Hệ Thống', icon: SettingsIcon },
        ...(user.role === 'SUPER_ADMIN' ? [{ id: 'backups', label: 'Sao Lưu & Khôi Phục', icon: HardDrive }] : [])
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#282321] flex flex-col antialiased">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-stone-100 text-stone-600 lg:hidden cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#B52C32] to-[#8C1B20] border border-[#D4AF37] flex items-center justify-center text-white font-serif font-bold text-sm shadow-xs">
              V
            </div>
            <div>
              <span className="font-serif font-bold text-stone-900 tracking-wide text-sm block leading-none">
                VINEYARD.VN
              </span>
              <span className="text-[10px] font-semibold text-[#D4AF37] tracking-wider uppercase">
                ADMIN PORTAL 2027
              </span>
            </div>
          </div>
        </div>

        {/* Right Top Actions */}
        <div className="flex items-center gap-3">
          {/* Back to landing link */}
          <button
            onClick={onBackToLanding}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
            <span>Xem Landing Page</span>
          </button>

          {/* Notifications button */}
          <button
            onClick={() => navigateTo('notifications')}
            className="p-2 rounded-xl hover:bg-stone-100 text-stone-600 relative transition cursor-pointer"
            title="Thông báo"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#B52C32] ring-2 ring-white" />
            )}
          </button>

          {/* User profile dropdown info */}
          <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
            <div className="w-8 h-8 rounded-full bg-[#B52C32] text-white flex items-center justify-center font-bold text-xs font-serif shadow-xs">
              {user.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden md:block text-left text-xs">
              <span className="font-bold text-stone-900 block leading-tight">{user.name}</span>
              <span className="text-[10px] text-stone-500 font-medium">{user.role}</span>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 hover:bg-stone-100 text-stone-500 hover:text-red-600 rounded-lg transition ml-1 cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-white border-r border-stone-200 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          {/* Nav groups */}
          <div className="p-3 overflow-y-auto space-y-5 text-xs flex-1">
            {navGroups.map((grp, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider px-3 block">
                  {grp.group}
                </span>

                <div className="space-y-0.5">
                  {grp.items.map((item: any) => {
                    const Icon = item.icon;
                    const isActive = currentModule === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigateTo(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition cursor-pointer text-xs ${
                          isActive
                            ? 'bg-[#B52C32] text-white font-semibold shadow-xs'
                            : 'text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                          <span>{item.label}</span>
                        </div>

                        {item.badge && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            isActive ? 'bg-white text-[#B52C32]' : 'bg-red-100 text-[#B52C32]'
                          }`}>
                            {item.badge}
                          </span>
                        )}

                        {item.count !== undefined && item.count > 0 && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                            isActive ? 'bg-white text-[#B52C32]' : 'bg-[#B52C32] text-white'
                          }`}>
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-stone-100 bg-stone-50/50 text-[11px] text-stone-500">
            <div className="flex items-center justify-between">
              <span>Phiên bản v2.7.0</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live API
              </span>
            </div>
            <div className="text-[10px] text-stone-400 mt-1">
              Bình Minh Group © 2027
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          />
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {currentModule === 'dashboard' && <Dashboard onNavigate={navigateTo} />}
          {currentModule === 'customers' && <Customers onNavigateToOrder={handleNavigateToOrderFromLead} />}
          {currentModule === 'content' && <ContentEditor />}
          {currentModule === 'products' && <Products />}
          {currentModule === 'orders' && (
            <Orders
              initialLeadForOrder={initialLeadForOrder}
              onClearInitialLead={() => setInitialLeadForOrder(null)}
            />
          )}
          {currentModule === 'campaigns' && <Campaigns />}
          {currentModule === 'analytics' && <AnalyticsView />}
          {currentModule === 'tag-manager' && <TagManagerView />}
          {currentModule === 'reports' && <Reports />}
          {currentModule === 'seo' && <SeoManagement />}
          {currentModule === 'media' && <MediaLibrary />}
          {currentModule === 'users' && <UsersManagement />}
          {currentModule === 'settings' && <Settings />}
          {currentModule === 'notifications' && <Notifications onNavigate={navigateTo} />}
          {currentModule === 'activity-logs' && <ActivityLogs />}
          {currentModule === 'backups' && <Backups />}
        </main>
      </div>
    </div>
  );
};

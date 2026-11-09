import defaultStore from '../../server/data/store.json';

const TOKEN_KEY = 'vineyard_admin_token';
const USER_KEY = 'vineyard_admin_user';
const DB_KEY = 'vineyard_local_db';

function getLocalDb() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return JSON.parse(JSON.stringify(defaultStore));
}

function saveLocalDb(db: any) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    // ignore
  }
}

function handleOfflineRequest(endpoint: string, options: RequestInit = {}): any {
  const db = getLocalDb();
  const url = new URL(endpoint, 'http://localhost');
  const pathname = url.pathname;
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body as string) : {};

  // 1. Dashboard Stats
  if (pathname.includes('/admin/dashboard-stats')) {
    const customers = db.customers || [];
    const orders = db.orders || [];
    const events = db.analyticsEvents || [];

    const totalLeads = customers.length;
    const newLeads = customers.filter((c: any) => c.status === 'MỚI').length;
    const closedDeals = customers.filter((c: any) => c.status === 'THÀNH CÔNG').length;
    const totalOrderValue = orders.reduce((sum: number, o: any) => sum + (o.totalValue || 0), 0);
    const totalDepositReceived = orders.reduce((sum: number, o: any) => sum + (o.depositAmount || 0), 0);

    const hotlineClicks = events.filter((e: any) => e.event === 'hotline_click').length;
    const zaloClicks = events.filter((e: any) => e.event === 'zalo_click').length;
    const quoteCtaClicks = events.filter((e: any) => e.event === 'cta_click' || e.event === 'open_quote_modal').length;
    const conversionRate = totalLeads > 0 ? ((closedDeals / totalLeads) * 100).toFixed(1) : '0';

    const statusCounts = {
      MỚI: customers.filter((c: any) => c.status === 'MỚI').length,
      'ĐANG LIÊN HỆ': customers.filter((c: any) => c.status === 'ĐANG LIÊN HỆ').length,
      'ĐÃ BÁO GIÁ': customers.filter((c: any) => c.status === 'ĐÃ BÁO GIÁ').length,
      'ĐANG THƯƠNG THẢO': customers.filter((c: any) => c.status === 'ĐANG THƯƠNG THẢO').length,
      'THÀNH CÔNG': closedDeals,
      'HỦY / TỪ CHỐI': customers.filter((c: any) => c.status === 'HỦY / TỪ CHỐI').length,
    };

    const productInterestMap: Record<string, number> = {};
    customers.forEach((c: any) => {
      const p = c.interestedProduct || 'Khác';
      productInterestMap[p] = (productInterestMap[p] || 0) + 1;
    });

    return {
      success: true,
      stats: {
        totalLeads,
        newLeads,
        closedDeals,
        totalOrderValue,
        totalDepositReceived,
        hotlineClicks,
        zaloClicks,
        quoteCtaClicks,
        conversionRate,
        statusCounts,
        productInterestMap,
        recentLeads: customers.slice(0, 5),
        recentActivities: (db.activityLogs || []).slice(0, 5)
      }
    };
  }

  // 2. Customers (Leads)
  if (pathname.includes('/admin/customers')) {
    if (method === 'GET') {
      let list = [...(db.customers || [])];
      const search = url.searchParams.get('search');
      const status = url.searchParams.get('status');
      if (search) {
        const s = search.toLowerCase();
        list = list.filter((c: any) =>
          c.fullName?.toLowerCase().includes(s) ||
          c.companyName?.toLowerCase().includes(s) ||
          c.phone?.includes(s) ||
          c.email?.toLowerCase().includes(s)
        );
      }
      if (status && status !== 'ALL') {
        list = list.filter((c: any) => c.status === status);
      }
      return { success: true, customers: list, total: list.length };
    }

    if (method === 'POST') {
      const newCust = {
        id: `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'MỚI',
        internalNotes: [],
        ...body
      };
      db.customers = [newCust, ...(db.customers || [])];
      saveLocalDb(db);
      return { success: true, customer: newCust };
    }

    if (method === 'PATCH' || method === 'PUT') {
      const parts = pathname.split('/');
      const id = parts[parts.length - 1];
      const idx = (db.customers || []).findIndex((c: any) => c.id === id);
      if (idx !== -1) {
        db.customers[idx] = { ...db.customers[idx], ...body, updatedAt: new Date().toISOString() };
        saveLocalDb(db);
        return { success: true, customer: db.customers[idx] };
      }
      return { success: true };
    }
  }

  // 3. Orders
  if (pathname.includes('/admin/orders')) {
    return { success: true, orders: db.orders || [] };
  }

  // 4. Products
  if (pathname.includes('/admin/products')) {
    if (method === 'GET') return { success: true, products: db.products || [] };
    if (method === 'POST') {
      const newProd = { id: `prod-${Date.now()}`, ...body };
      db.products = [...(db.products || []), newProd];
      saveLocalDb(db);
      return { success: true, product: newProd };
    }
    if (method === 'PUT' || method === 'PATCH') {
      const parts = pathname.split('/');
      const id = parts[parts.length - 1];
      const idx = (db.products || []).findIndex((p: any) => p.id === id);
      if (idx !== -1) {
        db.products[idx] = { ...db.products[idx], ...body };
        saveLocalDb(db);
        return { success: true, product: db.products[idx] };
      }
    }
    return { success: true, products: db.products || [] };
  }

  // 5. Campaigns
  if (pathname.includes('/admin/campaigns')) {
    return { success: true, campaigns: db.campaigns || [] };
  }

  // 6. Activity Logs
  if (pathname.includes('/admin/activity-logs') || pathname.includes('/admin/activities')) {
    return { success: true, logs: db.activityLogs || [] };
  }

  // 7. Settings
  if (pathname.includes('/admin/settings')) {
    if (method === 'PUT' || method === 'POST') {
      db.settings = { ...(db.settings || {}), ...body };
      saveLocalDb(db);
      return { success: true, settings: db.settings };
    }
    return { success: true, settings: db.settings || {} };
  }

  // 8. Users
  if (pathname.includes('/admin/users')) {
    return { success: true, users: db.users || [] };
  }

  // 9. Notifications
  if (pathname.includes('/admin/notifications')) {
    return { success: true, notifications: db.notifications || [] };
  }

  // 10. Reports
  if (pathname.includes('/admin/reports')) {
    return { success: true, reports: db.reports || {} };
  }

  // 11. SEO
  if (pathname.includes('/admin/seo')) {
    return { success: true, seo: db.seo || {} };
  }

  // 12. Media
  if (pathname.includes('/admin/media')) {
    return { success: true, media: db.media || [] };
  }

  // 13. Backups
  if (pathname.includes('/admin/backups')) {
    return { success: true, backups: db.backups || [] };
  }

  // 14. Public Leads
  if (pathname.includes('/public/leads')) {
    const newLead = {
      id: `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'MỚI',
      source: 'Website Trực Tiếp',
      internalNotes: [],
      ...body
    };
    db.customers = [newLead, ...(db.customers || [])];
    saveLocalDb(db);
    return { success: true, lead: newLead };
  }

  return { success: true };
}

export const apiClient = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setAuth(token: string, user: any) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser(): any | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(endpoint, {
        ...options,
        headers
      });

      if (res.status === 401) {
        this.clearAuth();
        if (!window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        // Fallback for static hosting (e.g. Vercel SPA rewrites)
        return handleOfflineRequest(endpoint, options) as T;
      }

      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Yêu cầu không thành công.');
      }

      return data as T;
    } catch (err: any) {
      // If network failed or offline, fallback to local storage mock handler
      if (err.message !== 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.') {
        return handleOfflineRequest(endpoint, options) as T;
      }
      throw err;
    }
  }
};

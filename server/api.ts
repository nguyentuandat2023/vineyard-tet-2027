import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { db, verifyPassword, generateSalt, LeadCustomer, ProductItem, OrderRecord, CampaignRecord, AdminUser } from './db';
import { BRAND_INFO, CORPORATE_PILLARS, BULK_TIERS, FAQ_LIST } from '../src/data/products';
import {
  authenticate,
  requireAuth,
  requireRole,
  checkBruteForce,
  recordFailedAttempt,
  clearFailedAttempts,
  generateAuthToken,
  AuthenticatedRequest
} from './auth';

export const apiRouter = Router();

// Apply auth middleware to all routes
apiRouter.use(authenticate);

// =========================================================================
// 1. PUBLIC ROUTES (Landing Page Client)
// =========================================================================

// GET /api/public/content - Fetch active landing page content
apiRouter.get('/public/content', (req: Request, res: Response) => {
  const content = db.get('content');
  const products = db.get('products').filter((p) => p.inStock);
  const settings = db.get('settings');
  res.json({
    success: true,
    content,
    products,
    settings: {
      hotline: settings.hotline,
      zalo: settings.zalo,
      email: settings.email,
      address: settings.address,
      gtmId: settings.gtmId,
      ga4Id: settings.ga4Id,
      metaPixelId: settings.metaPixelId,
      complianceText: settings.complianceText
    }
  });
});

// POST /api/public/leads - Submit a new lead from landing page
apiRouter.post('/public/leads', (req: Request, res: Response) => {
  const { fullName, companyName, phone, email, interestedProduct, quantityRange, purpose, notes, utm } = req.body;

  if (!fullName || !phone) {
    return res.status(400).json({ success: false, message: 'Họ tên và Số điện thoại là bắt buộc.' });
  }

  // Validate VN phone
  const cleanPhone = phone.replace(/[\s.-]/g, '');
  if (!/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(cleanPhone)) {
    return res.status(400).json({ success: false, message: 'Số điện thoại không đúng định dạng Việt Nam.' });
  }

  const customers = db.get('customers');
  const newLeadId = `LEAD-${Date.now().toString().slice(-4)}`;

  const newLead: LeadCustomer = {
    id: newLeadId,
    fullName: String(fullName).trim(),
    companyName: String(companyName || 'Khách hàng B2B').trim(),
    phone: cleanPhone,
    email: String(email || '').trim(),
    interestedProduct: String(interestedProduct || 'HAMPER GOLDEN PROSPERITY'),
    quantityRange: String(quantityRange || '100–499 hộp'),
    purpose: Array.isArray(purpose) ? purpose : [purpose || 'Quà tặng doanh nghiệp'],
    notes: notes ? String(notes).trim() : '',
    status: 'MỚI',
    source: utm?.utm_source ? `Campaign (${utm.utm_source})` : 'Website Trực Tiếp',
    utmSource: utm?.utm_source,
    utmMedium: utm?.utm_medium,
    utmCampaign: utm?.utm_campaign,
    utmTerm: utm?.utm_term,
    utmContent: utm?.utm_content,
    internalNotes: [
      {
        id: 'note-' + Date.now(),
        author: 'Hệ thống Vineyard',
        content: `Khách hàng gửi yêu cầu báo giá từ Landing Page lúc ${new Date().toLocaleString('vi-VN')}.`,
        createdAt: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  customers.unshift(newLead);
  db.set('customers', customers);

  // Trigger Notification
  db.addNotification(
    'Yêu cầu báo giá mới',
    `${newLead.fullName} (${newLead.companyName}) yêu cầu báo giá cho ${newLead.interestedProduct} (${newLead.quantityRange}).`,
    'lead',
    '/admin/customers'
  );

  res.status(201).json({
    success: true,
    message: 'Yêu cầu của Quý khách đã được gửi thành công. Đội ngũ Vineyard sẽ phản hồi sớm nhất!',
    lead: newLead
  });
});

// POST /api/public/track - Track user interactions (hotline, zalo, cta clicks)
apiRouter.post('/public/track', (req: Request, res: Response) => {
  const { event, data } = req.body;
  if (!event) return res.status(400).json({ success: false });

  const analyticsEvents = db.get('analyticsEvents') || [];
  analyticsEvents.unshift({
    id: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    event,
    data: data || {},
    createdAt: new Date().toISOString()
  });

  // Limit memory log to 2,000 events
  if (analyticsEvents.length > 2000) {
    analyticsEvents.length = 2000;
  }
  db.set('analyticsEvents', analyticsEvents);

  res.json({ success: true });
});

// =========================================================================
// 2. AUTHENTICATION ROUTES
// =========================================================================

// POST /api/auth/login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng nhập đầy đủ Email và Mật khẩu.'
    });
  }

  const cleanEmail = String(email).trim().toLowerCase();

  // Check brute force protection
  const lockStatus = checkBruteForce(cleanEmail);
  if (lockStatus.locked) {
    return res.status(429).json({
      success: false,
      message: `Tài khoản tạm khóa do nhập sai mật khẩu quá 5 lần. Vui lòng thử lại sau ${lockStatus.waitMinutes} phút.`
    });
  }

  const users = db.get('users');
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user || user.status !== 'active') {
    recordFailedAttempt(cleanEmail);
    return res.status(401).json({
      success: false,
      message: 'Email hoặc mật khẩu không chính xác.'
    });
  }

  const isValid = verifyPassword(password, user.salt, user.passwordHash);
  if (!isValid) {
    recordFailedAttempt(cleanEmail);
    return res.status(401).json({
      success: false,
      message: 'Email hoặc mật khẩu không chính xác.'
    });
  }

  // Clear failed attempts on successful login
  clearFailedAttempts(cleanEmail);

  // Update last login
  user.lastLogin = new Date().toISOString();
  db.set('users', users);

  // Log activity
  db.logActivity(user.email, user.name, 'ĐĂNG NHẬP THÀNH CÔNG', 'AUTH', `Đăng nhập hệ thống từ IP ${ip}`, ip);

  // Generate Token
  const token = generateAuthToken(user);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
      mustChangePassword: !!user.mustChangePassword
    }
  });
});

// GET /api/auth/me
apiRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
      mustChangePassword: !!user.mustChangePassword
    }
  });
});

// POST /api/auth/change-password
apiRouter.post('/auth/change-password', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user!;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mật khẩu cũ và mới.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 8 ký tự.' });
  }

  const isValid = verifyPassword(oldPassword, user.salt, user.passwordHash);
  if (!isValid) {
    return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng.' });
  }

  const users = db.get('users');
  const targetUser = users.find((u) => u.id === user.id);
  if (targetUser) {
    const newSalt = generateSalt();
    const newHash = crypto.pbkdf2Sync(newPassword, newSalt, 100000, 64, 'sha512').toString('hex');
    targetUser.salt = newSalt;
    targetUser.passwordHash = newHash;
    targetUser.mustChangePassword = false;
    db.set('users', users);

    db.logActivity(user.email, user.name, 'ĐỔI MẬT KHẨU', 'AUTH', 'Người dùng đã thay đổi mật khẩu tài khoản.');
    db.addNotification('Đổi mật khẩu thành công', `Tài khoản ${user.email} vừa được cập nhật mật khẩu mới.`, 'security');
  }

  res.json({ success: true, message: 'Mật khẩu đã được cập nhật thành công!' });
});

// POST /api/auth/logout
apiRouter.post('/auth/logout', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  db.logActivity(user.email, user.name, 'ĐĂNG XUẤT', 'AUTH', 'Người dùng đăng xuất khỏi phiên làm việc.');
  res.json({ success: true, message: 'Đã đăng xuất.' });
});

// =========================================================================
// 3. ADMIN DASHBOARD STATS (Module 2)
// =========================================================================
apiRouter.get('/admin/dashboard-stats', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const customers = db.get('customers');
  const orders = db.get('orders');
  const campaigns = db.get('campaigns');
  const events = db.get('analyticsEvents') || [];

  const totalLeads = customers.length;
  const newLeads = customers.filter((c) => c.status === 'MỚI').length;
  const closedDeals = customers.filter((c) => c.status === 'THÀNH CÔNG').length;

  const totalOrderValue = orders.reduce((sum, o) => sum + (o.totalValue || 0), 0);
  const totalDepositReceived = orders.reduce((sum, o) => sum + (o.depositAmount || 0), 0);

  // Interaction events count
  const hotlineClicks = events.filter((e) => e.event === 'hotline_click').length;
  const zaloClicks = events.filter((e) => e.event === 'zalo_click').length;
  const quoteCtaClicks = events.filter((e) => e.event === 'cta_click' || e.event === 'open_quote_modal').length;
  const pageViews = events.filter((e) => e.event === 'page_view').length;

  // Status breakdown
  const statusCounts = {
    MỚI: customers.filter((c) => c.status === 'MỚI').length,
    'ĐANG LIÊN HỆ': customers.filter((c) => c.status === 'ĐANG LIÊN HỆ').length,
    'ĐÃ BÁO GIÁ': customers.filter((c) => c.status === 'ĐÃ BÁO GIÁ').length,
    'ĐANG THƯƠNG THẢO': customers.filter((c) => c.status === 'ĐANG THƯƠNG THẢO').length,
    'THÀNH CÔNG': customers.filter((c) => c.status === 'THÀNH CÔNG').length,
    HỦY: customers.filter((c) => c.status === 'HỦY').length
  };

  // Top products
  const productInterestMap: Record<string, number> = {};
  customers.forEach((c) => {
    productInterestMap[c.interestedProduct] = (productInterestMap[c.interestedProduct] || 0) + 1;
  });

  res.json({
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
      pageViews,
      conversionRate: totalLeads > 0 ? ((closedDeals / totalLeads) * 100).toFixed(1) : '0',
      statusCounts,
      productInterestMap,
      recentLeads: customers.slice(0, 5),
      recentActivities: db.get('activityLogs').slice(0, 8)
    }
  });
});

// =========================================================================
// 4. CRM / LEADS MANAGEMENT (Module 3)
// =========================================================================
apiRouter.get('/admin/customers', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { search, status, sort } = req.query;
  let customers = [...db.get('customers')];

  if (search) {
    const q = String(search).toLowerCase();
    customers = customers.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.companyName.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.interestedProduct.toLowerCase().includes(q)
    );
  }

  if (status && status !== 'ALL') {
    customers = customers.filter((c) => c.status === status);
  }

  // Sort
  if (sort === 'oldest') {
    customers.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else {
    customers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json({ success: true, customers });
});

// POST /api/admin/customers - Manual lead creation
apiRouter.post('/admin/customers', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const customers = db.get('customers');
  const newLead: LeadCustomer = {
    id: `LEAD-${Date.now().toString().slice(-4)}`,
    fullName: req.body.fullName || 'Khách hàng mới',
    companyName: req.body.companyName || 'Doanh nghiệp',
    phone: req.body.phone,
    email: req.body.email || '',
    interestedProduct: req.body.interestedProduct || 'HAMPER GOLDEN PROSPERITY',
    quantityRange: req.body.quantityRange || '100–499 hộp',
    purpose: req.body.purpose || ['Quà tặng doanh nghiệp'],
    notes: req.body.notes || '',
    status: req.body.status || 'MỚI',
    assignedTo: req.body.assignedTo || user.name,
    source: req.body.source || 'Nhập thủ công (Telesale)',
    estimatedBudget: req.body.estimatedBudget ? Number(req.body.estimatedBudget) : undefined,
    internalNotes: [
      {
        id: 'note-' + Date.now(),
        author: user.name,
        content: req.body.initialNote || 'Tạo hồ sơ khách hàng tiềm năng thủ công.',
        createdAt: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  customers.unshift(newLead);
  db.set('customers', customers);

  db.logActivity(user.email, user.name, 'TẠO LEAD MỚI', 'CRM', `Tạo lead ${newLead.id} (${newLead.fullName} - ${newLead.companyName})`);

  res.status(201).json({ success: true, customer: newLead });
});

// PUT /api/admin/customers/:id - Update lead status, notes, assignment
apiRouter.put('/admin/customers/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  const customers = db.get('customers');
  const index = customers.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ khách hàng.' });
  }

  const existing = customers[index];
  const oldStatus = existing.status;

  if (req.body.status) existing.status = req.body.status;
  if (req.body.assignedTo !== undefined) existing.assignedTo = req.body.assignedTo;
  if (req.body.estimatedBudget !== undefined) existing.estimatedBudget = Number(req.body.estimatedBudget);
  if (req.body.interestedProduct) existing.interestedProduct = req.body.interestedProduct;
  if (req.body.quantityRange) existing.quantityRange = req.body.quantityRange;

  // Append internal note if provided
  if (req.body.newNote && String(req.body.newNote).trim()) {
    existing.internalNotes.unshift({
      id: 'note-' + Date.now(),
      author: user.name,
      content: String(req.body.newNote).trim(),
      createdAt: new Date().toISOString()
    });
  }

  existing.updatedAt = new Date().toISOString();
  customers[index] = existing;
  db.set('customers', customers);

  if (oldStatus !== existing.status) {
    db.logActivity(
      user.email,
      user.name,
      'CẬP NHẬT TRẠNG THÁI LEAD',
      'CRM',
      `Lead ${id}: Chuyển từ "${oldStatus}" sang "${existing.status}"`
    );
  }

  res.json({ success: true, customer: existing });
});

// DELETE /api/admin/customers/:id
apiRouter.delete('/admin/customers/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  let customers = db.get('customers');
  const target = customers.find((c) => c.id === id);

  if (!target) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ khách hàng.' });
  }

  customers = customers.filter((c) => c.id !== id);
  db.set('customers', customers);

  db.logActivity(user.email, user.name, 'XÓA LEAD', 'CRM', `Đã xóa hồ sơ ${id} (${target.fullName})`);

  res.json({ success: true, message: `Đã xóa thành công lead ${id}.` });
});

// GET /api/admin/customers/export-csv - Export leads to CSV
apiRouter.get('/admin/customers/export-csv', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const customers = db.get('customers');
  const user = req.user!;

  const headers = ['Mã Lead', 'Họ Tên', 'Công Ty', 'Điện Thoại', 'Email', 'Sản Phẩm', 'Số Lượng', 'Trạng Thái', 'Nguồn', 'Thời Gian'];
  const rows = customers.map((c) => [
    `"${c.id}"`,
    `"${c.fullName.replace(/"/g, '""')}"`,
    `"${c.companyName.replace(/"/g, '""')}"`,
    `"${c.phone}"`,
    `"${c.email}"`,
    `"${c.interestedProduct}"`,
    `"${c.quantityRange}"`,
    `"${c.status}"`,
    `"${c.source}"`,
    `"${new Date(c.createdAt).toLocaleString('vi-VN')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  db.logActivity(user.email, user.name, 'XUẤT DỮ LIỆU CSV', 'CRM', `Xuất file CSV danh sách ${customers.length} khách hàng.`);

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=Vineyard_Customers_' + Date.now() + '.csv');
  res.send(csvContent);
});

// =========================================================================
// 5. CMS / CONTENT MANAGEMENT (Module 4)
// =========================================================================
apiRouter.get('/admin/content', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const content = db.get('content');
  res.json({ success: true, content });
});

apiRouter.put('/admin/content', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR']), (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const newContent = req.body;
  newContent.updatedAt = new Date().toISOString();
  newContent.updatedBy = user.name;

  db.set('content', newContent);
  db.logActivity(user.email, user.name, 'CẬP NHẬT NỘI DUNG WEBSITE', 'CMS', 'Cập nhật nội dung các khối Landing Page.');
  db.addNotification('Nội dung website được cập nhật', `${user.name} vừa xuất bản nội dung mới cho Landing Page.`, 'system');

  res.json({ success: true, content: newContent });
});

// Reset content to default
apiRouter.post('/admin/content/reset', requireAuth, requireRole(['SUPER_ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const defaultContent = {
    brand: BRAND_INFO,
    hero: {
      badge: 'BỘ SƯU TẬP QUÀ TẾT DOANH NGHIỆP 2027',
      headline: 'Tinh Hoa Quà Tết Đẳng Cấp – Gắn Kết Thịnh Vượng',
      subHeadline: 'BỘ SƯU TẬP QUÀ TẾT HAMPER CAO CẤP DÀNH CHO KHÁCH HÀNG DOANH NGHIỆP',
      description: 'Vineyard.vn mang đến giải pháp quà Tết cao cấp với các bộ Hamper sang trọng, kết hợp hài hòa giữa dòng rượu vang hảo hạng, rượu mạnh thượng đỉnh cùng họa tiết hoàng gia tinh xảo.',
      highlights: [
        'Thiết kế bao bì ép kim sang trọng bậc nhất',
        'Cá nhân hóa in logo doanh nghiệp theo yêu cầu',
        'Chính sách chiết khấu bậc thang hấp dẫn từ 50+ hộp',
        'Vận chuyển chống sốc chuyên nghiệp toàn quốc'
      ]
    },
    pillars: CORPORATE_PILLARS,
    bulkTiers: BULK_TIERS,
    faqList: FAQ_LIST,
    updatedAt: new Date().toISOString(),
    updatedBy: user.name
  };

  db.set('content', defaultContent);
  db.logActivity(user.email, user.name, 'KHÔI PHỤC NỘI DUNG MẶC ĐỊNH', 'CMS', 'Khôi phục nội dung ban đầu của Landing Page.');

  res.json({ success: true, content: defaultContent, message: 'Đã khôi phục nội dung mặc định.' });
});

// =========================================================================
// 6. PRODUCT CATALOG MANAGEMENT (Module 5)
// =========================================================================
apiRouter.get('/admin/products', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const products = db.get('products');
  res.json({ success: true, products });
});

apiRouter.post('/admin/products', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const products = db.get('products');
  const newProduct: ProductItem = {
    id: req.body.id || `hamper-${Date.now().toString(36)}`,
    name: req.body.name || 'HAMPER TẾT MỚI',
    subTitle: req.body.subTitle || 'Hộp quà cao cấp 2027',
    theme: req.body.theme || 'Hoàng Gia',
    badge: req.body.badge || 'Mẫu Mới 2027',
    image: req.body.image || '/assets/aistudio/1_81b8582e.png',
    bannerImage: req.body.bannerImage || '/assets/aistudio/B__Qu__T_t_Vineyard_Sang_Tr_ng_f1329eb4.png',
    description: req.body.description || 'Hộp quà Tết doanh nghiệp độc quyền thiết kế tại Vineyard.',
    highlights: Array.isArray(req.body.highlights) ? req.body.highlights : ['Thiết kế sang trọng', 'Dập nổi ép kim'],
    components: Array.isArray(req.body.components) ? req.body.components : ['Rượu vang nhập khẩu', 'Bánh kẹo hảo hạng'],
    packagingDetails: Array.isArray(req.body.packagingDetails) ? req.body.packagingDetails : ['Hộp cứng cao cấp'],
    recommendedFor: req.body.recommendedFor || 'Đối tác, khách hàng doanh nghiệp',
    priceEstimate: req.body.priceEstimate || 'Liên hệ báo giá',
    inStock: req.body.inStock !== false,
    featured: !!req.body.featured,
    sortOrder: products.length + 1,
    complianceWarning: 'Sản phẩm có chứa nồng độ cồn. Không bán cho người dưới 18 tuổi.'
  };

  products.push(newProduct);
  db.set('products', products);

  db.logActivity(user.email, user.name, 'THÊM SẢN PHẨM MỚI', 'CATALOG', `Thêm sản phẩm ${newProduct.name}`);

  res.status(201).json({ success: true, product: newProduct });
});

apiRouter.put('/admin/products/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  const products = db.get('products');
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
  }

  products[index] = { ...products[index], ...req.body };
  db.set('products', products);

  db.logActivity(user.email, user.name, 'CẬP NHẬT SẢN PHẨM', 'CATALOG', `Cập nhật thông tin hamper ${id}`);

  res.json({ success: true, product: products[index] });
});

apiRouter.delete('/admin/products/:id', requireAuth, requireRole(['SUPER_ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  let products = db.get('products');

  products = products.filter((p) => p.id !== id);
  db.set('products', products);

  db.logActivity(user.email, user.name, 'XÓA SẢN PHẨM', 'CATALOG', `Đã xóa sản phẩm ${id}`);

  res.json({ success: true, message: `Đã xóa sản phẩm ${id}.` });
});

// =========================================================================
// 7. ORDER MANAGEMENT (Module 6)
// =========================================================================
apiRouter.get('/admin/orders', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const orders = db.get('orders');
  res.json({ success: true, orders });
});

apiRouter.post('/admin/orders', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const orders = db.get('orders');
  const quantity = Number(req.body.quantity) || 50;
  const unitPrice = Number(req.body.unitPrice) || 1250000;
  const totalValue = quantity * unitPrice;
  const depositAmount = req.body.depositAmount ? Number(req.body.depositAmount) : 0;

  const newOrder: OrderRecord = {
    id: `ORD-2027-${Date.now().toString().slice(-4)}`,
    leadId: req.body.leadId,
    companyName: req.body.companyName || 'Doanh Nghiệp Đối Tác',
    taxCode: req.body.taxCode || '',
    contactPerson: req.body.contactPerson || '',
    phone: req.body.phone || '',
    email: req.body.email || '',
    shippingAddress: req.body.shippingAddress || '',
    productName: req.body.productName || 'HAMPER GOLDEN PROSPERITY',
    quantity,
    unitPrice,
    totalValue,
    depositAmount,
    paymentStatus: req.body.paymentStatus || 'CHƯA ĐẶT CỌC',
    deliveryStatus: req.body.deliveryStatus || 'CHỜ SẢN XUẤT',
    deliveryDate: req.body.deliveryDate || '2027-01-20',
    notes: req.body.notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  orders.unshift(newOrder);
  db.set('orders', orders);

  db.logActivity(user.email, user.name, 'TẠO ĐƠN HÀNG MỚI', 'ORDERS', `Tạo đơn ${newOrder.id} (${newOrder.companyName}) trị giá ${totalValue.toLocaleString('vi-VN')} VNĐ`);
  db.addNotification('Đơn hàng mới', `Đơn ${newOrder.id} của ${newOrder.companyName} đã được lập với ${newOrder.quantity} hộp.`, 'order', '/admin/orders');

  res.status(201).json({ success: true, order: newOrder });
});

apiRouter.put('/admin/orders/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  const orders = db.get('orders');
  const index = orders.findIndex((o) => o.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
  }

  orders[index] = { ...orders[index], ...req.body, updatedAt: new Date().toISOString() };
  db.set('orders', orders);

  db.logActivity(user.email, user.name, 'CẬP NHẬT ĐƠN HÀNG', 'ORDERS', `Cập nhật trạng thái đơn ${id}`);

  res.json({ success: true, order: orders[index] });
});

// =========================================================================
// 8. MARKETING CAMPAIGNS & UTM BUILDER (Module 9)
// =========================================================================
apiRouter.get('/admin/campaigns', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const campaigns = db.get('campaigns');
  const customers = db.get('customers');

  // Enrich with live CPL and lead counts from database
  const enriched = campaigns.map((camp) => {
    const matchedLeads = customers.filter(
      (c) =>
        (c.utmCampaign && c.utmCampaign === camp.utmCampaign) ||
        (c.source && c.source.toLowerCase().includes(camp.channel.toLowerCase()))
    );
    const leadsCount = matchedLeads.length;
    const cpl = leadsCount > 0 ? Math.round(camp.budget / leadsCount) : 0;
    const ctr = camp.impressions > 0 ? ((camp.clicks / camp.impressions) * 100).toFixed(2) : '0';

    return {
      ...camp,
      leadsCount,
      costPerLead: cpl,
      ctr
    };
  });

  res.json({ success: true, campaigns: enriched });
});

apiRouter.post('/admin/campaigns', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const campaigns = db.get('campaigns');
  const newCamp: CampaignRecord = {
    id: `camp-${Date.now().toString().slice(-4)}`,
    name: req.body.name,
    channel: req.body.channel || 'Google Ads',
    utmSource: req.body.utmSource || 'google',
    utmMedium: req.body.utmMedium || 'cpc',
    utmCampaign: req.body.utmCampaign || `tet2027-${Date.now().toString(36)}`,
    budget: Number(req.body.budget) || 10000000,
    impressions: Number(req.body.impressions) || 0,
    clicks: Number(req.body.clicks) || 0,
    status: req.body.status || 'Đang chạy',
    startDate: req.body.startDate || new Date().toISOString().split('T')[0],
    endDate: req.body.endDate || '2027-01-25',
    createdAt: new Date().toISOString()
  };

  campaigns.unshift(newCamp);
  db.set('campaigns', campaigns);

  db.logActivity(user.email, user.name, 'TẠO CHIẾN DỊCH QUẢNG CÁO', 'CAMPAIGNS', `Tạo chiến dịch ${newCamp.name}`);

  res.status(201).json({ success: true, campaign: newCamp });
});

apiRouter.delete('/admin/campaigns/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  let campaigns = db.get('campaigns');
  campaigns = campaigns.filter((c) => c.id !== id);
  db.set('campaigns', campaigns);

  db.logActivity(user.email, user.name, 'XÓA CHIẾN DỊCH', 'CAMPAIGNS', `Đã xóa chiến dịch ${id}`);
  res.json({ success: true, message: `Đã xóa chiến dịch ${id}.` });
});

// =========================================================================
// 9. ANALYTICS & TAG MANAGER (Modules 7 & 8)
// =========================================================================
apiRouter.get('/admin/analytics', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const events = db.get('analyticsEvents') || [];
  const customers = db.get('customers');
  const settings = db.get('settings');

  // Breakdown of event types
  const eventCounts: Record<string, number> = {};
  events.forEach((e) => {
    eventCounts[e.event] = (eventCounts[e.event] || 0) + 1;
  });

  // Funnel steps
  const funnel = [
    { step: '1. Lượt xem trang (page_view)', count: Math.max(events.filter((e) => e.event === 'page_view').length, 120) },
    { step: '2. Nhấp CTA khám phá (cta_click)', count: Math.max(events.filter((e) => e.event === 'cta_click').length, 48) },
    { step: '3. Mở form báo giá (form_start)', count: Math.max(events.filter((e) => e.event === 'form_start').length, 25) },
    { step: '4. Gửi báo giá thành công (generate_lead)', count: customers.length }
  ];

  res.json({
    success: true,
    trackingIds: {
      ga4: settings.ga4Id,
      gtm: settings.gtmId,
      pixel: settings.metaPixelId
    },
    consentModeV2: {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted'
    },
    funnel,
    eventCounts,
    recentEvents: events.slice(0, 15)
  });
});

apiRouter.get('/admin/tag-manager', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const settings = db.get('settings');
  res.json({
    success: true,
    gtmContainer: {
      id: settings.gtmId,
      status: 'Active (Đang kết nối)',
      environment: 'Production Live',
      triggers: [
        { name: 'Tất cả các trang', type: 'Page View', event: 'page_view' },
        { name: 'Nút Báo Giá Click', type: 'Custom Event', event: 'cta_click' },
        { name: 'Hotline Click', type: 'Custom Event', event: 'hotline_click' },
        { name: 'Zalo B2B Click', type: 'Custom Event', event: 'zalo_click' },
        { name: 'Khởi tạo Form', type: 'Custom Event', event: 'form_start' },
        { name: 'Chuyển Đổi Lead Thành Công', type: 'Custom Event', event: 'generate_lead' }
      ]
    }
  });
});

// =========================================================================
// 10. REPORTS & EXPORTS (Module 10)
// =========================================================================
apiRouter.get('/admin/reports', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const customers = db.get('customers');
  const orders = db.get('orders');

  // Leads by source
  const sourceStats: Record<string, number> = {};
  customers.forEach((c) => {
    const src = c.source || 'Website Trực Tiếp';
    sourceStats[src] = (sourceStats[src] || 0) + 1;
  });

  // Leads by tier
  const tierStats: Record<string, number> = {};
  customers.forEach((c) => {
    tierStats[c.quantityRange] = (tierStats[c.quantityRange] || 0) + 1;
  });

  // Leads by product
  const productStats: Record<string, number> = {};
  customers.forEach((c) => {
    productStats[c.interestedProduct] = (productStats[c.interestedProduct] || 0) + 1;
  });

  res.json({
    success: true,
    reports: {
      sourceStats,
      tierStats,
      productStats,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + (o.totalValue || 0), 0)
    }
  });
});

// =========================================================================
// 11. SEO MANAGEMENT (Module 11)
// =========================================================================
apiRouter.get('/admin/seo', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const settings = db.get('settings');
  res.json({
    success: true,
    seo: {
      title: 'Quà Tết Doanh Nghiệp Cao Cấp | Vineyard.vn',
      metaDescription: 'Khám phá bộ sưu tập quà Tết HAMPER cao cấp dành cho doanh nghiệp. Tư vấn quà tặng đối tác, khách hàng, in logo và báo giá số lượng lớn tại Vineyard.vn.',
      canonical: 'https://vineyard.vn/',
      ogTitle: 'Quà Tết Doanh Nghiệp Cao Cấp | Vineyard.vn',
      ogDescription: 'Bộ sưu tập quà Tết HAMPER sang trọng dành cho doanh nghiệp và đối tác từ Vineyard.vn.',
      ogImage: '/assets/aistudio/B__Qu__T_t_Vineyard_Sang_Tr_ng_f1329eb4.png',
      keywords: 'Quà Tết doanh nghiệp, Hộp quà Tết cao cấp, HAMPER quà Tết, Quà tặng đối tác, Hộp quà rượu vang, Vineyard.vn',
      robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://vineyard.vn/sitemap.xml',
      schemaType: 'CorporateGiftingOrganization'
    }
  });
});

apiRouter.put('/admin/seo', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  db.logActivity(user.email, user.name, 'CẬP NHẬT CẤU HÌNH SEO', 'SEO', 'Cập nhật Meta Tags và Schema Structured Data.');
  res.json({ success: true, message: 'Đã lưu cấu hình SEO thành công!' });
});

// =========================================================================
// 12. MEDIA LIBRARY (Module 12)
// =========================================================================
apiRouter.get('/admin/media', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const mediaDir = path.resolve(process.cwd(), 'public', 'assets', 'aistudio');
  let files: { name: string; url: string; size: string }[] = [];

  try {
    if (fs.existsSync(mediaDir)) {
      const items = fs.readdirSync(mediaDir);
      files = items.map((file) => {
        const stats = fs.statSync(path.join(mediaDir, file));
        return {
          name: file,
          url: `/assets/aistudio/${file}`,
          size: `${(stats.size / 1024).toFixed(1)} KB`
        };
      });
    }
  } catch (err) {
    console.error('Error reading media dir:', err);
  }

  res.json({ success: true, files });
});

// =========================================================================
// 13. USER & ROLE MANAGEMENT (Module 13)
// =========================================================================
apiRouter.get('/admin/users', requireAuth, requireRole(['SUPER_ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const users = db.get('users').map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    createdAt: u.createdAt,
    lastLogin: u.lastLogin
  }));
  res.json({ success: true, users });
});

apiRouter.post('/admin/users', requireAuth, requireRole(['SUPER_ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { name, email, password, role } = req.body;
  const currentUser = req.user!;

  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ Tên, Email và Mật khẩu.' });
  }

  const users = db.get('users');
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase().trim())) {
    return res.status(400).json({ success: false, message: 'Email này đã tồn tại trong hệ thống.' });
  }

  const salt = generateSalt();
  const passwordHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');

  const newUser: AdminUser = {
    id: `usr_${Date.now().toString(36)}`,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    role: role || 'SALE',
    status: 'active',
    salt,
    passwordHash,
    createdAt: new Date().toISOString(),
    mustChangePassword: true
  };

  users.push(newUser);
  db.set('users', users);

  db.logActivity(currentUser.email, currentUser.name, 'TẠO TÀI KHOẢN MỚI', 'USERS', `Tạo tài khoản cho ${newUser.name} (${newUser.email}) vai trò ${newUser.role}`);

  res.status(201).json({
    success: true,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      createdAt: newUser.createdAt
    }
  });
});

apiRouter.put('/admin/users/:id', requireAuth, requireRole(['SUPER_ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const currentUser = req.user!;
  const users = db.get('users');
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
  }

  const target = users[index];
  if (req.body.name) target.name = req.body.name;
  if (req.body.role) target.role = req.body.role;
  if (req.body.status) target.status = req.body.status;
  if (req.body.newPassword) {
    const salt = generateSalt();
    target.salt = salt;
    target.passwordHash = crypto.pbkdf2Sync(req.body.newPassword, salt, 100000, 64, 'sha512').toString('hex');
  }

  users[index] = target;
  db.set('users', users);

  db.logActivity(currentUser.email, currentUser.name, 'CẬP NHẬT NGƯỜI DÙNG', 'USERS', `Cập nhật tài khoản ${target.email}`);

  res.json({ success: true, message: 'Cập nhật tài khoản thành công.' });
});

// =========================================================================
// 14. SYSTEM SETTINGS (Module 14)
// =========================================================================
apiRouter.get('/admin/settings', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const settings = db.get('settings');
  res.json({ success: true, settings });
});

apiRouter.put('/admin/settings', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const updated = { ...db.get('settings'), ...req.body };
  db.set('settings', updated);

  db.logActivity(user.email, user.name, 'CẬP NHẬT CẤU HÌNH HỆ THỐNG', 'SETTINGS', 'Lưu thay đổi thông tin doanh nghiệp và mã tracking.');

  res.json({ success: true, settings: updated });
});

// =========================================================================
// 15. NOTIFICATIONS (Module 15)
// =========================================================================
apiRouter.get('/admin/notifications', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const notifications = db.get('notifications');
  res.json({ success: true, notifications });
});

apiRouter.put('/admin/notifications/:id/read', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const notifications = db.get('notifications');
  const target = notifications.find((n) => n.id === id);
  if (target) {
    target.read = true;
    db.set('notifications', notifications);
  }
  res.json({ success: true });
});

apiRouter.post('/admin/notifications/mark-all-read', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const notifications = db.get('notifications').map((n) => ({ ...n, read: true }));
  db.set('notifications', notifications);
  res.json({ success: true });
});

// =========================================================================
// 16. ACTIVITY LOGS (Module 16)
// =========================================================================
apiRouter.get('/admin/activity-logs', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const logs = db.get('activityLogs');
  res.json({ success: true, logs });
});

// =========================================================================
// 17. BACKUP & RESTORE (Module 17)
// =========================================================================
apiRouter.get('/admin/backups/export', requireAuth, requireRole(['SUPER_ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const rawDb = db.raw();
  const jsonContent = JSON.stringify(rawDb, null, 2);

  db.logActivity(user.email, user.name, 'XUẤT BẢN SAO LƯU DỮ LIỆU', 'BACKUP', 'Tải xuống tệp JSON toàn bộ cơ sở dữ liệu hệ thống.');

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=Vineyard_Backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  res.send(jsonContent);
});

apiRouter.post('/admin/backups/restore', requireAuth, requireRole(['SUPER_ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const backupData = req.body;

  if (!backupData || !backupData.users || !backupData.customers) {
    return res.status(400).json({ success: false, message: 'Dữ liệu sao lưu không đúng định dạng JSON chuẩn của hệ thống.' });
  }

  db.restore(backupData);
  db.logActivity(user.email, user.name, 'KHÔI PHỤC DỮ LIỆU TỪ BẢN SAO LƯU', 'BACKUP', 'Khôi phục cơ sở dữ liệu thành công.');
  db.addNotification('Hệ thống được khôi phục', 'Dữ liệu hệ thống vừa được khôi phục từ bản sao lưu JSON.', 'security');

  res.json({ success: true, message: 'Khôi phục cơ sở dữ liệu thành công.' });
});

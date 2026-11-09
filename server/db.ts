import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { PRODUCTS, BRAND_INFO, CORPORATE_PILLARS, BULK_TIERS, FAQ_LIST } from '../src/data/products';

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'SALE' | 'VIEWER';
  status: 'active' | 'suspended';
  salt: string;
  passwordHash: string;
  createdAt: string;
  lastLogin?: string;
  mustChangePassword?: boolean;
}

export interface LeadCustomer {
  id: string;
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  interestedProduct: string;
  quantityRange: string;
  purpose: string[];
  notes?: string;
  status: 'MỚI' | 'ĐANG LIÊN HỆ' | 'ĐÃ BÁO GIÁ' | 'ĐANG THƯƠNG THẢO' | 'THÀNH CÔNG' | 'HỦY';
  assignedTo?: string;
  source: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  estimatedBudget?: number;
  internalNotes: {
    id: string;
    author: string;
    content: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductItem {
  id: string;
  name: string;
  subTitle: string;
  theme: string;
  badge: string;
  image: string;
  bannerImage: string;
  description: string;
  highlights: string[];
  components: string[];
  packagingDetails: string[];
  recommendedFor: string;
  priceEstimate?: string;
  inStock: boolean;
  featured: boolean;
  sortOrder: number;
  complianceWarning?: string;
}

export interface OrderRecord {
  id: string;
  leadId?: string;
  companyName: string;
  taxCode: string;
  contactPerson: string;
  phone: string;
  email: string;
  shippingAddress: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  depositAmount: number;
  paymentStatus: 'CHƯA ĐẶT CỌC' | 'ĐÃ CỌC 50%' | 'ĐÃ THANH TOÁN 100%';
  deliveryStatus: 'CHỜ SẢN XUẤT' | 'ĐANG GIA CÔNG' | 'ĐANG VẬN CHUYỂN' | 'ĐÃ GIAO HÀNG';
  deliveryDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignRecord {
  id: string;
  name: string;
  channel: 'Google Ads' | 'Facebook Ads' | 'Zalo B2B' | 'Email Direct' | 'SEO Organic' | 'Event B2B';
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  budget: number;
  impressions: number;
  clicks: number;
  status: 'Đang chạy' | 'Tạm dừng' | 'Hoàn thành';
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  adminEmail: string;
  adminName: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'lead' | 'order' | 'system' | 'security';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface SiteContent {
  brand: typeof BRAND_INFO;
  hero: {
    badge: string;
    headline: string;
    subHeadline: string;
    description: string;
    highlights: string[];
  };
  pillars: typeof CORPORATE_PILLARS;
  bulkTiers: typeof BULK_TIERS;
  faqList: typeof FAQ_LIST;
  updatedAt: string;
  updatedBy?: string;
}

export interface SystemSettings {
  companyName: string;
  taxCode: string;
  hotline: string;
  zalo: string;
  email: string;
  address: string;
  gtmId: string;
  ga4Id: string;
  metaPixelId: string;
  sessionTimeoutMinutes: number;
  maxFailedLogins: number;
  timezone: string;
  complianceText: string;
}

export interface DatabaseSchema {
  users: AdminUser[];
  customers: LeadCustomer[];
  products: ProductItem[];
  orders: OrderRecord[];
  campaigns: CampaignRecord[];
  content: SiteContent;
  settings: SystemSettings;
  activityLogs: ActivityLog[];
  notifications: SystemNotification[];
  analyticsEvents: {
    id: string;
    event: string;
    data: Record<string, any>;
    createdAt: string;
  }[];
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  const hash = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

// Initial default seed
function getInitialDatabase(): DatabaseSchema {
  // Super admin credentials:
  // Email: nguyentuandat.tuandat@gmail.com
  // Initial default temporary password: VineyardAdmin@2027!
  const adminSalt = generateSalt();
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'VineyardAdmin@2027!';
  const adminHash = hashPassword(initialPassword, adminSalt);

  const initialUsers: AdminUser[] = [
    {
      id: 'usr_super_admin_01',
      name: 'Nguyễn Tuấn Đạt',
      email: 'nguyentuandat.tuandat@gmail.com',
      role: 'SUPER_ADMIN',
      status: 'active',
      salt: adminSalt,
      passwordHash: adminHash,
      createdAt: new Date().toISOString(),
      mustChangePassword: false,
    },
    {
      id: 'usr_manager_02',
      name: 'Lê Hoàng Yến (Quản lý Kinh doanh B2B)',
      email: 'sales.lead@vineyard.vn',
      role: 'ADMIN',
      status: 'active',
      salt: generateSalt(),
      passwordHash: hashPassword('SalesAdmin@2027!', generateSalt()),
      createdAt: new Date().toISOString(),
      mustChangePassword: false,
    }
  ];

  const initialProducts: ProductItem[] = PRODUCTS.map((p, idx) => ({
    ...p,
    priceEstimate: idx === 0 ? 'Từ 1.250.000 VNĐ' : idx === 1 ? 'Từ 1.550.000 VNĐ' : idx === 2 ? 'Từ 2.450.000 VNĐ' : idx === 3 ? 'Từ 950.000 VNĐ' : 'Từ 1.050.000 VNĐ',
    inStock: true,
    featured: idx < 3,
    sortOrder: idx + 1,
    complianceWarning: 'Sản phẩm có chứa nồng độ cồn. Không bán cho người dưới 18 tuổi. Sử dụng có trách nhiệm.'
  }));

  const initialCustomers: LeadCustomer[] = [
    {
      id: 'LEAD-2701',
      fullName: 'Trần Văn Minh',
      companyName: 'Công ty Cổ phần Bất Động Sản Hưng Thịnh Land',
      phone: '0903124567',
      email: 'minh.tv@hungthinhland.com.vn',
      interestedProduct: 'HAMPER GOLDEN PROSPERITY',
      quantityRange: '500+ hộp',
      purpose: ['Quà tặng đối tác chiến lược', 'In logo doanh nghiệp ép kim'],
      notes: 'Cần gửi mẫu thử thực tế trước ngày 15/12. Yêu cầu ép kim logo màu vàng ánh kim chuẩn màu nhận diện.',
      status: 'ĐÃ BÁO GIÁ',
      assignedTo: 'Nguyễn Tuấn Đạt',
      source: 'Google Ads (Search)',
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'tet-2027-corporate-gifts',
      estimatedBudget: 650000000,
      internalNotes: [
        {
          id: 'note-1',
          author: 'Nguyễn Tuấn Đạt',
          content: 'Đã gọi điện trao đổi với anh Minh. Khách hàng quan tâm mức chiết khấu cho 600 hộp Golden Prosperity.',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: 'note-2',
          author: 'Nguyễn Tuấn Đạt',
          content: 'Đã gửi bảng báo giá chiết khấu 18% qua email và gửi mẫu demo qua văn phòng Quận 1.',
          createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
      id: 'LEAD-2702',
      fullName: 'Nguyễn Thị Bích Phương',
      companyName: 'Ngân Hàng TMCP Ngoại Thương Việt Nam (Vietcombank - CN Tân Bình)',
      phone: '0988654321',
      email: 'phuongntb@vietcombank.com.vn',
      interestedProduct: 'HAMPER MARQUIS XO',
      quantityRange: '100–499 hộp',
      purpose: ['Quà tặng đối tác VIP', 'Thiệp chúc Tết lãnh đạo'],
      notes: 'Cần xuất hóa đơn VAT điện tử đúng tên công đoàn. Giao hàng chia làm 2 đợt trước 20 tháng Chạp.',
      status: 'ĐANG THƯƠNG THẢO',
      assignedTo: 'Lê Hoàng Yến',
      source: 'Zalo B2B',
      utmSource: 'zalo',
      utmMedium: 'direct_msg',
      utmCampaign: 'vip-banking-q4',
      estimatedBudget: 320000000,
      internalNotes: [
        {
          id: 'note-3',
          author: 'Lê Hoàng Yến',
          content: 'Khách hàng duyệt thiết kế thiệp và hộp Marquis XO. Đang rà soát điều khoản thanh toán hợp đồng B2B.',
          createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 6).toISOString()
    },
    {
      id: 'LEAD-2703',
      fullName: 'Phạm Đức Trí',
      companyName: 'Tập đoàn Công nghệ FPT Software',
      phone: '0912889900',
      email: 'tri.pd@fpt.com',
      interestedProduct: 'HAMPER LABEL 5 GREEN',
      quantityRange: '500+ hộp',
      purpose: ['Quà tặng nhân viên xuất sắc', 'Quà tặng đối tác công nghệ'],
      notes: 'Thích thiết kế trẻ trung xanh lục bảo của dòng Citrus. Cần báo giá 800 suất.',
      status: 'MỚI',
      assignedTo: 'Chưa phân công',
      source: 'Facebook Ads',
      utmSource: 'facebook',
      utmMedium: 'feed_video',
      utmCampaign: 'label5-green-modern',
      estimatedBudget: 850000000,
      internalNotes: [],
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ];

  const initialOrders: OrderRecord[] = [
    {
      id: 'ORD-2027-001',
      leadId: 'LEAD-2701',
      companyName: 'Công ty Cổ phần Đầu tư Bất Động Sản Sunrise',
      taxCode: '0315892341',
      contactPerson: 'Vũ Quốc Cường',
      phone: '0938112233',
      email: 'cuong.vq@sunrisegroup.vn',
      shippingAddress: 'Tòa nhà Sunrise Tower, 258 Bến Vân Đồn, P.2, Q.4, TP.HCM',
      productName: 'HAMPER ORIENTAL CELEBRATION',
      quantity: 250,
      unitPrice: 1550000,
      totalValue: 387500000,
      depositAmount: 193750000,
      paymentStatus: 'ĐÃ CỌC 50%',
      deliveryStatus: 'ĐANG GIA CÔNG',
      deliveryDate: '2027-01-20',
      notes: 'Đã hoàn thiện market ép kim nhũ vàng logo Sunrise. Đang tiến hành đóng gói đợt 1.',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ];

  const initialCampaigns: CampaignRecord[] = [
    {
      id: 'camp-01',
      name: 'Google Search Tết Doanh Nghiệp 2027',
      channel: 'Google Ads',
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'tet-2027-corporate-gifts',
      budget: 35000000,
      impressions: 48500,
      clicks: 3420,
      status: 'Đang chạy',
      startDate: '2026-10-15',
      endDate: '2027-01-25',
      createdAt: new Date(Date.now() - 86400000 * 20).toISOString()
    },
    {
      id: 'camp-02',
      name: 'Facebook Video Quà Tết C-Suite VIP',
      channel: 'Facebook Ads',
      utmSource: 'facebook',
      utmMedium: 'feed_video',
      utmCampaign: 'label5-green-modern',
      budget: 25000000,
      impressions: 112000,
      clicks: 4180,
      status: 'Đang chạy',
      startDate: '2026-11-01',
      endDate: '2027-01-20',
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
    },
    {
      id: 'camp-03',
      name: 'Zalo B2B Direct Outreach cho Ngân Hàng',
      channel: 'Zalo B2B',
      utmSource: 'zalo',
      utmMedium: 'direct_msg',
      utmCampaign: 'vip-banking-q4',
      budget: 15000000,
      impressions: 12400,
      clicks: 1950,
      status: 'Đang chạy',
      startDate: '2026-11-05',
      endDate: '2027-01-22',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    }
  ];

  const initialContent: SiteContent = {
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
    updatedAt: new Date().toISOString()
  };

  const initialSettings: SystemSettings = {
    companyName: 'BINH MINH GROUP – FOODS & DRINKS (VINEYARD.VN)',
    taxCode: '0314892011',
    hotline: '091 100 22 33',
    zalo: '091 100 22 33',
    email: 'baogia@vineyard.vn',
    address: '10 Trường Đình Hợi, Phường 16, Quận 8, TP. Hồ Chí Minh, Việt Nam.',
    gtmId: 'GTM-VYND2027',
    ga4Id: 'G-VYNDTET2027',
    metaPixelId: '109283746501928',
    sessionTimeoutMinutes: 120,
    maxFailedLogins: 5,
    timezone: 'Asia/Ho_Chi_Minh',
    complianceText: 'Tuân thủ Nghị định 24/2020/NĐ-CP: Thông tin chỉ mang tính chất giới thiệu quà biếu tặng đối tác doanh nghiệp, không nhằm mục đích quảng cáo hoặc bán lẻ trực tuyến rượu cho người chưa đủ 18 tuổi.'
  };

  const initialActivityLogs: ActivityLog[] = [
    {
      id: 'log-01',
      adminEmail: 'nguyentuandat.tuandat@gmail.com',
      adminName: 'Nguyễn Tuấn Đạt',
      action: 'KHỞI TẠO HỆ THỐNG',
      module: 'SYSTEM',
      details: 'Khởi tạo cấu trúc cơ sở dữ liệu và cấu hình Super Admin.',
      ipAddress: '127.0.0.1',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: 'log-02',
      adminEmail: 'nguyentuandat.tuandat@gmail.com',
      adminName: 'Nguyễn Tuấn Đạt',
      action: 'CẬP NHẬT TRẠNG THÁI LEAD',
      module: 'CRM',
      details: 'Chuyển trạng thái Lead LEAD-2701 sang ĐÃ BÁO GIÁ.',
      ipAddress: '14.161.22.45',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ];

  const initialNotifications: SystemNotification[] = [
    {
      id: 'notif-01',
      title: 'Yêu cầu báo giá mới',
      message: 'Khách hàng Phạm Đức Trí (FPT Software) vừa gửi yêu cầu 500+ hộp Hamper Label 5 Green.',
      type: 'lead',
      read: false,
      link: '/admin/customers',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'notif-02',
      title: 'Đơn hàng mới đã xác nhận cọc',
      message: 'Đơn hàng ORD-2027-001 (BĐS Sunrise) đã thanh toán 50% tiền cọc (193.750.000 VNĐ).',
      type: 'order',
      read: true,
      link: '/admin/orders',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ];

  return {
    users: initialUsers,
    customers: initialCustomers,
    products: initialProducts,
    orders: initialOrders,
    campaigns: initialCampaigns,
    content: initialContent,
    settings: initialSettings,
    activityLogs: initialActivityLogs,
    notifications: initialNotifications,
    analyticsEvents: []
  };
}

class Database {
  private db: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.db = this.loadDatabase();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error loading DB file, reinitializing default:', err);
    }
    const initial = getInitialDatabase();
    this.saveDirect(initial);
    return initial;
  }

  private saveDirect(data: DatabaseSchema) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  public save() {
    this.saveDirect(this.db);
  }

  public get<K extends keyof DatabaseSchema>(key: K): DatabaseSchema[K] {
    return this.db[key];
  }

  public set<K extends keyof DatabaseSchema>(key: K, value: DatabaseSchema[K]) {
    this.db[key] = value;
    this.save();
  }

  public raw(): DatabaseSchema {
    return this.db;
  }

  public restore(data: DatabaseSchema) {
    this.db = data;
    this.save();
  }

  public logActivity(adminEmail: string, adminName: string, action: string, module: string, details: string, ip: string = '127.0.0.1') {
    const log: ActivityLog = {
      id: 'log-' + Date.now(),
      adminEmail,
      adminName,
      action,
      module,
      details,
      ipAddress: ip,
      createdAt: new Date().toISOString()
    };
    this.db.activityLogs.unshift(log);
    if (this.db.activityLogs.length > 500) {
      this.db.activityLogs = this.db.activityLogs.slice(0, 500);
    }
    this.save();
  }

  public addNotification(title: string, message: string, type: SystemNotification['type'], link?: string) {
    const notif: SystemNotification = {
      id: 'notif-' + Date.now(),
      title,
      message,
      type,
      read: false,
      link,
      createdAt: new Date().toISOString()
    };
    this.db.notifications.unshift(notif);
    if (this.db.notifications.length > 200) {
      this.db.notifications = this.db.notifications.slice(0, 200);
    }
    this.save();
  }
}

export const db = new Database();

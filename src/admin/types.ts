export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'SALE' | 'VIEWER';
  status: 'active' | 'suspended';
  lastLogin?: string;
  mustChangePassword?: boolean;
}

export interface InternalNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
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
  internalNotes: InternalNote[];
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
  leadsCount?: number;
  costPerLead?: number;
  ctr?: string;
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

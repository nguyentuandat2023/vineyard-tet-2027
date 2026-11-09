export interface LeadFormData {
  fullName: string;
  companyName: string;
  phone: string;
  email?: string;
  interestedProduct: string;
  quantityRange: string;
  purpose: string[];
  notes?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates a Vietnamese phone number.
 * Accepts formats: 0912345678, +84912345678, 84912345678, with optional spaces/dots/dashes.
 */
export function isValidVietnamesePhone(phone: string): boolean {
  if (!phone) return false;
  // Clean spaces, dots, dashes, parentheses
  const cleaned = phone.replace(/[\s.\-()]/g, '');
  // Regex for Vietnamese numbers:
  // (0 or +84 or 84) followed by (3|5|7|8|9) and 8 digits
  const vnPhoneRegex = /^(?:\+84|84|0)(?:3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
  return vnPhoneRegex.test(cleaned);
}

/**
 * Validates an email address.
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.trim() === '') return true; // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates the entire Lead Form according to business requirements.
 */
export function validateLeadForm(data: Partial<LeadFormData>): ValidationResult {
  const errors: Record<string, string> = {};

  // Full name check
  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Vui lòng nhập họ và tên người liên hệ (tối thiểu 2 ký tự)';
  }

  // Company name check
  if (!data.companyName || data.companyName.trim().length < 2) {
    errors.companyName = 'Vui lòng nhập tên công ty hoặc doanh nghiệp';
  }

  // Phone check
  if (!data.phone || data.phone.trim() === '') {
    errors.phone = 'Vui lòng cung cấp số điện thoại liên hệ';
  } else if (!isValidVietnamesePhone(data.phone)) {
    errors.phone = 'Số điện thoại không hợp lệ (Vui lòng nhập số điện thoại Việt Nam 10 chữ số, VD: 091 100 22 33)';
  }

  // Email check (optional, but must be valid format if provided)
  if (data.email && data.email.trim() !== '' && !isValidEmail(data.email)) {
    errors.email = 'Địa chỉ email không đúng định dạng (VD: contact@doanhnghiep.com)';
  }

  // Interested product check
  if (!data.interestedProduct || data.interestedProduct.trim() === '') {
    errors.interestedProduct = 'Vui lòng chọn bộ quà Tết quý doanh nghiệp đang quan tâm';
  }

  // Quantity check
  if (!data.quantityRange || data.quantityRange.trim() === '') {
    errors.quantityRange = 'Vui lòng chọn số lượng hộp dự kiến';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Lead Storage helper using browser localStorage
 */
export const LEADS_STORAGE_KEY = 'vineyard_leads_inquiries';

export interface SavedLead extends LeadFormData {
  id: string;
  createdAt: string;
  status: 'PENDING_CONTACT' | 'CONSULTING' | 'QUOTED';
}

export function saveLead(data: LeadFormData): SavedLead {
  const newLead: SavedLead = {
    ...data,
    id: `LEAD-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
    status: 'PENDING_CONTACT'
  };

  try {
    const existing = getStoredLeads();
    const updated = [newLead, ...existing];
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Local storage unavailable or full
  }

  return newLead;
}

/**
 * Gửi thông tin khách hàng về Google Sheet qua Google Apps Script Web App.
 * Dùng text/plain + no-cors để trình duyệt không chặn (Apps Script không hỗ trợ CORS preflight).
 */
export async function sendLeadToSheet(url: string, lead: SavedLead): Promise<void> {
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        id: lead.id,
        createdAt: new Date(lead.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
        fullName: lead.fullName,
        companyName: lead.companyName,
        phone: lead.phone,
        email: lead.email || '',
        interestedProduct: lead.interestedProduct,
        quantityRange: lead.quantityRange,
        purpose: (lead.purpose || []).join(', '),
        notes: lead.notes || '',
        page: typeof window !== 'undefined' ? window.location.href : ''
      })
    });
  } catch (err) {
    console.warn('sendLeadToSheet error:', err);
  }
}

export function getStoredLeads(): SavedLead[] {
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

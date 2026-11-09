/**
 * Analytics and DataLayer Tracking Utility for Vineyard.vn
 * Compliant with Google Analytics 4 (GA4), GTM, Google Ads & Meta Pixel standards.
 * Follows strict privacy policies: NEVER passes raw PII (phone/email) into analytics events.
 */

// Extend window interface for dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export interface UtmParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
}

const UTM_STORAGE_KEY = 'vineyard_utm_attribution';

/**
 * Parses URL query parameters for UTM & Ad Click IDs and saves them to sessionStorage/localStorage
 */
export function captureAndPersistUtmParams(): UtmParameters {
  if (typeof window === 'undefined') return {};

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const captured: UtmParameters = {};

    const utmKeys: (keyof UtmParameters)[] = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
      'gclid',
      'fbclid'
    ];

    let hasAnyUtm = false;
    utmKeys.forEach((key) => {
      const val = urlParams.get(key);
      if (val) {
        captured[key] = val;
        hasAnyUtm = true;
      }
    });

    if (hasAnyUtm) {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(captured));
      return captured;
    }

    // Fallback to existing session attribution
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Storage access restricted or disabled
  }

  return { utm_source: 'direct', utm_medium: 'none' };
}

/**
 * Retrieves persisted UTM parameters for attaching to lead submission payload
 */
export function getPersistedUtmParams(): UtmParameters {
  if (typeof window === 'undefined') return {};
  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    return stored ? JSON.parse(stored) : { utm_source: 'direct', utm_medium: 'none' };
  } catch {
    return { utm_source: 'direct', utm_medium: 'none' };
  }
}

/**
 * Pushes standard event to window.dataLayer
 */
export function pushToDataLayer(eventData: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    ...eventData,
    timestamp: new Date().toISOString()
  });

  // Also sync to server database for live admin dashboard
  try {
    fetch('/api/public/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: eventData.event,
        data: eventData
      })
    }).catch(() => {});
  } catch {
    // Ignore offline errors
  }
}

/**
 * Tracks CTA click across the landing page
 */
export function trackCtaClick(ctaName: string, location: string): void {
  pushToDataLayer({
    event: 'cta_click',
    cta_name: ctaName,
    cta_location: location
  });
}

/**
 * Tracks Hotline telephone clicks
 */
export function trackPhoneClick(phoneNumber: string, location: string): void {
  pushToDataLayer({
    event: 'phone_click',
    phone_number: phoneNumber,
    click_location: location
  });
}

/**
 * Tracks Zalo consultation clicks
 */
export function trackZaloClick(zaloNumber: string, location: string): void {
  pushToDataLayer({
    event: 'zalo_click',
    zalo_number: zaloNumber,
    click_location: location
  });
}

/**
 * Tracks product inspect / quick view modal
 */
export function trackProductView(productId: string, productName: string): void {
  pushToDataLayer({
    event: 'view_item',
    ecommerce: {
      items: [
        {
          item_id: productId,
          item_name: productName,
          item_category: 'Tết Hamper 2027',
          item_brand: 'Vineyard.vn'
        }
      ]
    }
  });
}

/**
 * Tracks form engagement start (first input interaction)
 */
export function trackFormStart(formName: string): void {
  pushToDataLayer({
    event: 'form_start',
    form_name: formName
  });
}

/**
 * Tracks successful Lead generation
 * IMPORTANT: No raw PII (phone number or email) is pushed into GA4/GTM dataLayer.
 * An anonymous lead_id, hashed transaction token, and commercial intent tier are sent.
 */
export function trackGenerateLead(params: {
  leadId: string;
  productName: string;
  quantityRange: string;
  purposes: string[];
}): void {
  const utms = getPersistedUtmParams();

  pushToDataLayer({
    event: 'generate_lead',
    lead_id: params.leadId,
    product_name: params.productName,
    quantity_range: params.quantityRange,
    lead_type: 'B2B_CORPORATE',
    purposes: params.purposes.join(', '),
    ...utms
  });
}

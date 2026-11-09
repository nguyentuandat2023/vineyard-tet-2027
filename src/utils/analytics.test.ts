import test from 'node:test';
import assert from 'node:assert/strict';
import {
  pushToDataLayer,
  trackCtaClick,
  trackPhoneClick,
  trackZaloClick,
  trackGenerateLead
} from './analytics.ts';

// Setup mock window for Node test environment
(global as unknown as { window: { dataLayer: Record<string, unknown>[] } }).window = {
  dataLayer: []
};

test('pushToDataLayer attaches timestamp and pushes to window.dataLayer', () => {
  window.dataLayer = [];
  pushToDataLayer({ event: 'test_event', test_prop: 'value_123' });

  assert.equal(window.dataLayer.length, 1);
  assert.equal(window.dataLayer[0].event, 'test_event');
  assert.equal(window.dataLayer[0].test_prop, 'value_123');
  assert.ok(window.dataLayer[0].timestamp);
});

test('trackCtaClick pushes cta_click with location', () => {
  window.dataLayer = [];
  trackCtaClick('Nhận Báo Giá', 'Hero Banner');

  assert.equal(window.dataLayer.length, 1);
  assert.equal(window.dataLayer[0].event, 'cta_click');
  assert.equal(window.dataLayer[0].cta_name, 'Nhận Báo Giá');
  assert.equal(window.dataLayer[0].cta_location, 'Hero Banner');
});

test('trackPhoneClick pushes phone_click event', () => {
  window.dataLayer = [];
  trackPhoneClick('0911002233', 'Header Desktop');

  assert.equal(window.dataLayer.length, 1);
  assert.equal(window.dataLayer[0].event, 'phone_click');
  assert.equal(window.dataLayer[0].phone_number, '0911002233');
});

test('trackZaloClick pushes zalo_click event', () => {
  window.dataLayer = [];
  trackZaloClick('0911002233', 'Floating Button');

  assert.equal(window.dataLayer.length, 1);
  assert.equal(window.dataLayer[0].event, 'zalo_click');
  assert.equal(window.dataLayer[0].zalo_number, '0911002233');
});

test('trackGenerateLead records lead without exposing raw PII phone or email', () => {
  window.dataLayer = [];
  trackGenerateLead({
    leadId: 'LEAD-998877',
    productName: 'HAMPER GOLDEN PROSPERITY',
    quantityRange: '100–499 hộp',
    purposes: ['Quà tặng đối tác', 'Quà tặng khách hàng']
  });

  assert.equal(window.dataLayer.length, 1);
  const event = window.dataLayer[0];
  assert.equal(event.event, 'generate_lead');
  assert.equal(event.lead_id, 'LEAD-998877');
  assert.equal(event.product_name, 'HAMPER GOLDEN PROSPERITY');
  assert.equal(event.quantity_range, '100–499 hộp');
  // Ensure no raw phone or email properties are pushed
  assert.equal((event as Record<string, unknown>).phone, undefined);
  assert.equal((event as Record<string, unknown>).email, undefined);
});

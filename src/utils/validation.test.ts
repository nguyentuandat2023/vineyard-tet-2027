import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidVietnamesePhone, isValidEmail, validateLeadForm } from './validation.ts';

test('isValidVietnamesePhone correctly identifies valid VN phone numbers', () => {
  assert.equal(isValidVietnamesePhone('0911002233'), true);
  assert.equal(isValidVietnamesePhone('091 100 22 33'), true);
  assert.equal(isValidVietnamesePhone('+84911002233'), true);
  assert.equal(isValidVietnamesePhone('84911002233'), true);
  assert.equal(isValidVietnamesePhone('0388123456'), true);
  assert.equal(isValidVietnamesePhone('0777123456'), true);
  assert.equal(isValidVietnamesePhone('0866123456'), true);
});

test('isValidVietnamesePhone rejects invalid numbers', () => {
  assert.equal(isValidVietnamesePhone(''), false);
  assert.equal(isValidVietnamesePhone('12345'), false);
  assert.equal(isValidVietnamesePhone('0123456789'), false); // Old 11-digit or invalid prefix
  assert.equal(isValidVietnamesePhone('abcdefghij'), false);
  assert.equal(isValidVietnamesePhone('0911002233999'), false); // Too long
});

test('isValidEmail handles empty (optional) and valid/invalid addresses', () => {
  assert.equal(isValidEmail(''), true);
  assert.equal(isValidEmail('baogia@vineyard.vn'), true);
  assert.equal(isValidEmail('contact.b2b@company.com.vn'), true);
  assert.equal(isValidEmail('invalid-email'), false);
  assert.equal(isValidEmail('@missinguser.com'), false);
});

test('validateLeadForm returns errors on empty required fields', () => {
  const result = validateLeadForm({});
  assert.equal(result.isValid, false);
  assert.ok(result.errors.fullName);
  assert.ok(result.errors.companyName);
  assert.ok(result.errors.phone);
  assert.ok(result.errors.interestedProduct);
  assert.ok(result.errors.quantityRange);
});

test('validateLeadForm succeeds with proper business lead payload', () => {
  const result = validateLeadForm({
    fullName: 'Nguyễn Văn Minh',
    companyName: 'Tập đoàn Công nghệ Á Châu',
    phone: '091 100 22 33',
    email: 'minh.nguyen@achau.vn',
    interestedProduct: 'HAMPER GOLDEN PROSPERITY',
    quantityRange: '100–499 hộp',
    purpose: ['Quà tặng đối tác']
  });

  assert.equal(result.isValid, true);
  assert.equal(Object.keys(result.errors).length, 0);
});

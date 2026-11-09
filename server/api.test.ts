import test from 'node:test';
import assert from 'node:assert/strict';
import { db, verifyPassword, generateSalt } from './db';
import {
  generateAuthToken,
  verifyAuthToken,
  checkBruteForce,
  recordFailedAttempt,
  clearFailedAttempts
} from './auth';

test('Database initializes Super Admin nguyentuandat.tuandat@gmail.com with SUPER_ADMIN role', () => {
  const users = db.get('users');
  const superAdmin = users.find((u) => u.email === 'nguyentuandat.tuandat@gmail.com');
  assert.ok(superAdmin, 'Super Admin user must exist in database');
  assert.equal(superAdmin?.role, 'SUPER_ADMIN', 'Role must be SUPER_ADMIN');
  assert.equal(superAdmin?.status, 'active', 'Super admin must be active');
  assert.ok(superAdmin?.passwordHash, 'Password hash must be present');
  assert.ok(superAdmin?.salt, 'Salt must be present');

  // Verify password matches default
  const valid = verifyPassword('VineyardAdmin@2027!', superAdmin!.salt, superAdmin!.passwordHash);
  assert.equal(valid, true, 'Default password must authenticate correctly');
});

test('Token generation and verification works with HMAC SHA256', () => {
  const users = db.get('users');
  const superAdmin = users[0];
  const token = generateAuthToken(superAdmin);
  assert.ok(token, 'Token string must be generated');

  const payload = verifyAuthToken(token);
  assert.ok(payload, 'Payload must be decoded');
  assert.equal(payload.email, superAdmin.email);
  assert.equal(payload.role, superAdmin.role);

  // Tampered token test
  const tampered = token.slice(0, -3) + 'xyz';
  assert.equal(verifyAuthToken(tampered), null, 'Tampered token must fail validation');
});

test('Brute force lockout locks account after 5 failed attempts', () => {
  const testEmail = 'attacker_test@domain.com';
  clearFailedAttempts(testEmail);

  for (let i = 0; i < 4; i++) {
    recordFailedAttempt(testEmail);
    const status = checkBruteForce(testEmail);
    assert.equal(status.locked, false, `Should not lock on attempt ${i + 1}`);
  }

  // 5th failed attempt triggers lock
  recordFailedAttempt(testEmail);
  const status5 = checkBruteForce(testEmail);
  assert.equal(status5.locked, true, 'Account must lock after 5 failed attempts');
  assert.ok(status5.waitMinutes > 0, 'Must have positive wait minutes');

  clearFailedAttempts(testEmail);
  assert.equal(checkBruteForce(testEmail).locked, false, 'Cleared attempt should unlock');
});

test('Database contains 5 authentic hampers with transparent cutouts', () => {
  const products = db.get('products');
  assert.equal(products.length >= 5, true, 'Must have at least 5 hampers');
  const ids = products.map((p) => p.id);
  assert.ok(ids.includes('hamper-golden-prosperity'));
  assert.ok(ids.includes('hamper-oriental-celebration'));
  assert.ok(ids.includes('hamper-marquis-xo'));
  assert.ok(ids.includes('hamper-label-5-red'));
  assert.ok(ids.includes('hamper-label-5-green'));
});

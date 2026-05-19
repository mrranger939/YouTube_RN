import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { tokenRequired, optionalToken } from '../middleware/auth.js';
import { config } from '../config/index.js';

function makeRes() {
  let statusCode = null;
  let body = null;
  return {
    status(code) { statusCode = code; return this; },
    json(obj) { body = obj; return { statusCode, body }; },
    _get() { return { statusCode, body }; },
  };
}

test.skip('tokenRequired denies when missing Authorization header', async () => {
  const req = { headers: {} };
  const res = makeRes();
  let nextCalled = false;
  await tokenRequired(req, res, () => { nextCalled = true; });
  const result = res._get();
  assert.equal(nextCalled, false);
  assert.equal(result.statusCode, 401);
  assert.deepEqual(result.body, { error: 'Token is missing' });
});

test('tokenRequired denies when token invalid', async () => {
  const req = { headers: { authorization: 'Bearer bad.token.here' } };
  const res = makeRes();
  let nextCalled = false;
  await tokenRequired(req, res, () => { nextCalled = true; });
  const result = res._get();
  assert.equal(nextCalled, false);
  assert.equal(result.statusCode, 401);
  assert.deepEqual(result.body, { error: 'Invalid or expired token' });
});

test('tokenRequired allows valid token and sets req.user', async () => {
  const payload = { user_id: 'u1', username: 'bob', vid: 'v' };
  const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1h' });
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = makeRes();
  let nextCalled = false;
  await tokenRequired(req, res, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
  assert.equal(req.user.user_id, payload.user_id);
  assert.equal(req.user.username, payload.username);
});

test('optionalToken sets Guest when no header', async () => {
  const req = { headers: {} };
  const res = makeRes();
  let nextCalled = false;
  await optionalToken(req, res, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
  assert.equal(req.user.user_id, null);
  assert.equal(req.user.username, 'Guest');
});

test('optionalToken handles invalid token and provides guest vid', async () => {
  const req = { headers: { authorization: 'not.a.valid.token' } };
  const res = makeRes();
  let nextCalled = false;
  await optionalToken(req, res, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
  assert.equal(req.user.user_id, null);
  assert.equal(req.user.username, 'Guest');
  assert.ok(req.user.vid && req.user.vid.startsWith('https://'));
});

test('optionalToken decodes valid token', async () => {
  const payload = { user_id: 'u2', username: 'alice', vid: 'pix' };
  const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1h' });
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = makeRes();
  let nextCalled = false;
  await optionalToken(req, res, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
  assert.equal(req.user.user_id, payload.user_id);
  assert.equal(req.user.username, payload.username);
});

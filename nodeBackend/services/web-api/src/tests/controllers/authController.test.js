import test from 'node:test';
import assert from 'node:assert/strict';
import * as authCtrl from '../../controllers/authController.js';
import * as db from '../../services/db.js';
import * as s3 from '../../services/s3.js';
import bcrypt from 'bcryptjs';

function makeRes() {
  let statusCode = null;
  let body = null;
  return {
    status(code) { statusCode = code; return this; },
    json(obj) { body = obj; return { statusCode, body }; },
    _get() { return { statusCode, body }; },
  };
}

test('signup returns 400 when missing file', async () => {
  const req = { body: { username: 'u', email: 'e', password: 'p' } };
  const res = makeRes();
  await authCtrl.signup(req, res);
  const r = res._get();
  assert.equal(r.statusCode, 400);
  assert.deepEqual(r.body, 'failed');
});

test('signup returns 400 when username exists', async () => {
  const req = { body: { username: 'u', email: 'e', password: 'p' }, file: { originalname: 'a.png', buffer: Buffer.from('x') } };
  const res = makeRes();
  const origFindOne = db.User.findOne;
  db.User.findOne = async () => ({ username: 'u' });
  await authCtrl.signup(req, res);
  const r = res._get();
  assert.equal(r.statusCode, 400);
  assert.deepEqual(r.body, { error: 'Username already exists' });
  db.User.findOne = origFindOne;
});

test('signup returns 500 when upload fails', async () => {
  const req = { body: { username: 'u2', email: 'e', password: 'p' }, file: { originalname: 'a.png', buffer: Buffer.from('x') } };
  const res = makeRes();
  const origFindOne = db.User.findOne;
  const origSend = s3.s3Client.send;
  db.User.findOne = async () => null;
  // simulate S3 failure by making the underlying client throw
  s3.s3Client.send = async () => { throw new Error('s3 fail'); };
  await authCtrl.signup(req, res);
  const r = res._get();
  assert.equal(r.statusCode, 500);
  assert.deepEqual(r.body, 'failed');
  db.User.findOne = origFindOne;
  s3.s3Client.send = origSend;
});

test('signup returns 201 on success', async () => {
  const req = { body: { username: 'u3', email: 'e', password: 'p' }, file: { originalname: 'a.png', buffer: Buffer.from('x') } };
  const res = makeRes();
  const origFindOne = db.User.findOne;
  const origSend = s3.s3Client.send;
  const origCreate = db.User.create;
  db.User.findOne = async () => null;
  // simulate S3 success by making underlying client return
  s3.s3Client.send = async () => ({});
  db.User.create = async () => ({});
  await authCtrl.signup(req, res);
  const r = res._get();
  assert.equal(r.statusCode, 201);
  assert.deepEqual(r.body, { message: 'success' });
  db.User.findOne = origFindOne;
  s3.s3Client.send = origSend;
  db.User.create = origCreate;
});

// LOGIN

test('login returns 400 when missing fields', async () => {
  const req = { body: { email: '', password: '' } };
  const res = makeRes();
  await authCtrl.login(req, res);
  const r = res._get();
  assert.equal(r.statusCode, 400);
  assert.deepEqual(r.body, { error: 'Username and password are required' });
});

test('login returns 401 when user not found', async () => {
  const req = { body: { email: 'x', password: 'p' } };
  const res = makeRes();
  const origFindOne = db.User.findOne;
  db.User.findOne = async () => null;
  await authCtrl.login(req, res);
  const r = res._get();
  assert.equal(r.statusCode, 401);
  assert.deepEqual(r.body, { error: 'Invalid username or password' });
  db.User.findOne = origFindOne;
});

test('login returns 401 when password invalid', async () => {
  const req = { body: { email: 'x', password: 'p' } };
  const res = makeRes();
  const origFindOne = db.User.findOne;
  const origCompare = bcrypt.compare;
  db.User.findOne = async () => ({ password: 'hashed' });
  bcrypt.compare = async () => false;
  await authCtrl.login(req, res);
  const r = res._get();
  assert.equal(r.statusCode, 401);
  assert.deepEqual(r.body, { error: 'Invalid username or password' });
  db.User.findOne = origFindOne;
  bcrypt.compare = origCompare;
});

test('login returns token on success', async () => {
  const req = { body: { email: 'x', password: 'p' } };
  const res = makeRes();
  const origFindOne = db.User.findOne;
  const origCompare = bcrypt.compare;
  db.User.findOne = async () => ({ _id: 'id1', username: 'u', profilePic: 'pic', password: 'h' });
  bcrypt.compare = async () => true;
  await authCtrl.login(req, res);
  const r = res._get();
  assert.equal(r.statusCode, null);
  assert.equal(r.body.message, 'success');
  assert.ok(typeof r.body.token === 'string');
  db.User.findOne = origFindOne;
  bcrypt.compare = origCompare;
});

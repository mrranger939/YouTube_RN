import test from 'node:test';
import assert from 'node:assert/strict';
import * as chCtrl from '../../controllers/channelController.js';
import * as db from '../../services/db.js';

function makeRes() {
  let statusCode = null;
  let body = null;
  return {
    status(code) { statusCode = code; return this; },
    json(obj) { body = obj; return { statusCode, body }; },
    _get() { return { statusCode, body }; },
  };
}

test('checkIfChannel returns fail when none', async () => {
  const req = { params: { channelId: 'no' } };
  const res = makeRes();
  const origFindOne = db.Channel.findOne;
  db.Channel.findOne = async () => null;
  await chCtrl.checkIfChannel(req, res);
  const r = res._get();
  assert.equal(r.statusCode, null);
  assert.deepEqual(r.body, 'fail');
  db.Channel.findOne = origFindOne;
});

test('checkIfChannel returns success when exists', async () => {
  const req = { params: { channelId: 'yes' } };
  const res = makeRes();
  const origFindOne = db.Channel.findOne;
  db.Channel.findOne = async () => ({});
  await chCtrl.checkIfChannel(req, res);
  const r = res._get();
  assert.equal(r.statusCode, null);
  assert.deepEqual(r.body, 'success');
  db.Channel.findOne = origFindOne;
});

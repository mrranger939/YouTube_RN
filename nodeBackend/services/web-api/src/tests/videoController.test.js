import test from 'node:test';
import assert from 'node:assert/strict';
import * as videoCtrl from '../controllers/videoController.js';
import * as db from '../services/db.js';

function makeRes() {
  let statusCode = null;
  let body = null;
  return {
    status(code) { statusCode = code; return this; },
    json(obj) { body = obj; return { statusCode, body }; },
    _get() { return { statusCode, body }; },
  };
}

test.skip('getVideoData returns 404 when document not found', async () => {
  const req = { body: { data_id: 'nope' } };
  const res = makeRes();
  const origFindOne = db.Video.findOne;
  db.Video.findOne = async () => null;
  await videoCtrl.getVideoData(req, res);
  const r = res._get();
  assert.equal(r.statusCode, 404);
  assert.deepEqual(r.body, { error: 'Document not found' });
  db.Video.findOne = origFindOne;
});

test('getVideoData returns videoSrc when found', async () => {
  const req = { body: { data_id: 'vid1' } };
  const res = makeRes();
  const origFindOne = db.Video.findOne;
  db.Video.findOne = async () => ({ video_id: 'vid1' });
  await videoCtrl.getVideoData(req, res);
  const r = res._get();
  assert.equal(r.statusCode, null);
  assert.deepEqual(r.body, { videoSrc: 'vid1', posterSrc: 'vid1' });
  db.Video.findOne = origFindOne;
});

test('streamVideo returns 404 when video not found', async () => {
  const req = { params: { video_id: 'x' } };
  const res = makeRes();
  const origFindOne = db.Video.findOne;
  db.Video.findOne = async () => null;
  await videoCtrl.streamVideo(req, res);
  const r = res._get();
  assert.equal(r.statusCode, 404);
  assert.deepEqual(r.body, { error: 'Video not found' });
  db.Video.findOne = origFindOne;
});

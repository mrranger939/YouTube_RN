import test from 'node:test';
import assert from 'node:assert/strict';
import * as uploadCtrl from '../../controllers/uploadController.js';
import * as db from '../../services/db.js';
import * as s3 from '../../services/s3.js';
import * as kafka from '../../services/kafka.js';

function makeRes() {
  let statusCode = null;
  let body = null;
  return {
    status(code) { statusCode = code; return this; },
    json(obj) { body = obj; return { statusCode, body }; },
    _get() { return { statusCode, body }; },
  };
}

test('uploadVideo returns 400 when files missing', async () => {
  const req = { files: {}, user: {} };
  const res = makeRes();
  await uploadCtrl.uploadVideo(req, res);
  const r = res._get();
  assert.equal(r.statusCode, 400);
  assert.deepEqual(r.body, 'Image or Video file missing');
});

test('uploadVideo returns 400 when channel not found', async () => {
  const req = { files: { resizedImage: [{}], video: [{}] }, body: {}, user: { user_id: 'u1', username: 'a', vid: 'v' } };
  const res = makeRes();
  const origFindOne = db.Channel.findOne;
  db.Channel.findOne = async () => null;
  await uploadCtrl.uploadVideo(req, res);
  const r = res._get();
  assert.equal(r.statusCode, 400);
  assert.deepEqual(r.body, 'Channel not found');
  db.Channel.findOne = origFindOne;
});

test('uploadVideo returns 500 when upload fails', async () => {
  const req = { files: { resizedImage: [{ originalname: 'a.jpg', buffer: Buffer.from('i') }], video: [{ originalname: 'v.mp4', buffer: Buffer.from('v') }] }, body: { description: 'd', genre: 'g', videoTitle: 't' }, user: { user_id: 'u2', username: 'b', vid: 'v' } };
  const res = makeRes();
  const origFindOne = db.Channel.findOne;
  const origSend = s3.s3Client.send;
  db.Channel.findOne = async () => ({});
  // make s3 client throw to simulate upload failure
  s3.s3Client.send = async () => { throw new Error('s3 fail'); };
  await uploadCtrl.uploadVideo(req, res);
  const r = res._get();
  assert.equal(r.statusCode, 500);
  assert.deepEqual(r.body, 'failed');
  db.Channel.findOne = origFindOne;
  s3.s3Client.send = origSend;
});

test('uploadVideo returns success on happy path', async () => {
  const req = { files: { resizedImage: [{ originalname: 'a.jpg', buffer: Buffer.from('i') }], video: [{ originalname: 'v.mp4', buffer: Buffer.from('v') }] }, body: { description: 'd', genre: 'g', videoTitle: 't' }, user: { user_id: 'u3', username: 'b', vid: 'v' } };
  const res = makeRes();
  const origFindOne = db.Channel.findOne;
  const origUpload = s3.uploadToS3;
  const origUpdate = db.Channel.updateOne;
  const origCreate = db.Video.create;
  const origKafkaSend = kafka.sendVideoMessage;

  db.Channel.findOne = async () => ({});
  const origS3Send = s3.s3Client.send;
  s3.s3Client.send = async () => ({});
  db.Channel.updateOne = async () => ({});
  db.Video.create = async () => ({});
  const origKafkaProducerSend = kafka.producer.send;
  kafka.producer.send = async () => ({});

  await uploadCtrl.uploadVideo(req, res);
  const r = res._get();
  assert.equal(r.body, 'success');

  db.Channel.findOne = origFindOne;
  s3.s3Client.send = origS3Send;
  db.Channel.updateOne = origUpdate;
  db.Video.create = origCreate;
  kafka.producer.send = origKafkaProducerSend;
});

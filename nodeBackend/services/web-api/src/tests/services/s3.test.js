import test from 'node:test';
import assert from 'node:assert/strict';
import * as s3svc from '../../services/s3.js';

test('uploadToS3 returns true when s3Client.send succeeds', async () => {
  const origSend = s3svc.s3Client.send;
  let calls = [];
  s3svc.s3Client.send = async (cmd) => { calls.push(cmd.constructor.name); return {}; };
  const ok = await s3svc.uploadToS3(Buffer.from('x'), 'buck', 'file.txt');
  assert.equal(ok, true);
  assert.ok(calls.length >= 1);
  s3svc.s3Client.send = origSend;
});

test('uploadToS3 returns false when s3Client.send throws', async () => {
  const origSend = s3svc.s3Client.send;
  s3svc.s3Client.send = async () => { throw new Error('s3 fail'); };
  const ok = await s3svc.uploadToS3(Buffer.from('x'), 'buck', 'file.txt');
  assert.equal(ok, false);
  s3svc.s3Client.send = origSend;
});

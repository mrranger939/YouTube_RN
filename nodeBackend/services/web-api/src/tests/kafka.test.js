import test from 'node:test';
import assert from 'node:assert/strict';
import * as kafkaSvc from '../services/kafka.js';

test.skip('sendVideoMessage returns true when producer.send succeeds', async () => {
  // backup
  const origSend = kafkaSvc.producer.send;
  kafkaSvc.producer.send = async () => ({ topicName: 'ok' });
  const ok = await kafkaSvc.sendVideoMessage('file.mp4');
  assert.equal(ok, true);
  // restore
  kafkaSvc.producer.send = origSend;
});

test('sendVideoMessage returns false when producer.send throws', async () => {
  const origSend = kafkaSvc.producer.send;
  kafkaSvc.producer.send = async () => { throw new Error('kafka fail'); };
  const ok = await kafkaSvc.sendVideoMessage('file.mp4');
  assert.equal(ok, false);
  kafkaSvc.producer.send = origSend;
});

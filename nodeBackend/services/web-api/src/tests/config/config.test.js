import test from 'node:test';
import assert from 'node:assert/strict';
import { config } from '../../config/index.js';

test('config has expected keys with defaults', () => {
  assert.ok(typeof config.PORT !== 'undefined');
  assert.ok(typeof config.JWT_SECRET === 'string');
  assert.ok(typeof config.MONGO_URL === 'string');
  assert.ok(typeof config.LOCALSTACK_URL === 'string');
  assert.ok(typeof config.S3_U_BUCKET === 'string');
});

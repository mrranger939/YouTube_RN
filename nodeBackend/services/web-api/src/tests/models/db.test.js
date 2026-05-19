import test from 'node:test';
import assert from 'node:assert/strict';
import * as db from '../../services/db.js';

test('db exports models', () => {
  assert.equal(typeof db.User, 'function');
  assert.equal(typeof db.Channel, 'function');
  assert.equal(typeof db.Video, 'function');
});

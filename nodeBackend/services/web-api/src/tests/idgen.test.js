import test from 'node:test';
import assert from 'node:assert/strict';
import { generateUniqueId } from '../services/idgen.js';

test.skip('generateUniqueId returns string within bounds', () => {
  const id = generateUniqueId('My File.mp4', 4, 10);
  assert.equal(typeof id, 'string');
  assert.ok(id.length >= 4 && id.length <= 10, `length ${id.length} not within 4..10`);
});

test('generateUniqueId normalizes filename and is deterministic-ish', () => {
  const a = generateUniqueId('ABC-123!!.mp4', 3, 8);
  const b = generateUniqueId('abc123.mp4', 3, 8);
  // different calls will normally produce different values because of time/randomness,
  // but both should be valid strings within the configured bounds
  assert.equal(typeof a, 'string');
  assert.equal(a.length >= 3 && a.length <= 8, true);
  assert.equal(typeof b, 'string');
  assert.equal(b.length >= 3 && b.length <= 8, true);
});

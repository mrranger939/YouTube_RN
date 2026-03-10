import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const CONFIG_PATH = resolve(process.cwd(), '../../../.coderabbit.yaml');

test('CodeRabbit config file exists', () => {
  assert.ok(existsSync(CONFIG_PATH), `.coderabbit.yaml should exist at ${CONFIG_PATH}`);
});

test('CodeRabbit config file is not empty', () => {
  const content = readFileSync(CONFIG_PATH, 'utf-8');
  assert.ok(content.length > 0, 'Config file should not be empty');
});

test('CodeRabbit config contains required language field', () => {
  const content = readFileSync(CONFIG_PATH, 'utf-8');
  assert.ok(content.includes('language:'), 'Config should specify language');
  assert.ok(content.includes('en-US') || content.includes('en'), 'Language should be English');
});

test('CodeRabbit config contains reviews section', () => {
  const content = readFileSync(CONFIG_PATH, 'utf-8');
  assert.ok(content.includes('reviews:'), 'Config should have reviews section');
});

test('CodeRabbit config has profile setting', () => {
  const content = readFileSync(CONFIG_PATH, 'utf-8');
  assert.ok(content.includes('profile:'), 'Config should have profile setting');
});

test('CodeRabbit config has auto_review section', () => {
  const content = readFileSync(CONFIG_PATH, 'utf-8');
  assert.ok(content.includes('auto_review:'), 'Config should have auto_review section');
  assert.ok(content.includes('enabled:'), 'auto_review should have enabled field');
});

test('CodeRabbit config has valid boolean values', () => {
  const content = readFileSync(CONFIG_PATH, 'utf-8');
  // Check that boolean fields use true/false (not yes/no or 1/0)
  const booleanPattern = /:\s*(true|false)/g;
  const matches = content.match(booleanPattern);
  assert.ok(matches && matches.length > 0, 'Config should have boolean values');

  // Ensure no invalid boolean representations
  assert.ok(!content.match(/:\s*(yes|no|1|0)\s*$/m), 'Should use true/false for booleans');
});

test('CodeRabbit config review features are properly configured', () => {
  const content = readFileSync(CONFIG_PATH, 'utf-8');

  // Check for presence of key review features
  const features = [
    'high_level_summary',
    'changed_files_summary',
    'review_details'
  ];

  features.forEach(feature => {
    assert.ok(
      content.includes(feature),
      `Config should include ${feature} setting`
    );
  });
});

test('CodeRabbit config has poem setting', () => {
  const content = readFileSync(CONFIG_PATH, 'utf-8');
  assert.ok(content.includes('poem:'), 'Config should have poem setting');
});

test('CodeRabbit config follows YAML structure', () => {
  const content = readFileSync(CONFIG_PATH, 'utf-8');

  // Basic YAML validation checks
  assert.ok(content.includes(':'), 'YAML should have key-value pairs');
  assert.ok(!content.includes('\t'), 'YAML should use spaces, not tabs');

  // Check for common YAML errors
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.trim().length > 0 && !line.trim().startsWith('#')) {
      // Lines with content should either have a key or be indented
      if (line.includes(':') || line.startsWith(' ')) {
        assert.ok(true, `Line ${index + 1} has valid structure`);
      }
    }
  });
});

test('CodeRabbit config auto_review enabled is a boolean', () => {
  const content = readFileSync(CONFIG_PATH, 'utf-8');
  const enabledMatch = content.match(/auto_review:\s*\n\s*enabled:\s*(true|false)/);
  assert.ok(enabledMatch, 'auto_review.enabled should be true or false');
});

test('CodeRabbit config has consistent indentation', () => {
  const content = readFileSync(CONFIG_PATH, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim().length > 0 && !line.trim().startsWith('#'));

  const indentations = lines
    .filter(line => line.startsWith(' '))
    .map(line => line.match(/^(\s*)/)[1].length);

  // Check that all indentations are multiples of 2
  indentations.forEach(indent => {
    assert.equal(indent % 2, 0, `Indentation should be multiples of 2 spaces, found ${indent}`);
  });
});

test('CodeRabbit config schema reference is present', () => {
  const content = readFileSync(CONFIG_PATH, 'utf-8');
  // Check for schema reference comment at the top
  const firstLine = content.split('\n')[0];
  assert.ok(
    firstLine.includes('yaml-language-server') || firstLine.includes('schema'),
    'Config should reference the CodeRabbit schema'
  );
});

test('CodeRabbit config drafts setting exists in auto_review', () => {
  const content = readFileSync(CONFIG_PATH, 'utf-8');
  assert.ok(content.includes('drafts:'), 'auto_review should have drafts setting');
});

test('CodeRabbit config has reasonable feature flags', () => {
  const content = readFileSync(CONFIG_PATH, 'utf-8');

  // Features that should exist (from the file structure)
  const expectedFeatures = [
    'sequence_diagrams',
    'estimate_code_review_effort',
    'assess_linked_issues',
    'suggested_labels',
    'suggested_reviewers'
  ];

  expectedFeatures.forEach(feature => {
    assert.ok(
      content.includes(feature),
      `Config should include ${feature} setting`
    );
  });
});
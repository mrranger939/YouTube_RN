import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const README_PATH = resolve(process.cwd(), '../../../nodeBackend/README.md');

test('Backend README file exists', () => {
  assert.ok(existsSync(README_PATH), `README.md should exist at ${README_PATH}`);
});

test('Backend README is not empty', () => {
  const content = readFileSync(README_PATH, 'utf-8');
  assert.ok(content.length > 0, 'README should not be empty');
});

test('Backend README has markdown heading', () => {
  const content = readFileSync(README_PATH, 'utf-8');
  assert.ok(content.includes('#'), 'README should have markdown headings');
});

test('Backend README specifies Node.js version', () => {
  const content = readFileSync(README_PATH, 'utf-8');
  assert.ok(content.includes('node version'), 'README should specify Node.js version');
  assert.ok(content.match(/\d+\.\d+\.\d+/), 'README should include a version number');
});

test('Backend README contains architecture structure', () => {
  const content = readFileSync(README_PATH, 'utf-8');
  assert.ok(content.includes('backend/') || content.includes('services/'), 'README should describe backend structure');
});

test('Backend README has code block with structure', () => {
  const content = readFileSync(README_PATH, 'utf-8');
  assert.ok(content.includes('```'), 'README should have code blocks');
  assert.ok(content.match(/```[\s\S]*```/), 'README should have complete code blocks');
});

test('Backend README describes web-api service', () => {
  const content = readFileSync(README_PATH, 'utf-8');
  assert.ok(content.includes('web-api'), 'README should describe web-api service');
  assert.ok(content.includes('Express') || content.includes('REST API'), 'README should mention Express or REST API');
});

test('Backend README describes video-worker service', () => {
  const content = readFileSync(README_PATH, 'utf-8');
  assert.ok(content.includes('video-worker'), 'README should describe video-worker service');
});

test('Backend README mentions key technologies', () => {
  const content = readFileSync(README_PATH, 'utf-8');

  const technologies = [
    'Express',
    'Kafka',
    'ffmpeg'
  ];

  technologies.forEach(tech => {
    assert.ok(
      content.toLowerCase().includes(tech.toLowerCase()),
      `README should mention ${tech}`
    );
  });
});

test('Backend README has src directory structure', () => {
  const content = readFileSync(README_PATH, 'utf-8');
  assert.ok(content.includes('src/'), 'README should show src directory structure');
});

test('Backend README describes routes and controllers', () => {
  const content = readFileSync(README_PATH, 'utf-8');
  assert.ok(content.includes('routes/'), 'README should mention routes directory');
  assert.ok(content.includes('controllers/'), 'README should mention controllers directory');
});

test('Backend README describes services layer', () => {
  const content = readFileSync(README_PATH, 'utf-8');
  assert.ok(content.includes('services/'), 'README should mention services directory');
  assert.ok(
    content.includes('db') || content.includes('s3') || content.includes('kafka'),
    'README should describe key services (db, s3, kafka)'
  );
});

test('Backend README mentions middleware', () => {
  const content = readFileSync(README_PATH, 'utf-8');
  assert.ok(content.includes('middleware/'), 'README should mention middleware directory');
  assert.ok(
    content.includes('auth') || content.includes('error'),
    'README should describe middleware types'
  );
});

test('Backend README has utils/helpers directory', () => {
  const content = readFileSync(README_PATH, 'utf-8');
  assert.ok(content.includes('utils/'), 'README should mention utils directory');
});

test('Backend README mentions package.json files', () => {
  const content = readFileSync(README_PATH, 'utf-8');
  assert.ok(content.includes('package.json'), 'README should reference package.json files');
});

test('Backend README mentions Docker configuration', () => {
  const content = readFileSync(README_PATH, 'utf-8');
  assert.ok(
    content.includes('Dockerfile') || content.includes('docker-compose'),
    'README should mention Docker configuration'
  );
});

test('Backend README describes shared libraries', () => {
  const content = readFileSync(README_PATH, 'utf-8');
  assert.ok(content.includes('libs/') || content.includes('common/'), 'README should mention shared libraries');
});

test('Backend README has infrastructure section', () => {
  const content = readFileSync(README_PATH, 'utf-8');
  assert.ok(content.includes('infra/'), 'README should mention infrastructure directory');
});

test('Backend README mentions environment configuration', () => {
  const content = readFileSync(README_PATH, 'utf-8');
  assert.ok(content.includes('.env'), 'README should mention environment configuration');
});

test('Backend README has proper markdown formatting', () => {
  const content = readFileSync(README_PATH, 'utf-8');
  const lines = content.split('\n');

  // Check for various markdown elements
  const hasHeadings = lines.some(line => line.trim().startsWith('#'));
  const hasCodeBlocks = content.includes('```');

  assert.ok(hasHeadings, 'README should have headings');
  assert.ok(hasCodeBlocks, 'README should have code blocks');
});

test('Backend README code blocks are properly closed', () => {
  const content = readFileSync(README_PATH, 'utf-8');
  const openBlocks = (content.match(/```/g) || []).length;
  assert.equal(openBlocks % 2, 0, 'All code blocks should be properly closed');
});

test('Backend README mentions Flask migration decision', () => {
  const content = readFileSync(README_PATH, 'utf-8');
  assert.ok(
    content.toLowerCase().includes('flask'),
    'README should mention Flask and migration decisions'
  );
});

test('Backend README has reasonable line length', () => {
  const content = readFileSync(README_PATH, 'utf-8');
  const lines = content.split('\n');

  // Most lines should be under 120 characters (excluding code blocks)
  let inCodeBlock = false;
  let reasonableLines = 0;
  let totalContentLines = 0;

  lines.forEach(line => {
    if (line.includes('```')) {
      inCodeBlock = !inCodeBlock;
      return;
    }

    if (!inCodeBlock && line.trim().length > 0) {
      totalContentLines++;
      if (line.length <= 120) {
        reasonableLines++;
      }
    }
  });

  // At least 80% of lines should be reasonable length
  const ratio = reasonableLines / totalContentLines;
  assert.ok(ratio >= 0.8, `Most lines should be under 120 chars, ratio: ${ratio.toFixed(2)}`);
});

test('Backend README structure is hierarchical', () => {
  const content = readFileSync(README_PATH, 'utf-8');

  // Check that structure uses proper tree characters
  const treeChars = ['├─', '└─', '│'];
  const hasTreeStructure = treeChars.some(char => content.includes(char));

  assert.ok(hasTreeStructure, 'README should use tree structure characters for hierarchy');
});

test('Backend README has main entry points documented', () => {
  const content = readFileSync(README_PATH, 'utf-8');

  const entryPoints = ['index.js', 'app.js', 'worker.js'];
  const foundEntryPoints = entryPoints.filter(ep => content.includes(ep));

  assert.ok(
    foundEntryPoints.length >= 2,
    `README should document main entry points, found: ${foundEntryPoints.join(', ')}`
  );
});

test('Backend README describes file responsibilities', () => {
  const content = readFileSync(README_PATH, 'utf-8');

  // Check for inline comments explaining what files/directories do
  assert.ok(content.includes('#'), 'README should have comments describing components');

  const hasDescriptions = content.match(/#.*\n/) || content.match(/#[^#\n]+/);
  assert.ok(hasDescriptions, 'README should describe component responsibilities');
});
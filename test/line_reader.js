import test from 'ava';
import { dirname, join as joinPath } from 'path';
import { fileURLToPath } from 'url';

import LineReader from '../lib/line_reader.js';

const testDataFileURL = new URL('./test.txt', import.meta.url);
const testDataFilePath = joinPath(dirname(fileURLToPath(import.meta.url)), 'test.txt');

test('readline from file', async t => {
  const lineReader = new LineReader(testDataFilePath);
  const lines = [];
  for await (const line of lineReader) {
    lines.push(line);
  }
  t.deepEqual(lines, ['line1', 'line2', 'line3']);
});


test('readline from buffer', async t => {
  const lineReader = new LineReader(Buffer.from(testDataFilePath, 'utf8'));
  const lines = [];
  for await (const line of lineReader) {
    lines.push(line);
  }
  t.deepEqual(lines, ['line1', 'line2', 'line3']);
});


test('readline from url', async t => {
  const lineReader = new LineReader(testDataFileURL);
  const lines = [];
  for await (const line of lineReader) {
    lines.push(line);
  }
  t.deepEqual(lines, ['line1', 'line2', 'line3']);
});



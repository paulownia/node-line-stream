import test from 'ava';
import {dirname, join as joinPath} from 'path';
import {fileURLToPath} from 'url';
import {createLineStream} from '../index.js';

const testDataFilePath = joinPath(dirname(fileURLToPath(import.meta.url)), 'test.txt');

test('createLineStream',  async t => {
  await new Promise((end, error) => {
    const stream = createLineStream(testDataFilePath, { highWaterMark: 12 });
    const lines = [];
    stream.on('data', data => {
      lines.push(data);
    });
    stream.on('end', () => {
      t.is(lines.length, 3);
      t.is(lines[0], 'line1');
      t.is(lines[1], 'line2');
      t.is(lines[2], 'line3');
      end();
    });
    stream.on('error', error);
  });
  t.pass('call end event');
});



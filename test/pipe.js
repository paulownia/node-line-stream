import test from 'ava';
import {dirname, join as joinPath} from 'path';
import {fileURLToPath} from 'url';
import {createLineStream} from '../index.js';
import { Writable } from 'stream';

const testDataFilePath = joinPath(dirname(fileURLToPath(import.meta.url)), 'test.txt');

class TestWritable extends Writable {
  constructor(options) {
    super(options);
    this.data = [];
    this.count = 0;
  }

  _write(chunk, encoding, callback) {
    this.count++;
    this.data.push(`${this.count}: ${chunk}`);
    callback();
  }
}


test('pipe', async t => {
  const stream = createLineStream(testDataFilePath);
  const writable = new TestWritable();
  stream.pipe(writable);

  await new Promise((resolve, reject) => {
    stream.on('end', () => {
      t.deepEqual(writable.data, ['1: line1', '2: line2', '3: line3']);
      resolve();
    });
    stream.on('error', reject);
  });
});

import { createReadStream } from 'fs';
import { Readable } from 'stream';
import debug from './debug.js';

/**
 * LineReader is an async iterable object that reads lines from a file. It can be used in a for-await-of loop.ReadStream();
 */
export default class LineReader {
  constructor(input, opts = {}) {
    this.input = input;
    this.opts = opts;
    this.separator = opts.separator || '\n';
    this.rsOpts = Object.assign({}, opts);
    delete this.rsOpts.separator;

    if (typeof input === 'string' || input instanceof Buffer || input instanceof URL) {  // considered as a file path
      this.type = 'stream';
    } else if (input[Symbol.iterator]) {
      this.type = 'iterable';
    } else {
      throw new Error('Invalid input type');
    }
  }

  _getStream() {
    switch (this.type) {
    case 'array':
      return this._getArrayStream();
    case 'stream':
      return this._getReadStream();
    default:
      throw new Error('Invalid input type');
    }
  }

  _getArrayStream() {
    return Readable.from(this.input);
  }

  _getReadStream() {
    return createReadStream(this.input, this.rsOpts);
  }

  async* [Symbol.asyncIterator]() {
    const rs = createReadStream(this.input, this.rsOpts);
    if (debug.enabled) {
      rs.on('close', () => {
        debug('rs close');
      });
    }
    let buffer = '';
    for await (const line of rs) {
      const str = line.toString();
      if (str.indexOf('\n') === -1) {
        buffer += str;
        continue;
      }
      const lines = (buffer + str).split(this.separator);
      buffer = lines.pop();
      for (const line of lines) {
        yield line;
      }
    }
    if (buffer) {
      yield buffer;
    }
  }
}



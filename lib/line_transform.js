import { Transform } from 'stream';

export default class LineTransform extends Transform {

  constructor(options = {}) {
    const encoding = options.encoding || 'utf8';
    const separator = options.separator || '\n';
    const copy = Object.assign({ encoding }, options);
    delete copy.separator;
    super(copy);

    this._separator = separator;
    this._encoding = encoding;
    this._buffer = '';
  }

  _transform(chunk, encoding, done) {
    if (!chunk) {
      return done();
    }

    const str = chunk.toString(this._encoding);
    if (str.indexOf(this._separator) === -1) {
      this._buffer += str;
      return done();
    }
    const lines = (this._buffer + str).split(this._separator);
    this._buffer = lines.pop();
    for (const line of lines) {
      this.push(line);
    }
    done();
  }

  _flush(done) {
    if (this._buffer) {
      this.push(this._buffer);
    }
    this._buffer = '';
    done();
  }
}

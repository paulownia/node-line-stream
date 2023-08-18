import fs from 'fs';
import stream from 'stream';

export class LineTransform extends stream.Transform {

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
    if (chunk) {
      const str = chunk.toString(this._encoding);
      const lines = (this._buffer + str).split(this._separator);
      this._buffer = lines.pop();
      for (const line of lines) {
        this.push(line);
      }
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


export function createLineStream(input, opts = {}) {
  const ltOpts = Object.assign({}, opts);
  const rsOpts = Object.assign({}, opts);
  delete rsOpts.separator;

  const lineStream = new LineTransform(ltOpts);
  const readStream = fs.createReadStream(input, rsOpts);
  return readStream.pipe(lineStream);
}


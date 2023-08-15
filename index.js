const fs = require('fs');
const stream = require('stream');
const {on} = require('events');

class LineTransform extends stream.Transform {

  constructor(options) {
    super(options);
    this._separator = options.separator || '\n';
    this._buffer = '';
  }

  _transform(chunk, encoding, done) {
    if (chunk) {
      const lines = (this._buffer + chunk).split(this._separator);
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

  [Symbol.asyncIterator]() {
    return on(this, 'data');
  }
}
module.exports.LineTransform = LineTransform;


function createLineStream(input, opts = {}) {
  const separator = opts.separator || '\n';
  const rsOpts = Object.assign({}, opts);
  delete rsOpts.separator;

  const lineStream = new LineTransform({ separator });
  const readStream = fs.createReadStream(input, rsOpts);
  return readStream.pipe(lineStream);
}

module.exports.createLineStream = createLineStream;


import { createReadStream } from 'fs';
import LineTransform from './line_transform.js';
import debug from './debug.js';

export default function createLineStream(input, opts = {}) {
  const ltOpts = Object.assign({}, opts);
  const rsOpts = Object.assign({}, opts);
  delete rsOpts.separator;

  const lineStream = new LineTransform(ltOpts);
  const readStream = createReadStream(input, rsOpts);
  if (debug.enabled) {
    readStream.on('close', () => {
      debug('readStream close');
    });
  }
  return readStream.pipe(lineStream);
}


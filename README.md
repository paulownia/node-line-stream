# node-linestream

A stream that emits text data line by line.


## Usage

```javascript
const {createLineStream} = require('@paulownia/line-stream');

const lineStream = createLineStream('./test.txt');

lineStream.on('data', (chunk) => {
    console.log(chunk);
});
```

with pipe

```javascript
lineStream.pipe(process.stdout);
```

## classes

### LineTransform

An implementation of stream.Transform that converts to line-by-line data.


## functions

### createLineStream(path, [opts])

Returns a stream piped from ReadStream to LineStream.

#### Arguments

- path - <string> | <Buffer> | <URL> path to text file
- opts <object>
    - encoding <string> default: 'ascii'
    - highWaterMark  <integer> default: 256



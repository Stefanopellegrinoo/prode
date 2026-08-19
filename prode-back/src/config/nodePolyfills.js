import buffer from 'node:buffer';

// Node 25+ compatibility: SlowBuffer was removed in Node 25, polyfill for legacy dependencies
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import buffer from 'node:buffer';

// Load .env reliably regardless of current working directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

// Node 25+ compatibility: SlowBuffer was removed in Node 25, polyfill for legacy dependencies
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}

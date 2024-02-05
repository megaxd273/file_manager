import { createReadStream } from 'fs';
import { createHash } from 'crypto';

export const getHash = async (filename) => {
  const hash = createHash('sha256');
  const input = createReadStream(filename);
  input.pipe(hash.setEncoding('hex')).pipe(process.stdout);
  input.on('error', () => console.error('Operation failed'));
};

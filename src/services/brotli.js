import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';

export const compressFile = async (filename) => {
  const compressedFileName = `${filename}.br`;
  const transform = createBrotliCompress();
  const output = createWriteStream(compressedFileName);
  const input = createReadStream(filename);
  const stream = input.pipe(transform).pipe(output);
  stream.on('finish', () => console.log('done compressing'));
};

export const decompressFile = async (filename) => {
  const decompressedFileName = filename.replace(/\.br\b/g, '');
  const transform = createBrotliDecompress();
  const output = createWriteStream(decompressedFileName);
  const input = createReadStream(filename);
  const stream = input.pipe(transform).pipe(output);
  stream.on('finish', () => console.log('done decompressing'));
};

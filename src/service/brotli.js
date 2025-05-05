import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { createBrotliCompress, createBrotliDecompress } from "zlib";

export const compress = async (originPath, destinationPath) => {
  const input = createReadStream(originPath);
  const brotli = createBrotliCompress();
  const output = createWriteStream(destinationPath);
  try {
    await pipeline(input, brotli, output);
  } catch (error) {
    console.log("Operation failed");
  }
};
export const decompress = async (originPath, destinationPath) => {
  const input = createReadStream(originPath);
  const brotli = createBrotliDecompress();
  const output = createWriteStream(destinationPath);
  try {
    await pipeline(input, brotli, output);
  } catch (error) {
    console.log("Operation failed");
  }
};

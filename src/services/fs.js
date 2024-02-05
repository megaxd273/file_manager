import { opendir, rename, rm, writeFile } from 'fs/promises';
import { cwd } from 'process';
import { createReadStream, createWriteStream } from 'fs';
import { EOL } from 'os';
import { basename, join, relative } from 'path';

export const createFile = async (path) => {
  try {
    await writeFile(`${cwd()}\\${path}`, '', { flag: 'wx' });
  } catch {
    console.error('Invalid input');
  }
};
export const readFile = async (path) => {
  const input = createReadStream(`${cwd()}\\${path}`);
  input.pipe(process.stdout);
  input.on('end', () => console.log(EOL));
  input.on('error', () => console.error('Invalid input'));
};
export const renameFile = async (path, newPath) => {
  try {
    await rename(path, newPath);
  } catch {
    console.error('Invalid input');
  }
};
export const copyFile = async (file, newDir) => {
  try {
    const input = createReadStream(file);
    const newPath = relative(cwd(), newDir);
    const output = createWriteStream(join(newPath, basename(file)));
    input.pipe(output);
    output.on('finish', () => {
      console.log('Success');
    });
    input.on('error', () => console.error('Invalid input'));
    output.on('error', () => console.error('Invalid input'));
  } catch {
    console.error('Invalid input');
  }
};
export const removeFile = async (path) => {
  try {
    await rm(path);
  } catch {
    console.error('Invalid input');
  }
};
export const moveFile = async (path, newPath) => {
  try {
    await copyFile(path, newPath);
    await rm(path);
  } catch {
    console.error('Invalid input');
  }
};

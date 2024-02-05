import { createHash } from 'crypto';
import { createReadStream, createWriteStream } from 'fs';
import { opendir, rename, rm, writeFile } from 'fs/promises';
import readline from 'node:readline/promises';
import { homedir, EOL, cpus, arch, userInfo } from 'os';
import { basename, join, relative } from 'path';
import { chdir, argv, cwd } from 'process';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { ls, cd, up } from './services/nwd.js';
import {
  createFile,
  readFile,
  renameFile,
  copyFile,
  removeFile,
  moveFile,
} from './services/fs.js';
import {
  getUserName,
  moveToHomedir,
  closeLog,
  currentDirLog,
  getCommand,
  getArguments,
} from './utils/index.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const commands = {
  '.exit': () => rl.close(),
  cd: (path) => cd(path),
  up: () => up(),
  ls: () => ls(),
  add: (path) => createFile(path),
  cat: (path) => readFile(path),
  rename: (path, newPath) => renameFile(path, newPath),
  cp: (path, newPath) => copyFile(path, newPath),
  rm: (path) => removeFile(path),
  mv: (path, newPath) => moveFile(path, newPath),
};
//TODO sort ls array
function manage() {
  let userName = getUserName(argv);
  if (!userName) {
    userName = 'Guest';
  }
  console.log(`Welcome to the File Manager, ${userName}!`);
  moveToHomedir();
  currentDirLog();
  rl.on('line', async (line) => {
    const [command, ...args] = getArguments(line);
    if (commands.hasOwnProperty(command)) {
      commands[command](...args);
    } else {
      console.error('Invalid input');
    }
    // if (getCommand(line) === 'mv') {
    //   const [filePath, newDirPath] = line.split(' ').slice(1);
    //   const input = createReadStream(filePath);
    //   const newPath = relative(cwd(), newDirPath);
    //   const output = createWriteStream(join(newPath, basename(filePath)));
    //   input.pipe(output);
    //   await rm(filePath);
    // }
    if (getCommand(line) === 'os') {
      if (line.split(' ')[1] === '--EOL') {
        console.log(JSON.stringify(EOL));
      }
      if (line.split(' ')[1] === '--cpus') {
        console.log(cpus());
      }
      if (line.split(' ')[1] === '--homedir') {
        console.log(homedir());
      }
      if (line.split(' ')[1] === '--username') {
        console.log(userInfo().username);
      }
      if (line.split(' ')[1] === '--arch') {
        console.log(arch());
      }
    }
    if (getCommand(line) === 'hash') {
      const filename = line.split(' ')[1];
      const hash = createHash('sha256');
      const input = createReadStream(filename);
      input.pipe(hash.setEncoding('hex')).pipe(process.stdout);
    }
    if (getCommand(line) === 'compress') {
      const filename = line.split(' ')[1];
      const compressedFileName = `${filename}.br`;
      const transform = createBrotliCompress();
      const output = createWriteStream(compressedFileName);
      const input = createReadStream(filename);
      const stream = input.pipe(transform).pipe(output);
      stream.on('finish', () => console.log('done compressing'));
    }
    if (getCommand(line) === 'decompress') {
      const filename = line.split(' ')[1];
      const decompressedFileName = filename.replace(/\.br\b/g, '');
      const transform = createBrotliDecompress();
      const output = createWriteStream(decompressedFileName);
      const input = createReadStream(filename);
      const stream = input.pipe(transform).pipe(output);
      stream.on('finish', () => console.log('done compressing'));
    }
    currentDirLog();
  });
  rl.on('close', () => closeLog(userName));
}
manage();

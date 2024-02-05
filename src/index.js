import readline from 'node:readline/promises';
import { argv } from 'process';
import { ls, cd, up } from './services/nwd.js';
import { getOsInfo } from './services/os.js';
import { getHash } from './services/hash.js';
import { compressFile, decompressFile } from './services/brotli.js';
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
  os: (arg) => getOsInfo(arg),
  hash: (path) => getHash(path),
  compress: (path) => compressFile(path),
  decompress: (path) => decompressFile(path),
};
async function handleUserInput(line) {
  const [command, ...args] = getArguments(line);
  if (commands.hasOwnProperty(command)) {
    await commands[command](...args);
    await currentDirLog();
  } else {
    console.error('Invalid input');
  }
}

async function manage() {
  let userName = getUserName(argv);
  if (!userName) {
    userName = 'Guest';
  }
  console.log(`Welcome to the File Manager, ${userName}!`);
  moveToHomedir();
  await currentDirLog();

  rl.on('line', handleUserInput);

  rl.on('close', () => closeLog(userName));
}

manage();

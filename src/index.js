import { createHash } from 'crypto';
import { createReadStream, createWriteStream } from 'fs';
import { opendir, rename, rm, writeFile } from 'fs/promises';
import readline from 'node:readline/promises';
import { homedir, EOL, cpus, arch, userInfo } from 'os';
import { basename, join, relative } from 'path';
import { chdir, argv, cwd } from 'process';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';

const fileType = {
  1: 'file',
  2: 'directory',
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getUserName = (array) => {
  try {
    if (array.length > 3) {
      throw new Error('Operation failed');
    }
    const argument = array.at(-1).split('=')[1];
    return argument;
  } catch (error) {
    console.log(error);
  }
};
const moveToHomedir = () => {
  chdir(homedir());
};

const closeLog = (userName) => {
  console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
};
const currentDirLog = () => {
  console.log(`You are currently in ${cwd()}`);
};
const getCommand = (line) => {
  return line.split(' ')[0];
};
const getArguments = (line) => {
  const args = [];
  let currentArg = '';

  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === ' ' && !quoted) {
      if (currentArg !== '') {
        args.push(currentArg);
        currentArg = '';
      }
    } else if (char === '"') {
      quoted = !quoted;
    } else {
      currentArg += char;
    }
  }

  if (currentArg !== '') {
    args.push(currentArg);
  }

  return args;
};

function manage() {
  const userName = getUserName(argv);
  if (userName) {
    console.log(`Welcome to the File Manager, ${userName}!`);
    moveToHomedir();
    currentDirLog();
  }
  rl.on('line', async (line) => {
    if (getCommand(line) === '.exit') {
      rl.close();
    }
    if (getCommand(line) === 'cd') {
      const path = getArguments(line);
      chdir(path[1]);
    }
    if (getCommand(line) === 'up') {
      chdir('..');
    }
    if (getCommand(line) === 'ls') {
      const files = await opendir(cwd());
      let idx = 0;
      for await (const file of files) {
        console.log(
          `${idx++} \"${file.name}\" ${
            fileType[file[Object.getOwnPropertySymbols(file)[0]]]
          }`
        );
      }
    }
    if (getCommand(line) === 'add') {
      const fileName = line.split(' ').slice(1).join(' ').trim();
      await writeFile(`${cwd()}\\${fileName}`, '');
    }
    if (getCommand(line) === 'cat') {
      const fileName = line.split(' ').slice(1).join(' ').trim();
      const input = createReadStream(`${cwd()}\\${fileName}`);
      input.pipe(process.stdout);
    }
    if (getCommand(line) === 'rename') {
      const args = getArguments(line);
      const [oldName, newName] = line.split(' ').slice(1);
      await rename(args[1], args[2]);
    }
    if (getCommand(line) === 'cp') {
      const [filePath, newDirPath] = line.split(' ').slice(1);
      const input = createReadStream(filePath);
      const newPath = relative(cwd(), newDirPath);
      const output = createWriteStream(join(newPath, basename(filePath)));
      input.pipe(output);
    }
    if (getCommand(line) === 'rm') {
      await rm(line.split(' ').slice(1).join(' ').trim());
    }
    if (getCommand(line) === 'mv') {
      const [filePath, newDirPath] = line.split(' ').slice(1);
      const input = createReadStream(filePath);
      const newPath = relative(cwd(), newDirPath);
      const output = createWriteStream(join(newPath, basename(filePath)));
      input.pipe(output);
      await rm(filePath);
    }
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

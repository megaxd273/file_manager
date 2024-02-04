import { createHash } from 'crypto';
import { createReadStream, createWriteStream } from 'fs';
import { opendir, rename, rm, writeFile } from 'fs/promises';
import readline from 'node:readline/promises';
import { homedir, EOL, cpus, hostname, arch, userInfo } from 'os';
import { basename, join, relative } from 'path';
import { chdir, argv, cwd } from 'process';

const fileType = {
  1: 'file',
  2: 'directory',
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Get user name from argv.
 * @param {Array} array - The title of the book.
 */
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

function manage() {
  const userName = getUserName(argv);
  if (userName) {
    console.log(`Welcome to the File Manager, ${userName}!`);
    moveToHomedir();
    currentDirLog();
  }
  rl.on('line', async (line) => {
    if (line === '.exit') {
      rl.close();
    }
    if (line.split(' ')[0] === 'cd') {
      const path = line.split(' ').slice(1).join(' ').trim();
      chdir(path);
      currentDirLog();
    }
    if (line === 'up') {
      chdir('..');
      currentDirLog();
    }
    if (line === 'ls') {
      const files = await opendir(cwd());
      let idx = 0;
      for await (const file of files) {
        console.log(
          `${idx++} \"${file.name}\" ${
            fileType[file[Object.getOwnPropertySymbols(file)[0]]]
          }`
        );
      }
      currentDirLog();
    }
    if (line.split(' ')[0] === 'add') {
      const fileName = line.split(' ').slice(1).join(' ').trim();
      await writeFile(`${cwd()}\\${fileName}`, '');
    }
    if (line.split(' ')[0] === 'cat') {
      const fileName = line.split(' ').slice(1).join(' ').trim();
      const input = createReadStream(`${cwd()}\\${fileName}`);
      input.pipe(process.stdout);
    }
    if (line.split(' ')[0] === 'rename') {
      const [oldName, newName] = line.split(' ').slice(1);
      await rename(oldName, newName);
    }
    if (line.split(' ')[0] === 'cp') {
      const [filePath, newDirPath] = line.split(' ').slice(1);
      const input = createReadStream(filePath);
      const newPath = relative(cwd(), newDirPath);
      const output = createWriteStream(join(newPath, basename(filePath)));
      input.pipe(output);
    }
    if (line.split(' ')[0] === 'rm') {
      await rm(line.split(' ').slice(1).join(' ').trim());
    }
    if (line.split(' ')[0] === 'mv') {
      const [filePath, newDirPath] = line.split(' ').slice(1);
      const input = createReadStream(filePath);
      const newPath = relative(cwd(), newDirPath);
      const output = createWriteStream(join(newPath, basename(filePath)));
      input.pipe(output);
      await rm(filePath);
    }
    if (line.split(' ')[0] === 'os') {
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
    if (line.split(' ')[0] === 'hash') {
      const filename = line.split(' ')[1];
      const hash = createHash('sha256');
      const input = createReadStream(filename);
      input.pipe(hash.setEncoding('hex')).pipe(process.stdout);
      currentDirLog();
    }
  });
  rl.on('close', () => closeLog(userName));
}
manage();

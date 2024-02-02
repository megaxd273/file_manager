import readline from 'node:readline/promises';
import { homedir } from 'os';
import { chdir, argv, cwd } from 'process';

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
    console.log(homedir());
    console.log(`Welcome to the File Manager, ${userName}!`);
    moveToHomedir();
    currentDirLog();
  }
  rl.on('line', (line) => {
    if (line === '.exit') {
      rl.close();
    }
  });
  rl.on('close', () => closeLog(userName));
}
manage();

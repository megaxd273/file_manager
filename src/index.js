import readline from 'node:readline/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

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

const closeLog = (userName) => {
  console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
};
const operationLog = () => {
  console.log(dirname(fileURLToPath(import.meta.url)));
};

function manage() {
  const userName = getUserName(process.argv);
  if (userName) {
    console.log(`Welcome to the File Manager, ${userName}!`);
    operationLog();
  }
  rl.on('line', (line) => {
    console.log(`Recieved ${line}`);
    if (line === '.exit') {
      rl.close();
    }
  });
  rl.on('close', () => closeLog(userName));
}
manage();

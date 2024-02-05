import { chdir, cwd } from 'process';
import { homedir } from 'os';

export const getUserName = (array) => {
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
export const moveToHomedir = () => {
  chdir(homedir());
};

export const closeLog = (userName) => {
  console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
};
export const currentDirLog = async () => {
  return new Promise((res) => {
    const currentdir = cwd();
    console.log(`You are currently in ${currentdir}`);
    res();
  });
};

export const getArguments = (line) => {
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

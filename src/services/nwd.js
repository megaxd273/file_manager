import { chdir, cwd } from 'process';
import { opendir } from 'fs/promises';

const fileType = {
  1: 'file',
  2: 'directory',
};

export const cd = async (path) => {
  try {
    chdir(path);
  } catch {
    console.error('Invalid input');
  }
};
export const up = async () => {
  chdir('..');
};
export const ls = async () => {
  try {
    const files = await opendir(cwd());
    const fileData = [];
    for await (const file of files) {
      const filesObj = {};
      filesObj['Name'] = file.name;
      filesObj['Type'] = fileType[file[Object.getOwnPropertySymbols(file)[0]]];
      fileData.push(filesObj);
    }
    console.table(fileData);
  } catch {
    console.error('Operation failed');
  }
};

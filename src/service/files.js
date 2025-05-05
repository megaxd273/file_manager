import { stdout, chdir, cwd } from "process";
import { opendir, writeFile, stat, mkdir, rename, rm } from "fs/promises";
import { createReadStream, createWriteStream } from "fs";
import { basename, dirname, join } from "path";
import { pipeline } from "stream/promises";

export const up = () => {
  chdir("..");
};
export const cd = (path) => {
  try {
    chdir(path);
  } catch (error) {
    console.log(error);
    console.log("Operation failed");
  }
};
export const ls = async () => {
  const result = [];
  for await (const element of await opendir(cwd())) {
    result.push({
      Name: element.name,
      Type: element.isDirectory() ? "directory" : "file",
    });
  }
  console.table(
    result.sort((a, b) => {
      if (a.Type === "directory" && b.Type === "directory") {
        return a.Name.localeCompare(b.Name);
      }
      if (a.Type === "directory" && b.Type === "file") {
        return -1;
      }
      if (a.Type === "file" && b.Type === "directory") {
        return 1;
      }
      if (a.Type === "file" && b.Type === "file") {
        return a.Name.localeCompare(b.Name);
      }
    })
  );
};

export const cat = (path) => {
  return new Promise((resolve, reject) => {
    const read = createReadStream(path);
    read.pipe(stdout);
    read.on("end", resolve);
    read.on("error", () => console.log("Operation failed"));
  });
};

export const add = async (filename) => {
  try {
    await stat(filename);
    console.log("Operation failed");
  } catch (error) {
    await writeFile(filename, "");
  }
};

export const myMkdir = async (dirname) => {
  try {
    await stat(dirname);
    console.log("Operation failed");
  } catch (error) {
    await mkdir(dirname, {});
  }
};
export const rn = async (oldPath, newFileName) => {
  try {
    const newPath = join(dirname(oldPath), newFileName);
    await rename(oldPath, newPath);
  } catch (error) {
    console.log("Operation failed");
  }
};
export const cp = async (originPath, destinationPath) => {
  const input = createReadStream(originPath);
  const dest = join(destinationPath, basename(originPath));
  const output = createWriteStream(dest);
  try {
    await pipeline(input, output);
  } catch (error) {
    console.log("Operation failed");
  }
};

export const myRm = async (path) => {
  try {
    console.log(path);
    await rm(path);
  } catch (error) {
    console.log("Operation failed");
  }
};

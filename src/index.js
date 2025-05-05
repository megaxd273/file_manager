import { stdin, stdout, argv, pid, kill, chdir, cwd } from "process";
import { EOL, homedir } from "os";
import { opendir, writeFile, stat, mkdir, rename, rm } from "fs/promises";
import { createReadStream, createWriteStream } from "fs";
import { basename, dirname, join } from "path";
import { pipeline } from "stream/promises";

const getUsername = () => {
  const template = "--username=";
  for (const element of argv) {
    if (element.includes(template)) {
      return element.replace(template, "");
    }
  }
  return "Who are you?";
};

const parseInput = (input) => {
  const args = input.toString().trim().split(" ");
  return args;
};

const pwd = () => {
  stdout.write(`${EOL}You are currently in ${cwd()}${EOL}`);
};

const up = () => {
  chdir("..");
};
const cd = (path) => {
  try {
    chdir(path);
  } catch (error) {
    console.log("Operation failed");
  }
};
const ls = async () => {
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

const cat = (path) => {
  return new Promise((resolve, reject) => {
    const read = createReadStream(path);
    read.pipe(stdout);
    read.on("end", resolve);
    read.on("error", () => console.log("Operation failed"));
  });
};

const add = async (filename) => {
  try {
    await stat(filename);
    console.log("Operation failed");
  } catch (error) {
    await writeFile(filename, "");
  }
};

const myMkdir = async (dirname) => {
  try {
    await stat(dirname);
    console.log("Operation failed");
  } catch (error) {
    await mkdir(dirname, {});
  }
};
const rn = async (oldPath, newFileName) => {
  try {
    const newPath = join(dirname(oldPath), newFileName);
    await rename(oldPath, newPath);
  } catch (error) {
    console.log("Operation failed");
  }
};
const cp = async (originPath, destinationPath) => {
  const input = createReadStream(originPath);
  const dest = join(destinationPath, basename(originPath));
  const output = createWriteStream(dest);
  try {
    await pipeline(input, output);
  } catch (error) {
    console.log("Operation failed");
  }
};

const myRm = async (path) => {
  try {
    await rm(path);
  } catch (error) {
    console.log("Operation failed");
  }
};

stdout.write(`Welcome to the File Manager, ${getUsername()}!${EOL}`);
cd(homedir());

stdin.on("data", async (data) => {
  data = parseInput(data);
  if (data[0].includes(".exit")) {
    process.emit("SIGINT");
  }
  if (data[0].includes("up")) {
    up();
  }
  if (data[0].includes("cd")) {
    cd(data[1]);
  }
  if (data[0].includes("ls")) {
    await ls();
  }
  if (data[0].includes("cat")) {
    await cat(data[1]);
  }
  if (data[0].includes("add")) {
    await add(data[1]);
  }
  if (data[0].includes("mkdir")) {
    await myMkdir(data[1]);
  }
  if (data[0].includes("rn")) {
    await rn(data[1], data[2]);
  }
  if (data[0].includes("cp")) {
    await cp(data[1], data[2]);
  }
  if (data[0].includes("mv")) {
    await cp(data[1], data[2]);
    await myRm(data[1]);
  }
  if (data[0].includes("rm")) {
    await myRm(data[1]);
  }
  pwd();
});
process.once("SIGINT", () => {
  stdout.write(`Thank you for using File Manager, ${getUsername()}, goodbye!`);
  process.exit(0);
});

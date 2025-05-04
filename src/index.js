import { stdin, stdout, argv, pid, kill, chdir, cwd } from "process";
import { EOL, homedir } from "os";
import path from "path";
import { opendir } from "fs/promises";

const getUsername = () => {
  const template = "--username=";
  for (const element of argv) {
    if (element.includes(template)) {
      return element.replace(template, "");
    }
  }
  return "Who are you?";
};

const pwd = () => {
  stdout.write(`You are currently in ${cwd()}${EOL}`);
};

const up = () => {
  chdir("..");
};
const cd = (path) => {
  chdir(path);
};
const ls = async () => {
  const result = [];
  for await (const element of await opendir(cwd())) {
    result.push({
      Name: element.name,
      Type: element.isDirectory() ? "directory" : "file",
    });
  }
  console.table(result);
};

stdout.write(`Welcome to the File Manager, ${getUsername()}!${EOL}`);
cd(homedir());

stdin.on("data", (data) => {
  if (data.includes(".exit")) {
    process.emit("SIGINT");
  }
  if (data.includes("up")) {
    up();
    cd(data.toString().split(" ")[1]);
  }
  if (data.includes("cd")) {
    console.log(path.join(data.toString().split(" ")[1]));
    cd(data.toString().trim().split(" ")[1]);
  }
  if (data.includes("ls")) {
    ls();
  }
  pwd();
});
process.once("SIGINT", () => {
  stdout.write(`Thank you for using File Manager, ${getUsername()}, goodbye!`);
  process.exit(0);
});

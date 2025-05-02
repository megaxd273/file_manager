import { stdin, stdout, argv, pid, kill } from "process";
import { EOL } from "os";

const getUsername = () => {
  const template = "--username=";
  for (const element of argv) {
    if (element.includes(template)) {
      return element.replace(template, "");
    }
  }
  return "Who are you?";
};

stdout.write(`Welcome to the File Manager, ${getUsername()}!${EOL}`);

process.on("SIGINT", () => {
  stdout.write(`Thank you for using File Manager, ${getUsername()}, goodbye!`);
  process.exit(0);
});

stdin.on("data", (data) => {
  if (data.includes(".exit")) {
    kill(pid, "SIGINT");
  }
});

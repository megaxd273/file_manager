import { stdout, argv, cwd } from "process";
import { EOL } from "os";

export const getUsername = () => {
  const template = "--username=";
  for (const element of argv) {
    if (element.includes(template)) {
      return element.replace(template, "");
    }
  }
  return "Who are you?";
};

export const parseInput = (input) => {
  const args = input.toString().trim().split(" ");
  return args;
};

export const pwd = () => {
  stdout.write(`${EOL}You are currently in ${cwd()}${EOL}`);
};

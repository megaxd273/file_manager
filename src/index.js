import { stdin, stdout } from "process";
import { EOL, homedir } from "os";
import { commands } from "./helpers/strategy.js";
import { parseInput, getUsername, pwd } from "./helpers/utils.js";
import { cd } from "./service/files.js";

process.once("SIGINT", () => {
  stdout.write(`Thank you for using File Manager, ${getUsername()}, goodbye!`);
  process.exit(0);
});
stdout.write(`Welcome to the File Manager, ${getUsername()}!${EOL}`);
cd(homedir());

stdin.on("data", async (data) => {
  data = parseInput(data);
  const command = data[0];
  if (commands[command]) {
    await commands[command](data.slice(1));
  } else {
    console.log("Invalid input");
  }
  pwd();
});

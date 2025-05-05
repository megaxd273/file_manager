import { arch, cpus, EOL, homedir, userInfo } from "os";

export const handleOs = (arg) => {
  switch (arg) {
    case "--EOL":
      console.log(JSON.stringify(EOL));
      break;
    case "--cpus":
      const cpu = cpus()[0];
      console.log(
        `Amount is ${cpus().length}; Model is ${cpus()[0]
          .model.split(" ")
          .slice(0, -2)
          .join(" ")}; Speed is ${(cpu.speed / 1000).toFixed(1)} GHz`
      );
      break;
    case "--homedir":
      console.log(homedir());
      break;
    case "--username":
      console.log(userInfo().username);
      break;
    case "--architecture":
      console.log(arch());
      break;
    default:
      console.log("Invalid input");
  }
};

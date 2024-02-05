import { homedir, EOL, cpus, arch, userInfo } from 'os';

export const getOsInfo = (command) => {
  switch (command) {
    case '--EOL':
      console.log(JSON.stringify(EOL));
      break;
    case '--cpus':
      console.log(`Total amount of cpus${cpus().length}`);
      for (const cpu of cpus()) {
        console.log(
          `modle: ${cpu.model.replace(' @ 3.30GHz', '')}, speed: ${(
            cpu.speed / 1000
          ).toFixed(1)}GHz`
        );
      }
      break;
    case '--homedir':
      console.log(homedir());
      break;
    case '--username':
      console.log(userInfo().username);
      break;
    case '--arch':
      console.log(arch());
      break;

    default:
      break;
  }
};

import {
  up,
  add,
  cat,
  cd,
  cp,
  ls,
  myMkdir,
  myRm,
  rn,
} from "../service/files.js";
import { handleOs } from "../service/handleOs.js";
import { compress, decompress } from "../service/brotli.js";
import { calcHash } from "../service/hash.js";

export const commands = {
  up,
  cd: (args) => cd(args[0]),
  ls,
  cat: (args) => cat(args[0]),
  add: (args) => add(args[0]),
  mkdir: (args) => myMkdir(args[0]),
  rn: (args) => rn(args[0], args[1]),
  cp: (args) => cp(args[0], args[1]),
  mv: async (args) => {
    await cp(args[0], args[1]);
    await myRm(args[0]);
  },
  rm: (args) => myRm(args[0]),
  hash: (args) => calcHash(args[0]),
  compress: (args) => compress(args[0], args[1]),
  decompress: (args) => decompress(args[0], args[1]),
  os: (args) => handleOs(args[0]),
};

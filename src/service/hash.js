import { createReadStream } from "fs";
import { createHash } from "crypto";

export const calcHash = async (path) => {
  const input = createReadStream(path);
  const hash = createHash("sha256");
  return new Promise((resolve, reject) => {
    input.on("data", (chunk) => {
      hash.update(chunk);
    });
    input.on("end", () => {
      const result = hash.digest("hex");
      console.log(result);
      resolve(result);
    });
  });
};

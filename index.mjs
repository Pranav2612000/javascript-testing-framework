import JestHasteMap from "jest-haste-map";
import {cpus} from "os";
import {dirname} from "path";
import {fileURLToPath} from "url";
import fs from "fs";

const root = dirname(fileURLToPath(import.meta.url));

const hasteMapOptions = {
  extensions: ["js"],
  maxWorkers: cpus().length,
  name: "building_a_test_framework",
  platforms: [],
  rootDir: root,
  roots: [root]
}

const hasteMap = new JestHasteMap.default(hasteMapOptions);
await hasteMap.setupCachePath(hasteMapOptions);

const {hasteFS} = await hasteMap.build();
const testFiles = hasteFS.matchFilesWithGlob(["**/*.test.js"]);

await Promise.all(
  Array.from(testFiles).map(async (testFile) => {
    const code = await fs.promises.readFile(testFile, "utf8");
    console.log(testFile + ":\n" + code);
  })
);

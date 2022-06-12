import JestHasteMap from "jest-haste-map";
import {cpus} from "os";
import {dirname} from "path";
import {fileURLToPath} from "url";

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

console.log(testFiles);

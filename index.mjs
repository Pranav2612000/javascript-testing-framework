import JestHasteMap from "jest-haste-map";
import {cpus} from "os";
import chalk from "chalk";
import {dirname} from "path";
import {fileURLToPath} from "url";
import {Worker} from "jest-worker";
import {join, relative} from "path";

const root = dirname(fileURLToPath(import.meta.url));
const worker = new Worker(join(root, 'worker.js'), {
  enableWorkerThreads: true
});

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
    const {success, errorMessage} = await worker.runTest(testFile);
    const status = success 
      ? chalk.green.inverse.bold(' PASS ')
      : chalk.red.inverse.bold(' FAIL ');

    console.log(status + ' ' + chalk.dim(relative(root, testFile)));
    if (!success) {
      console.log(' ' + errorMessage);
    }
  })
);

worker.end();

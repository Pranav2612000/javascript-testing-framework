import JestHasteMap from "jest-haste-map";
import {cpus} from "os";
import {dirname} from "path";
import {fileURLToPath} from "url";
import {Worker} from "jest-worker";
import {join} from "path";

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
    const testResult = await worker.runTest(testFile);
    console.log(testResult);
  })
);

worker.end();

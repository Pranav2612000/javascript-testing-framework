const fs = require("fs");
const {expect} = require("expect");
const mock = require("jest-mock");
const {describe, it, run, resetState} = require("jest-circus");

exports.runTest = async function(testFile) {
  const code = await fs.promises.readFile(testFile, "utf8");
  const testResult = {
    success: false,
    errorMessage: null
  };

  let testName;
  try {
    resetState();
    eval(code);

    const {testResults} = await run();
    testResult.testResults = testResults;
    testResult.success = testResults.every((result) => !result.errors.length);
  } catch (err) {
    testResult.errorMessage = (testName ?? '') + ' ' + err.message;
  }
  return testResult;
}

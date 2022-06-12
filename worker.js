const fs = require("fs");
const {expect} = require("expect");
const mock = require("jest-mock");

exports.runTest = async function(testFile) {
  const code = await fs.promises.readFile(testFile, "utf8");
  const testResult = {
    success: false,
    errorMessage: null
  };

  try {
    eval(code);
    testResult.success = true;
  } catch (err) {
    testResult.errorMessage = err.message;
  }
  return testResult;
}

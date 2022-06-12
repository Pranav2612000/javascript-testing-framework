const fs = require("fs");

exports.runTest = async function(testFile) {
  const code = await fs.promises.readFile(testFile, "utf8");
  const testResult = {
    success: false,
    errorMessage: null
  };

  const expect = (received) => ({
    toBe: (expected) => {
      if (received !== expected) {
        throw new Error(`Expected ${expected} but received ${received}.`);
      } else {
        return true;
      }
    }
  });

  try {
    eval(code);
    testResult.success = true;
  } catch (err) {
    testResult.errorMessage = err.message;
  }
  return testResult;
}

const fs = require("fs");
const {expect} = require("expect");
const mock = require("jest-mock");

exports.runTest = async function(testFile) {
  const code = await fs.promises.readFile(testFile, "utf8");
  const testResult = {
    success: false,
    errorMessage: null
  };

  let testName;
  try {

    const describeFns = [];
    let currentDescribeFn;
    const describe = (name, fn) => {
      describeFns.push([name, fn]);
    };
    const it = (name, fn) => {
      currentDescribeFn.push([name, fn]);
    }

    eval(code);

    for (const [name, fn] of describeFns) {
      currentDescribeFn = [];
      testName = name;
      fn();

      currentDescribeFn.forEach(([name, fn]) => {
        testName += ' ' + name;
        fn();
      });
    };

    testResult.success = true;
  } catch (err) {
    testResult.errorMessage = (testName ?? '') + ' ' + err.message;
  }
  return testResult;
}

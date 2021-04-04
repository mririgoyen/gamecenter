const { create } = require('xmlbuilder2');

const parseFailedCase = (testCase, source) => {
  const {
    column,
    line,
    message,
    ruleId,
    severity
  } = testCase;
  const relativeSource = source.split(process.cwd())[1];

  return {
    '@name': `[ESLint] ${relativeSource}:${line}:${column}`,
    [severity === 2 ? 'failure' : 'skipped']: {
      '#text': `${message} (${ruleId})\nOn line ${line}, column ${column} in ${relativeSource}`,
      '@message': message,
      '@type': severity === 2 ? 'error' : 'warning'
    }
  };
};

const parseSuite = (testSuite) => {
  const { errorCount, filePath, warningCount } = testSuite;
  const failuresCount = warningCount + errorCount;
  const testCases = failuresCount > 0 ? testSuite.messages.map((testCase) => parseFailedCase(testCase, filePath)) : { '@name': 'eslint.passed' };

  return {
    '@failures': errorCount,
    '@name': filePath,
    '@skipped': warningCount,
    '@tests': failuresCount,
    testcase: testCases
  };
};

module.exports = (eslintResults) => {
  const parsedResults = eslintResults.map((testSuite) => parseSuite(testSuite));
  const schema = create({ testsuites: { testsuite: parsedResults } });
  const xml = schema.end({ prettyPrint: true });
  return xml;
};

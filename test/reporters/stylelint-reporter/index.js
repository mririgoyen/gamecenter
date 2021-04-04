const { create } = require('xmlbuilder2');

const parseFailedCase = (testCase, source) => {
  const {
    column,
    line,
    severity,
    text
  } = testCase;
  const relativeSource = source.split(process.cwd())[1];

  return {
    '@name': `[Stylelint] ${relativeSource}:${line}:${column}`,
    [severity === 'error' ? 'failure' : 'skipped']: {
      '#text': `${text}\nOn line ${line}, column ${column} in ${relativeSource}`,
      '@message': text,
      '@type': severity
    }
  };
};

const parseSuite = (testSuite) => {
  const suiteName = testSuite.source;
  const warningCount = testSuite.warnings.filter((c) => c.severity === 'warning').length;
  const errorCount = testSuite.warnings.filter((c) => c.severity === 'error').length;
  const failuresCount = warningCount + errorCount;
  const testCases = testSuite.errored ? testSuite.warnings.map((testCase) => parseFailedCase(testCase, suiteName)) : { '@name': 'stylelint.passed' };

  return {
    '@failures': errorCount,
    '@name': suiteName,
    '@skipped': warningCount,
    '@tests': failuresCount,
    testcase: testCases
  };
};

module.exports = (stylelintResults) => {
  const parsedResults = stylelintResults.map((testSuite) => parseSuite(testSuite));
  const schema = create({ testsuites: { testsuite: parsedResults } });
  const xml = schema.end({ prettyPrint: true });
  return xml;
};

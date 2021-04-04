module.exports = {
  collectCoverageFrom: [
    '<rootDir>/client/**/*.{js,jsx}',
    '<rootDir>/server/**/*.js',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**'
  ],
  coverageDirectory: '../.nyc_output',
  coverageReporters: [ 'json' ],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(svg|png|jpg)$': '<rootDir>/test/__mocks__/fileMock.js',
    '~/actions/(.*)$': '<rootDir>/client/actions/$1',
    '~/atoms/(.*)$': '<rootDir>/client/atoms/$1',
    '~/components/(.*)$': '<rootDir>/client/components/$1',
    '~/hooks/(.*)$': '<rootDir>/client/hooks/$1',
    '~/lib/(.*)$': '<rootDir>/client/lib/$1'
  },
  reporters: process.env.CI && [
    'jest-spec-reporter',
    'jest-junit'
  ],
  testMatch: [
    '<rootDir>/client/**/?(*.)test.{js,jsx}',
    '<rootDir>/server/**/?(*.)test.js'
  ]
};

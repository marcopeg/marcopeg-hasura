// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  name: 'unit',
  displayName: 'Unit Tests',

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // The root directory that Jest should scan for tests and modules within
  rootDir: '../../src/',

  // A list of paths to directories that Jest should use to search for files in
  roots: [
    '<rootDir>'
  ],

  // The test environment that will be used for testing
  testEnvironment: 'node',

  testMatch: [
    '**/__tests__/**/*.unit.[jt]s?(x)',
    '**/?(*.)+(unic.spec|unit.test).[jt]s?(x)'
  ],
};

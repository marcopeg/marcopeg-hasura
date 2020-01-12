// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
const path = require('path');
const getEnv = require('./jest.env');

module.exports = {
  name: 'e2e',
  displayName: 'E2E Tests',

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
    '**/__tests__/**/*.e2e.[jt]s?(x)',
    '**/?(*.)+(e2e.spec|e2e.test).[jt]s?(x)'
  ],

  globals: getEnv(),
  globalSetup: path.join(__dirname, 'jest.setup.js'),
};

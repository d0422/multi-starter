/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '(.+)\\.js': '$1',
  },
  testMatch: ['**/?(*.)+(spec|test).ts'],
};

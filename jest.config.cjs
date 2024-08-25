// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: path.resolve(__dirname),
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  roots: ['<rootDir>/e2e/', '<rootDir>/src/'],
  globals: {
    client: undefined,
  },
  verbose: true,
}

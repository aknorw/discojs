const path = require('path')

module.exports = {
  testEnvironment: 'node',
  rootDir: path.resolve(__dirname),
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  roots: ['<rootDir>/e2e/', '<rootDir>/src/'],
  globals: {
    client: undefined,
  },
  transform: {
    '\\.(ts)$': 'ts-jest',
  },
  verbose: true
}

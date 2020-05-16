const path = require('path')

module.exports = {
  testEnvironment: 'node',
  rootDir: path.resolve(__dirname, './src'),
  setupFilesAfterEnv: ['<rootDir>/../jest.setup.ts'],
  roots: ['<rootDir>'],
  globals: {
    client: undefined,
  },
  transform: {
    '\\.(ts)$': 'ts-jest',
  },
}

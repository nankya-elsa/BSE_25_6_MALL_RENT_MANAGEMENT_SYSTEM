module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js', '**/tests/**/*.test.ts'],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'node'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};


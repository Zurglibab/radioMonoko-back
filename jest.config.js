module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/tests/**/*.test.ts'],
  // Ensure we cleanup global resources (Redis, DB) after all tests
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.ts'],
  maxWorkers: 1
};
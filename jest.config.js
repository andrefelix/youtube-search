module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: [
    './dotenv.testconfig.js'
  ]
};

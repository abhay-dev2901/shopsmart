module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  setupFiles: ["<rootDir>/tests/env.cjs"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  maxWorkers: 1,
  testTimeout: 15000,
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@prisma)/)"
  ],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/index.js"
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ]
};

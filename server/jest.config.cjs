module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
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
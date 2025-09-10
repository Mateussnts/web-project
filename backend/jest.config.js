module.exports = {
  preset: "ts-jest", // usa ts-jest para transpilar TS
  testEnvironment: "node", 
  moduleFileExtensions: ["ts", "js", "json", "node"],
  testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
  clearMocks: true,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  modulePathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/"],
};


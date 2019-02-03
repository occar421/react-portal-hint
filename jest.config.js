module.exports = {
  preset: "ts-jest",
  unmockedModulePathPatterns: ["react"],
  testPathIgnorePatterns: ["<rootDir>/cypress/", "<rootDir>/node_modules/"]
};

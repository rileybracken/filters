module.exports = {
  clearMocks: true,
  preset: "ts-jest",
  testPathIgnorePatterns: ["/lib/", "/node_modules", "/tmp/"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  globals: {
    mockApolloDatasourceRest: true,
    "ts-jest": {
      diagnostics: false
    }
  }
};
